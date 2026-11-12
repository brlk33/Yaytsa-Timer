package com.brlk33.yaytsatimer;

import android.app.AlarmManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.media.AudioAttributes;
import android.media.RingtoneManager;
import android.os.Build;

import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

/**
 * Everything that must work without the page: the data file, the timer state the page last
 * reported, the ongoing notification, the end-of-phase alarm and the alert notification.
 * The timer is wall-clock based (endAt), so the same state can be advanced here while the
 * page sleeps (pause/resume from the notification) and picked up by the page later.
 */
final class Host {
    static final String CH_TIMER = "timer";
    static final String CH_ALERT = "alert";
    static final String CH_ALERT_QUIET = "alert_quiet2";
    static final int ID_TIMER = 1;
    static final int ID_ALERT = 2;

    static final String ACTION_ALARM = "com.brlk33.yaytsatimer.ALARM";
    static final String ACTION_TOGGLE = "com.brlk33.yaytsatimer.TOGGLE";
    static final String ACTION_DISMISS = "com.brlk33.yaytsatimer.DISMISS";
    static final String EXTRA_ALERT_ACTION = "alertAction";

    /** The live page, if any; receivers use it to tell the page about changes. */
    static volatile MainActivity live;

    private Host() {}

    /* ---------------- data file ---------------- */

    static File dataFile(Context c) { return new File(c.getFilesDir(), "data.json"); }

    static String readData(Context c) {
        File f = dataFile(c);
        if (!f.exists()) return "{}";
        try (InputStream in = new FileInputStream(f)) {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            byte[] buf = new byte[16384];
            int n;
            while ((n = in.read(buf)) > 0) out.write(buf, 0, n);
            return out.toString("UTF-8");
        } catch (Exception e) {
            return "{}";
        }
    }

    static synchronized boolean writeData(Context c, String json) {
        File f = dataFile(c);
        File tmp = new File(f.getPath() + ".tmp");
        try (FileOutputStream out = new FileOutputStream(tmp)) {
            out.write(json.getBytes(StandardCharsets.UTF_8));
            out.getFD().sync();
        } catch (Exception e) {
            return false;
        }
        return tmp.renameTo(f);
    }

    /* ---------------- timer state ---------------- */

    static SharedPreferences prefs(Context c) {
        return c.getSharedPreferences("host", Context.MODE_PRIVATE);
    }

    static JSONObject timer(Context c) {
        try {
            return new JSONObject(prefs(c).getString("timer", "{}"));
        } catch (Exception e) {
            return new JSONObject();
        }
    }

    /** Stores the state, then brings the alarm and the ongoing notification in line with it. */
    static void setTimer(Context c, JSONObject s) {
        prefs(c).edit().putString("timer", s.toString()).apply();
        schedule(c, s);
        showTimer(c, s);
        tickBar(c);
    }

    /* The bar in the notification fills from left to right as the phase goes (work and break
       alike); it is redrawn every few seconds while this process is alive. */
    private static final android.os.Handler barHandler = new android.os.Handler(android.os.Looper.getMainLooper());
    private static Runnable barTick;
    static void tickBar(Context c) {
        Context app = c.getApplicationContext();
        if (barTick != null) barHandler.removeCallbacks(barTick);
        barTick = new Runnable() {
            @Override public void run() {
                JSONObject s = timer(app);
                if (!s.optBoolean("running") || s.optLong("endAt") <= System.currentTimeMillis()) return;
                showTimer(app, s);
                barHandler.postDelayed(this, 5000);
            }
        };
        barHandler.postDelayed(barTick, 5000);
    }

    /** Pause / resume without the page, with the same rules as start() and pause() in app.js. */
    static JSONObject toggle(Context c) {
        JSONObject s = timer(c);
        if (s.optLong("total") <= 0) return s;
        long now = System.currentTimeMillis();
        JSONObject sr = s.optJSONObject("series");
        if (sr != null) {
            try {
                if (s.optBoolean("running")) {
                    sr.put("pausedAt", now);
                    s.put("remaining", Math.max(0, s.optLong("endAt") - now));
                    s.put("running", false);
                    s.put("endAt", 0);
                } else {
                    long pausedAt = sr.optLong("pausedAt");
                    if (pausedAt > 0) sr.put("start", sr.optLong("start") + now - pausedAt);
                    else sr.put("start", now); // a planned series: start it now
                    sr.put("pausedAt", 0);
                    applySeries(s, sr, now);
                }
            } catch (Exception ignored) {}
            setTimer(c, s);
            return s;
        }
        try {
            if (s.optBoolean("running")) {
                s.put("remaining", Math.max(0, s.optLong("endAt") - now));
                s.put("running", false);
                s.put("endAt", 0);
            } else {
                if ("work".equals(s.optString("phase")) && s.optLong("startedAt") == 0) s.put("startedAt", now);
                s.put("endAt", now + s.optLong("remaining"));
                s.put("running", true);
                s.put("remaining", 0);
            }
        } catch (Exception ignored) {}
        setTimer(c, s);
        return s;
    }

    /* ---------------- alarm ---------------- */

    private static PendingIntent alarmIntent(Context c) {
        Intent i = new Intent(c, TimerReceiver.class).setAction(ACTION_ALARM);
        return PendingIntent.getBroadcast(c, 0, i, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    static void schedule(Context c, JSONObject s) {
        AlarmManager am = (AlarmManager) c.getSystemService(Context.ALARM_SERVICE);
        PendingIntent pi = alarmIntent(c);
        long at;
        JSONObject sr = s.optJSONObject("series");
        if (s.optBoolean("running")) at = s.optLong("endAt");
        else if (sr != null && sr.optLong("pausedAt") == 0 && sr.optLong("start") > 0) at = sr.optLong("start");
        else if (sr == null && s.optJSONObject("plan") != null && s.optJSONObject("plan").optLong("at") > 0) at = s.optJSONObject("plan").optLong("at"); // the next planned start
        else {
            am.cancel(pi);
            return;
        }
        try {
            if (Build.VERSION.SDK_INT >= 31 && !am.canScheduleExactAlarms()) {
                am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, at, pi);
            } else {
                am.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, at, pi);
            }
        } catch (SecurityException e) {
            am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, at, pi);
        }
    }

    /** The alarm went off: the phase is over even if the page is not running. */
    static void phaseDue(Context c) {
        JSONObject s = timer(c);
        JSONObject sr = s.optJSONObject("series");
        if (sr != null) {
            seriesDue(c, s, sr);
            MainActivity a = live;
            if (a != null) a.emit("phase-due", null);
            return;
        }
        if (!s.optBoolean("running") && planDue(c, s)) return;
        if (!s.optBoolean("running")) return;
        long endAt = s.optLong("endAt");
        if (endAt > System.currentTimeMillis() + 2000) {
            schedule(c, s); // fired early (inexact alarm): wait for the real end
            return;
        }
        nm(c).cancel(ID_TIMER);
        if (prefs(c).getLong("alertedEndAt", 0) != endAt) {
            prefs(c).edit().putLong("alertedEndAt", endAt).putLong("alertedAt", System.currentTimeMillis()).apply();
            JSONObject t = s.optJSONObject("text");
            if (t == null) t = new JSONObject();
            boolean popup = s.optBoolean("popup", true);
            postAlert(c, t.optString("doneTitle", "Яйцетаймер"), t.optString("doneBody", ""),
                    popup ? t.optString("go") : "", popup ? t.optString("ok") : "", s.optBoolean("sound", true));
        }
        MainActivity a = live;
        if (a != null) a.emit("phase-due", null);
    }

    /** A planned start came while the page may be closed: the series begins now, from its planned time. */
    static boolean planDue(Context c, JSONObject s) {
        JSONObject plan = s.optJSONObject("plan");
        if (plan == null) return false;
        long now = System.currentTimeMillis();
        if (plan.optLong("at") > now + 2000) {
            schedule(c, s); // fired early (inexact alarm): wait for the real time
            return true;
        }
        JSONObject ps = plan.optJSONObject("series");
        if (ps == null) return false;
        int count = ps.optInt("count");
        long block = count > 0 ? workStart(ps, count - 1) - ps.optLong("start") + ps.optLong("work") : 3 * 3600000L;
        if (now >= plan.optLong("at") + block) {
            // the whole block went by while the phone was off: the page asks whether to count it
            s.remove("plan");
            setTimer(c, s);
            return true;
        }
        try {
            s.remove("plan");
            s.put("series", ps);
            applySeries(s, ps, now);
        } catch (Exception e) {
            return false;
        }
        JSONObject t = s.optJSONObject("text");
        postAlert(c, plan.optString("title", "Яйцетаймер"), plan.optString("body", ""), "", t != null ? t.optString("gotIt") : "OK", s.optBoolean("sound", true));
        setTimer(c, s);
        MainActivity a = live;
        if (a != null) a.emit("phase-due", null);
        return true;
    }

    /** True when the alarm already announced the end of the phase the page is completing now. */
    static boolean alreadyAlerted(Context c) {
        if (System.currentTimeMillis() - prefs(c).getLong("alertedAt", 0) < 5000) return true;
        JSONObject s = timer(c);
        return s.optBoolean("running") && prefs(c).getLong("alertedEndAt", 0) == s.optLong("endAt");
    }

    /* ---------------- series (same schedule maths as app.js) ---------------- */

    /** Puts the phase the schedule says into s. Returns "wait", "work", "break" or "done". */
    /** Start of work k: with a long break every n-th time (sr.every, sr.lbrk), as in app.js. */
    static long workStart(JSONObject sr, long k) {
        long work = sr.optLong("work"), brk = sr.optLong("brk"), start = sr.optLong("start"), c = work + brk;
        int n = sr.optInt("every");
        long L = sr.optLong("lbrk");
        if (n < 2 || L <= 0) return start + k * c;
        long block = n * work + (n - 1) * brk + L;
        return start + (k / n) * block + (k % n) * c;
    }

    static long breakLen(JSONObject sr, long k) {
        int n = sr.optInt("every");
        long L = sr.optLong("lbrk");
        return n >= 2 && L > 0 && k % n == n - 1 ? L : sr.optLong("brk");
    }

    static String applySeries(JSONObject s, JSONObject sr, long now) throws Exception {
        long work = sr.optLong("work"), brk = sr.optLong("brk"), start = sr.optLong("start"), c = work + brk;
        int count = sr.optInt("count");
        long pausedAt = sr.optLong("pausedAt");
        long at = pausedAt > 0 ? pausedAt : now;
        if (c <= 0 || count < 0) return "done"; // count 0 = endless: work and break until stopped
        if (at < start) {
            s.put("phase", "work").put("total", work).put("running", false).put("endAt", 0).put("remaining", work).put("startedAt", 0);
            return "wait";
        }
        int n = sr.optInt("every");
        long L = sr.optLong("lbrk");
        long k;
        if (n < 2 || L <= 0) k = (at - start) / c;
        else {
            long block = n * work + (n - 1) * brk + L, b = (at - start) / block, rem = at - start - b * block;
            k = b * n + Math.min(n - 1, rem / c);
        }
        long base = workStart(sr, k), within = at - base;
        if (count > 0 && (k >= count || (k == count - 1 && within >= work))) return "done";
        boolean isWork = within < work;
        long pStart = isWork ? base : base + work, pEnd = isWork ? base + work : base + work + breakLen(sr, k);
        s.put("phase", isWork ? "work" : "break").put("total", pEnd - pStart);
        s.put("startedAt", isWork ? pStart : 0);
        if (pausedAt > 0) s.put("running", false).put("endAt", 0).put("remaining", Math.max(0, pEnd - at));
        else s.put("running", true).put("endAt", pEnd).put("remaining", 0);
        s.put("phaseStart", pStart);
        return isWork ? "work" : "break";
    }

    /** A series boundary passed while the page may be asleep: move on, ring, re-arm. */
    static void seriesDue(Context c, JSONObject s, JSONObject sr) {
        long now = System.currentTimeMillis();
        if (sr.optLong("pausedAt") > 0) return;
        JSONObject t = s.optJSONObject("text");
        if (t == null) t = new JSONObject();
        String before = s.optString("phase") + s.optLong("endAt") + s.optBoolean("running");
        String state;
        try {
            state = applySeries(s, sr, now);
            if ("done".equals(state)) {
                s.remove("series");
                s.put("phase", "work").put("running", false).put("endAt", 0).put("startedAt", 0);
                s.put("total", sr.optLong("work")).put("remaining", sr.optLong("work"));
            }
        } catch (Exception e) {
            return;
        }
        boolean changed = !before.equals(s.optString("phase") + s.optLong("endAt") + s.optBoolean("running"));
        boolean fresh = now - s.optLong("phaseStart", now) < 60000; // after a long sleep, no stale rings
        if (changed && ("done".equals(state) || fresh)) {
            prefs(c).edit().putLong("alertedAt", now).putLong("alertedEndAt", s.optLong("endAt")).apply();
            boolean sound = s.optBoolean("sound", true);
            if ("done".equals(state)) postAlert(c, t.optString("seriesDoneTitle"), t.optString("seriesDoneBody"), "", t.optString("gotIt"), sound);
            else if ("work".equals(state)) postAlert(c, t.optString("toWorkTitle"), t.optString("toWorkBody"), "", t.optString("gotIt"), sound);
            else if ("break".equals(state)) postAlert(c, t.optString("toBreakTitle"), t.optString("toBreakBody"), "", t.optString("gotIt"), sound);
        }
        try {
            JSONObject tx = s.optJSONObject("text");
            if (tx != null && !"done".equals(state)) tx.put("phase", "work".equals(s.optString("phase")) ? tx.optString("work") : tx.optString("brk"));
        } catch (Exception ignored) {}
        setTimer(c, s);
    }

    /* ---------------- notifications ---------------- */

    static NotificationManager nm(Context c) {
        return (NotificationManager) c.getSystemService(Context.NOTIFICATION_SERVICE);
    }

    /* A channel's sound cannot change after it is created, so a new sound means a new channel id. */
    static String alertChannel(Context c) { return prefs(c).getString("alertChannel", CH_ALERT + "2"); }

    static android.net.Uri soundUri(Context c) {
        String s = prefs(c).getString("soundUri", "");
        return s.isEmpty() ? RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION) : android.net.Uri.parse(s);
    }

    static String soundName(Context c) { return prefs(c).getString("soundName", ""); }

    static void setSound(Context c, android.net.Uri uri, String name) {
        String old = alertChannel(c);
        prefs(c).edit()
                .putString("soundUri", uri == null ? "" : uri.toString())
                .putString("soundName", name == null ? "" : name)
                .putString("alertChannel", "alert_" + System.currentTimeMillis())
                .apply();
        nm(c).deleteNotificationChannel(old);
        createChannels(c);
    }

    static void createChannels(Context c) {
        NotificationManager nm = nm(c);
        // v2: channels no longer vibrate on their own (one long buzz is made by hand in postAlert).
        // A channel cannot change after it exists, so the old ones are replaced once.
        if (prefs(c).getInt("chVer", 1) < 2) {
            String old = prefs(c).getString("alertChannel", CH_ALERT);
            nm.deleteNotificationChannel(old);
            nm.deleteNotificationChannel(CH_ALERT);
            nm.deleteNotificationChannel("alert_quiet");
            android.content.SharedPreferences.Editor e = prefs(c).edit().putInt("chVer", 2);
            if (prefs(c).contains("alertChannel")) e.putString("alertChannel", "alert_" + System.currentTimeMillis());
            e.commit();
        }
        NotificationChannel timer = new NotificationChannel(CH_TIMER, "Таймер", NotificationManager.IMPORTANCE_LOW);
        timer.setDescription("Обратный отсчёт текущего захода");
        timer.setShowBadge(false);
        nm.createNotificationChannel(timer);

        NotificationChannel alert = new NotificationChannel(alertChannel(c), "Конец захода", NotificationManager.IMPORTANCE_HIGH);
        alert.setDescription("Сигнал, когда работа или перерыв закончились");
        alert.enableVibration(false);
        alert.setSound(soundUri(c),
                new AudioAttributes.Builder().setUsage(AudioAttributes.USAGE_ALARM)
                        .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION).build());
        nm.createNotificationChannel(alert);

        NotificationChannel quiet = new NotificationChannel(CH_ALERT_QUIET, "Конец захода без звука", NotificationManager.IMPORTANCE_HIGH);
        quiet.setDescription("Когда звук в настройках таймера выключен");
        quiet.enableVibration(false);
        quiet.setSound(null, null);
        nm.createNotificationChannel(quiet);
    }

    static PendingIntent openApp(Context c, String alertAction, int req) {
        Intent i = new Intent(c, MainActivity.class).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        if (alertAction != null) i.putExtra(EXTRA_ALERT_ACTION, alertAction);
        return PendingIntent.getActivity(c, req, i, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    private static PendingIntent broadcast(Context c, String action, int req) {
        Intent i = new Intent(c, TimerReceiver.class).setAction(action);
        return PendingIntent.getBroadcast(c, req, i, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    static String clock(long ms) {
        long s = (ms + 999) / 1000;
        long h = s / 3600, m = (s % 3600) / 60, sec = s % 60;
        return h > 0 ? String.format("%d:%02d:%02d", h, m, sec) : String.format("%02d:%02d", m, sec);
    }

    /** Ongoing notification: a live countdown while running, the frozen time while paused. */
    static void showTimer(Context c, JSONObject s) {
        long total = s.optLong("total");
        boolean running = s.optBoolean("running");
        long remaining = running ? Math.max(0, s.optLong("endAt") - System.currentTimeMillis()) : s.optLong("remaining", total);
        boolean touched = running || (total > 0 && remaining < total);
        JSONObject plan = s.optJSONObject("series");
        if (!running && plan != null && plan.optLong("pausedAt") == 0 && plan.optLong("start") > System.currentTimeMillis()) {
            JSONObject tx = s.optJSONObject("text");
            Notification.Builder w = new Notification.Builder(c, CH_TIMER)
                    .setSmallIcon(R.drawable.ic_stat).setColor(0xFF6F6BFF).setOngoing(true).setOnlyAlertOnce(true)
                    .setContentTitle(tx != null ? tx.optString("waitTitle", "") : "")
                    .setWhen(plan.optLong("start")).setShowWhen(true).setUsesChronometer(true).setChronometerCountDown(true)
                    .setContentIntent(openApp(c, null, 10));
            nm(c).notify(ID_TIMER, w.build());
            return;
        }
        if (!touched || (running && remaining == 0)) {
            nm(c).cancel(ID_TIMER);
            return;
        }
        JSONObject t = s.optJSONObject("text");
        if (t == null) t = new JSONObject();
        String phase = t.optString("phase", "");
        String label = s.optString("label", "");
        Notification.Builder b = new Notification.Builder(c, CH_TIMER)
                .setSmallIcon(R.drawable.ic_stat)
                .setColor(0xFFD97757)
                .setOngoing(true)
                .setOnlyAlertOnce(true)
                .setShowWhen(true)
                .setCategory(Notification.CATEGORY_PROGRESS)
                .setVisibility(Notification.VISIBILITY_PUBLIC)
                .setContentIntent(openApp(c, null, 10));
        if (running) {
            b.setContentTitle(label.isEmpty() ? phase : phase + " · " + label)
                    .setWhen(s.optLong("endAt"))
                    .setUsesChronometer(true)
                    .setChronometerCountDown(true);
            // every timer pauses from the notification, a series too (2.19)
            b.addAction(new Notification.Action.Builder(null, t.optString("pause", "Пауза"), broadcast(c, ACTION_TOGGLE, 11)).build());
        } else {
            b.setContentTitle(phase + " — " + t.optString("paused", "пауза") + " · " + clock(remaining))
                    .setUsesChronometer(false)
                    .setShowWhen(false)
                    .addAction(new Notification.Action.Builder(null, t.optString("resume", "Продолжить"), broadcast(c, ACTION_TOGGLE, 11)).build());
            if (!label.isEmpty()) b.setContentText(label);
        }
        if (total > 0) b.setProgress(1000, (int) Math.max(0, Math.min(1000, 1000 * (total - remaining) / total)), false); // filled = time gone
        nm(c).notify(ID_TIMER, b.build());
    }

    static void postAlert(Context c, String title, String body, String go, String ok, boolean sound) {
        Notification.Builder b = new Notification.Builder(c, sound ? alertChannel(c) : CH_ALERT_QUIET)
                .setSmallIcon(R.drawable.ic_stat)
                .setColor(0xFFD97757)
                .setContentTitle(title)
                .setContentText(body)
                .setStyle(new Notification.BigTextStyle().bigText(body))
                .setCategory(Notification.CATEGORY_ALARM)
                .setVisibility(Notification.VISIBILITY_PUBLIC)
                .setAutoCancel(true)
                .setContentIntent(openApp(c, null, 20));
        if (go != null && !go.isEmpty()) {
            b.addAction(new Notification.Action.Builder(null, go, openApp(c, "start", 21)).build());
        }
        if (ok != null && !ok.isEmpty()) {
            b.addAction(new Notification.Action.Builder(null, ok, broadcast(c, ACTION_DISMISS, 22)).build());
        }
        nm(c).notify(ID_ALERT, b.build());
        buzz(c);
    }

    /** One long, soft buzz at the end of a phase — "bzzzzt", not a rattle. */
    static void buzz(Context c) {
        try {
            android.os.Vibrator v;
            if (Build.VERSION.SDK_INT >= 31) {
                android.os.VibratorManager vm = (android.os.VibratorManager) c.getSystemService(Context.VIBRATOR_MANAGER_SERVICE);
                v = vm != null ? vm.getDefaultVibrator() : null;
            } else {
                v = (android.os.Vibrator) c.getSystemService(Context.VIBRATOR_SERVICE);
            }
            if (v == null || !v.hasVibrator()) return;
            android.media.AudioAttributes aa = new android.media.AudioAttributes.Builder()
                    .setUsage(android.media.AudioAttributes.USAGE_ALARM).build();
            v.vibrate(android.os.VibrationEffect.createOneShot(700, android.os.VibrationEffect.DEFAULT_AMPLITUDE), aa);
        } catch (Exception ignored) {}
    }

    static void cancelAlert(Context c) { nm(c).cancel(ID_ALERT); }
}

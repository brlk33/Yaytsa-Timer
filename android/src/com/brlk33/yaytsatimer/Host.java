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
    static final String CH_ALERT_QUIET = "alert_quiet";
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
    }

    /** Pause / resume without the page, with the same rules as start() and pause() in app.js. */
    static JSONObject toggle(Context c) {
        JSONObject s = timer(c);
        if (s.optLong("total") <= 0) return s;
        long now = System.currentTimeMillis();
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
        if (!s.optBoolean("running")) {
            am.cancel(pi);
            return;
        }
        long at = s.optLong("endAt");
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
        if (!s.optBoolean("running")) return;
        long endAt = s.optLong("endAt");
        if (endAt > System.currentTimeMillis() + 2000) {
            schedule(c, s); // fired early (inexact alarm): wait for the real end
            return;
        }
        nm(c).cancel(ID_TIMER);
        if (prefs(c).getLong("alertedEndAt", 0) != endAt) {
            prefs(c).edit().putLong("alertedEndAt", endAt).apply();
            JSONObject t = s.optJSONObject("text");
            if (t == null) t = new JSONObject();
            boolean popup = s.optBoolean("popup", true);
            postAlert(c, t.optString("doneTitle", "Яйцетаймер"), t.optString("doneBody", ""),
                    popup ? t.optString("go") : "", popup ? t.optString("ok") : "", s.optBoolean("sound", true));
        }
        MainActivity a = live;
        if (a != null) a.emit("phase-due", null);
    }

    /** True when the alarm already announced the end of the phase the page is completing now. */
    static boolean alreadyAlerted(Context c) {
        JSONObject s = timer(c);
        return s.optBoolean("running") && prefs(c).getLong("alertedEndAt", 0) == s.optLong("endAt");
    }

    /* ---------------- notifications ---------------- */

    static NotificationManager nm(Context c) {
        return (NotificationManager) c.getSystemService(Context.NOTIFICATION_SERVICE);
    }

    /* A channel's sound cannot change after it is created, so a new sound means a new channel id. */
    static String alertChannel(Context c) { return prefs(c).getString("alertChannel", CH_ALERT); }

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
        NotificationChannel timer = new NotificationChannel(CH_TIMER, "Таймер", NotificationManager.IMPORTANCE_LOW);
        timer.setDescription("Обратный отсчёт текущего захода");
        timer.setShowBadge(false);
        nm.createNotificationChannel(timer);

        NotificationChannel alert = new NotificationChannel(alertChannel(c), "Конец захода", NotificationManager.IMPORTANCE_HIGH);
        alert.setDescription("Сигнал, когда работа или перерыв закончились");
        alert.enableVibration(true);
        alert.setVibrationPattern(new long[]{0, 250, 150, 250});
        alert.setSound(soundUri(c),
                new AudioAttributes.Builder().setUsage(AudioAttributes.USAGE_ALARM)
                        .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION).build());
        nm.createNotificationChannel(alert);

        NotificationChannel quiet = new NotificationChannel(CH_ALERT_QUIET, "Конец захода без звука", NotificationManager.IMPORTANCE_HIGH);
        quiet.setDescription("Когда звук в настройках таймера выключен");
        quiet.enableVibration(true);
        quiet.setVibrationPattern(new long[]{0, 250, 150, 250});
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
                    .setChronometerCountDown(true)
                    .addAction(new Notification.Action.Builder(null, t.optString("pause", "Пауза"), broadcast(c, ACTION_TOGGLE, 11)).build());
        } else {
            b.setContentTitle(phase + " — " + t.optString("paused", "пауза") + " · " + clock(remaining))
                    .setUsesChronometer(false)
                    .setShowWhen(false)
                    .addAction(new Notification.Action.Builder(null, t.optString("resume", "Продолжить"), broadcast(c, ACTION_TOGGLE, 11)).build());
            if (!label.isEmpty()) b.setContentText(label);
        }
        if (total > 0) b.setProgress(1000, (int) (1000 * (total - remaining) / total), false);
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
    }

    static void cancelAlert(Context c) { nm(c).cancel(ID_ALERT); }
}

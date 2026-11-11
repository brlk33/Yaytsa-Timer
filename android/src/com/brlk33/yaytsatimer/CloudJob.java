package com.brlk33.yaytsatimer;

import android.app.job.JobInfo;
import android.app.job.JobParameters;
import android.app.job.JobScheduler;
import android.app.job.JobService;
import android.content.ComponentName;
import android.content.Context;

import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

/**
 * Looks at the timer in the cloud now and then while the app is closed, so a timer started on
 * the PC shows up in the phone's notification (with its progress bar) without opening the app.
 * Android runs periodic jobs at most every 15 minutes; an instant push would need FCM.
 */
public class CloudJob extends JobService {
    static final int JOB_ID = 7301;
    private static final String KEY = "AIzaSyB5N_ynBpx9cD8cyy4da_HFMHVc-qZ_YyU";
    private static final String DB = "https://yaytsa-cloud-default-rtdb.europe-west1.firebasedatabase.app";

    /** Arms the periodic check (idempotent; survives reboots). */
    static void schedule(Context c) {
        JobScheduler js = (JobScheduler) c.getSystemService(Context.JOB_SCHEDULER_SERVICE);
        if (js == null) return;
        for (JobInfo j : js.getAllPendingJobs()) if (j.getId() == JOB_ID) return;
        JobInfo info = new JobInfo.Builder(JOB_ID, new ComponentName(c, CloudJob.class))
                .setRequiredNetworkType(JobInfo.NETWORK_TYPE_ANY)
                .setPeriodic(15 * 60 * 1000L)
                .setPersisted(true)
                .build();
        try { js.schedule(info); } catch (Exception ignored) {}
    }

    @Override
    public boolean onStartJob(JobParameters p) {
        Context app = getApplicationContext();
        new Thread(() -> {
            try { check(app); } catch (Exception ignored) {}
            jobFinished(p, false);
        }).start();
        return true;
    }

    @Override
    public boolean onStopJob(JobParameters p) { return true; }

    static void check(Context c) throws Exception {
        MainActivity live = Host.live;
        if (live != null && live.isVisible()) return; // the open page keeps in sync by itself
        JSONObject data = new JSONObject(Host.readData(c));
        JSONObject sync = data.optJSONObject("sync");
        JSONObject acc = sync != null ? sync.optJSONObject("account") : null;
        if (acc == null || acc.optString("uid").isEmpty() || acc.optString("rt").isEmpty()) return;

        String body = "grant_type=refresh_token&refresh_token=" + URLEncoder.encode(acc.optString("rt"), "UTF-8");
        JSONObject tok = new JSONObject(http("https://securetoken.googleapis.com/v1/token?key=" + KEY, body));
        String id = tok.optString("id_token");
        if (id.isEmpty()) return;
        String raw = http(DB + "/timer/" + acc.optString("uid") + "/t.json?auth=" + URLEncoder.encode(id, "UTF-8"), null);
        if (raw == null || raw.trim().equals("null")) return;
        JSONObject v = new JSONObject(raw);
        long u = v.optLong("u");
        if (u <= Host.prefs(c).getLong("cloudU", 0)) return; // nothing new since the last look
        String phase = v.optString("phase");
        if (!phase.equals("work") && !phase.equals("break")) return;
        long now = System.currentTimeMillis();
        JSONObject plan = v.optJSONObject("series");
        boolean running = v.optBoolean("running");
        if (running && v.optLong("endAt") < now - 60000 && plan == null) return; // long over, not news

        JSONObject s = Host.timer(c); // keeps the texts and settings the page left there
        long total = v.optLong("total");
        s.put("phase", phase);
        s.put("total", total);
        s.put("running", running);
        s.put("endAt", running ? v.optLong("endAt") : 0);
        s.put("remaining", running ? 0 : v.optLong("remaining", total));
        s.put("startedAt", v.optLong("startedAt"));
        if (v.has("label")) s.put("label", v.optString("label"));
        if (plan != null && plan.optLong("work") > 0 && plan.optInt("count") >= 0) s.put("series", plan); else s.remove("series");
        JSONObject tx = s.optJSONObject("text");
        if (tx == null) { tx = new JSONObject(); s.put("text", tx); }
        boolean ru = !"en".equals(data.optJSONObject("settings") != null ? data.optJSONObject("settings").optString("lang") : "");
        String work = tx.optString("work", ru ? "Работа" : "Work"), brk = tx.optString("brk", ru ? "Перерыв" : "Break");
        tx.put("work", work);
        tx.put("brk", brk);
        tx.put("phase", phase.equals("work") ? work : brk);

        Host.prefs(c).edit().putLong("cloudU", u).apply();
        Host.createChannels(c);
        Host.setTimer(c, s);
        MainActivity l = Host.live;
        if (l != null) l.emit("timer-state", s);
    }

    private static String http(String url, String form) throws Exception {
        HttpURLConnection h = (HttpURLConnection) new URL(url).openConnection();
        h.setConnectTimeout(15000);
        h.setReadTimeout(15000);
        if (form != null) {
            h.setRequestMethod("POST");
            h.setDoOutput(true);
            h.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
            try (OutputStream o = h.getOutputStream()) { o.write(form.getBytes(StandardCharsets.UTF_8)); }
        }
        if (h.getResponseCode() / 100 != 2) return null;
        try (InputStream in = h.getInputStream()) {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            byte[] buf = new byte[8192];
            int n;
            while ((n = in.read(buf)) > 0) out.write(buf, 0, n);
            return out.toString("UTF-8");
        } finally {
            h.disconnect();
        }
    }
}

package com.brlk33.yaytsatimer;

import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInstaller;
import android.net.Uri;
import android.provider.Settings;
import android.widget.Toast;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

/** Self-update from the GitHub repo, like the desktop build: version.txt, then YaytsaTimer.apk. */
final class Updater {
    private static final String RAW = "https://github.com/brlk33/Yaytsa-Timer/raw/main/";
    private static final String APK = "YaytsaTimer.apk";

    private static File downloaded;
    private static String downloadedVersion;

    private Updater() {}

    static boolean newer(String remote, String local) {
        int[] a = parse(remote), b = parse(local);
        for (int i = 0; i < 3; i++) if (a[i] != b[i]) return a[i] > b[i];
        return false;
    }

    private static int[] parse(String v) {
        int[] out = new int[3];
        String[] p = v.trim().replaceFirst("^v", "").split("\\.", 3);
        for (int i = 0; i < p.length && i < 3; i++) {
            try { out[i] = Integer.parseInt(p[i].replaceAll("[^0-9]", "")); } catch (Exception ignored) {}
        }
        return out;
    }

    private static HttpURLConnection open(String url) throws Exception {
        HttpURLConnection c = (HttpURLConnection) new URL(url).openConnection();
        c.setConnectTimeout(15000);
        c.setReadTimeout(30000);
        c.setUseCaches(false);
        c.setInstanceFollowRedirects(true);
        return c;
    }

    /** Runs on a background thread; calls back with the new version once the APK is downloaded. */
    static void check(Context c, String local, java.util.function.Consumer<String> ready) {
        try {
            if (downloaded != null) { ready.accept(downloadedVersion); return; }
            HttpURLConnection v = open(RAW + "version.txt?t=" + System.currentTimeMillis());
            String remote;
            try (InputStream in = v.getInputStream()) {
                byte[] buf = new byte[64];
                int n = in.read(buf);
                remote = n > 0 ? new String(buf, 0, n, "UTF-8").trim() : "";
            }
            if (remote.isEmpty() || !newer(remote, local)) return;
            File f = new File(c.getCacheDir(), "update-" + remote + ".apk");
            HttpURLConnection d = open(RAW + APK + "?v=" + remote);
            try (InputStream in = d.getInputStream(); OutputStream out = new FileOutputStream(f)) {
                byte[] buf = new byte[65536];
                int n;
                while ((n = in.read(buf)) > 0) out.write(buf, 0, n);
            }
            byte[] head = new byte[2];
            try (InputStream in = new FileInputStream(f)) { in.read(head); }
            if (f.length() < 100_000 || head[0] != 'P' || head[1] != 'K') { f.delete(); return; }
            downloaded = f;
            downloadedVersion = remote;
            ready.accept(remote);
        } catch (Exception ignored) {}
    }

    /** Installs the downloaded APK; Android shows its own confirmation. */
    static void install(MainActivity a) {
        if (downloaded == null) return;
        if (!a.getPackageManager().canRequestPackageInstalls()) {
            Toast.makeText(a, "Разрешите Яйцетаймеру устанавливать обновления и нажмите ещё раз", Toast.LENGTH_LONG).show();
            a.startActivity(new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES, Uri.parse("package:" + a.getPackageName())));
            return;
        }
        new Thread(() -> {
            try {
                PackageInstaller pi = a.getPackageManager().getPackageInstaller();
                PackageInstaller.SessionParams p = new PackageInstaller.SessionParams(PackageInstaller.SessionParams.MODE_FULL_INSTALL);
                p.setAppPackageName(a.getPackageName());
                int id = pi.createSession(p);
                try (PackageInstaller.Session s = pi.openSession(id)) {
                    try (InputStream in = new FileInputStream(downloaded); OutputStream out = s.openWrite("app.apk", 0, downloaded.length())) {
                        byte[] buf = new byte[65536];
                        int n;
                        while ((n = in.read(buf)) > 0) out.write(buf, 0, n);
                        s.fsync(out);
                    }
                    Intent i = new Intent(a, UpdateReceiver.class);
                    PendingIntent cb = PendingIntent.getBroadcast(a, id, i, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_MUTABLE);
                    s.commit(cb.getIntentSender());
                }
            } catch (Exception e) {
                a.runOnUiThread(() -> Toast.makeText(a, "Не удалось установить обновление", Toast.LENGTH_LONG).show());
            }
        }).start();
    }
}

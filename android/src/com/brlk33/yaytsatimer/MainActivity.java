package com.brlk33.yaytsatimer;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.graphics.Color;
import android.graphics.Insets;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.window.OnBackInvokedDispatcher;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

/**
 * The page from web/ in a WebView, with window.focusApi provided by bridge.js and this class:
 * the same UI and logic as the desktop build, with Android doing notifications and alarms.
 */
public class MainActivity extends Activity {
    private static final String TAG = "Yaytsa";
    private static final int REQ_IMPORT = 1, REQ_EXPORT = 2, REQ_NOTIFY = 3;
    private static final long UPDATE_EVERY = 6 * 3600_000L;

    private final Handler ui = new Handler(Looper.getMainLooper());
    private FrameLayout root;
    private WebView web;
    private boolean pageReady;
    private String pendingAlertAction;
    private JSONObject pendingAuth;
    private ValueCallback<Uri[]> fileCallback;
    private int exportId;
    private String exportCsv;
    private String theme = "dark";
    private long lastUpdateCheck;

    @Override
    protected void onCreate(Bundle saved) {
        super.onCreate(saved);
        Host.createChannels(this);
        pendingAlertAction = getIntent().getStringExtra(Host.EXTRA_ALERT_ACTION);
        pendingAuth = authFrom(getIntent());

        root = new FrameLayout(this);
        root.setBackgroundColor(0xFF191919);
        web = new WebView(this);
        web.setBackgroundColor(0xFF191919);
        web.setOverScrollMode(View.OVER_SCROLL_NEVER);
        root.addView(web, new FrameLayout.LayoutParams(-1, -1));
        setContentView(root);
        setupInsets();

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(true);
        s.setTextZoom(100);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setSupportZoom(false);

        web.addJavascriptInterface(new Bridge(), "YTB");
        web.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest r) {
                Uri u = r.getUrl();
                if ("http".equals(u.getScheme()) || "https".equals(u.getScheme())) {
                    try { startActivity(new Intent(Intent.ACTION_VIEW, u)); } catch (Exception ignored) {}
                }
                return true;
            }
        });
        web.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView v, ValueCallback<Uri[]> cb, FileChooserParams p) {
                if (fileCallback != null) fileCallback.onReceiveValue(null);
                fileCallback = cb;
                Intent i = new Intent(Intent.ACTION_OPEN_DOCUMENT).addCategory(Intent.CATEGORY_OPENABLE).setType("*/*");
                try {
                    startActivityForResult(i, REQ_IMPORT);
                } catch (Exception e) {
                    fileCallback = null;
                    return false;
                }
                return true;
            }
        });
        web.loadDataWithBaseURL("file:///android_asset/", pageHtml(), "text/html", "utf-8", null);

        if (Build.VERSION.SDK_INT >= 33) {
            getOnBackInvokedDispatcher().registerOnBackInvokedCallback(OnBackInvokedDispatcher.PRIORITY_DEFAULT, this::back);
        }
        Host.live = this;
    }

    /** index.html with bridge.js loaded before app.js (and no CSP: the page is local). */
    private String pageHtml() {
        String html = asset("index.html");
        html = html.replaceAll("(?i)<meta http-equiv=\"Content-Security-Policy\"[^>]*>", "");
        return html.replace("<script src=\"sync.js\"></script>", "<script src=\"bridge.js\"></script><script src=\"sync.js\"></script>");
    }

    private String asset(String name) {
        try (InputStream in = getAssets().open(name)) {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            byte[] buf = new byte[16384];
            int n;
            while ((n = in.read(buf)) > 0) out.write(buf, 0, n);
            return out.toString("UTF-8");
        } catch (Exception e) {
            return "";
        }
    }

    /* ---------------- window ---------------- */

    private void setupInsets() {
        Window w = getWindow();
        if (Build.VERSION.SDK_INT >= 30) {
            w.setDecorFitsSystemWindows(false);
            w.setStatusBarColor(Color.TRANSPARENT);
            w.setNavigationBarColor(Color.TRANSPARENT);
            root.setOnApplyWindowInsetsListener((v, insets) -> {
                Insets i = insets.getInsets(WindowInsets.Type.systemBars() | WindowInsets.Type.ime() | WindowInsets.Type.displayCutout());
                v.setPadding(i.left, i.top, i.right, i.bottom);
                return WindowInsets.CONSUMED;
            });
        }
    }

    private boolean systemDark() {
        return (getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK) == Configuration.UI_MODE_NIGHT_YES;
    }

    @SuppressWarnings("deprecation")
    private void applyTheme() {
        boolean dark = "dark".equals(theme) || ("system".equals(theme) && systemDark());
        int bg = dark ? 0xFF191919 : 0xFFFFFFFF;
        root.setBackgroundColor(bg);
        web.setBackgroundColor(bg);
        Window w = getWindow();
        if (Build.VERSION.SDK_INT >= 30) {
            int light = WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS | WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS;
            WindowInsetsController c = w.getInsetsController();
            if (c != null) c.setSystemBarsAppearance(dark ? 0 : light, light);
        } else {
            w.setStatusBarColor(bg);
            w.setNavigationBarColor(bg);
            int f = w.getDecorView().getSystemUiVisibility();
            int lightFlags = View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR | View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
            w.getDecorView().setSystemUiVisibility(dark ? (f & ~lightFlags) : (f | lightFlags));
        }
    }

    @Override
    public void onConfigurationChanged(Configuration c) {
        super.onConfigurationChanged(c);
        applyTheme();
        emit("system-theme-changed", systemDark());
    }

    private void back() {
        web.evaluateJavascript("window.__back ? window.__back() : false", v -> {
            if (!"true".equals(v)) moveTaskToBack(true);
        });
    }

    @Override
    @SuppressWarnings("deprecation")
    public void onBackPressed() {
        back();
    }

    /* ---------------- lifecycle ---------------- */

    @Override
    protected void onStart() {
        super.onStart();
        Host.live = this;
        web.onResume();
        web.resumeTimers();
        emit("window-visible", true);
        if (pageReady) checkUpdate();
    }

    @Override
    protected void onStop() {
        emit("window-visible", false);
        // Let the page save, then sleep: the alarm and the notification keep time meanwhile.
        ui.postDelayed(() -> {
            if (!isStartedNow()) {
                web.onPause();
                web.pauseTimers();
            }
        }, 400);
        super.onStop();
    }

    private boolean started;
    @Override protected void onResume() { super.onResume(); started = true; }
    @Override protected void onPause() { started = false; super.onPause(); }
    private boolean isStartedNow() { return started; }

    @Override
    protected void onDestroy() {
        if (Host.live == this) Host.live = null;
        web.destroy();
        super.onDestroy();
    }

    /** yaytsa://auth?state=…&rt=… from the site after Google sign-in (see sync.js). */
    private static JSONObject authFrom(Intent intent) {
        Uri u = intent != null ? intent.getData() : null;
        if (u == null || !"yaytsa".equals(u.getScheme()) || !"auth".equals(u.getHost())) return null;
        String state = u.getQueryParameter("state"), rt = u.getQueryParameter("rt");
        if (state == null || rt == null) return null;
        try {
            return new JSONObject().put("state", state).put("rt", rt);
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        JSONObject auth = authFrom(intent);
        if (auth != null) {
            if (pageReady) emit("auth-result", auth); else pendingAuth = auth;
        }
        String a = intent.getStringExtra(Host.EXTRA_ALERT_ACTION);
        if (a != null) {
            Host.cancelAlert(this);
            if (pageReady) emit("alert-action", a); else pendingAlertAction = a;
        }
    }

    /* ---------------- page <-> host ---------------- */

    static String js(Object v) {
        if (v == null) return "null";
        if (v instanceof String) return JSONObject.quote((String) v);
        if (v instanceof Boolean || v instanceof Number) return String.valueOf(v);
        return v.toString(); // JSONObject / JSONArray
    }

    void emit(String name, Object v) {
        String code = "window.__emit && window.__emit(" + JSONObject.quote(name) + "," + js(v) + ")";
        ui.post(() -> { if (web != null) web.evaluateJavascript(code, null); });
    }

    void reply(int id, Object v) {
        if (id == 0) return;
        String code = "window.__reply && window.__reply(" + id + "," + js(v) + ")";
        ui.post(() -> { if (web != null) web.evaluateJavascript(code, null); });
    }

    private String version() {
        try {
            return getPackageManager().getPackageInfo(getPackageName(), 0).versionName;
        } catch (Exception e) {
            return "0";
        }
    }

    private void checkUpdate() {
        long now = System.currentTimeMillis();
        if (now - lastUpdateCheck < UPDATE_EVERY) return;
        lastUpdateCheck = now;
        String local = version();
        new Thread(() -> {
            try { Thread.sleep(8000); } catch (InterruptedException ignored) {}
            Updater.check(getApplicationContext(), local, v -> emit("update-ready", v));
        }).start();
    }

    private void onReady() {
        pageReady = true;
        if (pendingAlertAction != null) {
            Host.cancelAlert(this);
            emit("alert-action", pendingAlertAction);
            pendingAlertAction = null;
        }
        if (pendingAuth != null) {
            emit("auth-result", pendingAuth);
            pendingAuth = null;
        }
        if (Build.VERSION.SDK_INT >= 33 && checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(new String[]{Manifest.permission.POST_NOTIFICATIONS}, REQ_NOTIFY);
        }
        checkUpdate();
    }

    /** Commands from bridge.js; run on the UI thread in the order the page sent them. */
    private void handle(int id, String cmd, JSONArray args) {
        switch (cmd) {
            case "ready":
                onReady();
                break;
            case "timerState": {
                JSONObject s = args.optJSONObject(0);
                if (s != null) Host.setTimer(this, s);
                break;
            }
            case "showAlert": {
                JSONObject d = args.optJSONObject(0);
                if (d == null) break;
                if (!d.optBoolean("test") && Host.alreadyAlerted(this)) break; // the alarm already rang for it
                Host.postAlert(this, d.optString("title"), d.optString("body"),
                        d.optBoolean("hideGo") ? "" : d.optString("goLabel"), d.optString("okLabel"), d.optBoolean("sound", true));
                break;
            }
            case "notify":
                if (!Host.alreadyAlerted(this)) Host.postAlert(this, args.optString(0), args.optString(1), "", "", false);
                break;
            case "closeAlert":
                Host.cancelAlert(this);
                break;
            case "theme":
                theme = args.optString(0, "dark");
                applyTheme();
                break;
            case "exportCsv": {
                exportId = id;
                exportCsv = args.optString(0);
                Intent i = new Intent(Intent.ACTION_CREATE_DOCUMENT).addCategory(Intent.CATEGORY_OPENABLE)
                        .setType("text/csv").putExtra(Intent.EXTRA_TITLE, args.optString(1, "yaytsa-timer.csv"));
                try {
                    startActivityForResult(i, REQ_EXPORT);
                } catch (Exception e) {
                    reply(id, false);
                }
                break;
            }
            case "authBrowser": {
                String state = args.optString(0), site = args.optString(1);
                if (state.matches("[0-9a-f]{16,64}") && site.startsWith("https://")) openUrl(site + "#timer-login/a/" + state);
                break;
            }
            case "openUrl": {
                String u = args.optString(0);
                if (u.startsWith("https://")) openUrl(u);
                break;
            }
            case "installUpdate":
                Updater.install(this);
                break;
            case "background":
                moveTaskToBack(true);
                break;
            case "log":
                Log.i(TAG, args.optString(0));
                break;
            default:
                reply(id, null);
        }
    }

    private void openUrl(String u) {
        try {
            startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(u)));
        } catch (Exception e) {
            Log.w(TAG, "no browser", e);
        }
    }

    final class Bridge {
        @JavascriptInterface
        public void post(String json) {
            try {
                JSONObject m = new JSONObject(json);
                int id = m.optInt("id");
                String cmd = m.optString("cmd");
                JSONArray args = m.optJSONArray("args");
                JSONArray a = args != null ? args : new JSONArray();
                ui.post(() -> handle(id, cmd, a));
            } catch (Exception e) {
                Log.w(TAG, "bad message", e);
            }
        }

        /** Synchronous calls: load, save, systemDark. */
        @JavascriptInterface
        public String sync(String json) {
            try {
                JSONObject m = new JSONObject(json);
                JSONArray args = m.optJSONArray("args");
                switch (m.optString("cmd")) {
                    case "load": {
                        JSONObject data;
                        try { data = new JSONObject(Host.readData(MainActivity.this)); } catch (Exception e) { data = new JSONObject(); }
                        data.put("timer", Host.timer(MainActivity.this));
                        return data.toString();
                    }
                    case "save":
                        Object p = args != null ? args.opt(0) : null;
                        return String.valueOf(p != null && Host.writeData(MainActivity.this, p.toString()));
                    case "systemDark":
                        return String.valueOf(systemDark());
                }
            } catch (Exception e) {
                Log.w(TAG, "sync failed", e);
            }
            return "null";
        }
    }

    /* ---------------- file pickers ---------------- */

    @Override
    @SuppressWarnings("deprecation")
    protected void onActivityResult(int req, int result, Intent data) {
        super.onActivityResult(req, result, data);
        Uri uri = result == RESULT_OK && data != null ? data.getData() : null;
        if (req == REQ_IMPORT) {
            if (fileCallback != null) fileCallback.onReceiveValue(uri != null ? new Uri[]{uri} : null);
            fileCallback = null;
        } else if (req == REQ_EXPORT) {
            boolean ok = false;
            if (uri != null && exportCsv != null) {
                try (OutputStream out = getContentResolver().openOutputStream(uri, "wt")) {
                    out.write(new byte[]{(byte) 0xEF, (byte) 0xBB, (byte) 0xBF});
                    out.write(exportCsv.getBytes(StandardCharsets.UTF_8));
                    ok = true;
                } catch (Exception e) {
                    Log.w(TAG, "export failed", e);
                }
            }
            exportCsv = null;
            reply(exportId, ok);
        }
    }
}

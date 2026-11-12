package com.brlk33.yaytsatimer;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

import org.json.JSONObject;

/** End-of-phase alarm, notification buttons, and re-arming the alarm after a reboot. */
public class TimerReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context c, Intent intent) {
        String a = intent.getAction();
        if (a == null) return;
        Host.createChannels(c);
        switch (a) {
            case CloudJob.ACTION_CLOUD: {
                PendingResult r = goAsync();
                CloudJob.lookNow(c, r::finish);
                break;
            }
            case Host.ACTION_ALARM:
                Host.phaseDue(c);
                break;
            case Host.ACTION_TOGGLE: {
                JSONObject s = Host.toggle(c);
                MainActivity live = Host.live;
                if (live != null) live.emit("timer-state", s);
                break;
            }
            case Host.ACTION_DISMISS: {
                Host.cancelAlert(c);
                MainActivity live = Host.live;
                if (live != null) live.emit("alert-action", "dismiss");
                break;
            }
            case Intent.ACTION_BOOT_COMPLETED:
            case Intent.ACTION_MY_PACKAGE_REPLACED: {
                JSONObject s = Host.timer(c);
                if (!s.optBoolean("running") && s.optJSONObject("series") == null && s.optJSONObject("plan") == null) {
                    Host.showTimer(c, s);
                } else if (s.optBoolean("running") && s.optLong("endAt") <= System.currentTimeMillis()) {
                    Host.phaseDue(c);
                } else {
                    Host.setTimer(c, s);
                }
                break;
            }
        }
    }
}

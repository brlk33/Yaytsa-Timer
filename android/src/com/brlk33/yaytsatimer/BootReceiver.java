package com.brlk33.yaytsatimer;

import android.content.Context;
import android.content.Intent;

/** Alarms are lost on reboot and on app update: re-arm (exported, so only these actions pass). */
public class BootReceiver extends TimerReceiver {
    @Override
    public void onReceive(Context c, Intent intent) {
        String a = intent.getAction();
        if (Intent.ACTION_BOOT_COMPLETED.equals(a) || Intent.ACTION_MY_PACKAGE_REPLACED.equals(a)) {
            super.onReceive(c, intent);
        }
    }
}

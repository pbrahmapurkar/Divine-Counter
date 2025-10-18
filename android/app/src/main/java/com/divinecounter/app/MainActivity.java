package com.divinecounter.app;

import android.os.Bundle;
import android.view.KeyEvent;
import android.util.Log;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private static final String TAG = "DivineCounter";
    
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Log.d(TAG, "MainActivity onCreate called");
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (event.getAction() == KeyEvent.ACTION_DOWN) {
            switch (keyCode) {
                case KeyEvent.KEYCODE_VOLUME_UP:
                    Log.d(TAG, "Volume Up pressed");
                    // Send volume up event to WebView
                    bridge.getWebView().evaluateJavascript(
                        "window.dispatchEvent(new CustomEvent('volume-up'))", null
                    );
                    return true;
                case KeyEvent.KEYCODE_VOLUME_DOWN:
                    Log.d(TAG, "Volume Down pressed");
                    // Send volume down event to WebView
                    bridge.getWebView().evaluateJavascript(
                        "window.dispatchEvent(new CustomEvent('volume-down'))", null
                    );
                    return true;
            }
        }
        return super.onKeyDown(keyCode, event);
    }
}

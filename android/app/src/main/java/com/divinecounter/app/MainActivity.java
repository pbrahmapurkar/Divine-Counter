package com.divinecounter.app;

import android.view.KeyEvent;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public boolean dispatchKeyEvent(KeyEvent event) {
        int action = event.getAction();
        int keyCode = event.getKeyCode();
        
        // Only handle key down events to avoid duplicates
        if (action == KeyEvent.ACTION_DOWN) {
            if (keyCode == KeyEvent.KEYCODE_VOLUME_UP) {
                // Send volume up event directly to JavaScript
                getBridge().getWebView().post(() -> {
                    getBridge().getWebView().evaluateJavascript(
                        "window.dispatchEvent(new CustomEvent('volumebutton', { detail: { direction: 'up' } }));",
                        null
                    );
                });
                return true; // Consume the event to prevent volume change
            } else if (keyCode == KeyEvent.KEYCODE_VOLUME_DOWN) {
                // Send volume down event directly to JavaScript
                getBridge().getWebView().post(() -> {
                    getBridge().getWebView().evaluateJavascript(
                        "window.dispatchEvent(new CustomEvent('volumebutton', { detail: { direction: 'down' } }));",
                        null
                    );
                });
                return true; // Consume the event to prevent volume change
            }
        }
        
        return super.dispatchKeyEvent(event);
    }
}

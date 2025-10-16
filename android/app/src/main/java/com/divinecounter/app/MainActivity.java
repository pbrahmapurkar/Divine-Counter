package com.divinecounter.app;

import android.view.KeyEvent;
import com.getcapacitor.BridgeActivity;
import com.ryltsov.alex.plugins.volume.buttons.VolumeButtonsPlugin;
import com.getcapacitor.JSObject;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(android.os.Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        registerPlugin(VolumeButtonsPlugin.class);
    }

    @Override
    public boolean dispatchKeyEvent(KeyEvent event) {
        int action = event.getAction();
        int keyCode = event.getKeyCode();
        
        switch (keyCode) {
            case KeyEvent.KEYCODE_VOLUME_UP:
                if (action == KeyEvent.ACTION_DOWN) {
                    // Send volume up event to JavaScript
                    JSObject data = new JSObject();
                    data.put("direction", "up");
                    data.put("timestamp", System.currentTimeMillis());
                    this.bridge.eval("window.dispatchEvent(new CustomEvent('volumeButtonPressed', { detail: '" + data.toString() + "' }));", null);
                }
                return true; // Consume the event to prevent volume change
                
            case KeyEvent.KEYCODE_VOLUME_DOWN:
                if (action == KeyEvent.ACTION_DOWN) {
                    // Send volume down event to JavaScript
                    JSObject data = new JSObject();
                    data.put("direction", "down");
                    data.put("timestamp", System.currentTimeMillis());
                    this.bridge.eval("window.dispatchEvent(new CustomEvent('volumeButtonPressed', { detail: '" + data.toString() + "' }));", null);
                }
                return true; // Consume the event to prevent volume change
                
            default:
                return super.dispatchKeyEvent(event);
        }
    }
}

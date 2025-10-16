package com.divinecounter.app;

import android.view.KeyEvent;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    
    private VolumeControlPlugin volumeControlPlugin;
    
    @Override
    public void onCreate(android.os.Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        registerPlugin(VolumeControlPlugin.class);
    }
    
    @Override
    protected void onStart() {
        super.onStart();
        // Get reference to our plugin
        volumeControlPlugin = (VolumeControlPlugin) getBridge().getPlugin("VolumeControl").getInstance();
    }

    @Override
    public boolean dispatchKeyEvent(KeyEvent event) {
        int keyCode = event.getKeyCode();
        
        // Check if it's a volume key
        if (keyCode == KeyEvent.KEYCODE_VOLUME_UP || keyCode == KeyEvent.KEYCODE_VOLUME_DOWN) {
            // Let our plugin handle it
            if (volumeControlPlugin != null && volumeControlPlugin.handleVolumeKey(keyCode, event)) {
                return true; // Consume the event to prevent volume change
            }
        }
        
        return super.dispatchKeyEvent(event);
    }
}

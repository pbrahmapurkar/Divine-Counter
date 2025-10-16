package com.divinecounter.app;

import android.view.KeyEvent;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.JSObject;

@CapacitorPlugin(name = "VolumeControl")
public class VolumeControlPlugin extends Plugin {
    
    private boolean isEnabled = false;
    
    @PluginMethod
    public void enable(PluginCall call) {
        isEnabled = true;
        JSObject ret = new JSObject();
        ret.put("success", true);
        call.resolve(ret);
    }
    
    @PluginMethod
    public void disable(PluginCall call) {
        isEnabled = false;
        JSObject ret = new JSObject();
        ret.put("success", true);
        call.resolve(ret);
    }
    
    @PluginMethod
    public void isEnabled(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("enabled", isEnabled);
        call.resolve(ret);
    }
    
    public boolean handleVolumeKey(int keyCode, KeyEvent event) {
        if (!isEnabled || event.getAction() != KeyEvent.ACTION_DOWN) {
            return false;
        }
        
        JSObject data = new JSObject();
        
        if (keyCode == KeyEvent.KEYCODE_VOLUME_UP) {
            data.put("direction", "up");
            notifyListeners("volumeButtonPressed", data);
            return true;
        } else if (keyCode == KeyEvent.KEYCODE_VOLUME_DOWN) {
            data.put("direction", "down");
            notifyListeners("volumeButtonPressed", data);
            return true;
        }
        
        return false;
    }
}

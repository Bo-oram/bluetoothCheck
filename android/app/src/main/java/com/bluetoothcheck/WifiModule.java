
package com.bluetoothcheck;

import android.content.Context;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.os.Build;
import android.Manifest;
import android.content.pm.PackageManager;
import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class WifiModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    WifiModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
    }

    @NonNull
    @Override
    public String getName() {
        return "WifiModule";
    }

    

    @ReactMethod
    public void getWifiSSID(Promise promise) {
        WifiManager wifiManager = (WifiManager) reactContext.getApplicationContext().getSystemService(Context.WIFI_SERVICE);
       
        //권한확인
        if (ActivityCompat.checkSelfPermission(reactContext, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            promise.reject("PERMISSION_DENIED", "접근 권한을 확인하세요.");
            return;
        }

        WifiInfo wifiInfo = wifiManager.getConnectionInfo();

            // 와이파이 연결 여부 확인
        if (wifiInfo == null || wifiInfo.getNetworkId() == -1) {
            promise.reject("NO_WIFI_CONNECTION", "와이파이가 연결해주세요.");
            return;
        }


        //wifi정보 확인
        if (wifiInfo != null && wifiInfo.getSSID() != null) {
            //정보 있으면 ssid리턴
            String ssid = wifiInfo.getSSID();
            if (ssid.startsWith("\"") && ssid.endsWith("\"")) {
                ssid = ssid.substring(1, ssid.length() - 1);  // Remove double quotes
            }
            promise.resolve(ssid);
        } else {
            //정보 확인되지 않으면
            promise.reject("NO_SSID", "ssid확인 불가");
        }
    }
}
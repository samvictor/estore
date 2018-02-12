//  Created by react-native-create-bridge

package com.estore.braintree;

import android.app.Activity;
import android.support.annotation.Nullable;

import com.braintreepayments.api.dropin.DropInRequest;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.HashMap;
import java.util.Map;

public class BraintreeModule extends ReactContextBaseJavaModule {
    public static final String REACT_CLASS = "Braintree";
    private static ReactApplicationContext reactContext = null;

    public BraintreeModule(ReactApplicationContext context) {
        // Pass in the context to the constructor and save it so you can emit events
        // https://facebook.github.io/react-native/docs/native-modules-android.html#the-toast-module
        super(context);

        reactContext = context;
    }

    @Override
    public String getName() {
        // Tell React the name of the module
        // https://facebook.github.io/react-native/docs/native-modules-android.html#the-toast-module
        return REACT_CLASS;
    }

    @Override
    public Map<String, Object> getConstants() {
        // Export any constants to be used in your native module
        // https://facebook.github.io/react-native/docs/native-modules-android.html#the-toast-module
        final Map<String, Object> constants = new HashMap<>();
        constants.put("EXAMPLE_CONSTANT", "example");

        return constants;
    }

    @ReactMethod
    public void exampleMethod () {
        // An example native method that you will expose to React
        // https://facebook.github.io/react-native/docs/native-modules-android.html#the-toast-module
    }


    @ReactMethod
    public void accept_payment (String token) {
        final WritableMap event = Arguments.createMap();
        event.putString("message", "Accepting Payment");
        emitDeviceEvent("NATIVE_MESSAGE", event);


        DropInRequest dropInRequest = new DropInRequest()
                .clientToken(token);
        Activity curr_activity = reactContext.getCurrentActivity();
        curr_activity.startActivityForResult(dropInRequest.getIntent(reactContext), 1);
    }

    private static void emitDeviceEvent(String eventName, @Nullable WritableMap eventData) {
        // A method for emitting from the native side to JS
        // https://facebook.github.io/react-native/docs/native-modules-android.html#sending-events-to-javascript
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, eventData);
    }
}

//  Created by react-native-create-bridge

package com.estore.braintree;

import android.app.Activity;
import android.content.Intent;
import android.support.annotation.Nullable;

import com.braintreepayments.api.dropin.DropInActivity;
import com.braintreepayments.api.dropin.DropInRequest;
import com.braintreepayments.api.dropin.DropInResult;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.HashMap;
import java.util.Map;

public class BraintreeModule extends ReactContextBaseJavaModule {
    public static final String REACT_CLASS = "Braintree";

    private static final String E_ACTIVITY_DOES_NOT_EXIST = "activity_does_not_exist";
    private static final String E_BRAINTREE_FAILED = "braintree_failed";
    private static final String E_USER_CANCELED = "user_canceled";
    private static final int BRAIN_REQUEST = 28935;

    private static ReactApplicationContext reactContext = null;
    private Promise mBrainPromise;

    private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
            //final WritableMap event = Arguments.createMap();

            if (requestCode == BRAIN_REQUEST) {
                if (mBrainPromise != null) {
                    if (resultCode == Activity.RESULT_OK) {
                        DropInResult result = data.getParcelableExtra(DropInResult.EXTRA_DROP_IN_RESULT);
                        // use the result to update your UI and send the payment method nonce to your server
                        String paymentMethodNonce = result.getPaymentMethodNonce().getNonce();
                        mBrainPromise.resolve(paymentMethodNonce);
                    } else if (resultCode == Activity.RESULT_CANCELED) {
                        // the user canceled
                        mBrainPromise.reject(E_USER_CANCELED, "User canceled");
                    } else {
                        // handle errors here, an exception may be available in
                        Exception error = (Exception) data.getSerializableExtra(DropInActivity.EXTRA_ERROR);
                        mBrainPromise.reject(error.getMessage(), "on activity result code: " + Integer.toString(resultCode));
                    }
                }
            }
            else {
                //event.putString("message", "Wrong request code?");
            }

            //emitDeviceEvent("NATIVE_MESSAGE", event);
        }
    };

    public BraintreeModule(ReactApplicationContext context) {
        // Pass in the context to the constructor and save it so you can emit events
        // https://facebook.github.io/react-native/docs/native-modules-android.html#the-toast-module
        super(context);

        reactContext = context;
        reactContext.addActivityEventListener(mActivityEventListener);
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
    public void accept_payment (String token, Promise promise) {
        mBrainPromise = promise;

        Activity curr_activity = reactContext.getCurrentActivity();
        if (curr_activity == null) {
            promise.reject(E_ACTIVITY_DOES_NOT_EXIST, "Activity doesn't exist");
            return;
        }

        try {
            DropInRequest dropInRequest = new DropInRequest()
                    .clientToken(token);

            curr_activity.startActivityForResult(dropInRequest.getIntent(reactContext), BRAIN_REQUEST);
        }
        catch(Exception e){
            promise.reject(E_BRAINTREE_FAILED, "Could not start braintree");
        }
    }

    private static void emitDeviceEvent(String eventName, @Nullable WritableMap eventData) {
        // A method for emitting from the native side to JS
        // https://facebook.github.io/react-native/docs/native-modules-android.html#sending-events-to-javascript
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, eventData);
    }
}

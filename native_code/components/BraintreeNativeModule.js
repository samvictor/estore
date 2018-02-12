//  Created by react-native-create-bridge
import { NativeModules, NativeEventEmitter } from 'react-native'

const { Braintree } = NativeModules

const BraintreeEmitter = new NativeEventEmitter(Braintree);

export default {
  exampleMethod () {
    return Braintree.exampleMethod();
  },

  accept_payment() {
    return fetch(
        'https://us-central1-estore-7e485.cloudfunctions.net/client_token_mobile',
        {
          'method': 'POST',
          'body': JSON.stringify({
            ***REMOVED***
          })
        }
      ).then((response) => {
        return response.text();
      })
      .then(function(text){
        return Braintree.accept_payment(text);
      });
  },

  emitter: BraintreeEmitter,

  EXAMPLE_CONSTANT: Braintree.EXAMPLE_CONSTANT
}

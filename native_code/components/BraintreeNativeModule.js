//  Created by react-native-create-bridge

import { NativeModules, NativeEventEmitter } from 'react-native'

const { Braintree } = NativeModules

const BraintreeEmitter = new NativeEventEmitter(Braintree);

export default {
  exampleMethod () {
    return Braintree.exampleMethod();
  },

  accept_payment() {
    return Braintree.accept_payment();
  },

  emitter: BraintreeEmitter,

  EXAMPLE_CONSTANT: Braintree.EXAMPLE_CONSTANT
}

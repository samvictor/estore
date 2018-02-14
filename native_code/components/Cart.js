import React, { Component } from 'react';
import {
  AsyncStorage,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  ScrollView,
} from 'react-native';
import TextInputState from 'react-native/lib/TextInputState'

import styles from './Styles';
import gen_items from './ShowItems';

import Braintree from './BraintreeNativeModule';


export default class Cart extends Component<{}> {
  constructor(props){
    super(props);

    this.state = {
      'log': 'ver 1',
      'msg_listener': null,
    };
  }

  componentWillMount() {
    let msg_listener = Braintree.emitter.addListener(
      'NATIVE_MESSAGE',
      ({message}) => {
        this.props.set_app_state({'snack_msg': message,
                                'snack_duration': 4000});
        this.setState({'log': message});
      }
    );

    this.setState({'msg_listener': msg_listener});
  }


  async accept_press () {
    this.props.set_app_state({'snack_msg':'Working...',
                            'snack_duration': 4000});
    try {
      let res = await Braintree.accept_payment(this.props.app_state.user);

      this.props.set_app_state({'snack_msg': res,
                              'snack_duration': 6000});
    }
    catch(e){
      this.props.set_app_state({'snack_msg':'braintree error: ' + e,
                              'snack_duration': 6000});
    }
  };

  render() {
    let price = 0;

    let cart = this.props.app_state.user_cart;
    let this_item;
    let render_items = null;

    if(cart.length === 0){
      if(this.props.app_state.user_cart_loaded)
        render_items = <Text style={styles.h5}>Cart is Empty</Text>;
      else
        render_items = <Text style={styles.h5}>Loading...</Text>;
    }
    else {
      render_items = gen_items(this, this.props.app_state);
    }

    let all_items = this.props.app_state.items_dict;
    for(var i = 0; i < cart.length; i++) {
      this_item = all_items[cart[i]];
      price += parseFloat(this_item.price);
    }

    return (
      <View style={[{flex: 1, width: '100%'}]}>
        <ScrollView style={[styles.scroll]}
              contentContainerStyle={styles.scroll_container}>

          <View style={{width: '100%', height:110, backgroundColor: 'white'}}>
          </View>
          <View style={{width: '90%', margin: 10}}>
            <Button title={'$' + price.toFixed(2)+'  |  Checkout'}
                    style={{'width': '100%'}}
                    onPress={this.accept_press.bind(this)} />
          </View>
          {render_items}
        </ScrollView>
        <View style={[styles.fixed_top, styles.banner]}>
          <Text style={[styles.h4, {color: 'white'}]}>
            Cart
          </Text>
          <Text style={[styles.h6, styles.red_text]}>
            { (this.props.app_state.user !== null)
              ? this.props.app_state.user.email
              : ''
            }
          </Text>
        </View>
      </View>
    );
  }

  componentWillUnmount(){
    this.state.msg_listener.remove();
  }
}

import React, { Component } from 'react';
import {
  AsyncStorage,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  WebView,
  Dimensions,
  ScrollView,
} from 'react-native';
import TextInputState from 'react-native/lib/TextInputState';

import styles from './Styles';
import checkout_html from './checkout_html.js';

//TODO: cart should stay lit during checkout

export default class Checkout extends Component<{}> {
  constructor(props){
    super(props);

    this.state = {
      'log': 'ver 1',
      'screen_width': Dimensions.get('window').width,
    };

    // Event Listener for orientation changes
    Dimensions.addEventListener('change', () => {
        this.setState({
            'screen_width': Dimensions.get('window').width,
        });
    });
  }

  render() {
    let price = 0;

    let cart = this.props.app_state.user_cart;
    let this_item;
    let message = null;

    let cart_is = 'empty';

    if(cart.length === 0){
      if(this.props.app_state.user_cart_loaded) {
        message = <Text style={styles.h5}>Cart is Empty</Text>;
      }
      else {
        message = <Text style={styles.h5}>Loading...</Text>;
        cart_is = 'loading';
      }
    }
    else {
      message = <Text>Please Pay Below:</Text>;
      cart_is = 'ready';
    }

    let all_items = this.props.app_state.items_dict;
    for(var i = 0; i < cart.length; i++) {
      this_item = all_items[cart[i]];
      price += parseFloat(this_item.price);
    }

    let js_code = `
      from_react({
        'price': '${price.toFixed(2)}',
        'cart_is': '${cart_is}',
        'user': {
          'uid': '${this.props.app_state.user.uid}',
          'email': '${this.props.app_state.user.email}'
        }
      });
    `;
    message = <Text>{js_code.toString()}</Text>;

    return (
      <View style={[styles.container, {backgroundColor: '#80'}]}>
        <ScrollView style={[styles.scroll]}
              contentContainerStyle={styles.scroll_container}>
          <View style={{height: 120}}/>
          {message}
          <WebView
            style={[checkout_styles.WebViewStyle,
                    {width: this.state.screen_width}]}
            source={{html: checkout_html}}
            injectedJavaScript={js_code}

            onMessage={(event)=>{
              let data_json = {};
              try {
                data_json = JSON.parse(event.nativeEvent.data);
              }
              catch(e){
                return;
              }


              switch(data_json.message){
                case 'snack':
                  this.props.set_app_state({
                    'snack_msg': data_json.extra,
                    'snack_duration': 4000
                  });
                break;
              }

            }}/>

        </ScrollView>
        <View style={[styles.fixed_top, styles.banner]}>
          <Text style={[styles.h4, {color: 'white'}]}>
            {'Checkout  |  $' + price.toFixed(2)}
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
}



const checkout_styles = StyleSheet.create({
  WebViewStyle:
  {
     justifyContent: 'center',
     alignItems: 'center',
     height: 380,
     marginTop: (Platform.OS) === 'ios' ? 20 : 0,
  }
});

import React, { Component } from 'react';
import {
  AsyncStorage,
  StyleSheet,
  Text,
  ScrollView,
  View,
  Image,
  Animated,
  TextInput,
  Button,
} from 'react-native';

import styles from './Styles';

// call when cart btn pressed
function cart_btn(parent_this, item_id, in_cart, app_state) {
  let user = app_state.user;
  if(user === null) {
    parent_this.props.set_app_state({
                    'snack_msg': 'Please login before adding items to cart',
                    'snack_duration': 5000
    });
    return;
  }

  let for_db = {};
  if (in_cart)
    for_db['cart/'+item_id] = null;
  else
    for_db['cart/'+item_id] = {'item_id': item_id};

  app_state.db.child('/users/'+user.uid).update(for_db)
    .then(function(){
      parent_this.props.set_app_state({'snack_msg': (in_cart)?
                                                'Item removed from cart'
                                                :'Item added to cart',
                                'snack_duration': 1500});
    }).catch(function(error){
      parent_this.props.set_app_state({'snack_msg': error.message,
                                'snack_duration': 7000});
    });
}

function gen_items(parent_this, app_state) {
  let this_item = {};
  let items = app_state.items;
  let for_ret = [];
  let short_description;

  if(items.length === 0){
    if (app_state.items_loaded) {
      for_ret = [<Text>
        No items available for purchase. Check back later.
      </Text>];
    }
    else
      for_ret = [<Text className="loading_items">Loading...</Text>];
  }

  for(var i = 0; i < items.length; i++) {
    this_item = items[i];
    short_description = this_item.description;
    if(short_description.length > 260)
      short_description = short_description.substring(0, 260) + '...';
    let item_url = (this_item.imgs === undefined)? '': this_item.imgs[0].url;
    let temp_btn;
    if(app_state.user_cart.includes(this_item.id)){
      temp_btn =
        <Button onPress={cart_btn.bind(this, parent_this, this_item.id, true, app_state)}
                      title={'$'+this_item.price}
                      color="green">
        </Button>;
    }
    else {
      temp_btn =
        <Button onPress={cart_btn.bind(this, parent_this, this_item.id, false, app_state)}
                title={'$'+this_item.price}>
        </Button>;

    }
    for_ret.push(
      <View style={styles.item_shaddow}>
      <View style={styles.item}>
        <Image source={{uri: item_url}} style={styles.item_image}/>
        <View style={styles.item_content}>
          <Text style={[styles.h5, styles.item_title]}>
            {this_item.name.toUpperCase()}
          </Text>
          <Text style={styles.item_desc}>{short_description}</Text>
          {temp_btn}
        </View>
      </View>
      </View> );
  }

  return for_ret;
}

export default gen_items;

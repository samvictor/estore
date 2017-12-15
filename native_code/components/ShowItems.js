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

function cart_btn(item_id, in_cart, app_state) {
  let user = app_state.user;
  if(user === null) {
    //$('#alert_info').text('Please login before adding items to cart')
    //        .fadeIn().delay(5000).fadeOut();
    return;
  }
  let for_db = {};
  if (in_cart)
    for_db['cart/'+item_id] = null;
  else
    for_db['cart/'+item_id] = {'item_id': item_id};

  app_state.db.child('/users/'+user.uid).update(for_db)
    .then(function(){
      //$('#alert_success')
      //        .text((in_cart)?'Item removed from cart':'Item added to cart')
      //        .fadeIn().delay(1000).fadeOut();
    }).catch(function(error){
      //$('#alert_danger').text(error.message).fadeIn().delay(7000).fadeOut();
    });
}

function gen_items(app_state) {
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
        <Button onPress={cart_btn.bind(this, this_item.id, true, app_state)}
                      title={'$'+this_item.price}>
        </Button>;
    }
    else {
      temp_btn =
        <Button onPress={cart_btn.bind(this, this_item.id, false, app_state)}
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

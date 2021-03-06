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
  TouchableOpacity,
} from 'react-native';

import styles from './Styles';
import Icon from 'react-native-vector-icons/MaterialIcons';

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


// call when remove from cart btn pressed
function remove_btn(parent_this, item_id, in_cart, app_state) {
  let user = app_state.user;
  if(user === null) {
    parent_this.props.set_app_state({
                    'snack_msg': 'Please login before using cart',
                    'snack_duration': 5000
    });
    return;
  }

  let for_db = {};
  for_db['cart/'+item_id] = null;

  app_state.db.child('/users/'+user.uid).update(for_db)
    .then(function(){
      parent_this.props.set_app_state({'snack_msg': 'Item removed from cart',
                                'snack_duration': 1500});
    }).catch(function(error){
      parent_this.props.set_app_state({'snack_msg': error.message,
                                'snack_duration': 7000});
    });
}

function gen_items(parent_this, app_state, local_items) {
  let this_item = {};
  let items = [];
  if (app_state.path === 'home')
    items = app_state.items;
  else if (app_state.path === 'search')
    items = local_items;
  else if (app_state.path === 'cart') {
    let cart = app_state.user_cart;
    let all_items = app_state.items_dict;
    for (var j = 0; j < cart.length; j++){
      items.push(all_items[cart[j]]);
    }
  }

  let for_ret = [];
  let short_description;

  if(items.length === 0){
    if (app_state.items_loaded) {
      for_ret = [<Text>
        No items available for purchase. Check back later.
      </Text>];
      if(app_state.path === 'search')
        for_ret = [];
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
    if (app_state.path === 'home' || app_state.path === 'search') {
      if(app_state.user_cart.includes(this_item.id)){
        temp_btn =
          <TouchableOpacity onPress={cart_btn.bind(this, parent_this,
                                          this_item.id, true, app_state)}
                        style={[styles.button, {backgroundColor: 'green'}]}>
            <Text style={{textAlign: 'center', color: 'white'}}>
              {'$'+this_item.price + '  |  '}
            </Text>
            <Icon name='check' size={18} style={{marginTop: 2, color: 'white'}}/>
          </TouchableOpacity>;
      }
      else {
        temp_btn =
          <TouchableOpacity onPress={cart_btn.bind(this, parent_this,
                                          this_item.id, false, app_state)}
                        style={[styles.button, {backgroundColor: '#1a8fff'}]}>
            <Text style={{textAlign: 'center', color: 'white'}}>
              {'$'+this_item.price + '  |  '}
            </Text>
            <Icon name='add-shopping-cart' size={18} style={{marginTop: 2, color: 'white'}}/>
          </TouchableOpacity>;

      }
    }
    if(app_state.path === 'cart'){
      temp_btn = <Button onPress={remove_btn.bind(this, parent_this,
                                    this_item.id, false, app_state)}
            title={'$'+this_item.price+'  |  Remove'}
            color='#d61010'>

      </Button>
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

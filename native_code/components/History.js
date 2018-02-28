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
  PixelRatio,
} from 'react-native';
import TextInputState from 'react-native/lib/TextInputState'
import Moment from 'moment';

import styles from './Styles';


export default class History extends Component<{}> {
  constructor(props){
    super(props);

    this.state = {
      'log': 'ver 1',
      'search_term': '',
    };
  }

  search_orders (search_term, orders) {
    if (search_term === '')
      return {'perfect_match': []};

    // In perfect match, all words in search term must be somewhere in item names or user email.
    let perfect_match = [];

    let search_list = search_term.toLowerCase().replace(/[^a-z\s]+/g, '')
                                                                  .split(' ');

    if (search_list.length === 0)
      return {'perfect_match': []};

    let temp_str_list = [];
    let temp_order;
    let temp_item;

    let temp_is_perfect;
    let temp_search_word;
    let j;
    let temp_order_str = '';

    for (let i = 0; i < orders.length; i++) {
      temp_order = orders[i];
      temp_str_list = [
        temp_order.user.email.toLowerCase().replace(/[^a-z]+/g, ''),
        temp_order.user.uid.toLowerCase().replace(/[^a-z]+/g, '')
      ];

      for (var item_key in temp_order.items) {
        temp_item = temp_order.items[item_key];
        temp_str_list = temp_str_list.concat(temp_item.name.toLowerCase()
                                        .replace(/[^a-z\s]+/g, '').split(' '));
      }

      temp_is_perfect = true;

      for (j = 0; j < search_list.length; j++) {
        temp_search_word = search_list[j];
        // if we know that this not perfect, no reason to keep looking
        if ((!temp_is_perfect)
                  || temp_search_word.length === 0)
          break;

        if (j !== search_list.length - 1) {
          // not looking at last search term word
          if (temp_str_list.includes(temp_search_word)) {
            // if previously false, maintain false, otherwise true
            // temp_is_perfect = temp_is_perfect && true;
          }
          else {
            // no matter what, now imperfect
            temp_is_perfect = false;
          }
        }
        else {
          // if we're looking at the last search term word, check if it's a subset
          // of any words in item name or desc.
          temp_order_str = temp_str_list.join(' ');
          if (temp_order_str.includes(temp_search_word)) {
            // nop
          }
          else {
            temp_is_perfect = false;
          }
        }
      }

      if (temp_is_perfect)
        perfect_match.push(orders[i]);
    }

    return {'perfect_match': perfect_match};
  }

  render() {
    let orders_dict = {};
    let orders = [];

    if (this.props.app_state.user_is_admin === 'true') {
      orders_dict = this.props.app_state.all_orders_dict;
      orders = this.props.app_state.all_orders;
    }
    else {
      orders = this.props.app_state.past_orders;
      orders_dict = this.props.app_state.past_orders_dict;
    }

    if (this.state.search_term.length > 0)
      orders = this.search_orders(this.state.search_term, orders).perfect_match;


    let orders_xml = [];
    let this_order;
    for (var i = 0; i < orders.length; i++) {
      this_order = orders[i];

      let o_items = this_order.items;
      let o_item_list = [];
      let o_item_str = '';
      for (var iid in o_items) {
        o_item_list.push(<Text>{o_items[iid].name}</Text>);
        o_item_list.push(<Text>, </Text>);
      }
      o_item_list.pop();

      Moment.locale('en');
      let o_time = Moment(this_order.time);

      let user_email = null;
      if (this.props.app_state.user_is_admin === 'true') {
        user_email =
        <Text style={[styles.h5]}>{
          this_order.user.email
        }</Text>;
      }

      orders_xml = orders_xml.concat([
        <View style={{
          backgroundColor: '#202020',
          height: 1/PixelRatio.get(),
          marginVertical: 20,
          width: '100%',
        }}></View>,
        user_email,
        <Text style={[styles.h5]}>{
          o_time.format('ddd, MMM Do YYYY [at] hh:mm A')
        }</Text>,
        <Text>{o_item_list}</Text>,
        <Text style={[styles.h5]}>${this_order.total_price}</Text>,
      ]);
    }

    orders_xml.push(<View style={{
      backgroundColor: '#202020',
      height: 1/PixelRatio.get(),
      marginVertical: 20,
      width: '100%',
    }}></View>);

    if (orders_xml.length <= 1) {
      if (this.props.app_state.user_loaded) {
        if (this.state.search_term.length > 0)
          orders_xml = <Text style={[styles.h5]}>No orders matched your search</Text>;
        else
          orders_xml = <Text style={[styles.h5]}>No Past Orders</Text>;
      }
      else
        orders_xml = <Text style={[styles.h5]}>Loading...</Text>;
    }

    return (
      <View style={[{flex: 1, width: '100%'}]}>
        <ScrollView style={[styles.scroll]}
              contentContainerStyle={styles.scroll_container}>

          <View style={{height:110}} />
          <TextInput
            placeholder='Search'
            returnKeyType = 'search'
            onChangeText={(text) => this.setState({'search_term': text})}
            style={[{width: '80%'}]}
          />
          {orders_xml}
        </ScrollView>
        <View style={[styles.fixed_top, styles.banner]}>
          <Text style={[styles.h4, {color: 'white'}]}>
            Order History
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

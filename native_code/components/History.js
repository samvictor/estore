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
    };
  }

  render() {
    let orders_dict = this.props.app_state.past_orders_dict;
    let orders = this.props.app_state.past_orders;
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

      orders_xml = orders_xml.concat([
        <View style={{
          backgroundColor: '#202020',
          height: 1/PixelRatio.get(),
          marginVertical: 20,
          width: '100%',
        }}></View>,
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
      if (this.props.app_state.user_loaded)
        orders_xml = <Text style={[styles.h5]}>No Past Orders</Text>;
      else
        orders_xml = <Text style={[styles.h5]}>Loading...</Text>;
    }

    return (
      <View style={[{flex: 1, width: '100%'}]}>
        <ScrollView style={[styles.scroll]}
              contentContainerStyle={styles.scroll_container}>

          <View style={{width: '100%', height:110, backgroundColor: 'white'}}>
          </View>
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

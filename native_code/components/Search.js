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


export default class Search extends Component<{}> {
  constructor(props){
    super(props);

    this.state = {
      'log': 'ver 1',
      'search_term': '',
    };
  }

  search_items (search_term, items) {
    if (search_term === '')
      return {'perfect_match': [], 'inclusive_match': []};
    // In perfect match, all words in search term must be somewhere in item name or desc.
    // in inclusive match, at least one word in search term must be in name or desc.
    //    and item is not in perfect match
    let perfect_match = [];
    let inclusive_match = [];

    let search_list = search_term.toLowerCase().replace(/[^a-z\s]+/g, '').split(' ');

    if (search_list.length === 0)
      return {'perfect_match': [], 'inclusive_match': []};

    let temp_str_list = '';
    let temp_item;

    let temp_is_perfect;
    let temp_is_inclusive;
    let temp_search_item;
    let j;
    let temp_item_str = '';

    for (let i = 0; i < items.length; i++) {
      temp_item = items[i];
      temp_str_list = temp_item.name.toLowerCase()
                          .replace(/[^a-z\s]+/g, '').split(' ')
                          .concat(temp_item.description.toLowerCase()
                              .replace(/[^a-z\s]+/g, '').split(' '));

      temp_is_perfect = true;
      temp_is_inclusive = false;

      for (j = 0; j < search_list.length; j++) {
        temp_search_item = search_list[j];
        // if we know that this not perfect and is inclusive, no reason to keep looking
        if ((!temp_is_perfect && temp_is_inclusive)
                  || temp_search_item.length === 0)
          break;

        if (j !== search_list.length - 1) {
          if (temp_str_list.includes(temp_search_item)) {
            // if previously false, maintain false, otherwise true
            // temp_is_perfect = temp_is_perfect && true;
            // no matter what, this is now true
            temp_is_inclusive = true;
          }
          else {
            // no matter what, now imperfect
            temp_is_perfect = false;
            // if previously true, maintain true, otherwise false.
            // temp_is_inclusive = temp_is_inclusive || false;
          }
        }
        else {
          // if we're looking at the last search term word, check if it's a subset
          // of any words in item name or desc.
          temp_item_str = temp_str_list.join(' ');
          if (temp_item_str.includes(temp_search_item)) {
            temp_is_inclusive = true;
          }
          else {
            temp_is_perfect = false;
          }
        }
      }

      if (temp_is_perfect)
        perfect_match.push(items[i]);
      else if (temp_is_inclusive)
        inclusive_match.push(items[i]);
    }

    return {'perfect_match': perfect_match, 'inclusive_match': inclusive_match};
  }

  render() {
    let searched_items = this.search_items(this.state.search_term,
                                            this.props.app_state.items);
    let message = null;
    if(searched_items.perfect_match.length === 0
          && searched_items.inclusive_match.length === 0)
      message = <Text style={[styles.h5, {marginTop: 10}]}>No items matched your search</Text>;

    return (
      <View style={[{flex: 1, width: '100%'}]}>
        <ScrollView style={[styles.scroll]}
              contentContainerStyle={styles.scroll_container}>

          <View style={{height: 100}} />
          <TextInput
            placeholder='Search'
            returnKeyType = 'search'
            onChangeText={(text) => this.setState({'search_term': text})}
            style={[{width: '80%'}]}
          />
          {
            (this.state.search_term.length === 0)
            ? gen_items(this, this.props.app_state, this.props.app_state.items)
            : [
                <Text>Searching for {this.state.search_term}</Text>,
                message,
                gen_items(this, this.props.app_state, searched_items.perfect_match),
                gen_items(this, this.props.app_state, searched_items.inclusive_match)
            ]
          }
        </ScrollView>
        <View style={[styles.fixed_top, styles.banner]}>
          <Text style={[styles.h4, {color: 'white'}]}>
            Search
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

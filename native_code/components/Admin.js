import React, { Component } from 'react';
import {
  AsyncStorage,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import TextInputState from 'react-native/lib/TextInputState'

import styles from './Styles';


export default class Admin extends Component<{}> {
  constructor(props){
    super(props);

    this.state = {
      'log': 'ver 1',
    };
  }

  render() {
    return (
      <View style={[{flex: 1, width: '100%'}]}>
        <ScrollView style={[styles.scroll]}
              contentContainerStyle={styles.scroll_container}>

          <View style={{width: '100%', height:110, backgroundColor: 'white'}}>
          </View>
          <Text>Admin Page</Text>
        </ScrollView>
        <View style={[styles.fixed_top, styles.banner]}>
          <Text style={[styles.h4, {color: 'white'}]}>
            Admin
          </Text>
          <Text style={[styles.h6, styles.red_text]}>
            { (this.props.app_state.user !== null)
              ? this.props.app_state.user.email
              : ''
            }
          </Text>
        </View>
        <TouchableOpacity
          style={{
            right: 20,
            top: 20,
            position: 'absolute'
          }}
          onPress={()=>{
            this.props.set_app_state({'path': 'history'});
          }}
        >
          <Text style={{color: 'white'}}>History</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

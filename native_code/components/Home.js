import React, { Component } from 'react';
import {
  AsyncStorage,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
} from 'react-native';
import TextInputState from 'react-native/lib/TextInputState'

import styles from './Styles';


export default class Home extends Component<{}> {
  constructor(props){
    super(props);

    this.state = {
      'log': 'ver 1',
    };
  }

  render() {
    return (
      <View style={[styles.container, {backgroundColor: 'white'}]}>
        <Text style={[styles.h3]}>
          Home
        </Text>
        <Image source={require("../img/open.png")}
                style={{width: '30%', height: '30%'}}
                resizeMode='contain'/>
      </View>
    );
  }
}

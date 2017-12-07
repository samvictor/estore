import React, { Component } from 'react';
import {
  AsyncStorage,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button
} from 'react-native';

import styles from './Styles';


export default class FirstTime extends Component<{}> {
  constructor(props){
    super(props);

    this.state = {'email': '', 'password': ''};
  }
  render() {
    return (
      <View style={[styles.container, {backgroundColor: '#ddfff8'}]}>
        <Image source={require("../img/open.png")}
                style={{width: '30%', height: '30%'}}
                resizeMode='contain'/>
        <Text style={[styles.h3]}>
          Log In
        </Text>
        <TextInput
          autoCorrect={false}
          placeholder='Email Address'
          returnKeyType = 'next'
          onChangeText={(text) => this.setState({'email': text})}
          style={[{width: '80%'}]}
          onSubmitEditing={(event) => {
            this.refs.pass_input.focus();
          }}
        />
        <TextInput
          ref={(el) => { this.pass_input = el; }}
          autoCorrect={false}
          placeholder='Password'
          secureTextEntry={true}
          onChangeText={(text) => this.setState({'password': text})}
          style={[{width: '80%'}]}
        />

        <Button
          title='Log In'
          accessibilityLabel='Tap here to log in'
          style={{width: '100%'}}
        />
        <Text style={style.text}>{"Don't have an account?"}</Text>
        <Text style={style.text}>skip</Text>
      </View>
    );
  }
}

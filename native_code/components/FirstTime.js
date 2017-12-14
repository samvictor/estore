import React, { Component } from 'react';
import {
  AsyncStorage,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  findNodeHandle
} from 'react-native';
import TextInputState from 'react-native/lib/TextInputState'

import styles from './Styles';


export default class FirstTime extends Component<{}> {
  constructor(props){
    super(props);

    this.state = {
      'email': '', 'password': '',
      'log': 'ver 1',
    };
  }

  focusTextInput(node) {
    try {
      TextInputState.focusTextInput(findNodeHandle(node))
    } catch(e) {
      //this.setState({'log': 'Couldnt focus text input: '+ e.message});
    }
  }


  render() {
    return (
      <View style={[styles.container, {backgroundColor: '#eff8f3'}]}>
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
          keyboardType='email-address'
          onChangeText={(text) => this.setState({'email': text})}
          style={[{width: '80%'}]}
          onSubmitEditing={(event) => {
            this.focusTextInput(this.pass_input);
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

        <View style={{width: '80%', 'marginTop': 10, 'marginBottom': 20}}>
          <Button
            title='Log In'
            accessibilityLabel='Tap here to log in'
            color='#339966'
            containerViewStyle={{width: '100%'}}
            onPress={(event) => {
            }}
          />
        </View>
        <View style={{width: '80%', 'marginBottom': 20}}>
          <Button
            title="Don't have an account?"
            color='#505050'
            containerViewStyle={{width: '100%'}}
            onPress={(event) => {
            }}
          />
        </View>
        <View style={{width: '80%'}}>
          <Button
            title='Skip'
            accessibilityLabel='Tap here to log in'
            color='#C62828'
            containerViewStyle={{width: '100%'}}
            onPress={(event) => {
              AsyncStorage.setItem('first_time', 'false');
              this.props.set_app_state({'first_time': 'false', 'path': 'home'});
            }}
          />
        </View>
        <Text style={styles.text}>{this.state.log+ this.props.app_state.log}</Text>
        <View style={{'height': '10%'}}>
        </View>
      </View>
    );
  }
}

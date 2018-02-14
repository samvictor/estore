import React, { Component } from 'react';
import {
  AsyncStorage,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TextInput,
  Button,
  findNodeHandle
} from 'react-native';
import TextInputState from 'react-native/lib/TextInputState'

import styles from './Styles';

// TODO: check mark on password should log in
// TODO: if password there, tab on email should log in


export default class Login extends Component<{}> {
  constructor(props){
    super(props);

    this.state = {
      'email': '',
      'password': '',
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
      <View style={[{flex: 1, width: '100%'}]}>
        <ScrollView style={[styles.scroll]}
              contentContainerStyle={styles.scroll_container}>
          <View style={{width: '100%', height:10, backgroundColor: 'white'}}>
          </View>
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
                this.props.app_state.firebase.auth()
                        .signInWithEmailAndPassword(this.state.email,
                                                    this.state.password)
                        .then(
                  function () {
                    AsyncStorage.setItem('first_time', 'false');
                    this.props.set_app_state({'first_time': 'false',
                                              'path': 'home',
                                              'snack_msg': 'You are logged in',
                                              'snack_duration': 3000});

                  }.bind(this)
                  ,function(error) {
                    this.props.set_app_state({'snack_msg': error.message,
                                              'snack_duration': 7000});
                  }.bind(this));

              }}
            />
          </View>
          <View style={{width: '80%', 'marginBottom': 20}}>
            <Button
              title="Don't have an account?"
              color='#505050'
              containerViewStyle={{width: '100%'}}
              onPress={(event) => {
                this.props.set_app_state({
                  'snack_msg': 'This section is still under construction',
                  'snack_duration': 3000
                });
              }}
            />
          </View>
          <View style={{width: '80%'}}>
            <Button
              title='Skip'
              color='#C62828'
              containerViewStyle={{width: '100%'}}
              onPress={(event) => {
                AsyncStorage.setItem('first_time', 'false');
                this.props.set_app_state({'first_time': 'false',
                                            'path': 'home'});
              }}
            />
          </View>
          <View style={{width: '100%', height:210, backgroundColor: 'white'}}>
          </View>
        </ScrollView>
      </View>
    );
  }
}

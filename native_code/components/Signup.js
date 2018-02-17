import React, { Component } from 'react';
import {
  AsyncStorage,
  Text,
  View,
  Image,
  ScrollView,
  TextInput,
  Button,
  findNodeHandle,
} from 'react-native';
import TextInputState from 'react-native/lib/TextInputState';

import styles from './Styles';

//TODO: switching fields closes keyboard


export default class Signup extends Component<{}> {
  constructor(props){
    super(props);

    this.state = {
      'log': 'ver 1',
      'email': '',
      'email_dup': '',
      'password': '',
      'password_dup': '',
    };
  }

  focusTextInput(node) {
    try {
      TextInputState.focusTextInput(findNodeHandle(node))
    } catch(e) {
      //this.setState({'log': 'Couldnt focus text input: '+ e.message});
    }
  }

  signup_submit() {
    if (this.state.email !== this.state.email_dup){
      this.props.set_app_state({'snack_msg': 'Email addresses do not match',
                                'snack_duration': 5000});
      return;
    }
    if (this.state.email === ''){
      this.props.set_app_state({'snack_msg': 'Please enter your email address',
                                'snack_duration': 5000});
      return;
    }

    if (this.state.password !== this.state.password_dup){
      this.props.set_app_state({'snack_msg': 'Passwords do not match',
                                'snack_duration': 4000});
      return;
    }
    if (this.state.password === ''){
      this.props.set_app_state({'snack_msg': 'Please enter your password',
                                'snack_duration': 4000});
      return;
    }
    if (this.state.password.length < 6){
      this.props.set_app_state({'snack_msg': 'Password must be at least characters 6 long',
                                'snack_duration': 7000});
      return;
    }
    if (this.state.password.replace(/[a-zA-Z]/g, '').length === 0) {
      this.props.set_app_state({'snack_msg': 'Password must contain at least 1 number or symbol',
                                'snack_duration': 7000});
      return;
    }

    this.props.set_app_state({'snack_msg': 'Working...',
                              'snack_duration': 4000});

    this.props.app_state.firebase.auth()
    .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(function(user) {
          let uid = user.uid;
          this.props.app_state.db.child('users/'+uid)
              .set({'is_admin': 'false', 'email': user.email})
              .then(function(){

                  AsyncStorage.setItem('first_time', 'false');
                  this.props.set_app_state({'first_time': 'false',
                                            'path': 'home',
                                            'snack_msg': 'Account created. You are logged in.',
                                            'snack_duration': 5000});
              }.bind(this))
              .catch(function (error) {
                this.props.set_app_state({'snack_msg': error.message,
                                          'snack_duration': 7000});
              }.bind(this));
        }.bind(this))
        .catch(function(error) {
          this.props.set_app_state({'snack_msg': error.message,
                                    'snack_duration': 7000});
        }.bind(this));
  }

  render() {
    return (
      <View style={[{flex: 1, width: '100%'}]}>
        <ScrollView style={[styles.scroll]}
              contentContainerStyle={styles.scroll_container}>

          <View style={{width: '100%', height:110}}></View>
          <TextInput
            autoCorrect={false}
            placeholder='Email Address'
            returnKeyType = 'next'
            keyboardType='email-address'
            onChangeText={(text) => this.setState({'email': text})}
            style={[{width: '80%'}]}
            onSubmitEditing={(event) => {
              this.focusTextInput(this.email_dup_input);
            }}
          />
          <TextInput
            ref={(el) => { this.email_dup_input = el; }}
            autoCorrect={false}
            placeholder='Confirm Email Address'
            returnKeyType = 'next'
            keyboardType='email-address'
            onChangeText={(text) => this.setState({'email_dup': text})}
            style={[{width: '80%'}]}
            onSubmitEditing={(event) => {
              this.focusTextInput(this.pass_input);
            }}
          />
          <TextInput
            ref={(el) => { this.pass_input = el; }}
            autoCorrect={false}
            placeholder='Password'
            returnKeyType = 'next'
            secureTextEntry={true}
            onChangeText={(text) => this.setState({'password': text})}
            style={[{width: '80%'}]}
            onSubmitEditing={(event) => {
              this.focusTextInput(this.pass_input_dup);
            }}
          />
          <TextInput
            ref={(el) => { this.pass_input_dup = el; }}
            autoCorrect={false}
            placeholder='Confirm Password'
            secureTextEntry={true}
            onChangeText={(text) => this.setState({'password_dup': text})}
            style={[{width: '80%'}]}
            onSubmitEditing={this.signup_submit.bind(this)}
          />

          <Text>Password Should Contain:</Text>
          <Text>* at least 6 characters</Text>
          <Text>* at least 1 number or symbol</Text>

          <View style={{width: '80%', 'marginTop': 10, 'marginBottom': 20}}>
            <Button
              title='Signup'
              color='#339966'
              containerViewStyle={{width: '100%'}}
              onPress={this.signup_submit.bind(this)}
            />
          </View>

          <View style={{width: '100%', height:30}}></View>
        </ScrollView>
        <View style={[styles.fixed_top, styles.banner]}>
          <Text style={[styles.h4, {color: 'white'}]}>
            Signup
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

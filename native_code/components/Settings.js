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
// TODO: <Text style={settings_styles.btn_space}>New Item Notifications Coming Soon</Text>

export default class Settings extends Component<{}> {
  constructor(props){
    super(props);

    this.state = {
      'log': 'ver 1',
    };
  }

  render() {
    let log_btn = (this.props.app_state.user === null)
      ? <View style={settings_styles.btn_space}>
          <Button
            title='Login'
            color='#339966'
            containerViewStyle={{width: '100%'}}
            onPress={(event) => {
              this.props.set_app_state({'path': 'login'});
            }}
          />
          <View style={{height: 20}}></View>
          <Button
            title='Signup'
            color='#606060'
            containerViewStyle={{width: '100%'}}
            onPress={(event) => {
              this.props.set_app_state({'path': 'signup'});
            }}
          />
      </View>
      : [<View style={settings_styles.btn_space}>
          <Button
          title='Logout'
          color='#C62828'
          containerViewStyle={{width: '100%'}}
          onPress={(event) => {
            this.props.app_state.firebase.auth().signOut();
            this.props.set_app_state({
              'snack_msg': 'You are logged out',
              'snack_duration': 3000
            });
          }}
        />
      </View>];

    return (
      <View style={[styles.container, {backgroundColor: 'white'}]}>
        <View style={[styles.banner]}>
          <Text style={[styles.h4, {color: 'white'}]}>
            Settings
          </Text>
          <Text style={[styles.h6, styles.red_text]}>
            { (this.props.app_state.user !== null)
              ? this.props.app_state.user.email
              : ''
            }
          </Text>
        </View>
        <View style={{width: '80%', justifyContent: 'center'}}>
          <View style={{height: 20}} />
          {log_btn}
          <View style={settings_styles.btn_space}>
            <Button
              title='About'
              color='#888'
              containerViewStyle={{width: '100%'}}
              onPress={(event) => {
                this.props.set_app_state({'path': 'about'});
              }}
            />
          </View>
          <Text style={[{color: '#888', fontSize: 10, textAlign: 'center'},
                          settings_styles.btn_space]}>
            version 0.16
          </Text>
        </View>
        <View style={{flex: 1}} />
      </View>
    );
  }
}


const settings_styles = StyleSheet.create({
  btn_space: {
    marginVertical: 10,
  }
});

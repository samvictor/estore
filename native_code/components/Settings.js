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


export default class Settings extends Component<{}> {
  constructor(props){
    super(props);

    this.state = {
      'log': 'ver 1',
    };
  }

  render() {
    let log_btn = (this.props.app_state.user === null)
      ? <Button
        title='Login'
        color='#339966'
        containerViewStyle={{width: '100%'}}
        onPress={(event) => {
          this.props.set_app_state({'path': 'login'});
        }}
      />
      : [<Button
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
      />,
      <Text>New Item Notif switch</Text>];


    return (
      <View style={[styles.container, {backgroundColor: 'white'}]}>
        <View style={[styles.fixed_top, styles.banner]}>
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
        <View style={{width: '80%', justifyContent: 'space-around'}}>
          {log_btn}
          <Button
            title='About'
            color='#888'
            containerViewStyle={{width: '100%'}}
            onPress={()=>{}}
          />
          <Text style={{color: '#888', fontSize: 10, textAlign: 'center'}}>
            version 0.3
          </Text>
        </View>
      </View>
    );
  }
}

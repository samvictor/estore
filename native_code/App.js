/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AsyncStorage,
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import firebase from 'firebase';


import FirstTime from './components/FirstTime';
import styles from './components/Styles';
import SamNav from './components/SamNav';
import SamPath from './components/SamPath';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component<{}> {
  constructor(props){
    super(props);

    this.state = {
      'storage_loaded': false,
      'first_time': null,
      'log': 'log: ',
      'firebase_ready': false,
      'path': 'cart',
    };

    AsyncStorage.getItem('first_time')
      .then((res) => {
        if(res === null || res === 'true') {
          this.setState({'first_time': 'true', 'path': 'first_time'});
        }
        else {
          this.setState({'first_time': res})
        }
        this.setState({'log': this.state.log+'\nres is '+res});
      });
  }

  componentDidMount() {
    try {
      firebase.initializeApp({
        apiKey: "AIzaSyCI7wGvpUOMSY-h9tHoJogBmEmhoZe0U_A",
        authDomain: "estore-7e485.firebaseapp.com",
        databaseURL: "https://estore-7e485.firebaseio.com",
        projectId: "estore-7e485",
        storageBucket: "estore-7e485.appspot.com",
      });
    }
    catch(e){}
    this.setState({'log': 'setting state in will mount'});
  }

  set_app_state(new_state) {
    this.setState({'log': 'setting state'});
      this.setState(new_state);
  }

  render() {
    let tabs = [
      {'path': 'home', 'name': 'Home'},
      {'path': 'settings', 'name': 'Settings'},
      {'path': 'cart', 'name': 'Cart'},
    ];

    return (
      //<View>
        //<Text>{this.state.log}</Text>
        <SamNav path={this.state.path} tabs={tabs}
              set_app_state={this.set_app_state.bind(this)}
              app_log={this.state.log}
              app_state={this.state}>
          <SamPath path='home'>
            <Text>Home {this.state.log}</Text>
          </SamPath>
          <SamPath path='settings'  default='true'>
            <Text>Settings</Text>
          </SamPath>
          <SamPath path='cart'>
            <Text>Cart</Text>
          </SamPath>
          <SamPath path='first_time' show_tabs='false'>
            <FirstTime app_state={this.state}
                    set_app_state={this.set_app_state.bind(this)}/>
          </SamPath>
        </SamNav>
      //</View>


      /*<View style={[styles.container]}>
        <Text style={styles.welcome}>
          {this.state.log}
        </Text>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit App.js
        </Text>
        <Text style={styles.instructions}>
          {instructions}
        </Text>
      </View>*/
    );
  }

}

/*
for ios version:
setup push notifications

*/

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

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component<{}> {
  constructor(){
    super();

    this.state = {
      'storage_loaded': false,
      'first_time': null,
      'log': 'log: ',
      'firebase_ready': false,
    };

    AsyncStorage.getItem('first_time')
      .then((res) => {
        if(res === null) {
          this.setState({'first_time': 'true'});
        }
        else {
          this.setState({'first_time': res})
        }
        this.setState({'log': this.state.log+'\nres is '+res});
      });
  }

  render() {
    return (
      (this.state.first_time === 'true')
      ? <FirstTime />
      :<View style={[styles.container]}>
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
      </View>
    );
  }


  componentWillMount() {
    firebase.initializeApp({
      apiKey: "AIzaSyCI7wGvpUOMSY-h9tHoJogBmEmhoZe0U_A",
      authDomain: "estore-7e485.firebaseapp.com",
      databaseURL: "https://estore-7e485.firebaseio.com",
      projectId: "estore-7e485",
      storageBucket: "estore-7e485.appspot.com",
    });
  }
}

/*
for ios version:
setup push notifications

*/

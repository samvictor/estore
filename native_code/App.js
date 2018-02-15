/*
   Written by Sam Inniss
   SamInniss.com
   License: MIT
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


import styles from './components/Styles';
import SamNav from './components/SamNav';
import SamPath from './components/SamPath';
import Login from './components/Login';
import Home from './components/Home';
import Admin from './components/Admin';
import History from './components/History';
import Search from './components/Search';
import Cart from './components/Cart';
import Settings from './components/Settings';
import About from './components/About';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component<{}> {
  constructor(props){
    super(props);

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
    let database = firebase.database().ref('estore');
    let storage = firebase.storage().ref('estore');

    this.state = {
      'storage_loaded': false,
      'first_time': null,
      'log': 'log: ',
      'firebase_ready': false,
      'path': 'home',
      'items_loaded': false,
      'items': [],
      'items_dict': {},
      'user': null,
      'user_loaded': false,
      'user_is_admin': null,
      'no_user': null,
      'user_cart': [],
      'user_cart_loaded': false,
      'past_orders_dict': {},
      'past_orders': [],
      'db': database,
      'storage': storage,
      'firebase': firebase,
      'searching': false,
      'search_term': '',
      'found_items': [],
      'snack_msg': '',
      'snack_duration': 0,
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

  set_app_state(new_state) {
      this.setState(new_state);
  }

  render() {
    let tab_1 = [];
    if (this.state.user !== null){
      if (this.state.user_is_admin === 'truely')
        tab_1 = [{'path': 'admin',
                  'name': 'Admin',
                  'color_paths': ['admin', 'history']}];
      else
        tab_1 = [{'path': 'history',
                  'name': 'History',
                  'color_paths': ['history']}];
    }

    let tabs = tab_1.concat([
      {'path': 'search', 'name': 'Search', 'color_paths': ['search']},
      {'path': 'home', 'name': 'Home', 'color_paths': ['home']}
    ]);
    if(this.state.user !== null)
      tabs.push({'path': 'cart', 'name': 'Cart', 'color_paths': ['cart']});

    tabs.push({'path': 'settings',
                  'name': 'Settings',
                  'color_paths': ['settings', 'login', 'about']});

    return (
      <SamNav path={this.state.path} tabs={tabs}
            set_app_state={this.set_app_state.bind(this)}
            app_log={this.state.log}
            app_state={this.state}>

        <SamPath path='home' default='true'>
          <Home app_state={this.state}
                  set_app_state={this.set_app_state.bind(this)}/>
        </SamPath>

        <SamPath path='admin'>
          <Admin app_state={this.state}
                  set_app_state={this.set_app_state.bind(this)}/>
        </SamPath>

        <SamPath path='history'>
          <History app_state={this.state}
                  set_app_state={this.set_app_state.bind(this)}/>
        </SamPath>

        <SamPath path='search'>
          <Search app_state={this.state}
                  set_app_state={this.set_app_state.bind(this)}/>
        </SamPath>

        <SamPath path='cart'>
          <Cart app_state={this.state}
                  set_app_state={this.set_app_state.bind(this)}/>
        </SamPath>

        <SamPath path='settings'>
          <Settings app_state={this.state}
                  set_app_state={this.set_app_state.bind(this)}/>
        </SamPath>

        <SamPath path='first_time' show_tabs='false'>
          <Login app_state={this.state}
                  set_app_state={this.set_app_state.bind(this)}/>
        </SamPath>

        <SamPath path='login'>
          <Login app_state={this.state}
                  set_app_state={this.set_app_state.bind(this)}/>
        </SamPath>

        <SamPath path='about'>
          <About app_state={this.state}
                  set_app_state={this.set_app_state.bind(this)}/>
        </SamPath>

      </SamNav>
    );
  }


  componentDidMount() {
    AsyncStorage.multiGet(['items', 'items_dict'])
      .then((res) => {
        let items = [];
        let items_dict = {};
        if(res[0][1] !== null) {
          try {
            items = JSON.parse(res[0][1]);
          }
          catch(e){}
        }
        if(res[1][1] !== null) {
          try {
            items_dict = JSON.parse(res[1][1]);
          }
          catch(e){}
        }
        this.setState({'items': items, 'items_dict': items_dict,
                          'items_loaded': true});
      });

    firebase.database().ref('estore').child('items').on('value', (snap) => {
      let items = snap.val();
      let items_list = [];
      for (var key in items) {
        items_list.push(items[key]);
      }
      // sort decending by time
      items_list.sort(function(b, a){
        if (a.time < b.time )
          return -1

        if (a.time > b.time)
          return 1

        return 0
      });
      AsyncStorage.setItem('items', JSON.stringify(items_list));
      AsyncStorage.setItem('items_dict', JSON.stringify(items));
      this.setState({'items': items_list, 'items_dict': items,
            'items_loaded': true});
    });

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        firebase.database().ref('estore').child('users/'+user.uid)
          .on('value', (snap) => {
            if (snap.val() === null) {
              this.setState({'user': user, 'user_loaded': true});
              return;
            }
            let user_data = snap.val();
            let for_state = {'user': user, 'user_loaded': true};
            if (user_data['is_admin'] === 'true')
              for_state['user_is_admin'] = 'true';

            let temp_cart = [];
            if (user_data['cart'] === undefined)
              for_state['user_cart'] = [];
            else {
              for(var key in user_data['cart']){
                temp_cart.push(user_data['cart'][key]['item_id']);
              }
              for_state['user_cart'] = temp_cart;
            }
            for_state['user_cart_loaded'] = true;
            for_state['no_user'] = 'false';

            for_state['past_orders'] = [];
            for_state['past_orders_dict'] = {};
            if (user_data['past_orders'] !== undefined) {
              for_state['past_orders_dict'] = user_data['past_orders'];

              for (var oid in user_data['past_orders']) {
                for_state['past_orders'].push(user_data['past_orders'][oid]);
              }
              for_state['past_orders'].sort(function (b, a) {
                if (a.time < b.time)
                  return -1;

                if (a.time > b.time)
                  return 1;

                return 0;
              });
            }

            this.setState(for_state);
          });
        } else {
          // No user is signed in.
          this.setState({'user': null, 'user_is_admin': 'false',
                  'user_cart': [], 'user_cart_loaded': true,
                  'no_user': 'true', 'user_loaded': true,
                  'past_orders_dict': {}, 'past_orders': [],
                });
        }
      });
  }

}

/*
for ios version:
setup push notifications

*/

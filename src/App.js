//TODO: sorting by order and add image and remove causes error
//TODO: rewrite image uploader
//TODO: admin delete items
//TODO: admin force user logout
//TODO: cart remove items
//TODO: in future, add temp cart
//TODO: if you try to do anything while offline 'you are offline'
//TODO: if you regain internet, update images and everything else
//TODO: email mobile keyboard
//TODO: search, user order history, admin order history
//TODO: update banner with blurred background image
//TODO: login working...


/* updating site name:
index.html head title
email template sender and project name
render document.title
change index.html theme color
manifest.json name and theme color */
/*
  Written by Sam Inniss
  SamInniss.com
  License: MIT
*/
import React, { Component } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import './App.css';
import Navbar from './Components/Navbar'
import Home from './Components/Home'
import About from './Components/About'
import Search from './Components/Search'
import History from './Components/History'
import Login from './Components/Login'
import Alerts from './Components/Alerts'
import Admin from './Components/Admin'
import Cart from './Components/Cart'
/*global firebase*/


class App extends Component {
  constructor() {
    super();
    // Initialize Firebase
    let config = {
      apiKey: "AIzaSyCI7wGvpUOMSY-h9tHoJogBmEmhoZe0U_A",
      authDomain: "estore-7e485.firebaseapp.com",
      databaseURL: "https://estore-7e485.firebaseio.com",
      projectId: "estore-7e485",
      storageBucket: "estore-7e485.appspot.com",
    };
    firebase.initializeApp(config);
    let database = firebase.database().ref('estore');
    let storage = firebase.storage().ref('estore');

    let items = JSON.parse(localStorage.getItem('items'));
    let items_dict = JSON.parse(localStorage.getItem('items_dict'));


    this.state = {
      'search_term': '',
      'site_name': 'eCommerce',
      'db': database,
      'storage': storage,
      'items': (items !== null)? items : [],
      'items_dict': (items_dict !== null)? items_dict : {},
      'items_loaded': (items !== null)? true : false,
      'user': null,
      'user_is_admin': null,
      'no_user': null,
      'user_cart': [],
      'user_cart_loaded': false,
      'past_orders': [],
      'past_orders_dict': {},
      'all_orders': [],
      'all_orders_dict': {},
    }
  }

  get_page(location) {
    let page = location.split('/')[1];
    page = (page === undefined || page === '' || page === 'index.html')
              ? 'home' : page;

    return page;
  }

  handle_search(search_term){
    this.setState({'search_term': search_term});
  }

  render() {
    document.title = "eCommerce";


    return (
      <Router>
        <div className="App">
          <Route path="/" render={(props) => {
            return <Navbar page={this.get_page(window.location.pathname)}
                      search2={this.handle_search.bind(this)}
                      user={this.state.user}
                      user_is_admin={this.state.user_is_admin}/>
          }} />
          <Route path="/:path(home||index.html)" render={() => (
            <Home items={this.state.items}
                  items_loaded={this.state.items_loaded}
                  user={this.state.user}
                  db={this.state.db}
                  user_cart={this.state.user_cart}/>
          )} />
          <Route path="/about" render={() => (
            <About />
          )} />
          <Route path="/search" render={() => (
            <Search search_term={this.state.search_term}
                    items={this.state.items}
                    user={this.state.user}
                    db={this.state.db}
                    user_cart={this.state.user_cart}/>
          )} />
          <Route path="/history" render={() => (
            <History items={this.state.items}
                    user={this.state.user}
                    db={this.state.db}
                    user_cart={this.state.user_cart}
                    user_is_admin={this.state.user_is_admin}
                    past_orders={this.state.past_orders}
                    past_orders_dict={this.state.past_orders_dict}
                    all_orders={this.state.all_orders}
                    all_orders_dict={this.state.all_orders_dict}/>
          )} />
          <Route path="/login" render={() => (
            <Login user={this.state.user}/>
          )} />
          <Route path="/admin" render={() => (
            <Admin user={this.state.user}
                  user_is_admin={this.state.user_is_admin}
                  storage={this.state.storage}
                  db={this.state.db}/>
          )} />
          <Route path="/cart" render={() => (
            <Cart  user={this.state.user}
                    items={this.state.items}
                    items_dict={this.state.items_dict}
                    db={this.state.db}
                    user_cart={this.state.user_cart}
                    user_cart_loaded={this.state.user_cart_loaded}
                    no_user={this.state.no_user}/>
          )} />
          <Alerts />
        </div>
      </Router>
    );
  }

  componentWillMount() {
    this.state.db.child('items').on('value', (snap) => {
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
      localStorage.setItem('items', JSON.stringify(items_list));
      localStorage.setItem('items_dict', JSON.stringify(items));
      this.setState({'items': items_list, 'items_dict': items,
            'items_loaded': true});
    });

    firebase.auth().onAuthStateChanged((user) => {
      // either way, clear old data
      this.setState({'user': null, 'user_is_admin': 'false',
              'user_cart': [], 'user_cart_loaded': true,
              'no_user': 'true', 'past_orders': [], 'past_orders_dict': {},
              'all_orders': [], 'all_orders_dict': {}});
      if (user) {
        // User is signed in.
        this.state.db.child('users/'+user.uid).on('value', (snap) => {
          if (snap.val() === null) {
            this.setState({'user': user});
            return;
          }
          let user_data = snap.val();
          let for_state = {'user': user};
          if (user_data['is_admin'] === 'true') {
            for_state['user_is_admin'] = 'true';

            firebase.database().ref('estore').child('past_orders')
              .on('value', (snap2) => {
                if (snap2.val() === null) {
                  return;
                }
                let for_state2 = {'all_orders': [], 'all_orders_dict': {}};
                for_state2['all_orders_dict'] = snap2.val();

                for (var oid in for_state2['all_orders_dict']) {
                  for_state2['all_orders'].push(for_state2['all_orders_dict'][oid]);
                }

                for_state2['all_orders'].sort(function (b, a) {
                  if (a.time < b.time)
                    return -1;

                  if (a.time > b.time)
                    return 1;

                  return 0;
                });

                this.setState(for_state2);
              });
          }


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
                'no_user': 'true'});
      }
    });

  }
}

export default App;

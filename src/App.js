/*
  Written by Sam Inniss for Connie
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
import Login from './Components/Login'
import Alerts from './Components/Alerts'
import Admin from './Components/Admin'
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
      storageBucket: "",
    };
    firebase.initializeApp(config);
    let database = firebase.database().ref('estore');
    let page = window.location.pathname.split('/')[1];
    page = (page === undefined || page === '')? 'home': page;
    this.state = {
      'search_term': '',
      'site_name': 'eCommerce',
      'page': page,
      'db': database,
      'items': [],
      'user': null,
      'user_is_admin': null,
    }
  }

  handleSearch(search_term){
    this.setState({'search_term': search_term});
  }

  render() {
    document.title = "eCommerce";

    return (
      <Router>
        <div className="App">
          <Route path="/" render={(props) => {
            let page = props.location.pathname.split('/')[1];
            page = (page === undefined || page === '')? 'home': page;
            return <Navbar page={page}
                      search2={this.handleSearch.bind(this)}
                      user={this.state.user}
                      user_is_admin={this.state.user_is_admin}/>
          }} />
          <Route path="/:path(home|)" render={() => (
            <Home items={this.state.items}/>
          )} />
          <Route path="/about" render={() => (
            <About />
          )} />
          <Route path="/search" render={() => (
            <Search search_term={this.state.search_term} items={this.state.items} />
          )} />
          <Route path="/login" render={() => (
            <Login user={this.state.user}/>
          )} />
          <Route path="/admin" render={() => (
            <Admin user={this.state.user} user_is_admin={this.state.user_is_admin}
                  items={this.state.items}/>
          )} />
          <Alerts />
        </div>
      </Router>
    );
  }

  componentDidMount() {
    this.state.db.child('items').on('value', (snap) => {
      let items = snap.val();
      let items_list = [];
      for (var key in items) {
        items_list.push(items[key]);
      }
      this.setState({'items': items_list});
    });

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        this.state.db.child('users/'+user.uid).once('value', (snap) => {
          if (snap.val() === null) {
            this.setState({'user': user});
            return;
          }
          let for_state = {'user': user}
          if (snap.val()['is_admin'] === 'true')
            for_state['user_is_admin'] = 'true';
          this.setState(for_state);
        });
      } else {
        // No user is signed in.
        this.setState({'user': null, 'user_is_admin': "false"});
      }
    });

  }
}

export default App;

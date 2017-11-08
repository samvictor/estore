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
    }
  }

  handleSearch(search_term){
    this.setState({'search_term': search_term});
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Route path="/" render={(props) => {
            let page = props.location.pathname.split('/')[1];
            page = (page === undefined || page === '')? 'home': page;
            return <Navbar page={page}
                      search2={this.handleSearch.bind(this)}/>
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
        </div>
      </Router>
    );
  }

  componentDidMount() {
    this.state.db.child('items').on('value', (snap) => {
      let items = snap.val();
      console.log(JSON.stringify(items));
      this.setState({'items': items});
    });
  }
}

export default App;

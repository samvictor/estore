import React, { Component } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import './App.css';
import Navbar from './Components/Navbar'
import Home from './Components/Home'
import About from './Components/About'
import Search from './Components/Search'

class App extends Component {
  constructor() {
    super();
    this.state = {
      'search_term': '',
      'site_name': 'eCommerce',
      'page': window.location.pathname.split('/')[1],
    }
  }

  handleSearch(search_term){
    this.setState({'search_term': search_term});
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Route path="/" render={(props) => (
            <Navbar page={props.location.pathname.split('/')[1]}
                  search2={this.handleSearch.bind(this)}/>
          )} />
          <Route path="/:path(home|)" render={() => (
            <Home />
          )} />
          <Route path="/about" render={() => (
            <About />
          )} />
          <Route path="/search" render={() => (
            <Search search_term={this.state.search_term} />
          )} />
        </div>
      </Router>
    );
  }
}

export default App;

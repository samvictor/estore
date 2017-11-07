import React, { Component } from 'react';
import Navbar from './Components/Navbar'
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      'page': this.get_page_from_url(),
    }
  }

  get_page_from_url() {
    if (document.location.pathname === '/')
      return 'home';

    return document.location.pathname.split('/')[1];
  }

  handleTabClicked(data) {
    this.setState({'page': data['page']});
  }

  render() {
    return (
      <div className="App">
        <Navbar page={this.state.page}
                tab_clicked={this.handleTabClicked.bind(this)} />
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;

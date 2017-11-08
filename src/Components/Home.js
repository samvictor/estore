import React, { Component } from 'react';
import ShowItems from './ShowItems'
import logo from '../logo.svg';

class Home extends Component {
  render() {
    return (
      <div>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <ShowItems items={this.props.items}/>
      </div>
    );
  }
}

export default Home;

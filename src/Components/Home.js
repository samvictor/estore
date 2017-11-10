import React, { Component } from 'react';
import ShowItems from './ShowItems'
import logo from '../logo.svg';

class Home extends Component {
  render() {
    return (
      <div>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to our Store</h1>
        </header>
        <p className="App-intro">
          Browse our collection below.
        </p>
        <ShowItems items={this.props.items}/>
      </div>
    );
  }
}

export default Home;

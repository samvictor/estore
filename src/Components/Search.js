import React, { Component } from 'react';
import logo from '../logo.svg';

class Search extends Component {
  render() {
    return (
      <div>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          Search page<br/>
          Searching for {this.props.search_term}
        </p>
      </div>
    );
  }
}

export default Search;

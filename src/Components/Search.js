import React, { Component } from 'react';
import ShowItems from './ShowItems'
import logo from '../open.png';

class Search extends Component {
  render() {
    return (
      <div>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to our Store</h1>
        </header>
        <p className="App-intro">
          Searching for {this.props.search_term}
        </p>
        <ShowItems items={this.props.items}
                   user={this.props.user}
                   db={this.props.db}
                   user_cart={this.props.user_cart}
                   page="search"/>
      </div>
    );
  }
}

export default Search;

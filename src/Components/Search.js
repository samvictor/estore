import React, { Component } from 'react';
import ShowItems from './ShowItems'
import logo from '../open.png';

//TODO: check url for search criteria, allow chrome tab search

class Search extends Component {
  search_items (search_term, items) {
    // In perfect match, all words in search term must be somewhere in item name or desc.
    // in inclusive match, at least one word in search term must be in name or desc.
    //    and item is not in perfect match
    let perfect_match = [];
    let inclusive_match = [];

    let search_list = (search_term === '')
                        ? []
                        : search_term.toLowerCase().replace(/[^a-z\s]+/g, '').split(' ');
    let temp_str_list = '';
    let temp_item;

    let temp_is_perfect;
    let temp_is_inclusive;
    let temp_search_item;
    let j;

    for (let i = 0; i < items.length; i++) {
      temp_item = items[i];
      temp_str_list = temp_item.name.toLowerCase()
                          .replace(/[^a-z\s]+/g, '').split(' ')
                          .concat(temp_item.description.toLowerCase()
                              .replace(/[^a-z\s]+/g, '').split(' '));

      temp_is_perfect = true;
      temp_is_inclusive = false;
      if (search_list.length === 0)
        temp_is_perfect = false;

      for (j = 0; j < search_list.length; j++) {
        temp_search_item = search_list[j];
        // if we know that this not perfect and is inclusive, no reason to keep looking
        if ((!temp_is_perfect && temp_is_inclusive)
                  || temp_search_item.length === 0)
          break;

        if (j !== search_list.length - 1) {
          if (temp_str_list.includes(temp_search_item)) {
            // if previously false, maintain false, otherwise true
            // temp_is_perfect = temp_is_perfect && true;
            // no matter what, this is now true
            temp_is_inclusive = true;
          }
          else {
            // no matter what, now imperfect
            temp_is_perfect = false;
            // if previously true, maintain true, otherwise false.
            // temp_is_inclusive = temp_is_inclusive || false;
          }
        }
        else {
          // if we're looking at the last search term word, check if it's a subset
          // of any words in item name or desc.
          let temp_item_str = temp_str_list.join(' ');
          if (temp_item_str.includes(temp_search_item)) {
            temp_is_inclusive = true;
          }
          else {
            temp_is_perfect = false;
          }
        }
      }

      if (temp_is_perfect)
        perfect_match.push(items[i]);
      else if (temp_is_inclusive)
        inclusive_match.push(items[i]);

    }

    return {'perfect_match': perfect_match, 'inclusive_match': inclusive_match};
  }

  render() {
    let searched_items = this.search_items(this.props.search_term, this.props.items);
    let message = null;
    if(searched_items.perfect_match.length === 0
          && searched_items.inclusive_match.length === 0)
      message = <h3>No items matched your search</h3>;

    let separate = null;
    if(searched_items.perfect_match.length > 0
          && searched_items.inclusive_match.length > 0)
      separate = <hr className="search" />;
    return (
      <div>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to our Store</h1>
        </header>
        <p className="App-intro">
          Searching for {this.props.search_term}
        </p>
        {message}
        <ShowItems items={searched_items.perfect_match}
                   user={this.props.user}
                   db={this.props.db}
                   user_cart={this.props.user_cart}
                   no_message = {true}
                   page="search"/>

        {separate}

        <ShowItems items={searched_items.inclusive_match}
                   user={this.props.user}
                   db={this.props.db}
                   user_cart={this.props.user_cart}
                   no_message = {true}
                   page="search"/>
      </div>
    );
  }
}

export default Search;

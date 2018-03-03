import React, { Component } from 'react';
import ShowItems from './ShowItems'
import logo from '../open.png';
var Moment = require('moment');
/*global $*/

class History extends Component {
    constructor() {
      super();
      this.state = {
        'orders_search': '',
      };
    }

    search_orders (search_term, orders) {
      if (search_term === '')
        return {'perfect_match': []};

      // In perfect match, all words in search term must be somewhere in item names or user email.
      let perfect_match = [];

      let search_list = search_term.toLowerCase().replace(/[^a-z\s]+/g, '')
                                                                    .split(' ');

      if (search_list.length === 0)
        return {'perfect_match': []};

      let temp_str_list = [];
      let temp_order;
      let temp_item;

      let temp_is_perfect;
      let temp_search_word;
      let j;
      let temp_order_str = '';

      for (let i = 0; i < orders.length; i++) {
        temp_order = orders[i];
        temp_str_list = [
          temp_order.user.email.toLowerCase().replace(/[^a-z]+/g, ''),
          temp_order.user.uid.toLowerCase().replace(/[^a-z]+/g, '')
        ];

        for (var item_key in temp_order.items) {
          temp_item = temp_order.items[item_key];
          temp_str_list = temp_str_list.concat(temp_item.name.toLowerCase()
                                          .replace(/[^a-z\s]+/g, '').split(' '));
        }

        temp_is_perfect = true;

        for (j = 0; j < search_list.length; j++) {
          temp_search_word = search_list[j];
          // if we know that this not perfect, no reason to keep looking
          if ((!temp_is_perfect)
                    || temp_search_word.length === 0)
            break;

          if (j !== search_list.length - 1) {
            // not looking at last search term word
            if (temp_str_list.includes(temp_search_word)) {
              // if previously false, maintain false, otherwise true
              // temp_is_perfect = temp_is_perfect && true;
            }
            else {
              // no matter what, now imperfect
              temp_is_perfect = false;
            }
          }
          else {
            // if we're looking at the last search term word, check if it's a subset
            // of any words in item name or desc.
            temp_order_str = temp_str_list.join(' ');
            if (temp_order_str.includes(temp_search_word)) {
              // nop
            }
            else {
              temp_is_perfect = false;
            }
          }
        }

        if (temp_is_perfect)
          perfect_match.push(orders[i]);
      }

      return {'perfect_match': perfect_match};
    }

  render() {
    let search_term = this.state.orders_search;
    let orders;
    if (this.props.user_is_admin === 'true')
      orders = this.props.all_orders;
    else
      orders = this.props.past_orders;

    if (search_term.length > 0)
      orders = this.search_orders(search_term, orders).perfect_match;


    let orders_xml = [];
    let this_order;
    for (var i = 0; i < orders.length; i++) {
      this_order = orders[i];

      let o_items = this_order.items;
      let o_item_list = [];
      let o_item_str = '';
      for (var iid in o_items) {
        o_item_list.push(<p style={{display: 'inline-block'}}>{o_items[iid].name}</p>);
        o_item_list.push(<p style={{display: 'inline-block', marginRight: '0.3em'}}>,</p>);
      }
      o_item_list.pop();

      Moment.locale('en');
      let o_time = Moment(this_order.time);

      let user_email = null;
      if (this.props.user_is_admin === 'true') {
        user_email =
        <h5>{
          this_order.user.email
        }</h5>;
      }
      orders_xml = orders_xml.concat([
        <hr/>,
        user_email,
        <h5>{
          o_time.format('ddd, MMM Do YYYY [at] hh:mm A')
        }</h5>,
        <t>{o_item_list}</t>,
        <h5>${this_order.total_price}</h5>,
      ]);
    }

    orders_xml.push(<hr/>);


    if (orders_xml.length <= 1) {
      if (this.props.user !== null) {
        if (search_term.length > 0)
          orders_xml = <h5>No orders matched your search</h5>;
        else
          orders_xml = <h5>No Past Orders</h5>;
      }
      else
        orders_xml = <h5>Loading...</h5>;
    }

    return (
      <div>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to our Store</h1>
        </header>
        <div style={{margin: '20px 7%'}}>
        <input id="orders_search" className="form-control mr-sm-2"
              style={{width: '100%'}}
              type="search" placeholder="Search Order History" aria-label="Search"
              onChange={() => {
                    let search_term = document.querySelector('#orders_search').value;
                    this.setState({'orders_search': search_term});
              }}
              onKeyUp={(e) => {
                let code = e.which;
                if(code === 13) {
                  e.preventDefault();
                  $("#orders_search").blur();
                }
              }}/>
        </div>
        {orders_xml}
      </div>
    );
  }
}

export default History;

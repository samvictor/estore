import React, { Component } from 'react';
import logo from '../open.png';
import {Redirect} from 'react-router-dom';
/*global braintree*/
/*global $*/

class Cart extends Component {
  handle_props(props) {
    let price = 0;
    let items = props.items_dict;
    let cart = props.user_cart;
    let this_item;
    let for_ret = [];
    let short_description;

    if(cart.length === 0){
      if(props.user_cart_loaded)
        for_ret = [<h3 className="loading_items">Cart is Empty</h3>];
      else
        for_ret = [<h3 className="loading_items">Loading...</h3>];
    }

    for(var i = 0; i < cart.length; i++) {
      this_item = items[cart[i]];
      if(this_item === undefined || this_item === null) {
        console.log(cart[i], ' in items is ', this_item);
        console.log('items: ', items);
        continue;
      }

      price += parseFloat(this_item.price);

      short_description = this_item.description;
      if(short_description.length > 40)
        short_description = short_description.substring(0, 40) + '...';
      let item_url = (this_item.imgs === undefined)? '': this_item.imgs[0].url;
      for_ret.push(
        <div id={'item_'+this_item.id} className="item_cont col-xl-3 col-lg-4 col-md-4 col-sm-6">
        <div className="item">
          <div className="item_img_div">
            <img className="item_img" src={item_url} alt={this_item.name}/>
          </div>
          <h5 className="item_name">{this_item.name.toUpperCase()}</h5>
          <em className="item_desc" title={this_item.description}>{short_description}</em><br/>
          <h5 className="cart_price">${this_item.price}</h5>
          <button className="btn btn-outline-danger cart_remove"
                  item_id={this_item.id}>
            Remove Item
          </button>
        </div>
        </div> );
    }
    return [for_ret, price];
  }

  constructor(props) {
    super(props);

    let from_handle_props = this.handle_props(this.props);
    let items_xml = from_handle_props[0];
    let price = from_handle_props[1];

    this.state = {
      'price': price,
      'cart': this.props.user_cart,
      'items': this.props.items_dict,
      'items_xml': items_xml,
    };
  }

  componentWillReceiveProps(next_props) {
    let from_handle_props = this.handle_props(next_props);
    let items_xml = from_handle_props[0];
    let price = from_handle_props[1];

    this.setState({
      'price': price,
      'cart': next_props.user_cart,
      'items': next_props.items_dict,
      'items_xml': items_xml,
    });
  }

  render() {
    return (
      <div id="cart_div">
        {
          (this.props.no_user === 'true')
            ? <Redirect to="/home"/>
            : ''
        }
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to our Store</h1>
        </header>
        <h3 id="cart_title">Cart{
          (this.props.user !== null)
            ? " for "+this.props.user.email
            :""
        }</h3>
        <p className="App-intro">
          Total Price ${this.state.price.toFixed(2)}
          <button id="checkout_btn" className="btn btn-outline-success"
                  onClick={function(){
                    document.querySelector('#checkout_div')
                            .scrollIntoView({'behavior': 'smooth'});
                  }}>Checkout</button>
        </p>
        <div id="show_items" className="row">
          {this.state.items_xml}
        </div>
        <hr id="checkout_hr"/>
        <div id="checkout_div">
          <h3>Checkout</h3>
          <h5 id="dropin_loading">Loading...</h5>
          <div id="dropin-container"></div>
          <button id="submit-button" className="btn btn-outline-success">
            Submit Payment of ${this.state.price.toFixed(2)}
          </button>
          <script>
          </script>
        </div>
      </div>
    );
  }

  handle_submit(dropinInstance){
    var user_cart = this.props.user_cart;
    var user = this.props.user;

    if (user_cart.length === 0){
      $('#alert_danger').text('Cart is empty')
        .fadeIn().delay(2000).fadeOut();
      return;
    }
    dropinInstance.requestPaymentMethod().then(function (payload) {
      $.post('https://us-central1-estore-7e485.cloudfunctions.net/checkout/',
        {'uid': user.uid, 'email': user.email,
                'nonce': payload.nonce})
        .done(function(checkout_data){
          console.log('checkout data', checkout_data);
        });
    }).catch(function (err) {
      // Handle errors in requesting payment method
      console.log('requesting payment method: ', err);
    });
  }

  componentDidMount(){
    /*var button = document.querySelector('#submit-button');

    braintree.dropin.create({
      'authorization': 'CLIENT_TOKEN_FROM_SERVER',
      'container': '#dropin-container'
    }, function (err, instance) {
      console.log(err);
    });*/
    var submitButton = document.querySelector('#submit-button');
    var temp_this = this;

    $.get('https://us-central1-estore-7e485.cloudfunctions.net/client_token/',
      function(data){
        braintree.dropin.create({
          authorization: data,
          container: '#dropin-container'
        }).then(function (dropinInstance) {
          $('#dropin_loading').css('display', 'none');

          submitButton.addEventListener('click', temp_this.handle_submit
                                                  .bind(temp_this, dropinInstance));
        }).catch(function (err) {
          // Handle any errors that might've occurred when creating Drop-in
          console.log('creating dropin: ', err);
        });
      }
    ).fail(function(){
      console.log('Error getting client token');
    });
  }
}

export default Cart;

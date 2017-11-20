import React, { Component } from 'react';
import logo from '../logo.svg';
/*global braintree*/

class Cart extends Component {
  render() {
    let price = 0;
    let items = this.props.items_dict;
    let cart = this.props.user_cart;
    let this_item;
    let for_ret = [];
    let short_description;

    if(cart.length === 0){
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

    return (
      <div id="cart_div">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to our Store</h1>
        </header>
        <h3 id="cart_title">Cart</h3>
        <p className="App-intro">
          Total Price ${price.toFixed(2)}
          <button id="checkout_btn" className="btn btn-outline-success"
                  onClick={function(){
                    document.querySelector('#checkout_div')
                            .scrollIntoView({'behavior': 'smooth'});
                  }}>Checkout</button>
        </p>
        <div id="show_items" className="row">
          {for_ret}
        </div>
        <hr id="checkout_hr"/>
        <div id="checkout_div">
          <h3>Checkout</h3>
          <div id="dropin-container"></div>
          <button id="submit-button">Request payment method</button>
          <script>
          </script>
        </div>
      </div>
    );
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

      braintree.dropin.create({
        authorization: 'CLIENT_AUTHORIZATION',
        container: '#dropin-container'
      }).then(function (dropinInstance) {
        submitButton.addEventListener('click', function () {
          dropinInstance.requestPaymentMethod().then(function (payload) {
            // Send payload.nonce to your server
          }).catch(function (err) {
            // Handle errors in requesting payment method
          });
        });
      }).catch(function (err) {
        // Handle any errors that might've occurred when creating Drop-in
        console.error(err);
      });
  }
}

export default Cart;
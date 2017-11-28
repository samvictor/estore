import React, { Component } from 'react';
/*global $*/

class ShowItems extends Component {
  cart_btn(item_id, in_cart) {
    let user = this.props.user;
    if(user === null) {
      $('#alert_info').text('Please login before adding items to cart')
              .fadeIn().delay(5000).fadeOut();
      return;
    }
    let for_db = {};
    if (in_cart)
      for_db['cart/'+item_id] = null;
    else
      for_db['cart/'+item_id] = {'item_id': item_id};

    this.props.db.child('/users/'+user.uid).update(for_db)
      .then(function(){
        $('#alert_success')
                .text((in_cart)?'Item removed from cart':'Item added to cart')
                .fadeIn().delay(1000).fadeOut();
      }).catch(function(error){
        $('#alert_danger').text(error.message).fadeIn().delay(7000).fadeOut();
      });
  }

  render() {
    let this_item = {};
    let items = this.props.items;
    let for_ret = [];
    let short_description;

    if(items.length === 0){
      if (this.props.items_loaded) {
        for_ret = [<h3 className="loading_items">
          No items available for purchase. Check back later.
        </h3>];
      }
      else
        for_ret = [<h3 className="loading_items">Loading...</h3>];
    }

    for(var i = 0; i < items.length; i++) {
      this_item = items[i];
      short_description = this_item.description;
      if(short_description.length > 40)
        short_description = short_description.substring(0, 40) + '...';
      let item_url = (this_item.imgs === undefined)? '': this_item.imgs[0].url;
      let temp_btn;
      if(this.props.user_cart.includes(this_item.id)){
        temp_btn =
          <button id={'item_btn_'+this_item.id}
                className="item_price btn btn-outline-success active"
                onClick={this.cart_btn.bind(this, this_item.id, true)}>
            <t>${this_item.price}</t> <i className="material-icons">check</i>
          </button>;
      }
      else {
        temp_btn =
          <button id={'item_btn_'+this_item.id}
                className="item_price btn btn-outline-primary"
                onClick={this.cart_btn.bind(this, this_item.id, false)}>
            <t>${this_item.price}</t> <i className="material-icons">add_shopping_cart</i>
          </button>;

      }
      for_ret.push(
        <div id={'item_'+this_item.id} className="item_cont col-xl-3 col-lg-4 col-md-4 col-sm-6">
        <div className="item">
          <div className="item_img_div">
            <img className="item_img" src={item_url} alt={this_item.name}/>
          </div>
          <h5 className="item_name">{this_item.name.toUpperCase()}</h5>
          <em className="item_desc" title={this_item.description}>{short_description}</em><br/>
          {temp_btn}
        </div>
        </div> );
    }


    return (
      <div id="show_items" className="row">
        {for_ret}
      </div>
    );
  }
}

export default ShowItems;

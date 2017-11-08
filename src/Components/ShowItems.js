import React, { Component } from 'react';

class ShowItems extends Component {
  render() {
    let this_item = {};
    let items = this.props.items;
    let for_ret = [];
    for(var i = 0; i < items.length; i++) {
      this_item = items[i];
      for_ret.push(
        <div id={'item_'+this_item.id} className="item_cont col-xl-2 col-lg-3 col-md-4 col-sm-6">
        <div className="item">
          <div className="item_img_div">
            <img className="item_img" src={this_item.imgs[0].url} alt={this_item.name}/>
          </div>
          <h5 className="item_name">{this_item.name}</h5>
          <em className="item_desc">{this_item.description}</em><br/>
          <t className="item_price">${this_item.price}</t>
          <t id={'item_btn_'+this_item.id} className="item_cart">cart</t>
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

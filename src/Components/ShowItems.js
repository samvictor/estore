import React, { Component } from 'react';

class ShowItems extends Component {
  render() {
    let this_item = {};
    let items = this.props.items;
    let for_ret = [];
    let short_description;
    for(var i = 0; i < items.length; i++) {
      this_item = items[i];
      short_description = this_item.description;
      if(short_description.length > 40)
        short_description = short_description.substring(0, 40) + '...';

      for_ret.push(
        <div id={'item_'+this_item.id} className="item_cont col-xl-3 col-lg-4 col-md-4 col-sm-6">
        <div className="item">
          <div className="item_img_div">
            <img className="item_img" src={this_item.imgs[0].url} alt={this_item.name}/>
          </div>
          <h5 className="item_name">{this_item.name.toUpperCase()}</h5>
          <em className="item_desc" title={this_item.description}>{short_description}</em><br/>
          <button id={'item_btn_'+this_item.id}
                className="item_price btn btn-outline-primary"
                ><t>${this_item.price}</t> <i className="material-icons">add_shopping_cart</i>
          </button>
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

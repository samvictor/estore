import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import ImageUploader from 'react-images-upload';
/*global firebase*/
/*global $*/

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = { pictures: {} };
  }
  onDrop(item_id, new_pic) {
    console.log('old state is ', JSON.stringify(this.state));
    let pictures = this.state.pictures;
    pictures[item_id] = new_pic;
    this.setState({'pictures': pictures}, () =>
                console.log(JSON.stringify(this.state), ' for ', item_id));
    $('#new_item .uploadPicturesWrapper > div').html('');
  }

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
        <div id={'item_'+this_item.id}
                className="item_cont col-xl-3 col-lg-4 col-md-4 col-sm-6">
        <div className="item">
          <div className="item_img_div">
            <img className="item_img" src={this_item.imgs[0].url} alt={this_item.name}/>
          </div>
          <h3>Item Name</h3>
          <input id={this_item.id+'_name'} className="edit_item_name form-control"
                  defaultValue={this_item.name} item_id={this_item.id}/>
          <h3>Item Description</h3>
          <textarea id={this_item.id+'_desc'} className="edit_item_desc form-control"
                  item_id={this_item.id} defaultValue={this_item.description}></textarea>
          <h3>Item Price</h3>
          <input id={this_item.id+'_price'} className="edit_item_price form-control"
                  defaultValue={this_item.price} item_id={this_item.id}
                  type="number" step="0.01"/>
          <button id={this_item.id+'_enter'} className="item_enter btn btn-outline-success"
                  item_id={this_item.id}>Submit</button>
        </div>
        </div> );
      }

    let redir = null;
    if (this.props.user_is_admin === "false")
      redir = <Redirect to="home" />;
    return (
      <div id="admin_div">
        {redir}
        <h1>Admin</h1>
        <div id="new_item">
          <h4>New Item</h4>
          <input id="new_item_name" placeholder="Item Name" className="form-control"/>
          <textarea placeholder="Item Description" className="form-control"/>
          <input id="new_item_price" placeholder="Item Price" className="form-control"
                  type="number" step="0.01"/>
          <ImageUploader
                  withIcon={true}
                  buttonText='Choose Image'
                  onChange={this.onDrop.bind(this, 'new_item')}
                  buttonClassName={'image_btn_new_item'}
                  imgExtension={['.jpg', '.png', '.gif']}
                  label='Max file size: 5mb. Accepted: .jpg, .png, .gif'
                  maxFileSize={5242880}
            />
          <button id="new_item_enter" className="btn btn-outline-success">Enter</button>
        </div>
        <div id="admin_items" className="row">
          {for_ret}
        </div>
      </div>
    );
  }

  componentDidMount() {
    document.title = "eCommerce - Admin";
    $('#new_item .chooseFileButton')
      .after('<button class="remove_img btn btn-danger" item_id="new_item">Remove Image</button>');

    $('.remove_img').on('click', function(){
      console.log($(this).attr('item_id'));
    });
  }
}

export default Admin;

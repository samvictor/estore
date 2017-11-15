import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import ImageUploader from 'react-images-upload';
/*global firebase*/
/*global $*/

// item id cannot have underscore

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = { 'pictures': {}, 'items': []};
  }
  componentWillMount() {
    firebase.database().ref('estore/items').once('value', (snap) => {
        let items = snap.val();
        let items_list = [];
        for (var key in items) {
          items_list.push(items[key]);
        }
        // sort decending by time
        items_list.sort(function(b, a){
          if (a.time < b.time )
            return -1

          if (a.time > b.time)
            return 1

          return 0
        });
        this.setState({'items': items_list});
      });
  }
  onDrop(item_id, new_pic) {
    console.log('old state is ', JSON.stringify(this.state));
    let pictures = this.state.pictures;
    pictures[item_id] = new_pic;
    this.setState({'pictures': pictures}, () =>
      console.log('new state is ', JSON.stringify(this.state)));
    $('#new_item .uploadPicturesWrapper > div').html('');
  }

  submit_item(target) {
    $('#alert_info').text('Working...').fadeIn();
    let storage = this.props.storage;

    let item_id = target;
    let temp_item_id;
    let id_counter;
    if (target === 'new_item'){
      // item id cannot contain underscore
      temp_item_id = document.querySelector('#new_item_name').value
                  .replace(/\.|\/|\_|\s|\$|\[|\]|\#|\!/g, '')
                  .toLowerCase();

      if (temp_item_id === '') {
        $('#alert_danger').text('Item name cannot be blank').fadeIn()
                  .delay(7000).fadeOut();
        $('#alert_info').fadeOut();
        return;
      }
      if (document.querySelector('#new_item_price').value === '') {
        $('#alert_danger').text('Price is invalid').fadeIn()
                  .delay(7000).fadeOut();
        $('#alert_info').fadeOut();
        return;
      }

      let items = this.state.items;
      let this_item = {};
      let item_ids = [];
      for(var i = 0; i < items.length; i++) {
        this_item = items[i];
        item_ids.push(this_item.id);
      }
      console.log(items);

      id_counter = 0;
      item_id = temp_item_id;
      while(item_ids.includes(item_id)) {
        item_id = temp_item_id + (++id_counter);
      }
    }
    else {
      // not new item
      if (document.querySelector('#'+target+'_name').value === '') {
        $('#alert_danger').text('Item name cannot be blank').fadeIn()
                  .delay(7000).fadeOut();
        $('#alert_info').fadeOut();
        return;
      }
      if (document.querySelector('#'+target+'_price').value === '') {
        $('#alert_danger').text('Price is invalid').fadeIn()
                  .delay(7000).fadeOut();
        $('#alert_info').fadeOut();
        return;
      }
    }
    console.log('item_id is ', item_id);
    // item_id is now the item id for new or old items

    // save all data other than image
    function save_data(img_url) {
      // item_id
      let for_db = {};
      for_db[item_id+'/id'] = item_id;
      if (img_url !== undefined) {
        for_db[item_id+'/full_img'] = img_url;
        for_db[item_id+'/imgs'] = [{'url': img_url}];
      }

      if(target === 'new_item') {
        for_db[item_id+'/name'] = document.querySelector('#new_item_name').value;
        for_db[item_id+'/description'] = document.querySelector('#new_item_desc').value;
        for_db[item_id+'/price'] = document.querySelector('#new_item_price').value;
        for_db[item_id+'/time'] =  Math.floor(Date.now() / 1000);
      }
      else {
        for_db[item_id+'/name'] = document.querySelector('#'+item_id+'_name').value;
        for_db[item_id+'/description'] =
                document.querySelector('#'+item_id+'_desc').value;
        for_db[item_id+'/price'] = document.querySelector('#'+item_id+'_price').value;
      }

      console.log('for db ', JSON.stringify(for_db));

      firebase.database().ref('estore/items').update(for_db).then(
        function(){
          console.log('update succeded');
          $('#alert_info').fadeOut();
          if (target === 'new_item')
            $('#alert_success').text('Item created. Reload to see new item.').fadeIn()
                .delay(10000).fadeOut();
          else
            $('#alert_success').text('Item updated. Reload to see update.').fadeIn()
                .delay(10000).fadeOut();
        },
        function(error){
          console.log('update failed: ', error.message);
          $('#alert_info').fadeOut();
          $('#alert_danger').text(error.message).fadeIn().delay(10000).fadeOut();
        });
    }

    let image = this.state.pictures[target];
    if (image === undefined || image === null) {
      // if admin did not upload an image, just save rest of data
      console.log('no image found. saving data');
      save_data.bind(this)();
      return;
    }
    image = image[0];
    console.log('saving image ', image);
    // image was found, upload image
    let upload_task = storage.child(item_id+'/' + image.name).put(image); // , metadata);
    upload_task.on(firebase.storage.TaskEvent.STATE_CHANGED,
      function(snapshot) {
        console.log('getting progress');
        // after upload, we are 80% done
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 80;
        console.log('Upload is ' + progress + '% done');
        $('#alert_info').text('Working ('+progress+'%)...');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
          break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
          break;
        }
      }, function(error) {
        $('#alert_info').fadeOut();
        $('#alert_danger').text('Error: '+error.message).fadeIn()
            .delay(10000).fadeOut();
        console.log(error.message);
    }, function() {
      // Upload completed successfully, now we can get the download URL
      let img_url = upload_task.snapshot.downloadURL;
      console.log('upload done ', img_url);
      save_data.bind(this, img_url)();
    });
  }

  render() {
    let this_item = {};
    let items = this.state.items;
    let for_ret = [];
    let short_description;
    for(var i = 0; i < items.length; i++) {
      this_item = items[i];
      short_description = this_item.description;
      if(short_description.length > 40)
        short_description = short_description.substring(0, 40) + '...';
      let image_url = (this_item.imgs === undefined)? '': this_item.imgs[0].url;
      for_ret.push(
        <div id={'item_'+this_item.id}
                className="item_cont col-xl-3 col-lg-4 col-md-4 col-sm-6">
        <div className="item">
          <div className="item_img_div">
            <img className="item_img" src={image_url} alt={this_item.name}/>
          </div>
          <h3>Item Name</h3>
          <input id={this_item.id+'_name'} className="edit_item_name form-control"
                  defaultValue={this_item.name} item_id={this_item.id}/>
          <h3>Item Description</h3>
          <textarea id={this_item.id+'_desc'} className="edit_item_desc form-control"
                  item_id={this_item.id} defaultValue={this_item.description}>
                  </textarea>
          <h3>Item Price</h3>
          <input id={this_item.id+'_price'} className="edit_item_price form-control"
                  defaultValue={this_item.price} item_id={this_item.id}
                  type="number" step="0.01"/>
          <ImageUploader
                  withIcon={true}
                  buttonText='Choose Image'
                  onChange={this.onDrop.bind(this, this_item.id)}
                  buttonClassName={'image_btn_new_item'}
                  imgExtension={['.jpg', '.png', '.gif']}
                  label=''
                  maxFileSize={5242880}
            />
          <button id={this_item.id+'_enter'}
                  className="item_enter btn btn-outline-success"
                  item_id={this_item.id}
                  onClick={this.submit_item.bind(this, this_item.id)}>Submit</button>
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
          <textarea id="new_item_desc" placeholder="Item Description"
                    className="form-control"/>
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
          <button id="new_item_enter" className="btn btn-outline-success"
                  onClick={this.submit_item.bind(this, 'new_item')}>
                  Enter</button>
        </div>
        <div id="admin_items" className="row">
          {for_ret}
        </div>
      </div>
    );
  }

  componentDidMount() {
    document.title = "eCommerce - Admin";
    /*$('#new_item .chooseFileButton')
      .after('<button class="remove_img btn btn-danger"'
          +' item_id="new_item">Remove Image</button>');

    $('.remove_img').on('click', () => {
      console.log($(this).attr('item_id'));
      $('#new_item .uploadPictureContainer').html('');
      let pictures = this.state.pictures;
      pictures['new_item'] = null;
      this.setState({'pictures': pictures});
    });*/
  }
}

export default Admin;

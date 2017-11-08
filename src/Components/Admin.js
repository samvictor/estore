import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import $ from 'jquery';
/*global firebase*/

class Admin extends Component {
  
  render() {
    let redir = null;
    if (this.props.user === null || this.props.user_is_admin !== "true")
      redir = <Redirect to="home" />;
    return (
      <div>
        {redir}
        Admin
      </div>
    );
  }
}

export default Admin;

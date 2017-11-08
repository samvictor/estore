import React, { Component } from 'react';
/*global firebase*/

class Alerts extends Component {
  render() {
    return (
      <div>
        <div id="alert_success" role="alert" class="alert alert-success"></div>
        <div id="alert_info" role="alert" class="alert alert-info"></div>
        <div id="alert_warning" role="alert" class="alert alert-warning"></div>
        <div id="alert_danger" role="alert" class="alert alert-danger"></div>
      </div>
    );
  }
}

export default Alerts;

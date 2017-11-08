import React, { Component } from 'react';
/*global firebase*/

class Alerts extends Component {
  render() {
    return (
      <div>
        <div id="alert_success" role="alert" className="alert alert-success"></div>
        <div id="alert_info" role="alert" className="alert alert-info"></div>
        <div id="alert_warning" role="alert" className="alert alert-warning"></div>
        <div id="alert_danger" role="alert" className="alert alert-danger"></div>
      </div>
    );
  }
}

export default Alerts;

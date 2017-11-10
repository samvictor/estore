import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
/*global firebase*/
/*global $*/

class Login extends Component {
  login_keydown(e) {
    let code = e.which;
    if(code === 13) {
      e.preventDefault();
      this.login_submit();
    }
  }
  login_submit(e) {
    if(e !== undefined) e.preventDefault();

    let email = document.querySelector('#login_email').value;
    let pass = document.querySelector('#login_password').value;
    document.querySelector('#login_email').value = '';
    document.querySelector('#login_password').value = '';

    firebase.auth().signInWithEmailAndPassword(email, pass).then(
      function () {
        $('#alert_success').text('You are logged in')
            .fadeIn().delay(4000).fadeOut();
      }
      ,function(error) {
        // Handle Errors here.
        var error_code = error.code;
        var error_message = error.message;

        $('#alert_danger').text(error_message)
            .fadeIn().delay(10000).fadeOut();
      });
  }

  render() {
    let redir = null;
    if (this.props.user !== null)
      redir = <Redirect to="home" />;
    return (
      <div id="signup_login_div" className="row">
        {redir}
        <div className="col-sm-6">
        <div id="login_div">
          <h3>Login</h3>
          <form method="post" action="/form">
            <input id="login_email" placeholder="Email" className="form-control" name="email"/>
            <input id="login_password" onKeyDown={this.login_keydown.bind(this)}
                  placeholder="Password" type="password" className="form-control" name="password"/>
            <button id="login_submit" onClick={this.login_submit} className="btn btn-outline-success">Submit</button>
          </form>
        </div>
        </div>
        <div className="col-sm-6">
        <div id="signup_div">
          <h3>Sign Up</h3>
          <input id="signup_email" placeholder="Email" className="form-control"/>
          <input id="signup_password" placeholder="Password" type="password" className="form-control"/>
          <button id="signup_submit" onClick={this.signup_submit} className="btn btn-outline-success">Submit</button>
        </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    document.title = "eCommerce - Login";
  }
}

export default Login;

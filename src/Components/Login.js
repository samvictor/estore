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

  signup_submit() {
    let email = document.querySelector('#signup_email').value;
    let password = document.querySelector('#signup_password').value;

    if (email !== document.querySelector('#signup_email_dup').value){
      $('#alert_danger').text('Email addresses do not match')
              .fadeIn().delay(4000).fadeOut();
      return;
    }
    if (email === ''){
      $('#alert_danger').text('Please enter an email address')
              .fadeIn().delay(4000).fadeOut();
      return;
    }

    if (password !== document.querySelector('#signup_password_dup').value){
      $('#alert_danger').text('Passwords do not match')
              .fadeIn().delay(4000).fadeOut();
      return;
    }
    if (password === ''){
      $('#alert_danger').text('Please enter a password')
              .fadeIn().delay(4000).fadeOut();
      return;
    }
    if (password.length < 6){
      $('#alert_danger').text('Password must be at least 6 characters long')
              .fadeIn().delay(6000).fadeOut();
      return;
    }
    if (password.replace(/[a-zA-Z]/g, '').length === 0){
      $('#alert_danger').text('Password must contain at least 1 number or symbol')
              .fadeIn().delay(7000).fadeOut();
      return;
    }


    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(function(user){
          $('#alert_success').text('Account created. You are signed in.').fadeIn()
                  .delay(7000).fadeOut();

          let uid = user.uid;
          firebase.database().ref('estore/users/'+uid)
              .set({'is_admin': 'false', 'email': user.email});
        }).catch(function(error){
          $('#alert_danger').text(error.message).fadeIn()
                  .delay(10000).fadeOut();
        });

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
          <hr id="login_divider"/>
          <h5>Forgot Your Password?</h5>
          <input id="forgot_email" placeholder="Email" className="form-control"/>
          <button id="forgot_submit" className="btn btn-outline-danger"
              onClick={function(){
                let auth = firebase.auth();
                let email = document.querySelector('#forgot_email').value;
                if (email === ''){
                  $('#alert_danger').text('Please enter your email address')
                          .fadeIn().delay(5000).fadeOut();
                  return;
                }
                auth.sendPasswordResetEmail(email)
                    .then(function(){
                      $('#alert_success').text('Instructions sent to your email. '
                              + 'Remember to check your spam folder.')
                              .fadeIn().delay(7000).fadeOut();
                    }).catch(function(error){
                      $('#alert_danger').text(error.message)
                              .fadeIn().delay(10000).fadeOut();

                    });
              }}>
            Reset Password
          </button>
        </div>
        </div>
        <div className="col-sm-6">
        <div id="signup_div">
          <h3>Sign Up</h3>
          <input id="signup_email" placeholder="Email" className="form-control"/>
          <input id="signup_email_dup" placeholder="Verify Email" className="form-control"/>
          <input id="signup_password" placeholder="Password" type="password" className="form-control"/>
          <input id="signup_password_dup" placeholder="Verify Password" type="password" className="form-control"/>
          <p className="requirements">
            Password Should Contain:<br/>
              * at least 6 characters<br/>
              * at least 1 number or symbol
          </p>
          <button id="signup_submit" className="btn btn-outline-success"
                  onClick={this.signup_submit}>Submit</button>
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

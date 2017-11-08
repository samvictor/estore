import React, { Component } from 'react';
import {Route, Link} from 'react-router-dom';
import $ from 'jquery';
/*global firebase*/

class Navbar extends Component {
  signOut() {
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      $('#alert_success').text('You are logged out')
          .fadeIn().delay(4000).fadeOut();
    }).catch(function(error) {
      console.log('signout failed', error);
    });

  }
  render() {
    let tabs = [
      <li className={(this.props.page==='home')?"nav-link active":"nav-link"}>
        <Link to="home" className="nav-link" sref="home">Home{(this.props.page==='home')?<span className="sr-only">(current)</span>:""}</Link>
      </li>,
      <li className={(this.props.page==='about')?"nav-link active":"nav-link"}>
        <Link to="about" className="nav-link" sref="about">About{(this.props.page==='about')?<span className="sr-only">(current)</span>:""}</Link>
      </li>
    ];

    if(this.props.user_is_admin === 'true')
      tabs.push( <li className={(this.props.page==='admin')?"nav-link active":"nav-link"}>
        <Link to="admin" className="nav-link" sref="admin">Admin{(this.props.page==='Admin')?<span className="sr-only">(current)</span>:""}</Link>
      </li>);

    let login_btn;
    if (this.props.user === null)
      login_btn = <Link to="login">
        <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Login / Signup</button>
      </Link>;
    else
      login_btn = <button id="logout" className="btn btn-outline-danger my-2 my-sm-0"
                      type="submit" onClick={this.signOut}>Logout</button>;

    return (
      <nav className="navbar navbar-expand-md navbar-light bg-light">
        <Link className="navbar-brand"
              to="home">ECommerce</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            {tabs}
          </ul>
          <div className="form-inline my-2 my-lg-0">
            <Route render={({history}) => (
              <input id="search" className="form-control mr-sm-2"
                    type="search" placeholder="Search" aria-label="Search"
                    onChange={() => {
                          let search_term = document.querySelector('#search').value;
                          if (search_term === '')
                            history.push('/home');
                          else
                            history.push('/search');

                          this.props.search2(search_term);
                    }}/>

            )} />
            <Link to="cart">
              <button id="cart_btn" className="btn btn-outline-success my-2 my-sm-0" type="submit">Cart</button>
            </Link>
            {login_btn}
          </div>
        </div>
      </nav>
    );
  }
}

export default Navbar;

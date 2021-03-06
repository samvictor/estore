import React, { Component } from 'react';
import {Route, Link} from 'react-router-dom';
/*global firebase*/
/*global $*/

class Navbar extends Component {
  search_keyup(e) {
    let code = e.which;
    if(code === 13) {
      e.preventDefault();
      $('#navbarSupportedContent').collapse('hide');
    }
  }

  render() {
    let tabs = [
      <li className={(this.props.page==='home')?"nav-link active":"nav-link"}>
        <Link to="home" className="nav-link" sref="home">
          Home{(this.props.page==='home')
                ?<span className="sr-only">(current)</span>
                :""}
        </Link>
      </li>,
      <li className={(this.props.page==='about')?"nav-link active":"nav-link"}>
        <Link to="about" className="nav-link" sref="about">About{(this.props.page==='about')?<span className="sr-only">(current)</span>:""}</Link>
      </li>
    ];

    if(this.props.user_is_admin === 'true')
      tabs.push( <li className={(this.props.page==='admin')?"nav-link active":"nav-link"}>
        <Link to="admin" className="nav-link" sref="admin">Admin{(this.props.page==='Admin')?<span className="sr-only">(current)</span>:""}</Link>
      </li>);

    if(this.props.user !== null)
      tabs.push( <li className={(this.props.page==='history')?"nav-link active":"nav-link"}>
        <Link to="history" className="nav-link" sref="history">Order History{(this.props.page==='history')?<span className="sr-only">(current)</span>:""}</Link>
      </li>);

    let cart_btn = null;
    if (this.props.user !== null) {
      if (this.props.page === 'cart') {
        cart_btn =
          <Link to="cart">
            <button id="cart_btn"
                  className="btn btn-outline-success my-2 my-sm-0 active"
                  type="submit">Cart</button>
          </Link>
      }
      else {
        cart_btn =
          <Link to="cart">
            <button id="cart_btn"
                  className="btn btn-outline-success my-2 my-sm-0"
                  type="submit">Cart</button>
          </Link>
      }
    }

    let login_btn;
    if (this.props.user === null)
      login_btn = <Link to="login">
        <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Login / Signup</button>
      </Link>;
    else
      login_btn = <Route render={({history}) => (
                    <button id="logout" className="btn btn-outline-danger my-2 my-sm-0"
                        type="submit" onClick={() => {
                            firebase.auth().signOut().then(function() {
                              // Sign-out successful.
                              $('#alert_success').text('You are logged out')
                                  .fadeIn().delay(3000).fadeOut();
                              history.push('/home');
                            }).catch(function(error) {
                              console.log('signout failed', error);
                            });
                          }}>
                      Logout
                    </button>
                  )} />;

    return (
      <nav id="main_navbar" className="navbar navbar-expand-md collapse navbar-light bg-light">
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

                    }}
                    onKeyUp={this.search_keyup}/>

            )} />
            {cart_btn}
            {login_btn}
          </div>
        </div>
      </nav>
    );
  }
}

export default Navbar;

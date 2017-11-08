import React, { Component } from 'react';
import {Route, Link} from 'react-router-dom';

class Navbar extends Component {
  render() {
    let tabs = [
      <li className={(this.props.page==='home')?"nav-link active":"nav-link"}>
        <Link to="home" className="nav-link" sref="home">Home{(this.props.page==='home')?<span className="sr-only">(current)</span>:""}</Link>
      </li>,
      <li className={(this.props.page==='about')?"nav-link active":"nav-link"}>
        <Link to="about" className="nav-link" sref="about">About{(this.props.page==='about')?<span className="sr-only">(current)</span>:""}</Link>
      </li>
    ];
    return (
      <nav className="navbar navbar-expand-sm navbar-light bg-light">
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
            <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Cart</button>
          </div>
        </div>
      </nav>
    );
  }
}

export default Navbar;

import React, { Component } from 'react';

class Navbar extends Component {
  handleClick(page) {
    this.props.tab_clicked({'page': page});
  }

  render() {
    let tabs = [
      <li className={(this.props.page==='home')?"nav-link active":"nav-link"}
              onClick={this.handleClick.bind(this, 'home')}>
        <a className="nav-link" sref="home">Home{(this.props.page==='home')?<span className="sr-only">(current)</span>:""}</a>
      </li>,
      <li className={(this.props.page==='about')?"nav-link active":"nav-link"}
              onClick={this.handleClick.bind(this, 'about')}>
        <a className="nav-link" sref="about">About{(this.props.page==='about')?<span className="sr-only">(current)</span>:""}</a>
      </li>
    ];
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand">ECommerce</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            {tabs}
          </ul>
          <form className="form-inline my-2 my-lg-0">
            <input id="search" className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"/>
            <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
          </form>
        </div>
      </nav>
    );
  }
}

export default Navbar;

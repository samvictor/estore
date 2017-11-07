import React, { Component } from 'react';
import './App.css';
import Navbar from './Components/Navbar'
import Home from './Components/Home'
import About from './Components/About'
import Search from './Components/Search'

class App extends Component {
  constructor() {
    super();
    this.state = {
      'page': this.get_page_from_url()
    }
  }

  get_page_from_url() {
    if (document.location.pathname === '/')
      return 'home';

    return document.location.pathname.split('/')[1];
  }

  handleGotoPage(data) {
    let for_state = {'page': data['page']};
    if (data['page'] === 'search')
      for_state['search_term'] = document.querySelector('#search').value;
    this.setState(for_state, () => console.log(this.state));
  }

  render() {
    let main_view;

    switch(this.state.page) {
      case 'home':
        main_view = <Home />;
      break;
      case 'about':
        main_view = <About />;
      break;
      case 'search':
        main_view = <Search search_term={this.state.search_term} />;
      break;
      default:
        main_view = <Home />;
    }

    return (
      <div className="App">
        <Navbar page={this.state.page}
                goto_page={this.handleGotoPage.bind(this)} />
        {main_view}
      </div>
    );
  }
}

export default App;

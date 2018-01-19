import React, { Component } from 'react';

import './SearchBar.css';

export default class SearchBar extends Component {
  constructor() {
    super();
    this.state = {
    }
  }


  render() {
    return (
      <div className="search-bar">
        <input type="text" placeholder="FIND STORES" />
      </div>
    );
  }
}

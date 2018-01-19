import React, { Component } from 'react';
import Home from './screens/Home/Home';

//Entry point of the app
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Default to English
      currentLanguage: 'en',
      i18next: null
    }
  }

  render() {
    // Use React router in the future if needed
    return (
      <Home/>
    )
  }
}

export default App;

import React, { Component } from 'react';

// Import screens from here
import Home from './screens/Home/Home';
import City from './screens/City/City';

import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

//Entry point of the app
class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Home} />
          <Route path="/city/:cityname" component={City} />
          <Route path="/store/:store_id" component={Home} />
        </div>
      </Router>
    )
  }
}


export default App;

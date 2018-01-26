import React, { Component } from 'react';

import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';


// Import screens from here
import Home from './screens/Home/Home';
import City from './screens/City/City';


// Entry point of the app
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // orientation: 'portrait'
    };
  }

  // componentDidMount() {
  //   let that = this;
  //   if (window.innerWidth > window.innerHeight) {
  //     that.setState({ orientation: 'landscape' });
  //   }
  //   window.addEventListener("orientationchange", function () {
  //     if (window.matchMedia("(orientation: portrait)").matches) {
  //       that.setState({ orientation: 'landscape' })
  //       console.log('landscape')
  //     }

  //     if (window.matchMedia("(orientation: landscape)").matches) {
  //       that.setState({ orientation: 'portrait' })
  //       console.log('portrait')
  //     }
  //   })
  // }

  render() {
    return (
      // <div>
      // {this.state.orientation === 'portrait' ?
      <Router>
        <div>
          <Route exact path="/" component={Home} />
          <Route path="/city/:cityname" component={City} />
          <Route path="/store/:store_id" component={Home} />
        </div>
      </Router>
      // : <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '30px', lineHeight: '100px' }}>Only portrait available</div>
      // }
      // </div>
    );
  }
}


export default App;

import React, { Component } from 'react';

import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

import MediaQuery from 'react-responsive';

// Import screens from here
import QRCode from './components/QRCode/QRCode';
import Home from './screens/Home/Home';
import City from './screens/City/City';
import SplashScreen from './components/SplashScreen/SplashScreen';

// import QRCode from './components/QRCode/QRCode';


// Entry point of the app
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
    };
    this.closeSplashScreen = this.closeSplashScreen.bind(this);
  }

  componentWillMount() {
    setTimeout(() => this.setState({ isLoaded: true }), 3000);
  }

  closeSplashScreen() {
    this.setState({ isLoaded: true });
  }

  render() {
    return (
      <div>
        <MediaQuery query="(orientation: landscape)">
          {(matches) => {
            if (matches) {
              return <QRCode />;
            }
            return (
              <div>
                <SplashScreen
                  isLoaded={this.state.isLoaded}
                  closeSplashScreen={this.closeSplashScreen}
                />
                <Router>
                  <div>
                    <Route exact path="/" component={Home} />
                    <Route path="/city/:cityname" component={City} />
                    <Route path="/store/:store_id" component={Home} />
                    <Route path="/poi/:poi_id" component={Home} />
                  </div>
                </Router>
              </div>
            );
            }
          }
        </MediaQuery>
      </div>
    );
  }
}


export default App;

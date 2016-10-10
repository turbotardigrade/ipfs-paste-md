import React from 'react';
import Editor from './Editor';
import Viewer from './Viewer';
import { Router, Route, Link, browserHistory } from 'react-router';

import './App.css';

class App extends React.Component {
  render() {
    return (
      <Router history={browserHistory}>
	<Route path="/" component={Editor} />
        <Route path="/edit" component={Editor} />
      	<Route path="/view/:hash" component={Viewer} />
      </Router>
    );
  }
}

export default App;

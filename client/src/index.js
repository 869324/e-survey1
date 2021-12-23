import React from 'react';
import ReactDOM from 'react-dom';
import Axios from "axios";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import './index.css';

import Home from "./js/home";
import Login from "./js/login"
import Signup from "./js/signup"
import Admin from "./js/admin"

class App extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/home" component={Home} />
          <Route path="/admin" component={Admin} />
          <Route path="/signup" component={Signup} />
        </Switch>
      </Router>
    );

  }
}

ReactDOM.render(<App />, document.getElementById('root'));

import React, {Component} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import './App.css';

import LockStrike from './components/lockStrike';
import Home from './components/home';
import Glogin from './components/glogin';
import OAuth from './components/oauth';
import CircuitBreaker from './components/circuitBreaker';
import ConsistentHashLB from './components/ConsistentHashLB';


class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      unlock: false,
      nostrike: false
    }
}
setLock = (v)=>{
  this.setState({nostrike: v})
  if(!this.state.unlock){

      setTimeout(function() {
        this.setState({unlock: v}) 
    }.bind(this), 300)
  }
  else{
    this.setState({unlock: v})
  }

}



  render(){

  return (
    <div className="App">
      <Glogin setLock={this.setLock} />
      <Router>
      <div>
        <nav>
          <Link to="/" style={{ textDecoration: 'none' }}>
              <div id="opt1">
                <LockStrike unlock={this.state.unlock} nostrike={this.state.nostrike} name="Home"/>
              </div>
          </Link>

          <Link to="/circuitbreaker" style={{ textDecoration: 'none' }}>
              <div id="opt2">
                <LockStrike unlock={this.state.unlock} nostrike={this.state.nostrike} name="Circuit Breaker"/>
              </div>
          </Link>

          <Link to="/sticky" style={{ textDecoration: 'none' }}>
              <div id="opt3">
                <LockStrike unlock={this.state.unlock} nostrike={this.state.nostrike} name="RequestAuthentication"/>
              </div>
          </Link>
          
          <Link to="/ConsistentHashLB" style={{ textDecoration: 'none' }}>
              <div id="opt4">
                <LockStrike unlock={this.state.unlock} nostrike={this.state.nostrike} name="ConsistentHashLB"/>
              </div>
          </Link>

          <Link to="/db" style={{ textDecoration: 'none' }}>
              <div id="opt5">
                <LockStrike unlock={this.state.unlock} nostrike={this.state.nostrike} name="MongoDB"/>
              </div>
          </Link>
        </nav>

        <Switch>

          <Route exact path="/"> <Home /> </Route>      
          
          <Route exact path="/circuitbreaker"> <CircuitBreaker /> </Route>

          <Route exact path="/sticky"> <OAuth/> </Route>

          <Route exact path="/ConsistentHashLB"> <ConsistentHashLB /> </Route>

          {/* <Route exact path="/db"> </Route> */} {/*ToDO*/ }
          
        </Switch>

      </div>
      </Router>
    </div>
    );
  }
}
export default App;



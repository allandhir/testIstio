import React, {Component} from 'react';

import './App.css';

//import Login from './components/login';
import OAuth from './components/oauth';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
}
  render(){

  return (
    <div className="App">
      {/*<Login />*/}
      <OAuth />
    </div>
    );
  }
}
export default App;



import React, { Component } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import MintHome from './components/MintHome';
import { BrowserRouter as Router, Switch } from "react-router-dom";


class App extends Component {
  
  render() {
    return (
      <>
        <Router>
          <Switch />
          <Navbar />
          <MintHome />
        </Router> 
      </>
    );
  }
}

export default App;

global.React = require('react');

import React from 'react';
import logo from './logo.svg';

import md2react from 'md2react';
import request from 'browser-request';

import './App.css';

export class MDViewer extends React.Component {
  render() {
    return (
      <div style={{padding: 30}}>
      {md2react(this.props.input)}
      </div>
    );
  }
}

export default class Viewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillMount() {
    var hash = this.props.params.hash;
    var host = window.location.hostname+":"+window.location.port;

    request('http://'+host+'/texts/'+hash, function(err, _, body) {
      if(err) throw err;
      this.setState({input: body});
    }.bind(this));
  }
  
  render() {
    console.log("state:");
    console.log(this.state);

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>IPFS Markdown Viewer</h2>
        </div>
        <div className="infobar">
          Hash: {this.props.params.hash}
	</div>
	<MDViewer input={this.state.input} />
      </div>
    )
  }
}

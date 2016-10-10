global.React = require('react');

import React from 'react';
import classNames from 'classnames';
import logo from './logo.svg';

var md2react = require('md2react');
var request = require('browser-request');
var Button = require('react-button');

import './Editor.css'; // tells webpack to use this style
import './App.css';

const defaultText = `
# Header

* A list
* A list

Some **bold** and _italic_ text

> A quote...

By [Long Hoang](https://longhoang.de)
`;

export class LiveEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {input: props.text}
  };

  onChange(event) {
    this.setState({input: event.target.value});
  };
  
  render() {
    return (
      <div className="cont">
	<div className="lefthalf">
	  <textarea value={this.state.input} className="editor" onChange={this.onChange.bind(this)} />
	</div>
	<div className="righthalf">
	  {md2react(this.state.input)}
	</div>
      </div>
    );
  }
}
  
export default class Editor extends React.Component {
  componentWillMount() {
    this.setState({
      text: defaultText,
      hash: ''
    });
  };
  
  save() {
    var host = window.location.hostname;
    var config = {
      method: 'POST',
      url: 'http://'+host+':3000/texts/',
      body: JSON.stringify({Text: this.state.text}),
      json: true
    };
    
    request(config, function(err, _, body) {
      if(err) throw err;
      this.setState({hash: body.Hash});
    }.bind(this));
  };
  
  render() {
    var host = window.location.hostname;
    var url = 'http://'+host+':3001/view/' + this.state.hash;
    
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>IPFS Markdown Editor</h2>
        </div>
        <p className="App-intro">
          Edit on the left using <code>Markdown</code> and hit <b>Save to IPFS</b> to upload.
	</p>
        <div className="topbar">
	  <Button style={{border: 1, color: 'white'}} type="button" onClick={this.save.bind(this)}>Save to IPFS</Button>
	</div>
	<div className={classNames({hidden: this.state.hash === '',infobar: true})}>
	  <div className="left">Saved as: <input value={this.state.hash} size="55" disabled /></div>
	  <div className="right"><a href={url}>Open in viewer</a></div>
	</div>
	<LiveEditor text={this.state.text}></LiveEditor>
      </div>
    )
  };
}

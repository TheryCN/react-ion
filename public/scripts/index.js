/**
 * Index.
 */
var ReactDOM = require('react-dom');
var React = require('react');
var TimeeBox = require('./timee');

// Render TimeeBox
ReactDOM.render(
  <TimeeBox url="/api/now" pollInterval={500} />,
  document.getElementById('content')
);

/**
 * SlotMachine component.
 */
var ReactDOM = require('react-dom');
var React = require('react');

const POSITIONS = ['front', 'bottom', 'back', 'top'];

module.exports = React.createClass({

  clickHandler: function(event) {
    var self = this;
    if (!this.state.active) {
      this.setState({ active: true });
      this.movement = setInterval(function() {
        self.setState({ time: self.state.time + 1 });
      }, 1000);
    } else {
      this.setState({ active: false });
      clearInterval(this.movement);
    }
  },

  doubleClickHandler: function(event) {
    this.setState({ time: 0, active: false });
  },

  getInitialState: function() {
    return { time: 0, active: false };
  },

  render: function() {
    return (
      <div className="chrono-box" onClick={this.clickHandler} onDoubleClick={this.doubleClickHandler}>
        <CubeBox time={this.state.time} role={3} />
        <CubeBox time={this.state.time} role={2} />
        <CubeBox time={this.state.time} role={1} />
        <CubeBox time={this.state.time} role={0} />
      </div>
    );
  }
});

var CubeBox = React.createClass({

  componentWillReceiveProps: function(nextProps) {
    var stringTime = parseInt(nextProps.time).toString();
    var localTime = stringTime[stringTime.length - parseInt(nextProps.role) - 1];
    localTime = parseInt((localTime) ? localTime : 0);

    var front = 0;
    var position = POSITIONS[localTime % 4];
    switch (position) {
      case 'front':
        front = localTime;
        break;
      case 'bottom':
        front = localTime - 1
        break;
      case 'back':
        front = localTime - 2
        break;
      case 'top':
        front = localTime - 3
        break;
      default:
        front = 0;
        break;
    }

    this.setState({
      front: front,
      bottom: front + 1,
      back: front + 2,
      top: front + 3,
      position: position
    });
  },

  getInitialState: function() {
    return { localTime: 0, positionId: 0 };
  },

  render: function() {
    return (
      <div className="cube-box">
        <div className={"cube show-"+this.state.position}>
          <div className={"front"}>{this.state.front}</div>
          <div className={"bottom"}>{this.state.bottom}</div>
          <div className={"back"}>{this.state.back}</div>
          <div className={"top"}>{this.state.top}</div>
          <div className={"right"}></div>
          <div className={"left"}></div>
        </div> 
      </div>
    );
  }
});

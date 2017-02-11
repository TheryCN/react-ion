/**
 * Chrono component.
 */
var ReactDOM = require('react-dom');
var React = require('react');

// Define cube positions
const POSITIONS = ['front', 'bottom', 'back', 'top'];

/**
 * ChronoBox class.
 * @return {ChronoBox}
 */
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
    clearInterval(this.movement);
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

/**
 * CubeBox class.
 * @param  {[type]} time the time to display
 * @param {int} role the role, it means the digit that the cube has in charge
 * @return {CubeBox}
 */
var CubeBox = React.createClass({

  componentWillReceiveProps: function(nextProps) {
    var stringTime = parseInt(nextProps.time).toString();
    var localTime = stringTime[stringTime.length - parseInt(nextProps.role) - 1];
    localTime = parseInt((localTime) ? localTime : 0);

    // The cube has only 6 faces, that's why we need to update them to get 0-9 values
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
      front: front%10,
      bottom: (front + 1)%10,
      back: (front + 2)%10,
      top: (front + 3)%10,
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

/**
 * Clocky component (used by timee).
 */
var ReactDOM = require('react-dom');
var React = require('react');

module.exports = React.createClass({

  getRadius: function(canvas, context) {
    var radius = canvas.height / 2;
    context.translate(radius, radius);
    radius = radius * 0.90;

    return radius;
  },

  drawClock: function(canvas, context, radius) {
    this.drawFace(context, radius);
    this.drawNumbers(context, radius);

    var time = moment();
    var hour = time.hours();
    var minute = time.minutes();
    var second = time.seconds();

    // Draw Hours/Minutes/Seconds
    hour = hour % 12;
    hour = (hour * Math.PI / 6) +
      (minute * Math.PI / (6 * 60)) +
      (second * Math.PI / (360 * 60));
    this.drawHand(context, hour, radius * 0.5, radius * 0.07);

    minute = (minute * Math.PI / 30) + (second * Math.PI / (30 * 60));
    this.drawHand(context, minute, radius * 0.8, radius * 0.07);

    second = (second * Math.PI / 30);
    this.drawHand(context, second, radius * 0.9, radius * 0.02);
  },

  drawFace: function(context, radius) {
    var grad;
    context.beginPath();
    context.arc(0, 0, radius, 0, 2 * Math.PI);
    context.fillStyle = 'white';
    context.fill();
    grad = context.createRadialGradient(0, 0, radius * 0.95, 0, 0, radius * 1.05);
    grad.addColorStop(0, '#333');
    grad.addColorStop(0.5, 'white');
    grad.addColorStop(1, '#333');
    context.strokeStyle = grad;
    context.lineWidth = radius * 0.1;
    context.stroke();
    context.beginPath();
    context.arc(0, 0, radius * 0.1, 0, 2 * Math.PI);
    context.fillStyle = '#333';
    context.fill();
  },

  drawNumbers: function(context, radius) {
    var ang;
    var num;
    context.font = radius * 0.15 + "px arial";
    context.textBaseline = "middle";
    context.textAlign = "center";
    for (num = 1; num < 13; num++) {
      ang = num * Math.PI / 6;
      context.rotate(ang);
      context.translate(0, -radius * 0.85);
      context.rotate(-ang);
      context.fillText(num.toString(), 0, 0);
      context.rotate(ang);
      context.translate(0, radius * 0.85);
      context.rotate(-ang);
    }
  },

  drawHand: function(context, pos, length, width) {
    context.beginPath();
    context.lineWidth = width;
    context.lineCap = "round";
    context.moveTo(0, 0);
    context.rotate(pos);
    context.lineTo(0, -length);
    context.stroke();
    context.rotate(-pos);
  },

  componentDidMount: function() {
    var self = this;
    var canvas = ReactDOM.findDOMNode(this);
    var context = canvas.getContext('2d');
    var radius = this.getRadius(canvas, context);
    setInterval(function() {
      self.drawClock(canvas, context, radius)
    }, 1000);
  },

  render: function() {
    return (
      <canvas className="clocky-canvas" width={250} height={250}></canvas>
    );
  }
});

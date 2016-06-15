/**
 * Timee component.
 */
var ReactDOM = require('react-dom');
var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var ClockyBox = require('./clocky');
var ChronoBox = require('./chrono');

module.exports = React.createClass({
  getCurrentTime: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({ time: data });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  getInitialState: function() {
    return { time: [] };
  },

  componentDidMount: function() {
    setInterval(this.getCurrentTime, this.props.pollInterval);
  },

  render: function() {
    return (
      <div className="timeeBox">
        <h1><span className="icon-clock" />TimEe</h1>
        <div className="row">
          <div className="col-md-2">
            <CurrentTimeBox time={this.state.time} />
            <ClockyBox />
            <ChronoBox />
          </div>
          <div className="col-md-10">
            <DefinedTimeBox />
          </div>
        </div>
      </div>
    );
  }
});

var CurrentTimeBox = React.createClass({
  render: function() {
    var Panel = ReactBootstrap.Panel;
    return (
      <Panel header="Current Time">
        <div>
          Millis : {this.props.time.millis}
        </div>
        <div>
          UTC : {this.props.time.utc}
        </div>
        <div>
          Server ({this.props.time.tz}) : {this.props.time.local}
        </div>
      </Panel>
    );
  }
});

var DefinedTimeBox = React.createClass({
  getUtcTime: function() {
    $.ajax({
      url: "/api/utctime",
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.updateTime(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  getTimeZoneList: function(timeRequest) {
    $.ajax({
      url: "/api/time/zone",
      dataType: 'json',
      cache: false,
      type: 'POST',
      data: timeRequest,
      success: function(data) {
        this.setState({ timeZoneList: data });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  getInitialState: function() {
    return { time: [], timeZoneList: [] };
  },

  componentDidMount: function() {
    this.getUtcTime();
  },

  handleChangeTime: function(event) {
    this.updateTime(event.target.value);
  },

  updateTime: function(time) {
    var timeJson = { time: time };
    this.setState(timeJson);
    this.getTimeZoneList(timeJson);
  },

  render: function() {
    var Panel = ReactBootstrap.Panel;
    return (
      <Panel header="Defined Time">
        <div className="row">
          <div className="col-md-3">
            <SettingsTimeBox time={this.state.time} handleChangeTime={this.handleChangeTime} />
          </div>
          <div className="col-md-9">
            <TimeZoneGrid url="/api/time/zone" timeZoneList={this.state.timeZoneList} />
          </div>
        </div>
      </Panel>
    );
  }
});

var SettingsTimeBox = React.createClass({
  render: function() {
    return (
      <div>
        <div>
          <form>
            UTC : <input value={this.props.time} onChange={this.props.handleChangeTime} />
          </form>
        </div>
      </div>
    );
  }
});

var TimeZoneGrid = React.createClass({
  render: function() {
    var Table = ReactBootstrap.Table;
    return (
      <div>
        <Table>
          <thead>
            <tr>
              <th>Date</th>
              <th>TimeZone</th>
              <th>Offset</th>
            </tr>
          </thead>
          <tbody>
            {this.props.timeZoneList.map(function(result) {
               return <TimeZoneGridRow key={result.tz} data={result} />;
            })}
          </tbody>
        </Table>
      </div>
    );
  }
});

var TimeZoneGridRow = React.createClass({
  render: function() {
    return <tr><td>{this.props.data.date}</td><td>{this.props.data.tz}</td><td>{this.props.data.offset}</td></tr>;
  }
});

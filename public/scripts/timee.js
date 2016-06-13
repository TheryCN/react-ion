/**
 * Timee component.
 */

var TimeeBox = React.createClass({
  getCurrentTime: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({time: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  getInitialState: function() {
    return {time: []};
  },

  componentDidMount: function() {
    setInterval(this.getCurrentTime, this.props.pollInterval);
  },

  render: function() {
    return (
      <div className="timeeBox">
        <h1>TimEe</h1>
        <div className="row">
          <div className="col-md-2">
            <CurrentTimeBox time={this.state.time} />
          </div>
          <div className="col-md-5">
            <TimeBox url="/api/time" pollInterval={this.props.pollInterval} />
          </div>
          <div className="col-md-5">
            <TimeZoneGrid url="/api/time/zone" pollInterval={this.props.pollInterval} />
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
        <div className="reaction-timebox">
          <Panel header="Current Time">
            <div>
              Millis : {this.props.time.millis}
            </div>
            <div>
              UTC : {this.props.time.utc}
            </div>
          </Panel>
        </div>
      );
    }
});

var TimeBox = React.createClass({
  getTime: function(timeRequest) {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      type: 'POST',
      data : timeRequest,
      success: function(data) {
        this.setState({time: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  getInitialState: function() {
    return {time: [], tz: 'Europe/Paris'};
  },

  componentDidMount: function() {
    var self = this;
    setInterval(function() {
      var timeRequest = {tz : self.state.tz};
      self.getTime(timeRequest);
    }, this.props.pollInterval);
  },

  render: function() {
      return (
        <div>
          {this.state.time} - {this.state.tz}
        </div>
      );
    }
});

var TimeZoneGrid = React.createClass({
  getTimeZoneList: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({timeZoneList: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  getInitialState: function() {
    return {timeZoneList: []};
  },

  componentDidMount: function() {
    setInterval(this.getTimeZoneList, this.props.pollInterval);
  },

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
              {this.state.timeZoneList.map(function(result) {
                 return <TimeZoneGridRow key={result.tz} data={result}/>;
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

ReactDOM.render(
  <TimeeBox url="/api/now" pollInterval={500} />,
  document.getElementById('content')
);

/**
 * Map component.
 */
var ReactDOM = require('react-dom');
var React = require('react');
var ol = require('openlayers');

/**
 * MapBox class.
 * @return {MapBox}
 */
module.exports = React.createClass({

  componentDidMount: function() {
    this.initMap();
  },

  initMap: function() {
    var countryVector = new ol.layer.Vector({
      source: new ol.source.Vector({
        url: '/api/countries/geojson',
        format: new ol.format.GeoJSON()
      })
    });

    var map = new ol.Map({
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        }),
        countryVector
      ],
      target: 'map',
      view: new ol.View({
        center: [0, 0],
        zoom: 2
      })
    });

    this.setState({map: map});
  },

  getInitialState: function() {
    return { map: undefined };
  },

  render: function() {
    return (
      <div>
        <div id="map"></div>
        <InfoBox map={this.state.map} />
      </div>
    );
  }
});

/**
 * InfoBox class.
 * @return {InfoBox}
 */
var InfoBox = React.createClass({
  componentWillReceiveProps: function(nextProps) {
    var self = this;
    if(this.props.map == undefined) {
      this.map = nextProps.map;

      // Add click interaction
      var selectClick = new ol.interaction.Select({
        condition: ol.events.condition.click
      });
      this.map.addInteraction(selectClick);

      selectClick.on('select', function(evt) {
        var featuresCollection = evt.target.getFeatures();
        if(featuresCollection && featuresCollection.getLength() == 1) {
          // Retrieve feature
          var feature = featuresCollection.getArray()[0];
          self.setState({country : feature.get('name')});
        } else {
          self.setState({country : ""});
        }
      });
    }
  },

  getInitialState: function() {
    return { country: "" };
  },

  render: function() {
    return (
      <div>
        {this.state.country}
      </div>
    );
  }
});
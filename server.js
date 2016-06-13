/**
 * NodeJS Server definition.
 */

var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var moment = require('moment');
var momentTz = require('moment-timezone');
var app = express();

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Additional middleware which will set headers that we need on each request.
app.use(function(req, res, next) {
    // Set permissive CORS header - this allows this server to be used only as
    // an API server in conjunction with something like webpack-dev-server.
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Disable caching so we'll always get the latest comments.
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

var format = 'YYYY-MM-DD HH:mm:ss'

app.get('/api/now', function(req, res) {
    var now = moment();
    var local = momentTz();
    res.json({
        millis: now.format('x'),
        utc: now.utc().format(format),
        tz : moment.tz.guess(),
        local: local.format(format)
    });
});

app.get('/api/utctime', function(req, res) {
    res.json(moment.utc().format(format));
});

app.post('/api/time/zone', function(req, res) {
    var data = [];
    var now = moment(req.body.time, format);
    var tzList = ['Europe/Paris', 'Europe/London', 'Europe/Moscow', 'America/Los_Angeles', 'America/New_York', 'Pacific/Auckland', 'Asia/Tokyo'];
    tzList.forEach(function(timeZone) {
        var dateTz = now.tz(timeZone);
        data.push({ date: dateTz.format('MM-DD HH:mm:ss'), tz: timeZone, offset: dateTz.utcOffset() / 60 });
    });
    res.json(data);
});

app.get('/api/timezones', function(req, res) {
    res.json(momentTz.tz.names());
});

app.listen(app.get('port'), function() {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
});

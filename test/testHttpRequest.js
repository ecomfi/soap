"use strict";

var assert = require('assert');
var httpRequest = require('../lib/httpRequest');
var deserializer = require('../lib/deserializer');

var wsdlOptions = {
    "hostname": "wsf.cdyne.com",
    "path": "/WeatherWS/Weather.asmx?WSDL",
    "isHttps": false
}

httpRequest.httpRequest(wsdlOptions, null, function(err, retval) {
    assert.ok(!err, "Cannot read WSDL");
    assert.equal(200, retval.status, "bad status");
    assert.equal(200, retval.statusCode, "bad status");
    assert.ok(retval.headers, "missing headers");
    assert.ok(retval.requestOptions, "missing options");
    assert.ok(retval.body, "missing body");
    deserializer.deserialize(retval.body, null, null, function(err, data) {
        assert.ok(!err, "Response is not XML");
    });
});

var noHostOptions = {
    "hostname": "nosuchhost.com",
    "path": "/WeatherWS/Weather.asmx?WSDL",
    "isHttps": false
}

httpRequest.httpRequest(noHostOptions, null, function(err, retval) {
    assert.ok(!retval, "Unexpected response");
    assert.ok(err, "No error");
    assert.equal(404, err.httpStatusCode);
});

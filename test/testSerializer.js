"use strict";

var serializer = require('../lib/serializer');
var assert = require('assert');
var testutils = require('./testutils');
var ws = require('./weatherService');
var ts = require('./trackerService');

testutils.makeTypePointers(ws.service);
testutils.makeTypePointers(ts.service);

var request = {parameters: {ZIP : "94903"}};

var expectedXmlRequest =
'<soap11:Envelope xmlns:pfx1="http://ws.cdyne.com/WeatherWS/" xmlns:soap11="http://schemas.xmlsoap.org/soap/envelope/" xmlns:soap12="http://www.w3.org/2001/12/soap-envelope" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" >\n' +
'<soap11:Body >\n' +
'<pfx1:GetCityForecastByZIP >\n' +
'<pfx1:ZIP >94903</pfx1:ZIP>\n' +
'</pfx1:GetCityForecastByZIP>\n' +
'</soap11:Body>\n' +
'</soap11:Envelope>';
var xmlRequest = serializer.serialize(request, ws.service.operations.GetCityForecastByZIP.requestDesc);
assert.equal(xmlRequest, expectedXmlRequest);

request =
{
    sessionId: "sessionPwd",
    containerId : "tracker1101",
    filters :
        [
            { name : "status", value : "closed"},
            { name : "priority", value : "1"}
        ]
};

expectedXmlRequest =
'<soap11:Envelope xmlns:pfx1="http://schema.open.collab.net/sfee50/soap50/service" xmlns:pfx2="http://schema.open.collab.net/sfee50/soap50/type" xmlns:soap11="http://schemas.xmlsoap.org/soap/envelope/" xmlns:soap12="http://www.w3.org/2001/12/soap-envelope" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" >\n' +
'<soap11:Body >\n' +
'<pfx1:getArtifactList3 soap11:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" >\n' +
'<sessionId xsi:type="xsd:string" >sessionPwd</sessionId>\n' +
'<containerId xsi:type="xsd:string" >tracker1101</containerId>\n' +
'<filters soapenc:arrayType="pfx2:SoapFilter[2]" xsi:type="soapenc:array" >\n' +
'<filters xsi:type="pfx2:SoapFilter" >\n' +
'<name xsi:type="xsd:string" >status</name>\n' +
'<value xsi:type="xsd:string" >closed</value>\n' +
'</filters>\n' +
'<filters xsi:type="pfx2:SoapFilter" >\n' +
'<name xsi:type="xsd:string" >priority</name>\n' +
'<value xsi:type="xsd:string" >1</value>\n' +
'</filters>\n' +
'</filters>\n' +
'</pfx1:getArtifactList3>\n' +
'</soap11:Body>\n' +
'</soap11:Envelope>'

var xmlRequest = serializer.serialize(request, ts.service.operations.getArtifactList3.requestDesc);
assert.equal(xmlRequest, expectedXmlRequest);

"use strict"

var soapdoc = require('../lib/soapdoc');
var assert = require('assert');

var expected = '<soap11:Envelope xmlns:pfx1="foo" xmlns:soap11="http://schemas.xmlsoap.org/soap/envelope/" xmlns:soap12="http://www.w3.org/2001/12/soap-envelope" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" >\n' +
'<soap11:Header >\n' +
'<SAML ></SAML>\n' +
'</soap11:Header>\n' +
'<soap11:Body >\n' +
'<a color="red" >\n' +
'<middle >\n' +
'<soap11:child xsi:type="xsd:int" >12</soap11:child>\n' +
'<child xsi:type="pfx1:enum" >12</child>\n' +
'</middle>\n' +
'</a>\n' +
'</soap11:Body>\n' +
'</soap11:Envelope>';
expected
var doc = new soapdoc.SOAPDocument("http://schemas.xmlsoap.org/soap/envelope/", createCustomHeader);
var elm = doc.createElement('a');
elm.addAttr("color", "red");
doc.createElement("middle");
doc.createLeafElement("child", "http://schemas.xmlsoap.org/soap/envelope/", "12", "int");
doc.createLeafElement("child", null, "12", "enum", "foo");
doc.finish();
doc.createHeaders();
var xml = doc.serialize();
assert.equal(xml, expected);

function createCustomHeader(header) {
    header.createChildElement("SAML");
}
"use strict";

var em_utils = require('emutils');

var deserializer = require('./deserializer');
var http = require('./httpRequest');
var namespaces = require('./namespaces');
var serializer = require('./serializer');
var soapdoc = require('./soapdoc');
var soaputils = require('./soaputils') ;
var wsdlcollection = require('./wsdlcollection');
var xmldoc = require('./xmldoc');

exports.call = call;
exports.subsystems =
{
    deserializer: deserializer,
    httpRequest: http,
    namespaces: namespaces,
    serializer : serializer,
    soapdoc : soapdoc,
    soaputils: soaputils,
    wsdlcollection: wsdlcollection,
    xmldoc: xmldoc
};

function call(request, httpOptions, requestDesc, deserializationOptions, responseDesc, cb) {
    var xmlRequest = serializer.serialize(request, requestDesc);
    //console.log(xmlRequest);
    httpOptions = em_utils.clone(httpOptions);
    if (!httpOptions.headers) {
        httpOptions.headers = {};
    }
    var soapAction;
    if (em_utils.hasValue(requestDesc.soapAction)) {
        soapAction = requestDesc.soapAction;
    }
    else if (em_utils.hasValue(httpOptions.soapAction)) {
        soapAction = httpOptions.soapAction;
    }
    else {
        soapAction = "";
    }
    switch (requestDesc.soapVersion) {

        case "1.1":
            httpOptions.headers["content-type"] = "text/xml";
            httpOptions.headers.soapAction = '"' + soapAction + '"';
            break;

        case "1.2":
            var hdr = soapAction = "application/soap+xml";
            if (soapAction) {
                hdr += ";action=soapAction";
            }
            httpOptions.headers["content-type"] = hdr;
            break;

        default:
            throw new Error("Unknown SOAP version: " + requestDesc.soapVersion);
    }
    http.httpRequest(httpOptions, xmlRequest, function(err, httpResponse) {
        if (err) {
            cb(err);
            return;
        }
        deserializer.deserialize(httpResponse.body, responseDesc, deserializationOptions, function(err, response) {
            if (err && !err.fault && http.isErrorStatus(httpResponse.status)) {
                err = new Error("Error contacting service: HTTP status: " + httpResponse.status);
            }
            cb(err, response);
        });
    });
}
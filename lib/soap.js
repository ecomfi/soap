"use strict";

var em_utils = require('emutils');

var deserializer = require('./deserializer');
var httpRequest = require('./httpRequest');
var namespaces = require('./namespaces');
var serializer = require('./serializer');
var soapdoc = require('./soapdoc');
var soaputils = require('./soaputils') ;
var wsdlcollection = require('./wsdlcollection');
var xmldoc = require('./xmldoc');

/**
 SOAP client

 @module emsoap
 @main
 **/

/**
 @class emsoap
 **/

exports.call = call;

/**
 The modules used by the SOAP client

 @property subsystems
 @type Object
 **/
exports.subsystems =
{
    deserializer: deserializer,
    httpRequest: httpRequest,
    namespaces: namespaces,
    serializer : serializer,
    soapdoc : soapdoc,
    soaputils: soaputils,
    wsdlcollection: wsdlcollection,
    xmldoc: xmldoc
};

/**Call a SOAP operation
@method call
@static
@param {Object} request The SOAP body, expressed as a JavaScript object
@param {HttpOptions} httpOptions HTTP options for calling the target service
@param {RequestDescriptor} requestDesc A description of the SOAP operation's request
@param {DeserializationOptions} deserializationOptions Options for converting the SOAP response into a JavaScript object
@param {ResponseDescriptor} responseDesc A description of the SOAP operation's response
@param {Function(err, response)} cb Callback
 **/
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
    httpRequest.httpRequest(httpOptions, xmlRequest, function(err, httpResponse) {
        if (err) {
            cb(err);
            return;
        }
        deserializer.deserialize(httpResponse.body, responseDesc, deserializationOptions, function(err, response) {
            if (err && !err.fault && httpRequest.isErrorStatus(httpResponse.status)) {
                err = new Error("Error contacting service: HTTP status: " + httpResponse.status);
            }
            cb(err, response);
        });
    });
}

//---------------------------------------------
/**
A descriptor for a SOAP request
@class RequestDescriptor
**/

/**
SOAP operation name
@property opName
@type String
**/

/**
 SOAP operation namespace
 @property opNs
 @type String
 **/

/**
 value for SOAPAction header
 @property soapAction
 @type String
 **/

/**
 is the request encoded
 @property isEncoded
 @type Boolean
 **/

/**
 is the request RPC-style
 @property isRpc
 @type Boolean
 **/

/**
 SOAP version (1.1 or 1.2)
 @property soapVersion
 @type String
 **/

/**
 request message part descriptors
 @property parts
 @type Array of Part
 **/
//---------------------------------------------
/**
 A descriptor for a SOAP response
 @class ResponseDescriptor
 **/

/**
 is the response encoded
 @property isEncoded
 @type Boolean
 **/

/**
 is the response RPC-style
 @property isRpc
 @type Boolean
 **/

/**
 response message part descriptors
 @property parts
 @type Array of Part
 **/
//---------------------------------------------
/**
 A descriptor for a SOAP message part
 @class Part
 **/

/**
 part name
 @property name
 @type String
 **/

/**
 element local name
 @property elementName
 @type String
 **/

/**
 element namespace
 @property elementNS
 @type String
 **/

/**
 complex type local name
 @property xmlType
 @type String
 **/

/**
 complex type namespace
 @property xmlNs
 @type Boolean
 **/

/**
 simple type name (String, Number, Boolean, Date)
 @property jsonType
 @type String
 **/

/**
 complex type
 @property type
 @type ComplexType
 **/
//---------------------------------------------
/**
 A complex type, as described by XML Schema
 @class ComplexType
 **/

/**
 type local name
 @property name
 @type String
 **/

/**
 type namespace
 @property ns
 @type String
 **/

/**
 checksum calculated from namespace, which can be used for uniqueness
 @property nsChecksum
 @type String
 **/

/**
 base type local name
 @property baseTypeName
 @type String
 **/


/**
 base type namespace
 @property baseTypeNs
 @type String
 **/

/**
 base type
 @property baseType
 @type ComplexType
 **/

/**
 Was the type name constructed during type parsing
 @property isSynthetic
 @type Boolean
 **/

/**
 If the type is synthetic, the non-unique stem it was constructed from
 @property stem
 @type String
 **/

/**
 The contents of the type
 @property content
 @type Array of TypeContentItem
 **/
//---------------------------------------------
/**
 A member of a ComplexType's content
 @class TypeContentItem
 **/

/**
 item local name
 @property name
 @type String
 **/

/**
 item namespace
 @property ns
 @type String
 **/

/**
 true if the item is an attribute (as opposed to an element)
 @property isAttr
 @type Boolean
 **/


/**
 complex type local name
 @property xmlType
 @type String
 **/

/**
 complex type namespace
 @property xmlNs
 @type Boolean
 **/

/**
 simple type name (String, Number, Boolean, Date)
 @property jsonType
 @type String
 **/

/**
 complex type
 @property type
 @type ComplexType
 **/

/**
 minimum number of types this item can occur, if not 1
 @property minOccurs
 @type Number
 **/

/**
 maximum number of types this item can occur, if not 1 (-1 means "unlimited")
 @property maxOccurs
 @type Number
 **/


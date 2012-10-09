"use strict";

var xmldoc = require('./xmldoc');

exports.SOAPDocument = SOAPDocument;

/**
 SOAP DOM

 @module emsoap
 @submodule soapdoc
 **/

/**
 A SOAP dom
 @class SOAPDocument
 @extends Document
 **/

/**
@constructor
@param soapNs {String} the namespace for the desired version of SOAP
@param [headercb] {Function(Element) or Array} a callback to create the desired SOAP headers,
or an array of headers to create
@constructor
**/
function SOAPDocument(soapNs, headercb) {
    xmldoc.Document.call(this);
    this.soapNs = soapNs;
    this.createElement("Envelope", soapNs);
    if (headercb)
    {
        var header = this.createElement("Header", soapNs);
        this.endElement();
        this.header = header;
        this.headercb = headercb;
    }
    this.createElement("Body", soapNs);
}
SOAPDocument.prototype = new xmldoc.Document();
SOAPDocument.prototype.createHeaders = createHeaders;

/**
 @method createHeaders create the SOAP headers, as specified by the constructor parameter headerCB
 **/
function createHeaders() {
    if (this.headercb) {
        if (Array.isArray(this.headercb)) {
            for (var i = 0; i < this.headercb.length; i++) {
                this.headercb[i](this.header);
            }
        }
        else {
            this.headercb(this.header);
        }
    }
}

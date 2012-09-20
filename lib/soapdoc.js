"use strict";

var namespaces = require('./namespaces');
var xmldoc = require('./xmldoc');

exports.init = init;

function init(soapNs, headercb) {
    var doc = xmldoc.init();
    doc.soapNs = soapNs;
    doc.createElement("Envelope", soapNs);
    if (headercb)
    {
        var header = doc.createElement("Header", soapNs);
        doc.endElement();
        doc.header = header;
        doc.headercb = headercb;
    }
    doc.createElement("Body", soapNs);

    // methods
    doc.createHeaders = createHeaders;

    return doc;
}

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

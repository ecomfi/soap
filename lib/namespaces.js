"use strict";

exports.init = init;

var SOAP11_NS = "http://schemas.xmlsoap.org/soap/envelope/";
var SOAP11_PFX = "soap11";
var SOAP12_NS = "http://www.w3.org/2001/12/soap-envelope";
var SOAP12_PFX = "soap12";
var XSD_NS = "http://www.w3.org/2001/XMLSchema";
var XSD_PFX = "xsd";
var XSI_NS = "http://www.w3.org/2001/XMLSchema-instance";
var XSI_PFX = "xsi";
var SOAPENC_NS = "http://schemas.xmlsoap.org/soap/encoding/";
var SOAPENC_PFX = "soapenc";
var XMLNS = "http://www.w3.org/2000/xmlns/";
var WSDL = "http://schemas.xmlsoap.org/wsdl/";

exports.SOAP12_NS = SOAP12_NS;
exports.SOAP11_NS = SOAP11_NS;
exports.SOAPENC_NS = SOAPENC_NS;
exports.XSD_NS = XSD_NS;
exports.XSI_NS = XSI_NS;
exports.XMLNS = XMLNS;
exports.WSDL = WSDL;


var preload = new Object();

preload.nsByPfx = new Object();
preload.pfxByNs = new Object();

preload.nsByPfx[SOAP11_PFX] = SOAP11_NS;
preload.nsByPfx[SOAP12_PFX] = SOAP12_NS;
preload.nsByPfx[XSD_PFX] = XSD_NS;
preload.nsByPfx[XSI_PFX] = XSI_NS;
preload.nsByPfx[SOAPENC_PFX] = SOAPENC_NS;

for (var pfx in preload.nsByPfx) {
    preload.pfxByNs[preload.nsByPfx[pfx]] = pfx;
}

function init() {
    var ns = new Object();
    ns.nsByPfx = new Object();
    ns.pfxByNs = new Object();
    ns.index = 1;

    // methods
    ns.addNs = addNs;
    ns.getNs = getNs;
    ns.getPrefix = getPrefix;
    ns.getNamespaces = getNamespaces;

    return ns;
}


function addNs(namespace) {
    var pfx = this.getPrefix(namespace);
    if (pfx) {
        return pfx;
    }
    pfx = "pfx" + this.index++;
    this.nsByPfx[pfx] = namespace;
    this.pfxByNs[namespace] = pfx;
    return pfx;
}

function getNs(pfx) {
    var namespace = this.nsByPfx[pfx];
    if (namespace) {
        return namespace;
    }
    return preload.nsByPfx[pfx];
}

function getPrefix(namespace) {
    var pfx = this.pfxByNs[namespace];
    if (pfx) {
        return pfx;
    }
    return preload.pfxByNs[namespace];
}

function getNamespaces() {
    var nss = new Array();
    nss.push(this.nsByPfx);
    nss.push(preload.nsByPfx);
    return nss;
}



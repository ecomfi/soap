"use strict";

var emutils = require("emutils");

exports.Namespaces = Namespaces;

/**
 XML Namespace-processing classes

 @module emsoap
 @submodule namespaces
 **/

/**
 A collection of namespaces used in an XML document
 @class Namespaces
 **/

/**
 The XML namespace for SOAP 1.1
 @property SOAP11_NS
 @type String
 **/
var SOAP11_NS = "http://schemas.xmlsoap.org/soap/envelope/";
var SOAP11_PFX = "soap11";

/**
 The XML namespace for SOAP 1.2
 @property SOAP12_NS
 @type String
 **/
var SOAP12_NS = "http://www.w3.org/2001/12/soap-envelope";
var SOAP12_PFX = "soap12";

/**
 The XML namespace for XML Schema
 @property XSD_NS
 @type String
 **/
var XSD_NS = "http://www.w3.org/2001/XMLSchema";
var XSD_PFX = "xsd";

/**
 The XML namespace for XML Schema instances
 @property XSI_NS
 @type String
 **/
var XSI_NS = "http://www.w3.org/2001/XMLSchema-instance";
var XSI_PFX = "xsi";

/**
 The XML namespace for SOAP encoding
 @property SOAPENC_NS
 @type String
 **/
var SOAPENC_NS = "http://schemas.xmlsoap.org/soap/encoding/";
var SOAPENC_PFX = "soapenc";

/**
 The XML namespace for XML namsepace definitions
 @property XMLNS
 @type String
 **/
var XMLNS = "http://www.w3.org/2000/xmlns/";

/**
 The XML namespace for WSDL 1.1
 @property WSDL
 @type String
 **/
var WSDL_NS = "http://schemas.xmlsoap.org/wsdl/";
var WSDL_PFX = "wsdl";

exports.SOAP12_NS = SOAP12_NS;
exports.SOAP11_NS = SOAP11_NS;
exports.SOAPENC_NS = SOAPENC_NS;
exports.XSD_NS = XSD_NS;
exports.XSI_NS = XSI_NS;
exports.XMLNS = XMLNS;
exports.WSDL_NS = WSDL_NS;


var preload = new Namespaces();

addNsToHashes.call(preload, SOAP11_PFX, SOAP11_NS);
addNsToHashes.call(preload, SOAP12_PFX, SOAP12_NS);
addNsToHashes.call(preload, SOAPENC_PFX, SOAPENC_NS);
addNsToHashes.call(preload, XSD_PFX, XSD_NS);
addNsToHashes.call(preload, XSI_PFX, XSI_NS);
addNsToHashes.call(preload, WSDL_PFX, WSDL_NS);


/**
 * @constructor
 */
function Namespaces() {
    this.nsByPfx = new Object();
    this.pfxByNs = new Object();
    this.index = 1;
}
Namespaces.prototype.addNs = addNs;
Namespaces.prototype.getNs = getNs;
Namespaces.prototype.getPrefix = getPrefix;
Namespaces.prototype.getNamespaces = getNamespaces;


/**
 Add a namespace.  If it is not already present, a new prefix is generated
 @method addNs
 @param {String} namespace
 @return {String} the prefix for this namespace
 **/
function addNs(namespace) {
    var pfx = this.getPrefix(namespace);
    if (pfx) {
        return pfx;
    }
    pfx = "pfx" + this.index++;
    addNsToHashes.call(this, pfx, namespace);
    return pfx;
}

/**
 Get the namespace associated with the given prefix
 @method getNs
 @param {String} pfx prefix
 @return {String} the namespace for this prefix
 **/
function getNs(pfx) {
    var namespace = this.nsByPfx[pfx];
    if (namespace) {
        return namespace;
    }
    return preload.nsByPfx[pfx];
}

/**
 Get the prefix associated with the given namespace
 @method getNs
 @param {String} namespace the XML namespace
 @return {String} the prefix for this namespace
 **/
function getPrefix(namespace) {
    var pfx = this.pfxByNs[namespace];
    if (pfx) {
        return pfx;
    }
    return preload.pfxByNs[namespace];
}

/**
 Get the current namespace definitions
 @method getNs
 @return {Object} all current namespace definitions
 **/
function getNamespaces() {
    var nss = new Object();
    emutils.merge(this.nsByPfx, nss);
    emutils.merge(preload.nsByPfx, nss);
    return nss;
}

function addNsToHashes(pfx, namespace) {
    this.nsByPfx[pfx] = namespace;
    this.pfxByNs[namespace] = pfx;
}



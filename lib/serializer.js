"use strict";

var soapdoc = require('./soapdoc');
var soaputils = require('./soaputils');
var namespaces = require('./namespaces');
var emutils = require('emutils');

exports.serialize = serialize;

/**
 functions used to serialize JavaScript objects into XML

 @module emsoap
 @submodule serializer
 **/

/**
 @class serializer
 **/

/**
 serialize JavaScript  into XML
 @method serialize
 @static
 @param data {Object} data to serialize
 @param descriptor {RequestDescriptor} a descriptor to direct the serialization of a JavaScript object into XML
 @return {String} a SOAP document
 **/

function serialize(data, descriptor) {
    var doc = new soapdoc.SOAPDocument(descriptor.soapVersion == "1.1" ? namespaces.SOAP11_NS : namespaces.SOAP12_NS);

    if (descriptor.isRpc) {
        var opElm = doc.createElement(descriptor.opName, descriptor.opNs);
        if (descriptor.isEncoded) {
            opElm.addAttr("encodingStyle", namespaces.SOAPENC_NS, doc.soapNs);
        }
    }

    descriptor.parts.forEach(function(part) {
        var value = data[part.name];
        var elmNs;
        var elmName;

        if (part.elementName) {
            elmNs = part.elementNs;
            elmName = part.elementName;
        }
        else {
            elmName = part.name;
        }

        serializeObject(doc, value, part.jsonType, part.type, part.xmlTypeNs, part.xmlType, elmNs, elmName, descriptor.isEncoded, part.isArray);
    });

    if (descriptor.isRpc) {
        doc.endElement(descriptor.opName, descriptor.opNs);
    }

    doc.finish();
    doc.createHeaders();
    return doc.serialize();
}

function serializeObject(doc, data, jsonType, type, typeNs, typeName, xmlNs, xmlName, isEncoded, isArray) {
    if (!emutils.hasValue(data))
        return;

    if (jsonType) {
        if (isArray) {
            data = emutils.toArray(data);
            data.forEach(function(row) {
                doc.createLeafElement(xmlName, xmlNs, formatJsonString(jsonType, row), isEncoded ? getXmlType(jsonType) : null);
            });
        }
        else { // not an array
            doc.createLeafElement(xmlName, xmlNs, formatJsonString(jsonType, data), isEncoded ? getXmlType(jsonType) : null);
        }
    }
    else {  // not a simple type
        if (isArray) {
            data = emutils.toArray(data);
            if (isEncoded) {
                doc.createElement(xmlName, xmlNs);
                doc.addAttr("arrayType", doc.ns.addNs(typeNs) + ":" + typeName + "[" + data.length +  "]", namespaces.SOAPENC_NS);
                doc.addTypeAttr("array", namespaces.SOAPENC_NS);
                data.forEach(function(row) {
                    serializeObject(doc, row, null, type, typeNs, typeName, xmlNs, xmlName, isEncoded, false);
                });
                doc.endElement();
            }
            else { // not encoded
                data.forEach(function(row) {
                    serializeObject(doc, row, null, type, typeNs, typeName, xmlNs, xmlName, isEncoded, false);
                });
            }
        }
        else { // not an array
            doc.createElement(xmlName, xmlNs);
            serializeFields(doc, data, type, isEncoded);
            if (isEncoded) {
                doc.addTypeAttr(typeName, typeNs, isEncoded);
            }
            doc.endElement();
        }
    }
}

function serializeFields(doc, data, type, isEncoded) {
    if (type.baseType) {
        serializeFields(doc, data, type.baseType, isEncoded);
    }

    type.content.forEach(function(item) {
        var value = data[item.name];
        if (value) {
            if (item.isAttr) {
                doc.addAttr(item.name, formatJsonString(item.jsonType, value), item.ns);
            }
            else {
                var isArray = item.isArray || item.maxOccurs < 0 || item.maxOccurs > 1;
                serializeObject(doc, value, item.jsonType, item.type, item.xmlTypeNs, item.xmlTypeName, item.ns, item.name, isEncoded, isArray);
            }
        }
    });
}


function formatJsonString(type, data) {
    var value;

    switch(type) {
        case "date":
            value = new Date(data).toISOString();

        default:
            value = data.toString();
    }

    return value;
}

function getXmlType(jsonType, value) {
    var xmlType;

    switch(jsonType) {
        case "number":
            if (value.indexOf) {
                xmlType = value.indexOf(".") < 0 ? "integer" : "double";
            } else if (emutils.type(value) == "number") {
                xmlType = Math.floor(value) == value ? "integer" : "double";
            }
            else {
                xmlType = "double";
            }
            break;

        case "boolean":
            xmlType = "boolean";
            break;

        case "date":
            xmlType = "dateTime";
            break;


        default:
            xmlType = "string";
            break;
    }

    return xmlType;
}
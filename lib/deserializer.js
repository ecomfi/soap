'use strict';

var xml2js = require('emxml2js');
var soaputils = require('./soaputils');
var namespaces = require('./namespaces');
var emutils = require('emutils');

exports.deserialize = deserialize;


/**
functions used to deserialize XML into JavaScript objects
@module emsoap
@submodule deserializer
**/

/**
@class deserializer
**/
var jsonOptions =
{
    normalize: false,
    trimming: false,
    explicitRoot: true,
    xmlns: true,
    attrkey: "@",
    charkey: "#",
    explicitArray: false
};

/**
Deserialize XML into JavaScript
@method deserialize
@static
@param xml {String} an XML document
@param descriptor ResponseDescriptor a descriptor to direct the
deserialization of the XML into JavaScript objects
@param theOptions {DeserializationOptions} options for processing the parsed XML
@param cb {Function(err, data)} callback
**/
function deserialize(xml, descriptor, theOptions, cb) {
    var options =
    {
        removeEnvelope : true,
        removeAttributes : false
    };


    if (theOptions) {
        for (var opt in theOptions) {
            options[opt] = theOptions[opt];
        }
    }

    var parser = new xml2js.Parser(jsonOptions);
    parser.parseString(xml, function(err, json)  {
        if (!err) {
            var fault = soaputils.findFault(json);
            if (fault) {
                var error = new Error("SOAP fault");
                error.fault = fault;
                cb(error, json);
                return;
            }
            if (options.soapEncoded) {
                json = decode(json);
            }
            if (options.removeEnvelope) {
                var tmp = soaputils.findChild(json, ['Envelope', 'Body']);
                if (tmp) {
                    json = tmp;
                }

            }
            if (options.skipLevels) {
                json = skipLevels(json, options.skipLevels);
            }
            if (options.removeAttributes) {
                removeAttrs(json);
            }
            if (descriptor) {
                json = processResponse(descriptor, json);
            }
        }
        cb(err, json);
    });
}

function skipLevels(json, levels) {
    if (json) {
        for (var i = 0; i < levels; i++) {
            soaputils.iterateChildren(json, function(child) {
                json = child;
            });
        }
    }

    return json;
}

function removeAttrs(obj, removeNs) {
    if (Array.isArray(obj)) {
        for (var i = 0; i < obj.length; i++) {
            removeAttrs(obj[i]);
        }
    }
    else {
        delete obj['@'];
        if (removeNs) {
            delete obj['@ns'];
        }
        soaputils.iterateChildren(obj, function(child) {
            removeAttrs(child, removeNs);
        });
    }
}

function decode(json) {
    var elmsWithIds = new Object();
    addIfId(elmsWithIds, json);
    fixUpRefs(elmsWithIds, json);
    return json;
}

function fixUpRefs(map, elm, parent, name, index) {
    if (elm['@'] && elm['@']['@done']) {
        return;
    }
    if (elm['@'] && elm['@'].href) {
        var mappedElm = map[elm['@'].href.value];
        mappedElm['@ns'] = elm['@ns'];
        if (typeof(index) !== 'undefined') {
            parent[name][index] = mappedElm;
        }
        else {
            parent[name] = mappedElm;
        }
        elm = mappedElm;
    }
    if (!elm['@']) {
        elm['@'] = new Object();
    }
    elm['@']['@done'] = true;
    soaputils.iterateChildren(elm, function(child, childName, childIndex) {
        fixUpRefs(map, child, elm, childName, childIndex);
    });
}

function addIfId(map, elm, parent, name) {
    if (elm['@'] && elm['@'].id) {
        map['#' + elm['@'].id.value] = elm;
        if (parent) {
            delete parent[name];
        }
    }
    else {
        soaputils.iterateChildren(elm, function(child, name) {
            addIfId(map, child, elm, name);
        });
    }
}

function processResponse(desc, response) {
    var result = {};

    if (desc.isRpc) {
        response = skipLevels(response, 1);
    }

    if (!desc.hash) {
        makePartsHash(desc);
    }

    var singlePartResponse = desc.parts.length == 1;

    for (var childName in response) {
        if (soaputils.isElement(childName)) {
            var child = response[childName];
            var ns = Array.isArray(child) ? child[0]['@ns'] : child['@ns'];
            var part = desc.hash[soaputils.makeQnameFromXml(ns)];
            if (part) {
                processType(result, childName, child, part.jsonType, part.type, desc.isEncoded, part.isArray);
            }
        }
    }

    if (singlePartResponse) {
        result = skipLevels(result, 1);
    }

    return result;
}

function processType(parent, name, source, jsonType, xmlType, isEncoded, isArray) {
    if (jsonType) {
        if (isArray) {
            var value = [];
            if (isEncoded) {
                for (var itemName in source) {
                    if (soaputils.isElement(itemName)) {
                        emutils.toArray(source[itemName]).forEach(function(row) {
                            value.push(processJsonType(jsonType, row['#']));
                        });
                    }
                }
            }
            else { // not encoded
                var arr = emutils.toArray(source);
                arr.forEach(function(row) {
                    value.push(processJsonType(jsonType, row['#']));
                });
            }
            parent[name] = value;
        }
        else { // not an array
            parent[name] = processJsonType(jsonType, source['#']);
        }
    }
    else { // not a simple type
        if (!xmlType.hash) {
            makeTypeHash(xmlType);
        }
        if (isArray) {
            var value = [];
            if (isEncoded) {
                for (var rowName in source) {
                    if (soaputils.isElement(rowName))
                    {
                        emutils.toArray(source[rowName]).forEach(function(row) {
                            value.push(processObject(row, xmlType, true));
                        });
                    }
                }
            }
            else { // not encoded
                var arr = emutils.toArray(source);
                arr.forEach(function(row) {
                    value.push(processObject(row, xmlType, true));
                });
            }
            parent[name] = value;
        }
        else { // not array
            parent[name] = processObject(source, xmlType, isEncoded);
        }
    }
}

function processObject(source, type, isEncoded) {
    var result = {};
    for (var childName in source) {
        if (soaputils.isElement(childName)) {
            var child = source[childName];
            var ns = Array.isArray(child) ? child[0]['@ns'] : child['@ns'];
            var desc = type.hash[soaputils.makeQnameFromXml(ns)];
            if (desc) {
                var isArray = desc.isArray || desc.maxOccurs < 0 || desc.maxOccurs > 1;
                if (desc && !desc.isAttr) {
                    processType(result, desc.name, child, desc.jsonType, desc.type, isEncoded, isArray);
                }
            }
        }
    }
    var attrs = source['@'];
    if (attrs) {
        for (var attrName in attrs) {
            var attr = attrs[attrName];
            switch(attr.uri)  {
                case namespaces.XMLNS:
                case namespaces.XSI_NS:
                case namespaces.SOAPENC_NS:
                    break;

                default:
                    var desc = type.hash[soaputils.makeQnameFromXml(attr)];
                    if (desc && desc.isAttr) {
                        processType(result, desc.name, result, desc.jsonType, null, isEncoded, false);
                    }
            }
        }
    }

    return result;
}

function makeTypeHash(type) {
    type.hash = {};
    addToHash(type, type.hash);
}

function makePartsHash(desc) {
    desc.hash = {};
    desc.parts.forEach(function(part) {
        if (part.elementName) {
            desc.hash[soaputils.makeQname(part.elementNs, part.elementName)] = part;
        }
        else {
            desc.hash[part.name] = part;
        }
    });
}

function addToHash(type, hash) {
    if (type.baseType) {
        addToHash(type.baseType, hash);
    }
    type.content.forEach(function(item) {
        hash[soaputils.makeQname(item.ns, item.name)] = item;
    });
}

function processJsonType(type, value) {
    var object;
    if (!emutils.hasValue(value)) {
        return undefined;
    }
    switch(type) {
        default:
        case 'string':
            object = value;
            break;

        case 'number':
            object = new Number(value);
            break;

        case 'boolean':
            object = (value == "true");
            break;

        case 'date':
            object = new Date(value).getTime();
    }

    return object;
}


/**
 The describes how to process an XML document before starting deserialization
 @class DeserializationOptions
 **/

/**
 If this is true,remove the SOAP envelope and body tags before processing
 @property removeEnvelope
 @type Boolean
 **/

/**
 If this is true, assume the document is SOAP encoded
 @property soapEncoded
 @type Boolean
 **/

/**
 If this is positive, remove this many levels of outermost element tags
 before processing.  This will take place after removal of the soap envelope
 if both are specified.
 @property skipLevels
 @type Number
 **/

/**
 If this is true, remove all attributes from the document before processing it
 @property removeAttributes
 @type Boolean
 **/





"use strict";

var em_utils = require('emutils')

exports.findChild = findChild;
exports.makeQname = makeQname;
exports.makeQnameFromXml = makeQnameFromXml;
exports.findFault = findFault;
exports.compressTree = compressTree;
exports.iterateChildren = iterateChildren;
exports.isElement = isElement;
exports.getFirstChild = getFirstChild;
exports.matches = matches;

/**
 SOAP-processing utilities

 @module emsoap
 @submodule soaputils
 **/

/**
 @class soaputils
 **/

/**
 Find the child (element or attribute) with the specified local name
 @method readJsonFromHttp
 @static
 @param {Object} json parent object
 @param {String or Array} childLocal local name (or array of local names, to do a multi-level search)
 @return {Object} the child
 **/
function findChild(json, childLocal) {
    var tmp = json;
    if (Array.isArray(childLocal)) {
        for (var i = 0; i < childLocal.length; i++) {
            tmp = findTheChild(tmp, childLocal[i]);
            if (!tmp) {
                return null;
            }
        }
        return tmp;
    }
    else {
        return findTheChild(json, childLocal);
    }
}

function findTheChild(json, childLocal) {
    for (var childName in json) {
        if (isElement(childName)) {
            var child = json[childName];
            if (Array.isArray(child)) {
                child = child[0];
            }
            if (child['@ns'].local == childLocal) {
                return child;
            }
        }
    }
    return null;
}


/**
 Make an XML qualified name using {ns}local syntax
 @method makeQname
 @static
 @param {String} uri namespace
 @param {String} local local name
 @return {String} the qualified name
**/
function makeQname(uri, local) {
    return (uri ? "{" + uri + "}" : "") + local;
}

/**
 Make an XML qualified name using {ns}local syntax
 @method makeQnameFromXml
 @static
 @param {Object} elmOrAttr an XML element or attribute
 @return {String} the qualified name
**/
function makeQnameFromXml(elmOrAttr) {
    return makeQname(elmOrAttr.uri, elmOrAttr.local);
}

/**
 If this is a SOAP fault, return the fault element
 @method findFault
 @static
 @param {Object} response the SOAP response to search
 @return {Object} the fault element, compressed
**/
function findFault(response) {

    var faultNode = findChild(response, ['Envelope', 'Body', 'Fault']);
    if (!faultNode) {
        return null;
    }

    compressTree(faultNode);
    return faultNode;
}


/**
 Throughout an XML tree, modify each leaf element to be a String containing its textual value
 @method compressTree
 @static
 @param {Object} node the tree to compress
 **/
function compressTree(node) {
    delete node['@'];
    delete node['@ns'];
    iterateChildren(node, function(child, childName, index) {
        if (typeof(child['#']) !== 'undefined') {
            if (typeof(index) !== 'undefined') {
                node[childName][index] = child['#'];
            }
            else {
                node[childName] = child['#'];
            }
        }
        else {
            compressTree(child);
        }
    });
}

/**
 Given a parent element, call a function on each of its child elements
 @method iterateChildren
 @static
 @param {Object} elm the parent element
 @param {Function(Object, String)} cb the callback
 **/
function iterateChildren(elm, cb) {
    for (var childName in elm) {
        if (isElement(childName)) {
            var child = elm[childName];
            if (Array.isArray(child)) {
                for (var i = 0; i < child.length; i++) {
                    cb(child[i], childName, i);
                }
            }
            else {
                cb(child, childName);
            }
        }
    }
}


/**
 Check whether a field in an element represents a child element
 @method isElement
 @static
 @param {String} field the field name
 @return {Boolean} true if it's an element
 **/
function isElement(field) {
    var first = field.substring(0, 1);
    switch (first)  {
        case '@':
        case '#':
            return false;

        default :
            return true;
    }
}


/**
 Return the first child of an element
 @method isElement
 @static
 @param {Object} parent parent element
 @return {Object} the first child element
 **/
function getFirstChild(parent) {
    for (var childName in parent) {
        if (isElement(childName)) {
            var child = parent[childName];
            if (Array.isArray(child)) {
                return child[0];
            }
            else {
                return child;
            }
        }
    }

    return null;
}

/**
 Check whether an ele,ent has the specified name
 @method matches
 @static
 @param {Object} elm element to check
 @param {String} uri namespace
 @param {String} local local name
 @return {Boolean} true if it matches
 **/
function matches(elm, uri, local) {
    var qname = elm['@ns'];
    if (!uri) {
        return !qname.uri  && qname.local == local;
    }
    else {
        return qname.uri == uri && qname.local == local;
    }
}

"use strict";

var em_utils = require('emutils')

exports.findChild = findChild;
exports.makeQname = makeQname;
exports.makeQnameFromXml = makeQnameFromXml;
exports.findFault = findFault;
exports.compressTree = compressTree;
exports.iterateChildren = iterateChildren;
exports.isElement = isElement;
exports.addParentPointers = addParentPointers;

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


function makeQname(uri, local) {
    return (uri ? "{" + uri + "}" : "") + local;
}

function makeQnameFromXml(elmOrAttr) {
    return makeQname(elmOrAttr.uri, elmOrAttr.local);
}

function findFault(response) {

    var faultNode = findChild(response, ['Envelope', 'Body', 'Fault']);
    if (!faultNode) {
        return null;
    }

    compressTree(faultNode);
    return faultNode;
}

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

function addParentPointers(json) {
    switch(em_utils.type(json)) {
        case 'object':
            for (var childName in json) {
                if (isElement(childName)) {
                    var child = json[childName];
                    child['@parent'] = json;
                    addParentPointers(child);
                }
            }
            break;

        case "array":
            for (var i = 0; i < json.length; i++) {
                var row = json[i];
                if (row) {
                    row['@parent'] = json;
                    row['@index'] = i;
                    addParentPointers(row);
                }
            }
            break;
    }
}

"use strict";

var emutils = require("emutils");
var soaputils = require("../lib/soaputils");

exports.areEqual = areEqual;
exports.makeTypePointers = makeTypePointers;

function areEqual(x, y) {
    var comparisons = 0;
    var maxComparisons = 1000; // no-frills loop detection

    return compare(x, y);

    function compare(p, q) {
        if (comparisons++ > maxComparisons) {
            return false; // In a loop of some kind.  Give up
        }

        if (p === q) {
            return true;
        }
        var typeP = emutils.type(p);
        var typeQ = emutils.type(q);
        if (typeP != typeQ) {
            return false;
        }

        switch(typeP) {
            case "number":
            case "boolean":
            case "string":
                return p.valueOf() === q.valueOf();

            case "regexp":
                return p.toString() === q.toString();

            case "date":
                return p.getTime() === q.getTime();

            case "array":
                if (p.length != q.length) {
                    return false;
                }
                for (var i = 0; i < p.length; i++) {
                    if (!compare(p[i], q[i])) {
                        return false;
                    }
                }
                return true;

            case "object":
                var checked = {};
                for (var field in p) {
                    if (!compare(p[field], q[field])) {
                        return false;
                    }
                    checked[field] = true;
                }
                for (var field in q) {
                    if (!checked[field]) {
                        return false;
                    }
                }
                return true;

            default:
                return false;
        }
    }
}

function makeTypePointers(descs) {

    for (var typeName in descs.types) {
        var type = descs.types[typeName];
        if (type.baseTypeName) {
            type.baseType = descs.types[soaputils.makeQname(type.baseTypeNs, type.baseTypeName)];
        }
    }

    for (var opName in descs.operations) {
        var op = descs.operations[opName];
        if (op.requestDesc && op.requestDesc.parts) {
            op.requestDesc.parts.forEach(function(part) {
                if (part.xmlType) {
                    part.type = descs.types[soaputils.makeQname(part.xmlTypeNs, part.xmlType)];
                }
            });
        }
        if (op.responseDesc && op.responseDesc.parts) {
            op.responseDesc.parts.forEach(function(part) {
                if (part.xmlType) {
                    part.type = descs.types[soaputils.makeQname(part.xmlTypeNs, part.xmlType)];
                }
            });
        }
    }

    for (var typeName in descs.types) {
        var type = descs.types[typeName];
        type.content.forEach(function(item) {
            if (item.xmlType) {
                item.type = descs.types[soaputils.makeQname(item.xmlTypeNs, item.xmlType)];
            }
        });
    }

}


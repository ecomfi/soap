"use strict";

var fs = require('fs');
var path = require('path');
var url = require('url');
var xml2js = require('emxml2js');

var httpRequest = require('./httpRequest');
var namespaces = require('./namespaces');
var soaputils = require('./soaputils');
var xmldoc = require('./xmldoc');


/**
 WSDL Collection

 @module emsoap
 @submodule wsdlCollection
 **/

/**
 a WSDL collection is an XML document that contains a top-level WSDL and the transitive closure of all of the WSDLs
 and XML Schemas it imports, kindexed by their URL.

 @class wsdlCollection
 **/

exports.makeWsdlCollection = makeWsdlCollection;

var FAILURE_BODY = "failure";

/**
 create a WSDL collection
 @method makeWsdlCollection
 @static
 @param {String} filename file the WSDL collection is written to
 @param {String} wsdlUrl the filename or URL of the top-level WSDL
 @param {String} username credential used for reading URLs and schemas
 @param {String} password  credential used for reading URLs and schemas
 @param {Function(Error)} cb called back when the collection has been created (or an error has occurred)
 **/
function makeWsdlCollection(filename, wsdlUrl, username, password, cb) {
    var collection = {};
    var urls = [{url: wsdlUrl}];

    checkForUrls();

    function processUrl(theUrl, isFailureOK) {
        readCollectionEntry(theUrl, username, password, function(err, location, body) {
            if (err) {
                return processError(err, theUrl, isFailureOK);
            }
            var parser = new xml2js.Parser(
                {
                    normalize: false,
                    trimming: false,
                    explicitRoot: true,
                    xmlns: true,
                    attrkey: "@",
                    charkey: "#",
                    explicitArray: false
                }
            );
            parser.parseString(body, function (err, root) {
                if (err) {
                    return processError(err, theUrl, isFailureOK);
                }
                var top = soaputils.getFirstChild(root);
                if (soaputils.matches(top, namespaces.WSDL_NS, "definitions")) {
                    collection[theUrl] = body;
                    soaputils.iterateChildren(top, function(child) {
                        if (soaputils.matches(child, namespaces.WSDL_NS, "import")) {
                            var loc = child['@'].location;
                            if (loc != null && !collection[loc]) {
                                urls.push({url : resolve(theUrl, loc)});
                            }
                        }
                        else if (soaputils.matches(child, namespaces.WSDL_NS, "types")) {
                            soaputils.iterateChildren(child, function(childOfType) {
                                if (soaputils.matches(childOfType, namespaces.XSD_NS, "schema")) {
                                    processSchemaElement(childOfType);
                                }
                            });
                        }
                    });
                }
                else if (soaputils.matches(top, namespaces.XSD_NS, "schema")) {
                    collection[theUrl] = body;
                    processSchemaElement(top);
                }
                else {
                    return processError(new Error(theUrl + " is neither a WSDL nor an XML schema."), theUrl, isFailureOK);
                }
                checkForUrls();
            });
        })
    }


    function processSchemaElement(schema, theUrl) {
        soaputils.iterateChildren(schema, function (childOfSchema) {
            if (soaputils.matches(childOfSchema, namespaces.XSD_NS, "import")) {
                var loc = childOfSchema['@'].schemaLocation;
                if (loc != null) {
                    if (!collection[loc.value]) {
                        urls.push({url:resolve(theUrl, loc.value)});
                    }
                }
                else {
                    var ns = childOfSchema['@'].namespace;
                    if (ns && !collection[ns.value]) {
                        urls.push({url:ns.value, isFailureOK:true});
                    }
                }
            }
        });
    }

    function processError(err, theUrl, isFailureOK) {
        if(isFailureOK) {
            collection[theUrl] = FAILURE_BODY;
            return checkForUrls();
        }
        else {
            return cb(err);
        }
    }

    function checkForUrls() {
        if (urls.length > 0) {
            var urlDesc = urls.pop();
            processUrl(urlDesc.url, urlDesc.isFailureOK);
        }
        else {
            try {
                makeCollectionFile(filename, collection);
            }
            catch (err) {
                return cb(err);
            }
            cb();
        }
    }
}

function resolve(base, modifier) {
    if (isUrl(modifier)) {
        return modifier;
    }
    else if (isUrl(base)) {
        return url.resolve(base, modifier);
    }
    else {
        if (!fs.statSync(base).isDirectory()) {
            base += path.sep + "..";
        }
        return path.resolve(base, modifier);
    }
}

function readCollectionEntry(wsdlUrl, username, password, cb) {
    if (isUrl(wsdlUrl)) {
        var options = httpRequest.parseUrl(wsdlUrl);
        options.method = "GET";
        if (username) {
            options.auth = username + ":" + password;
        }

        httpRequest.httpRequest(options, null, function(err, response) {
            var location = response.requestOptions ? httpRequest.makeUrl(response.requestOptions) : wsdlUrl;
            if (!err && httpRequest.isErrorStatus(response.status)) {
                err = new Error("HTTP Error " + response.status + " reading " + location);
            }
            cb(err, location, response.body);
        });
    }
    else {
        fs.readFile(wsdlUrl, null, function (err, data) {
            cb(err, wsdlUrl, data ? data.toString(): null);
        });
    }
}


function isUrl(string) {
    try {
        var parsed = url.parse(string);
        return parsed.protocol != null;
    }
    catch (err) {
        return false;
    }
}

function makeCollectionFile(filename, collection) {
    var result = [];

    result.push("<collection>")
    for (var name in collection) {
        if (collection[name] === FAILURE_BODY) {
            continue;
        }
        result.push("<entry>");
        result.push("<url>" + makeCDATA(name) + "</url>");
        result.push("<data>" + makeCDATA(collection[name]) + "</data>");
        result.push("</entry>");
    }
    result.push("</collection>");
    fs.writeFileSync(filename, result.join("\n"));
}


function makeCDATA(string) {
    var cdataHeader = "<![CDATA[";
    var cdataTrailer = "]]>";
    var result = [cdataHeader];
    var toEscape = string;
    while (true) {
        var term = toEscape.indexOf(cdataTrailer);
        if (term < 0) {
            result.push(toEscape);
            break;
        }
        result.push(toEscape.substring(0, term+1));
        result.push(cdataTrailer);
        result.push(cdataHeader);
        toEscape = toEscape.substring(term+1);
    }
    result.push(cdataTrailer);
    return result.join("");
}


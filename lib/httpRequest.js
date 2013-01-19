"use strict"

var xml2js = require('emxml2js');
var util = require('util');
var zlib = require('zlib');
var emutils = require('emutils');
var request = require('request');

exports.readJsonFromHttp = readJsonFromHttp;
exports.httpRequest = httpRequest;
exports.concatenateBuffers = concatenateBuffers;
exports.parseUrl = parseUrl;
exports.makeUrl = makeUrl;
exports.isErrorStatus = isErrorStatus;


/**
 HTTP client

 @module emsoap
 @submodule httpRequest
 **/

/**
 HTTP client
 @class httpRequest
 **/

/**
 Issue an HTTP[S] request and covert the response from XML to a JavaScript object
 @method readJsonFromHttp
 @static
 @param {HttpOptions} options options for HTTP[S] request
 @param {String} requestData request data
 @param {XMLOptions} jsonOptions XML parser options
 @param {Function(error, response)} cb callback
 **/
function readJsonFromHttp(options, requestData, jsonOptions, cb)
{
    httpRequest(options, requestData, function(error, result) {
        if (error)
        {
            cb(error, null);
            return;
        }
        var parser = new xml2js.Parser(jsonOptions);
        parser.parseString(result.body, function(err, json)
        {
            if (result.status < 200 || result.status >= 400)
            {
                error = new Error('Error contacting service. HTTP status: ' + result.status);
                error.httpStatusCode = result.status;
            }
            else if (err)
            {
                error = err;
            }
            cb(error, json);
        });
    });
}

/**
 Issue an HTTP[S] request
 @method httpRequest
 @static
 @param {HttpOptions} options options for HTTP[S] request
 @param {String} requestData request data
 @param {Function(error, response)} cb callback
 **/
function httpRequest(options, requestData, cb)
{
    var httpOptions = emutils.clone(options);
    httpOptions.encoding = null;
    httpOptions.body = requestData;
    if (emutils.type(requestData) == 'string') {
        requestData = new Buffer(requestData);
    }

    var req = request(makeUrl(httpOptions), httpOptions, function (err, res, body) {
        var retval = {};
        var error = err;

        if (!res) {
            var httpErr = new Error("Unable to contact service: " + err.message);
            httpErr.httpStatusCode = 404;
            cb(httpErr);
            return;
        }
        retval.status = res.statusCode;
        retval.statusCode = res.statusCode; // for backward compatibility
        retval.headers = res.headers;
        retval.requestOptions = emutils.clone(options);
        var gzip = res.headers['content-encoding'] == "gzip";
        var charset = "utf8";
        var type = res.headers["content-type"];
        if (type) {
            var offset = type.indexOf("charset=");
            if (offset >= 0) {
                charset = type.substring(offset + 8, type.length);
            }

            if(type.indexOf("charset=") === -1
                && type.indexOf("xml") === -1
                && type.indexOf("text") === -1
                && type.indexOf("json") === -1
                ) {
                charset = null; // use this when we think it is binary
            } else {
                // restrict to the set node.js knows about
                switch(charset) {
                    case "utf8":
                    case "utf-8":
                    case "hex":
                    case "binary":
                    case "base64":
                    case "ucs2":
                    case "ucs-2":
                        break;

                    case "utf16":
                    case "utf-16":
                        charset = "ucs2";
                        break;

                    default:
                        charset="ascii";
                        break;
                }
            }
        }
        if (gzip) {
            zlib.gunzip(body, function(err, result) {
                if (err)
                {
                    error = err;
                }
                else
                {
                    if(charset) {
                        retval.body = result.toString(charset);
                    } else {
                        retval.body = result;
                    }
                }
                cb(error, retval);
            });
        }
        else
        {
            if(charset) {
                retval.body = body.toString(charset);
            } else {
                retval.body = body;
            }
            cb(error, retval);
        }

    });
}

/**
 Concatenate an array of node.js Buffer objects into one big buffer
 @method concatenateBuffers
 @static
 @param {Array} buffers array of Buffers
 @return {Buffer} concatenated buffer
 **/
function concatenateBuffers(buffers) {
    // Handle simple cases simply
    if (buffers.length == 0)
    {
        return new Buffer(0);
    }
    else if (buffers.length == 1)
    {
        return buffers[0];
    }

    var total = 0;
    for (var i = 0; i < buffers.length; i++)
    {
        total += buffers[i].length;
    }
    var big = new Buffer(total);

    var offset = 0;
    for (var i = 0; i < buffers.length; i++)
    {
        buffers[i].copy(big, offset);
        offset += buffers[i].length;
    }
    return big;
}

var HTTP_PREFIX = "^http://";
var HTTPS_PREFIX = "^https://";


/**
 Parse a URL string into an HttpOptions object
 @method parseUrl
 @static
 @param {String} url
 @return {HttpOptions} parsed URL
 **/
function parseUrl(url) {
    var result = {};
    if (url.match(HTTP_PREFIX)) {
        result.isHttps = false;
        var host = url.substring(HTTP_PREFIX.length - 1);
    }
    else if (url.match(HTTPS_PREFIX)) {
        result.isHttps = true;
        var host = url.substring(HTTPS_PREFIX.length - 1);
    }
    else {
        return null;
    }
    var slash = host.indexOf('/');
    if (slash >= 0) {
        result.path = host.substring(slash);
        host = host.substring(0, slash);
    }
    var colon = host.indexOf(':');
    if (colon >= 0) {
        result.port = host.substring(colon + 1);
        host = host.substring(0, colon);
    }
    result.host = host;
    return result;
}


/**
 Create an URL from parts specified in an HttpOptions object
 @method makeUrl
 @static
 @param {HttpOptions} options http options object containing hostname, port, path, etc.
 @return {String} URL
 **/
function makeUrl(options) {
    return (options.isHttps ? "https" : "http") + "://" +
        (options.host ? options.host : options.hostname) +
        (options.port ? ":" + options.port : "") +
        options.path;
}

/**
 Determine whether an HTTP status represents an error
 @method isErrorStatus
 @static
 @param {Number} status HTTP status
 @return {Boolean} true if it's an error status
 **/
function isErrorStatus(status)  {
    return status >= 400;
}

/**
 Options for making HTTP[s] client requests.  This is an extension of the options defined for the node.js
 http and https modules
 @class HttpOptions
 **/

/**
 Specifies whether to use http or https.
 @property isHttps
 @type Boolean
 **/

/**
 Specifies a timeout for the request (in milliseconds)
 @property timeout
 @type Number
 **/

/**
 Specifies the maximum number of outgoing sockets to use for requests to this host/port combination
 @property maxSockets
 @type Number
 **/


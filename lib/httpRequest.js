"use strict"

var xml2js = require('emxml2js');
var https = require('https');
var http = require('http');
var util = require('util');
var zlib = require('zlib');
var em_utils = require('emutils');

exports.readJsonFromHttp = readJsonFromHttp;
exports.httpRequest = httpRequest;
exports.concatenateBuffers = concatenateBuffers;
exports.parseUrl = parseUrl;
exports.isErrorStatus = isErrorStatus;

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

function httpRequest(options, requestData, cb)
{
	var buffers = new Array();
	var retval = new Object();
	var protocol = options.isHttps ? https : http;
	var error;
	//console.dir(options);
	var req = protocol.request(em_utils.clone(options), function(res) {
		res.on('data', function(d) {
            if (!res.domain) {
                res.domain = req.domain;
            }
			buffers.push(d);
		});
		res.on('end', function() {

			retval.status = res.statusCode;
            if (retval.status >= 300 && retval.status <= 399)  {
                var redirectCount =  options.redirects ? options.redirects + 1 : 1;
                if (options.redirects > 5) {
                    cb(new Error("Too many HTTP redirects"));
                }
                options = em_utils.merge(parseUrl(res.headers.location), em_utils.clone(options), true);
                //options.redirects = redirectCount;
                httpRequest(options, requestData, cb);
                return;
            }

			var gzip = res.headers['content-encoding'] == "gzip";
			var charset = "utf8";
			var type = res.headers["content-type"];
			if (type)
			{
				var offset = type.indexOf("charset=");
				if (offset >= 0)
				{
					charset = type.substring(offset + 8, type.length);
				}
			}
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

			var big = concatenateBuffers(buffers);
			if (gzip)
			{
				zlib.gunzip(big, function(err, result) {
					if (err)
					{
						error = err;
					}
					else
					{
						retval.body = result.toString(charset);
					}
					cb(error, retval);
				});
			}
			else
			{
				retval.body = big.toString(charset);
				cb(error, retval);
			}
		});
	});
    req.on('error', function(e) {
        var httpErr = new Error("Unable to contact service: " + e.message);
        httpErr.httpStatusCode = 404;
        cb(httpErr);
    });
    if (options.timeout) {
        req.setTimeout(options.timeout, function() {
            req.abort();
        });
    }
    if (requestData) {
        req.write(requestData);
    }
	req.end();
}


function concatenateBuffers(buffers) {
	// Handle simple cases simply
	if (buffers.length == 0)
	{
		return new Buffer(1);
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

function isErrorStatus(status)  {
    return status >= 400;
}


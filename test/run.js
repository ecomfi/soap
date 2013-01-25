"use strict"

var emutils = require('emutils');

// Run all unit tests
var scripts =
    [
        "testNamespace.js",
        "testXml.js",
        "testDeserializer.js",
        "testSerializer.js",
        "testHttpRequest.js"
    ];

emutils.runTests(__dirname, scripts, true);

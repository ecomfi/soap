"use strict"

var emutils = require('emutils');

// Run all unit tests
var scripts =
    [
        "testNamespace.js",
        "testXml.js"
    ];

emutils.runTests(__dirname, scripts, true);
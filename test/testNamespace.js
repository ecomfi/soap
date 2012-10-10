"use strict"

var namespaces = require('../lib/namespaces');
var assert = require('assert');

var ns = new namespaces.Namespaces();
ns.addNs("foo");
ns.addNs("foo");
ns.addNs("foo1");
assert.equal(ns.getNs("pfx1"), "foo");
assert.equal(ns.getNs("xsd"), namespaces.XSD_NS);
assert.ifError(ns.getPrefix("foo2"));
assert.equal(ns.getPrefix(namespaces.SOAPENC_NS), 'soapenc');


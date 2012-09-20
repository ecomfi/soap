"use strict";

var namespaces = require('./namespaces');

exports.init = init;

var textNeedsEscaping =  new RegExp('[<&>]');
var attrNeedsEscaping =  new RegExp('[<&>]"');

function init() {

    var doc = new Object();
    doc.ns = namespaces.init();

    // methods
    doc.createElement = createElement;
    doc.createLeafElement = createLeafElement;
    doc.addAttr = addAttrToCurrent;
    doc.addTypeAttr = addTypeAttrToCurrent;
    doc.endElement = endElement;
    doc.serialize = serializeDoc;
    doc.finish = finishDoc;
    return doc;
}

function addAttrToCurrent(name, value, nsuri) {
    this.current.addAttr(name, value, nsuri);
}

function addAttr(name, value, nsuri) {
    var attr = new Object();
    attr.local = name;
    attr.value = value;
    if (nsuri) {
        attr.pfx = this.owner.ns.addNs(nsuri);
    }
    this.attrs.push(attr);
}

function addTypeAttrToCurrent(name, nsuri) {
    this.current.addTypeAttr(name, nsuri);
}

function addTypeAttr(type, typeuri) {
    type = type ? type : "string";
    typeuri = typeuri ? typeuri : namespaces.XSD_NS;
    var qtype = this.owner.ns.addNs(typeuri) + ':' + type;
    this.addAttr('type', qtype, namespaces.XSI_NS);
}

function addText(text) {
    var child = new Object();
    child.text = text;
    this.children.push(child);
}

function createElement(name, nsuri) {
    var elm = newElement(this, name, nsuri);

    if (this.current) {
        elm.parent = this.current;
        this.current.hasElementChildren = true;
        this.current.children.push(elm);
    }
    else {
        this.top = elm;
    }
    this.current = elm;

    return elm;
}

function createChildElement(name, nsuri) {
    var elm = newElement(this.owner, name, nsuri);
    elm.parent = this;
    this.hasElementChildren = true;
    this.children.push(elm);
    return elm;
}

function newElement(doc, name, nsuri) {
    var elm = new Object();
    elm.attrs = new Array();
    elm.children = new Array();
    elm.local = name;
    elm.owner = doc;
    if (nsuri)  {
        elm.pfx = doc.ns.addNs(nsuri);
    }

    // methods
    elm.addText = addText;
    elm.addAttr = addAttr;
    elm.addTypeAttr = addTypeAttr;
    elm.createChildElement = createChildElement;

    return elm;
}

function createLeafElement(name, nsuri, value, type, typeuri) {
    var elm = this.createElement(name, nsuri);
    if (type) {
        elm.addTypeAttr(type, typeuri);
    }
    elm.addText(value);
    this.endElement();
    return elm;
}

function endElement() {
    this.current = this.current.parent;
}

function serializeDoc() {
    var strings = new Array();
    serializeElm(this.top, strings);
    return strings.join("\n");
}

function finishDoc() {
    while(this.current != this.top) {
        this.endElement();
    }
}

function serializeAttr(attr, elmStrings) {
    var nameStr = attr.pfx ? attr.pfx + ':' + attr.local : attr.local;
    elmStrings.push(nameStr + '="' + escapeAttr(attr.value) + '" ');
}

function serializeNs(pfx, ns, elmStrings) {
    var nsDef = pfx == "" ? 'xmlns="' + escapeAttr(ns) + '" ' : 'xmlns:' + pfx + '="' + escapeAttr(ns) + '" ';
    elmStrings.push(nsDef);
}
function serializeElm(elm, strings) {
    var elmStrings = new Array();
    var nameStr = elm.pfx ? elm.pfx + ':' + elm.local : elm.local;
    elmStrings.push('<' + nameStr + " ");
    for (var i = 0; i < elm.attrs.length; i++) {
        serializeAttr(elm.attrs[i], elmStrings);
    }
    if (elm == elm.owner.top) {
        var nss = elm.owner.ns.getNamespaces();
        for (var i = 0; i < nss.length; i++) {
            for (var pfx in nss[i]) {
                serializeNs(pfx, nss[i][pfx], elmStrings);
            }
        }
    }

    elmStrings.push('>');
    if (elm.hasElementChildren) {
        strings.push(elmStrings.join(''));
        for (var i = 0; i < elm.children.length; i++) {
            serializeElm(elm.children[i], strings);
        }
        strings.push('</' + nameStr + '>');
    }
    else {
        for (var i = 0; i < elm.children.length; i++) {
            elmStrings.push(escapeText(elm.children[i].text));
        }
        elmStrings.push('</' + nameStr + '>');
        strings.push(elmStrings.join(''));
    }
}

function escapeText(str) {
    if (!textNeedsEscaping.test(str)) {
        return str;
    }

    var strings = new Array();
    strings.push('<![CDATA[');
    var rest = str;
    while (true) {
        var index = rest.indexOf(']]>');
        if (index < 0) {
            strings.push(rest);
            strings.push(']]>');
            return strings.join('');
        }
        else {
            strings.push(rest.slice(0, index + 1));
            strings.push(']]><![CDATA[');
            rest = rest.slice(index + 1);
        }
    }
    return strings.join('');
}

function escapeAttr(str) {
    if (!attrNeedsEscaping.test(str)) {
        return str;
    }

    var strings = new Array();
    for (var i = 0; i <str.length; i++) {
        var c = str.charAt(i);
        switch(c)
        {
            case '<':
                strings.push('&lt;');
                break;

            case '&':
                strings.push('&amp;');
                break;

            case '>':
                strings.push('&gt;');
                break;

            default:
                strings.push(c);
        }
    }

    return strings.join('');
}

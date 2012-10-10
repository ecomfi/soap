"use strict";

var namespaces = require('./namespaces');

exports.Document = Document;

var textNeedsEscaping =  new RegExp('[<&>]');
var attrNeedsEscaping =  new RegExp('[<&>]"');


/**
 A lightweight XML DOM

 @module emsoap
 @submodule xmldoc
 **/

/**
 An XML Document
 @class Document
 **/

/**
 @constructor
 **/
function Document() {
    this.ns = new namespaces.Namespaces();
}

Document.prototype.addAttr = addAttrToCurrent;
Document.prototype.addTypeAttr = addTypeAttrToCurrent;
Document.prototype.createElement = createElement;
Document.prototype.createLeafElement = createLeafElement;
Document.prototype.endElement = endElement;
Document.prototype.serialize = serializeDoc;
Document.prototype.finish = finishDoc;

/**
 Add an attribute to the current element
 @method addAttr
 @param {String} name attribute name
 @param {String} value attribute value
 @param {String} [nsuri] attribute namespace
 **/
function addAttrToCurrent(name, value, nsuri) {
    this.current.addAttr(name, value, nsuri);
}

/**
 Add an xsi:type attribute to the current element
 @method addTypeAttr
 @param {String} name type name
 @param {String} [nsuri=XSD_NS] type namespace
 **/
function addTypeAttrToCurrent(name, nsuri) {
    this.current.addTypeAttr(name, nsuri);
}

/**
 Create an element.  If this isn't the first element created in the document, it will be made a child of the
 current element
 @method createElement
 @param {String} name element name
 @param {String} [nsuri] element namespace
 @return {Element} the created element
 **/
function createElement(name, nsuri) {
    var elm = new Element(this, name, nsuri);

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

/**
 Create a leaf element, that is, one whose only child is a text nodes.  Optionally, give it an xsi:type attribute
 @method createLeafElement
 @param {String} name element name
 @param {String} nsuri element namespace (may be null)
 @param {String} [type] type name
 @param {String} [typeuri=XSD_NS] type namespace
 @return {Element} the created element
 **/
function createLeafElement(name, nsuri, value, type, typeuri) {
    var elm = this.createElement(name, nsuri);
    if (type) {
        elm.addTypeAttr(type, typeuri);
    }
    elm.addText(value);
    this.endElement();
    return elm;
}

/**
 Complete the current element.  Its parent (if any) becomes the current element.
 @method endElement
 **/
function endElement() {
    this.current = this.current.parent;
}

/**
 Serialize this document to a JavaScript object
 @method serialize
 @return (Object} the serialized document
 **/
function serializeDoc() {
    var strings = new Array();
    serializeElm(this.top, strings);
    return strings.join("\n");
}

/**
 Declare this document to be complete.
 @method finish
 **/
function finishDoc() {
    while(this.current != this.top) {
        this.endElement();
    }
}

/**
 An XML Element
 @class Element
 **/
function Element(doc, name, nsuri) {
    this.attrs = new Array();
    this.children = new Array();
    this.local = name;
    this.owner = doc;
    if (nsuri)  {
        this.pfx = doc.ns.addNs(nsuri);
    }
}

Element.prototype.addAttr = addAttr;
Element.prototype.addText = addText;
Element.prototype.addTypeAttr = addTypeAttr;
Element.prototype.createChildElement = createChildElement;

/**
 Add an attribute
 @method addAttr
 @param {String} name attribute name
 @param {String} value attribute value
 @param {String} [nsuri] attribute namespace
 **/
function addAttr(name, value, nsuri) {
    var attr = new Object();
    attr.local = name;
    attr.value = value;
    if (nsuri) {
        attr.pfx = this.owner.ns.addNs(nsuri);
    }
    this.attrs.push(attr);
}

/**
 Add a text child node
 @method addAttr
 @param {String} text text value
 **/
function addText(text) {
    var child = new Object();
    child.text = text;
    this.children.push(child);
}

/**
 Add an xsi:type attribute to the current element
 @method addTypeAttr
 @param {String} type type name
 @param {String} [typeuri=XSD_NS] type namespace
 **/
function addTypeAttr(type, typeuri) {
    type = type ? type : "string";
    typeuri = typeuri ? typeuri : namespaces.XSD_NS;
    var qtype = this.owner.ns.addNs(typeuri) + ':' + type;
    this.addAttr('type', qtype, namespaces.XSI_NS);
}

/**
 Create a child element.
 @method createChildElement
 @param {String} name element name
 @param {String} [nsuri] element namespace
 @return (Element} the created element
 **/
function createChildElement(name, nsuri) {
    var elm = new Element(this.owner, name, nsuri);
    elm.parent = this;
    this.hasElementChildren = true;
    this.children.push(elm);
    return elm;
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
        for (var pfx in nss) {
            serializeNs(pfx, nss[pfx], elmStrings);
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



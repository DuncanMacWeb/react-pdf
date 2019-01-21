import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import React, { Fragment } from 'react';
import warning from 'fbjs/lib/warning';
import _regeneratorRuntime from 'babel-runtime/regenerator';
import _Promise from 'babel-runtime/core-js/promise';
import _asyncToGenerator from 'babel-runtime/helpers/asyncToGenerator';
import BlobStream from 'blob-stream';
import ReactFiberReconciler from 'react-reconciler';
import emptyObject from 'fbjs/lib/emptyObject';
import _createClass from 'babel-runtime/helpers/createClass';
import PDFDocument, { PDFFont } from '@react-pdf/pdfkit';
import _getIterator from 'babel-runtime/core-js/get-iterator';
import _wrapPages from 'page-wrapping';
import _Object$keys from 'babel-runtime/core-js/object/keys';
import isUrl from 'is-url';
import fontkit from '@react-pdf/fontkit';
import fetch from 'isomorphic-fetch';
import _Array$from from 'babel-runtime/core-js/array/from';
import emojiRegex from 'emoji-regex';
import { Attachment, AttributedString, Container, LayoutEngine, Path, Rect } from '@react-pdf/textkit-core';
import scriptItemizer from '@react-pdf/script-itemizer';
import justificationEngine from '@textkit/justification-engine';
import textDecorationEngine from '@textkit/text-decoration-engine';
import english from 'hyphenation.en-us';
import Hypher from 'hypher';
import _typeof from 'babel-runtime/helpers/typeof';
import _JSON$stringify from 'babel-runtime/core-js/json/stringify';
import { isNode } from 'browser-or-node';
import PNG from '@react-pdf/png-js';
import _Object$assign from 'babel-runtime/core-js/object/assign';
import Yoga from 'yoga-layout-prebuilt';
import toPairsIn from 'lodash.topairsin';
import isFunction from 'lodash.isfunction';
import pick from 'lodash.pick';
import merge from 'lodash.merge';
import matchMedia from 'media-engine';
import createPDFRenderer from '@textkit/pdf-renderer';

var inheritedProperties = ['color', 'fontFamily', 'fontSize', 'fontStyle', 'fontWeight', 'letterSpacing', 'textDecoration', 'lineHeight', 'textAlign', 'visibility', 'wordSpacing'];

var flatStyles = function flatStyles(stylesArray) {
  return stylesArray.reduce(function (acc, style) {
    return _extends({}, acc, style);
  }, {});
};

var Root = function () {
  function Root() {
    _classCallCheck(this, Root);

    this.isDirty = false;
    this.document = null;
    this.instance = null;
  }

  Root.prototype.appendChild = function appendChild(child) {
    this.document = child;
  };

  Root.prototype.removeChild = function removeChild() {
    this.document = null;
  };

  Root.prototype.markDirty = function markDirty() {
    this.isDirty = true;
  };

  Root.prototype.render = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              this.instance = new PDFDocument({ autoFirstPage: false });
              _context.next = 3;
              return this.document.render();

            case 3:
              this.isDirty = false;

            case 4:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function render() {
      return _ref.apply(this, arguments);
    }

    return render;
  }();

  _createClass(Root, [{
    key: 'name',
    get: function get() {
      return 'Root';
    }
  }]);

  return Root;
}();

var standardFonts = ['Courier', 'Courier-Bold', 'Courier-Oblique', 'Helvetica', 'Helvetica-Bold', 'Helvetica-Oblique', 'Times-Roman', 'Times-Bold', 'Times-Italic'];

var fetchFont = function fetchFont(src) {
  return fetch(src).then(function (response) {
    if (response.buffer) {
      return response.buffer();
    }
    return response.arrayBuffer();
  }).then(function (arrayBuffer) {
    return Buffer.from(arrayBuffer);
  });
};

var fonts = {};
var emojiSource = void 0;
var hyphenationCallback = void 0;

var register = function register(src, _ref) {
  var family = _ref.family,
      otherOptions = _objectWithoutProperties(_ref, ['family']);

  fonts[family] = _extends({
    src: src,
    loaded: false,
    loading: false,
    data: null
  }, otherOptions);
};

var registerHyphenationCallback = function registerHyphenationCallback(callback) {
  hyphenationCallback = callback;
};

var registerEmojiSource = function registerEmojiSource(_ref2) {
  var url = _ref2.url,
      _ref2$format = _ref2.format,
      format = _ref2$format === undefined ? 'png' : _ref2$format;

  emojiSource = { url: url, format: format };
};

var getRegisteredFonts = function getRegisteredFonts() {
  return _Object$keys(fonts);
};

var getFont = function getFont(family) {
  return fonts[family];
};

var getEmojiSource = function getEmojiSource() {
  return emojiSource;
};

var getHyphenationCallback = function getHyphenationCallback() {
  return hyphenationCallback;
};

var load = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(fontFamily, doc) {
    var font, data;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            font = fonts[fontFamily];

            // We cache the font to avoid fetching it many times

            if (!(font && !font.data && !font.loading)) {
              _context.next = 15;
              break;
            }

            font.loading = true;

            if (!isUrl(font.src)) {
              _context.next = 10;
              break;
            }

            _context.next = 6;
            return fetchFont(font.src);

          case 6:
            data = _context.sent;

            font.data = fontkit.create(data);
            _context.next = 15;
            break;

          case 10:
            

            throw new Error('Invalid font url: ' + font.src + '. If you use relative url please replace it with absolute one (ex. /font.ttf -> http://localhost:3000/font.ttf)');

          case 12:
            _context.next = 14;
            return new _Promise(function (resolve, reject) {
              return fontkit.open(font.src, function (err, data) {
                return err ? reject(err) : resolve(data);
              });
            });

          case 14:
            font.data = _context.sent;

          case 15:

            // If the font wasn't added to the document yet (aka. loaded), we add it.
            // This prevents calling `registerFont` many times for the same font.
            // Fonts loaded state will be reset after the document is closed.
            if (font && !font.loaded) {
              font.loaded = true;
              font.loading = false;
              doc.registerFont(fontFamily, font.data);
            }

            if (!(!font && !standardFonts.includes(fontFamily))) {
              _context.next = 18;
              break;
            }

            throw new Error('Font family not registered: ' + fontFamily + '. Please register it calling Font.register() method.');

          case 18:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function load(_x, _x2) {
    return _ref3.apply(this, arguments);
  };
}();

var reset = function reset() {
  for (var font in fonts) {
    if (fonts.hasOwnProperty(font)) {
      fonts[font].loaded = false;
    }
  }
};

var clear = function clear() {
  fonts = {};
};

var Font = {
  register: register,
  getEmojiSource: getEmojiSource,
  getRegisteredFonts: getRegisteredFonts,
  registerEmojiSource: registerEmojiSource,
  registerHyphenationCallback: registerHyphenationCallback,
  getHyphenationCallback: getHyphenationCallback,
  getFont: getFont,
  load: load,
  clear: clear,
  reset: reset
};

var StandardFont = function () {
  function StandardFont(src) {
    _classCallCheck(this, StandardFont);

    this.name = src;
    this.src = PDFFont.open(null, src);
  }

  StandardFont.prototype.layout = function layout(str) {
    var _this = this;

    var _src$encode = this.src.encode(str),
        encoded = _src$encode[0],
        positions = _src$encode[1];

    return {
      positions: positions,
      stringIndices: positions.map(function (_, i) {
        return i;
      }),
      glyphs: encoded.map(function (g, i) {
        var glyph = _this.getGlyph(parseInt(g, 16));
        glyph.advanceWidth = positions[i].advanceWidth;
        return glyph;
      })
    };
  };

  StandardFont.prototype.glyphForCodePoint = function glyphForCodePoint(codePoint) {
    var glyph = this.getGlyph(codePoint);
    glyph.advanceWidth = 400;
    return glyph;
  };

  StandardFont.prototype.getGlyph = function getGlyph(id) {
    return {
      id: id,
      _font: this.src,
      codePoints: [id],
      isLigature: false,
      name: this.src.font.characterToGlyph(id)
    };
  };

  StandardFont.prototype.hasGlyphForCodePoint = function hasGlyphForCodePoint(codePoint) {
    return this.src.font.characterToGlyph(codePoint) !== '.notdef';
  };

  _createClass(StandardFont, [{
    key: 'ascent',
    get: function get() {
      return this.src.ascender;
    }
  }, {
    key: 'descent',
    get: function get() {
      return this.src.descender;
    }
  }, {
    key: 'lineGap',
    get: function get() {
      return this.src.lineGap;
    }
  }, {
    key: 'unitsPerEm',
    get: function get() {
      return 1000;
    }
  }]);

  return StandardFont;
}();

var fontSubstitutionEngine = (function () {
  return function (_ref) {
    var Run = _ref.Run;
    return function () {
      function FontSubstitutionEngine() {
        _classCallCheck(this, FontSubstitutionEngine);

        this.fontCache = {};
      }

      FontSubstitutionEngine.prototype.getOrCreateFont = function getOrCreateFont(name) {
        if (this.fontCache[name]) return this.fontCache[name];

        var font = new StandardFont(name);
        this.fontCache[name] = font;

        return font;
      };

      FontSubstitutionEngine.prototype.shouldFallbackToFont = function shouldFallbackToFont(codePoint, font) {
        return !font.hasGlyphForCodePoint(codePoint) && this.fallbackFont.hasGlyphForCodePoint(codePoint);
      };

      FontSubstitutionEngine.prototype.getRuns = function getRuns(string, runs) {
        var res = [];
        var lastFont = null;
        var lastIndex = 0;
        var index = 0;

        for (var _iterator = runs, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _getIterator(_iterator);;) {
          var _ref2;

          if (_isArray) {
            if (_i >= _iterator.length) break;
            _ref2 = _iterator[_i++];
          } else {
            _i = _iterator.next();
            if (_i.done) break;
            _ref2 = _i.value;
          }

          var run = _ref2;

          var defaultFont = typeof run.attributes.font === 'string' ? this.getOrCreateFont(run.attributes.font) : run.attributes.font;

          if (string.length === 0) {
            res.push(new Run(0, 0, { font: defaultFont }));
            break;
          }

          for (var _iterator2 = string.slice(run.start, run.end), _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _getIterator(_iterator2);;) {
            var _ref3;

            if (_isArray2) {
              if (_i2 >= _iterator2.length) break;
              _ref3 = _iterator2[_i2++];
            } else {
              _i2 = _iterator2.next();
              if (_i2.done) break;
              _ref3 = _i2.value;
            }

            var char = _ref3;

            var codePoint = char.codePointAt();
            var font = this.shouldFallbackToFont(codePoint, defaultFont) ? this.fallbackFont : defaultFont;

            // If the default font does not have a glyph and the fallback font does, we use it
            if (font !== lastFont) {
              if (lastFont) {
                res.push(new Run(lastIndex, index, { font: lastFont }));
              }

              lastFont = font;
              lastIndex = index;
            }

            index += char.length;
          }
        }

        if (lastIndex < string.length) {
          res.push(new Run(lastIndex, string.length, { font: lastFont }));
        }

        return res;
      };

      _createClass(FontSubstitutionEngine, [{
        key: 'fallbackFont',
        get: function get() {
          return this.getOrCreateFont('Helvetica');
        }
      }]);

      return FontSubstitutionEngine;
    }();
  };
});

var SOFT_HYPHEN_HEX = '\xAD';
var hypher = new Hypher(english);

var wordHyphenation = (function (_ref) {
  var hyphenationCallback = _ref.hyphenationCallback;
  return function () {
    return function () {
      function _class() {
        _classCallCheck(this, _class);

        this.cache = {};
      }

      _class.prototype.calculateParts = function calculateParts(word) {
        return word.includes(SOFT_HYPHEN_HEX) ? word.split(SOFT_HYPHEN_HEX) : hypher.hyphenate(word);
      };

      _class.prototype.hyphenateWord = function hyphenateWord(word) {
        if (this.cache[word]) return this.cache[word];

        var parts = hyphenationCallback ? hyphenationCallback(word) : this.calculateParts(word);

        this.cache[word] = parts;

        return parts;
      };

      return _class;
    }();
  };
});

var Node = function () {
  function Node(data) {
    _classCallCheck(this, Node);

    this.prev = null;
    this.next = null;
    this.data = data;
  }

  Node.prototype.toString = function toString() {
    return this.data.toString();
  };

  return Node;
}();

var LinkedList = function () {
  function LinkedList() {
    _classCallCheck(this, LinkedList);

    this.head = null;
    this.tail = null;
    this.listSize = 0;
  }

  LinkedList.prototype.isLinked = function isLinked(node) {
    return !(node && node.prev === null && node.next === null && this.tail !== node && this.head !== node || this.isEmpty());
  };

  LinkedList.prototype.size = function size() {
    return this.listSize;
  };

  LinkedList.prototype.isEmpty = function isEmpty() {
    return this.listSize === 0;
  };

  LinkedList.prototype.first = function first() {
    return this.head;
  };

  LinkedList.prototype.last = function last() {
    return this.last;
  };

  LinkedList.prototype.toString = function toString() {
    return this.toArray().toString();
  };

  LinkedList.prototype.toArray = function toArray() {
    var node = this.head;
    var result = [];

    while (node !== null) {
      result.push(node);
      node = node.next;
    }
    return result;
  };

  LinkedList.prototype.forEach = function forEach(fun) {
    var node = this.head;

    while (node !== null) {
      fun(node);
      node = node.next;
    }
  };

  LinkedList.prototype.contains = function contains(n) {
    var node = this.head;

    if (!this.isLinked(n)) {
      return false;
    }
    while (node !== null) {
      if (node === n) {
        return true;
      }
      node = node.next;
    }
    return false;
  };

  LinkedList.prototype.at = function at(i) {
    var node = this.head;
    var index = 0;

    if (i >= this.listLength || i < 0) {
      return null;
    }

    while (node !== null) {
      if (i === index) {
        return node;
      }
      node = node.next;
      index += 1;
    }
    return null;
  };

  LinkedList.prototype.insertAfter = function insertAfter(node, newNode) {
    if (!this.isLinked(node)) {
      return this;
    }
    newNode.prev = node;
    newNode.next = node.next;
    if (node.next === null) {
      this.tail = newNode;
    } else {
      node.next.prev = newNode;
    }
    node.next = newNode;
    this.listSize += 1;
    return this;
  };

  LinkedList.prototype.insertBefore = function insertBefore(node, newNode) {
    if (!this.isLinked(node)) {
      return this;
    }
    newNode.prev = node.prev;
    newNode.next = node;
    if (node.prev === null) {
      this.head = newNode;
    } else {
      node.prev.next = newNode;
    }
    node.prev = newNode;
    this.listSize += 1;
    return this;
  };

  LinkedList.prototype.push = function push(node) {
    if (this.head === null) {
      this.unshift(node);
    } else {
      this.insertAfter(this.tail, node);
    }
    return this;
  };

  LinkedList.prototype.unshift = function unshift(node) {
    if (this.head === null) {
      this.head = node;
      this.tail = node;
      node.prev = null;
      node.next = null;
      this.listSize += 1;
    } else {
      this.insertBefore(this.head, node);
    }
    return this;
  };

  LinkedList.prototype.remove = function remove(node) {
    if (!this.isLinked(node)) {
      return this;
    }
    if (node.prev === null) {
      this.head = node.next;
    } else {
      node.prev.next = node.next;
    }
    if (node.next === null) {
      this.tail = node.prev;
    } else {
      node.next.prev = node.prev;
    }
    this.listSize -= 1;
    return this;
  };

  LinkedList.prototype.pop = function pop() {
    var node = this.tail;
    this.tail.prev.next = null;
    this.tail = this.tail.prev;
    this.listSize -= 1;
    node.prev = null;
    node.next = null;
    return node;
  };

  LinkedList.prototype.shift = function shift() {
    var node = this.head;
    this.head.next.prev = null;
    this.head = this.head.next;
    this.listSize -= 1;
    node.prev = null;
    node.next = null;
    return node;
  };

  return LinkedList;
}();

LinkedList.Node = Node;

/**
 * @preserve Knuth and Plass line breaking algorithm in JavaScript
 *
 * Licensed under the new BSD License.
 * Copyright 2009-2010, Bram Stein
 * All rights reserved.
 */
var linebreak = function linebreak(nodes, lines, settings) {
  var options = {
    demerits: {
      line: settings && settings.demerits && settings.demerits.line || 10,
      flagged: settings && settings.demerits && settings.demerits.flagged || 100,
      fitness: settings && settings.demerits && settings.demerits.fitness || 3000
    },
    tolerance: settings && settings.tolerance || 3
  };
  var activeNodes = new LinkedList();
  var sum = {
    width: 0,
    stretch: 0,
    shrink: 0
  };
  var lineLengths = lines;
  var breaks = [];
  var tmp = {
    data: {
      demerits: Infinity
    }
  };

  function breakpoint(position, demerits, ratio, line, fitnessClass, totals, previous) {
    return {
      position: position,
      demerits: demerits,
      ratio: ratio,
      line: line,
      fitnessClass: fitnessClass,
      totals: totals || {
        width: 0,
        stretch: 0,
        shrink: 0
      },
      previous: previous
    };
  }

  function computeCost(start, end, active, currentLine) {
    var width = sum.width - active.totals.width;
    var stretch = 0;
    var shrink = 0;
    // If the current line index is within the list of linelengths, use it, otherwise use
    // the last line length of the list.
    var lineLength = currentLine < lineLengths.length ? lineLengths[currentLine - 1] : lineLengths[lineLengths.length - 1];

    if (nodes[end].type === 'penalty') {
      width += nodes[end].width;
    }

    if (width < lineLength) {
      // Calculate the stretch ratio
      stretch = sum.stretch - active.totals.stretch;

      if (stretch > 0) {
        return (lineLength - width) / stretch;
      }

      return linebreak.infinity;
    } else if (width > lineLength) {
      // Calculate the shrink ratio
      shrink = sum.shrink - active.totals.shrink;

      if (shrink > 0) {
        return (lineLength - width) / shrink;
      }

      return linebreak.infinity;
    }

    // perfect match
    return 0;
  }

  // Add width, stretch and shrink values from the current
  // break point up to the next box or forced penalty.
  function computeSum(breakPointIndex) {
    var result = {
      width: sum.width,
      stretch: sum.stretch,
      shrink: sum.shrink
    };

    for (var i = breakPointIndex; i < nodes.length; i += 1) {
      if (nodes[i].type === 'glue') {
        result.width += nodes[i].width;
        result.stretch += nodes[i].stretch;
        result.shrink += nodes[i].shrink;
      } else if (nodes[i].type === 'box' || nodes[i].type === 'penalty' && nodes[i].penalty === -linebreak.infinity && i > breakPointIndex) {
        break;
      }
    }
    return result;
  }

  // The main loop of the algorithm
  function mainLoop(node, index, nodes) {
    var active = activeNodes.first();
    var next = null;
    var ratio = 0;
    var demerits = 0;
    var candidates = [];
    var badness = void 0;
    var currentLine = 0;
    var tmpSum = void 0;
    var currentClass = 0;
    var fitnessClass = void 0;
    var candidate = void 0;
    var newNode = void 0;

    // The inner loop iterates through all the active nodes with line < currentLine and then
    // breaks out to insert the new active node candidates before looking at the next active
    // nodes for the next lines. The result of this is that the active node list is always
    // sorted by line number.
    while (active !== null) {
      candidates = [{
        demerits: Infinity
      }, {
        demerits: Infinity
      }, {
        demerits: Infinity
      }, {
        demerits: Infinity
      }];

      // Iterate through the linked list of active nodes to find new potential active nodes
      // and deactivate current active nodes.
      while (active !== null) {
        next = active.next;
        currentLine = active.data.line + 1;
        ratio = computeCost(active.data.position, index, active.data, currentLine);

        // Deactive nodes when the distance between the current active node and the
        // current node becomes too large (i.e. it exceeds the stretch limit and the stretch
        // ratio becomes negative) or when the current node is a forced break (i.e. the end
        // of the paragraph when we want to remove all active nodes, but possibly have a final
        // candidate active node---if the paragraph can be set using the given tolerance value.)
        if (ratio < -1 || node.type === 'penalty' && node.penalty === -linebreak.infinity) {
          activeNodes.remove(active);
        }

        // If the ratio is within the valid range of -1 <= ratio <= tolerance calculate the
        // total demerits and record a candidate active node.
        if (ratio >= -1 && ratio <= options.tolerance) {
          badness = 100 * Math.pow(Math.abs(ratio), 3);

          // Positive penalty
          if (node.type === 'penalty' && node.penalty >= 0) {
            demerits = Math.pow(options.demerits.line + badness, 2) + Math.pow(node.penalty, 2);
            // Negative penalty but not a forced break
          } else if (node.type === 'penalty' && node.penalty !== -linebreak.infinity) {
            demerits = Math.pow(options.demerits.line + badness, 2) - Math.pow(node.penalty, 2);
            // All other cases
          } else {
            demerits = Math.pow(options.demerits.line + badness, 2);
          }

          if (node.type === 'penalty' && nodes[active.data.position].type === 'penalty') {
            demerits += options.demerits.flagged * node.flagged * nodes[active.data.position].flagged;
          }

          // Calculate the fitness class for this candidate active node.
          if (ratio < -0.5) {
            currentClass = 0;
          } else if (ratio <= 0.5) {
            currentClass = 1;
          } else if (ratio <= 1) {
            currentClass = 2;
          } else {
            currentClass = 3;
          }

          // Add a fitness penalty to the demerits if the fitness classes of two adjacent lines
          // differ too much.
          if (Math.abs(currentClass - active.data.fitnessClass) > 1) {
            demerits += options.demerits.fitness;
          }

          // Add the total demerits of the active node to get the total demerits of this candidate node.
          demerits += active.data.demerits;

          // Only store the best candidate for each fitness class
          if (demerits < candidates[currentClass].demerits) {
            candidates[currentClass] = {
              active: active,
              demerits: demerits,
              ratio: ratio
            };
          }
        }

        active = next;

        // Stop iterating through active nodes to insert new candidate active nodes in the active list
        // before moving on to the active nodes for the next line.
        // TODO: The Knuth and Plass paper suggests a conditional for currentLine < j0. This means paragraphs
        // with identical line lengths will not be sorted by line number. Find out if that is a desirable outcome.
        // For now I left this out, as it only adds minimal overhead to the algorithm and keeping the active node
        // list sorted has a higher priority.
        if (active !== null && active.data.line >= currentLine) {
          break;
        }
      }

      tmpSum = computeSum(index);

      for (fitnessClass = 0; fitnessClass < candidates.length; fitnessClass += 1) {
        candidate = candidates[fitnessClass];

        if (candidate.demerits < Infinity) {
          newNode = new LinkedList.Node(breakpoint(index, candidate.demerits, candidate.ratio, candidate.active.data.line + 1, fitnessClass, tmpSum, candidate.active));
          if (active !== null) {
            activeNodes.insertBefore(active, newNode);
          } else {
            activeNodes.push(newNode);
          }
        }
      }
    }
  }

  // Add an active node for the start of the paragraph.
  activeNodes.push(new LinkedList.Node(breakpoint(0, 0, 0, 0, 0, undefined, null)));

  nodes.forEach(function (node, index, nodes) {
    if (node.type === 'box') {
      sum.width += node.width;
    } else if (node.type === 'glue') {
      if (index > 0 && nodes[index - 1].type === 'box') {
        mainLoop(node, index, nodes);
      }
      sum.width += node.width;
      sum.stretch += node.stretch;
      sum.shrink += node.shrink;
    } else if (node.type === 'penalty' && node.penalty !== linebreak.infinity) {
      mainLoop(node, index, nodes);
    }
  });

  if (activeNodes.size() !== 0) {
    // Find the best active node (the one with the least total demerits.)
    activeNodes.forEach(function (node) {
      if (node.data.demerits < tmp.data.demerits) {
        tmp = node;
      }
    });

    while (tmp !== null) {
      breaks.push({
        position: tmp.data.position,
        ratio: tmp.data.ratio
      });
      tmp = tmp.data.previous;
    }
    return breaks.reverse();
  }
  return [];
};

linebreak.infinity = 10000;

linebreak.glue = function (width, value, stretch, shrink) {
  return {
    type: 'glue',
    value: value,
    width: width,
    stretch: stretch,
    shrink: shrink
  };
};

linebreak.box = function (width, value) {
  var hyphenated = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  return {
    type: 'box',
    width: width,
    value: value,
    hyphenated: hyphenated
  };
};

linebreak.penalty = function (width, penalty, flagged) {
  return {
    type: 'penalty',
    width: width,
    penalty: penalty,
    flagged: flagged
  };
};

var INFINITY = 10000;

var getNextBreakpoint = function getNextBreakpoint(subnodes, widths, lineNumber) {
  var position = null;
  var minimumBadness = Infinity;

  var sum = { width: 0, stretch: 0, shrink: 0 };
  var lineLength = widths[Math.min(lineNumber, widths.length - 1)];

  var calculateRatio = function calculateRatio(node) {
    if (sum.width < lineLength) {
      return sum.stretch - node.stretch > 0 ? (lineLength - sum.width) / sum.stretch : INFINITY;
    } else if (sum.width > lineLength) {
      return sum.shrink - node.shrink > 0 ? (lineLength - sum.width) / sum.shrink : INFINITY;
    }

    return 0;
  };

  for (var i = 0; i < subnodes.length; i++) {
    var node = subnodes[i];

    if (node.type === 'box') {
      sum.width += node.width;
    } else if (node.type === 'glue') {
      sum.width += node.width;
      sum.stretch += node.stretch;
      sum.shrink += node.shrink;
    }

    if (sum.width - sum.shrink > lineLength) break;

    if (node.type === 'penalty' || node.type === 'glue') {
      var ratio = calculateRatio(node);
      var penalty = node.type === 'penalty' ? node.penalty : 0;
      var badness = 100 * Math.pow(Math.abs(ratio), 3) + penalty;

      if (minimumBadness >= badness) {
        position = i;
        minimumBadness = badness;
      }
    }
  }

  return sum.width - sum.shrink > lineLength ? position : null;
};

var applyBestFit = function applyBestFit(nodes, widths) {
  var count = 0;
  var lineNumber = 0;
  var subnodes = nodes;
  var breakpoints = [{ position: 0 }];

  while (subnodes.length > 0) {
    var breakpoint = getNextBreakpoint(subnodes, widths, lineNumber);

    if (breakpoint) {
      count += breakpoint;
      breakpoints.push({ position: count });
      subnodes = subnodes.slice(breakpoint + 1, subnodes.length);
      count++;
      lineNumber++;
    } else {
      subnodes = [];
    }
  }

  return breakpoints;
};

var HYPHEN = 0x002d;
var TOLERANCE_STEPS = 5;
var TOLERANCE_LIMIT = 50;

var opts = {
  width: 3,
  stretch: 6,
  shrink: 9
};

var lineBreaker = (function () {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      penalty = _ref.penalty;

  return function () {
    return function () {
      function KPLineBreaker(tolerance) {
        _classCallCheck(this, KPLineBreaker);

        this.tolerance = tolerance || 4;
      }

      KPLineBreaker.prototype.getNodes = function getNodes(glyphString, syllables, _ref2) {
        var align = _ref2.align;

        var start = 0;
        var hyphenWidth = 5;
        var hyphenPenalty = penalty || (align === 'justify' ? 100 : 600);

        var result = syllables.reduce(function (acc, s, index) {
          var glyphStart = glyphString.glyphIndexForStringIndex(start);
          var glyphEnd = glyphString.glyphIndexForStringIndex(start + s.length);
          var syllable = glyphString.slice(glyphStart, glyphEnd);

          if (syllable.string.trim() === '') {
            var width = syllable.advanceWidth;
            var stretch = width * opts.width / opts.stretch;
            var shrink = width * opts.width / opts.shrink;
            var value = { value: syllable, start: start, end: start + syllable.end };
            acc.push(linebreak.glue(width, value, stretch, shrink));
          } else {
            var hyphenated = syllables[index + 1] !== ' ';
            var _value = { value: syllable, start: start, end: start + syllable.end };
            acc.push(linebreak.box(syllable.advanceWidth, _value, hyphenated));

            if (syllables[index + 1] && hyphenated) {
              acc.push(linebreak.penalty(hyphenWidth, hyphenPenalty, 1));
            }
          }

          start += s.length;

          return acc;
        }, []);

        result.push(linebreak.glue(0, null, linebreak.infinity, 0));
        result.push(linebreak.penalty(0, -linebreak.infinity, 1));

        return result;
      };

      KPLineBreaker.prototype.breakLines = function breakLines(glyphString, nodes, breaks) {
        var start = 0;
        var end = null;

        var lines = breaks.reduce(function (acc, breakPoint) {
          var node = nodes[breakPoint.position];
          var prevNode = nodes[breakPoint.position - 1];

          // Last breakpoint corresponds to K&P mandatory final glue
          if (breakPoint.position === nodes.length - 1) return acc;

          var line = void 0;
          if (node.type === 'penalty') {
            end = glyphString.glyphIndexForStringIndex(prevNode.value.end);
            line = glyphString.slice(start, end);
            line.insertGlyph(line.length, HYPHEN);
          } else {
            end = glyphString.glyphIndexForStringIndex(node.value.end);
            line = glyphString.slice(start, end);
          }

          start = end;
          return [].concat(acc, [line]);
        }, []);

        var lastLine = glyphString.slice(start, glyphString.length);
        lines.push(lastLine);

        return lines;
      };

      KPLineBreaker.prototype.suggestLineBreak = function suggestLineBreak(glyphString, syllables, availableWidths, paragraphStyle) {
        var nodes = this.getNodes(glyphString, syllables, paragraphStyle);
        var tolerance = this.tolerance;
        var breaks = linebreak(nodes, availableWidths, { tolerance: tolerance });

        // Try again with a higher tolerance if the line breaking failed.
        while (breaks.length === 0 && tolerance < TOLERANCE_LIMIT) {
          tolerance += TOLERANCE_STEPS;
          breaks = linebreak(nodes, availableWidths, { tolerance: tolerance });
        }

        if (breaks.length === 0 || breaks.length === 1 && breaks[0].position === 0) {
          breaks = applyBestFit(nodes, availableWidths);
        }

        return this.breakLines(glyphString, nodes, breaks.slice(1));
      };

      return KPLineBreaker;
    }();
  };
});

// justificationEngine values
var shrinkWhitespaceFactor = { before: -0.5, after: -0.5 };

var LayoutEngine$1 = function (_BaseLayoutEngine) {
  _inherits(LayoutEngine$$1, _BaseLayoutEngine);

  function LayoutEngine$$1(_ref) {
    var hyphenationCallback = _ref.hyphenationCallback,
        hyphenationPenalty = _ref.hyphenationPenalty;

    _classCallCheck(this, LayoutEngine$$1);

    var engines = {
      scriptItemizer: scriptItemizer(),
      decorationEngine: textDecorationEngine(),
      fontSubstitutionEngine: fontSubstitutionEngine(),
      wordHyphenation: wordHyphenation({ hyphenationCallback: hyphenationCallback }),
      lineBreaker: lineBreaker({ penalty: hyphenationPenalty }),
      justificationEngine: justificationEngine({ shrinkWhitespaceFactor: shrinkWhitespaceFactor })
    };

    return _possibleConstructorReturn(this, _BaseLayoutEngine.call(this, engines));
  }

  return LayoutEngine$$1;
}(LayoutEngine);

PNG.isValid = function (data) {
  try {
    return !!new PNG(data);
  } catch (e) {
    return false;
  }
};

// Extracted from https://github.com/devongovett/pdfkit/blob/master/lib/image/jpeg.coffee

var MARKERS = [0xffc0, 0xffc1, 0xffc2, 0xffc3, 0xffc5, 0xffc6, 0xffc7, 0xffc8, 0xffc9, 0xffca, 0xffcb, 0xffcc, 0xffcd, 0xffce, 0xffcf];

var JPEG = function JPEG(data) {
  _classCallCheck(this, JPEG);

  this.data = null;
  this.width = null;
  this.height = null;

  this.data = data;

  if (data.readUInt16BE(0) !== 0xffd8) {
    throw new Error('SOI not found in JPEG');
  }

  var marker = void 0;
  var pos = 2;

  while (pos < data.length) {
    marker = data.readUInt16BE(pos);
    pos += 2;
    if (MARKERS.includes(marker)) {
      break;
    }
    pos += data.readUInt16BE(pos);
  }

  if (!MARKERS.includes(marker)) {
    throw new Error('Invalid JPEG.');
  }

  pos += 3;
  this.height = data.readUInt16BE(pos);

  pos += 2;
  this.width = data.readUInt16BE(pos);
};

JPEG.isValid = function (data) {
  if (!data || !Buffer.isBuffer(data) || data.readUInt16BE(0) !== 0xffd8) {
    return false;
  }

  var marker = void 0;
  var pos = 2;

  while (pos < data.length) {
    marker = data.readUInt16BE(pos);
    pos += 2;
    if (MARKERS.includes(marker)) {
      break;
    }
    pos += data.readUInt16BE(pos);
  }

  if (!MARKERS.includes(marker)) {
    return false;
  }

  return true;
};

var createCache = function createCache() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$limit = _ref.limit,
      limit = _ref$limit === undefined ? 100 : _ref$limit;

  var cache = {};
  var keys = [];

  return {
    get: function get(key) {
      return cache[key];
    },
    set: function set(key, value) {
      keys.push(key);
      if (keys.length > limit) {
        delete cache[keys.shift()];
      }
      cache[key] = value;
    },
    length: function length() {
      return keys.length;
    }
  };
};

var _this = undefined;

var isDangerousLocalPath = function isDangerousLocalPath(filename) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$safePath = _ref.safePath,
      safePath = _ref$safePath === undefined ? './public' : _ref$safePath;

  var path = require('path');
  var absoluteSafePath = path.resolve(safePath);
  var absoluteFilePath = path.resolve(filename);
  return !absoluteFilePath.startsWith(absoluteSafePath);
};

var fetchLocalFile = function fetchLocalFile(src) {
  var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      safePath = _ref2.safePath,
      _ref2$allowDangerousP = _ref2.allowDangerousPaths,
      allowDangerousPaths = _ref2$allowDangerousP === undefined ? false : _ref2$allowDangerousP;

  return new _Promise(function (resolve, reject) {
    try {
      var _require$parse = require('url').parse(src),
          protocol = _require$parse.protocol,
          auth = _require$parse.auth,
          host = _require$parse.host,
          port = _require$parse.port,
          hostname = _require$parse.hostname,
          path = _require$parse.path;

      var absolutePath = require('path').resolve(path);
      var fs = require('fs');
      if (protocol && protocol !== 'file:' || auth || host || port || hostname) {
        return reject(new Error('Cannot fetch local file with non-file protocol, host or auth credentials'));
      }
      if (!allowDangerousPaths && isDangerousLocalPath(absolutePath, { safePath: safePath })) {
        return reject(new Error('Cannot fetch dangerous local path: ' + path));
      }
      fs.readFile(absolutePath, function (err, data) {
        if (err) {
          return reject(err);
        }
        return resolve(data);
      });
    } catch (err) {
      reject(err);
    }
  });
};

var imagesCache = createCache({ limit: 30 });

var getImageFormat = function getImageFormat(body) {
  var isPng = body[0] === 137 && body[1] === 80 && body[2] === 78 && body[3] === 71 && body[4] === 13 && body[5] === 10 && body[6] === 26 && body[7] === 10;

  var isJpg = body[0] === 255 && body[1] === 216 && body[2] === 255;

  var extension = '';
  if (isPng) {
    extension = 'png';
  } else if (isJpg) {
    extension = 'jpg';
  } else {
    throw new Error('Not valid image extension');
  }

  return extension;
};

var isValidFormat = function isValidFormat(format) {
  var lower = format.toLowerCase();
  return lower === 'jpg' || lower === 'jpeg' || lower === 'png';
};

var guessFormat = function guessFormat(buffer) {
  var format = void 0;

  if (JPEG.isValid(buffer)) {
    format = 'jpg';
  } else if (PNG.isValid(buffer)) {
    format = 'png';
  }

  return format;
};

var isCompatibleBase64 = function isCompatibleBase64(src) {
  return (/^data:image\/[a-zA-Z]*;base64,[^"]*/g.test(src)
  );
};

function getImage(body, extension) {
  switch (extension.toLowerCase()) {
    case 'jpg':
    case 'jpeg':
      return new JPEG(body);
    case 'png':
      return new PNG(body);
    default:
      return null;
  }
}

var resolveBase64Image = function resolveBase64Image(src) {
  var match = /^data:image\/([a-zA-Z]*);base64,([^"]*)/g.exec(src);
  var format = match[1];
  var data = match[2];

  if (!isValidFormat(format)) {
    throw new Error('Base64 image invalid format: ' + format);
  }

  return new _Promise(function (resolve) {
    return resolve(getImage(Buffer.from(data, 'base64'), format));
  });
};

var resolveImageFromData = function resolveImageFromData(src) {
  if (src.data && src.format) {
    return new _Promise(function (resolve) {
      return resolve(getImage(src.data, src.format));
    });
  }

  throw new Error('Invalid data given for local file: ' + _JSON$stringify(src));
};

var resolveBufferImage = function resolveBufferImage(buffer) {
  var format = guessFormat(buffer);

  if (format) {
    return new _Promise(function (resolve) {
      return resolve(getImage(buffer, format));
    });
  }
};

var resolveImageFromUrl = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(src, options) {
    var body, response, buffer, extension;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            body = void 0;

            if (!(isNode && (src.substr(0, 5) === 'file:' || !/^https?:\/\//.exec(src)))) {
              _context.next = 7;
              break;
            }

            _context.next = 4;
            return fetchLocalFile(src, options);

          case 4:
            body = _context.sent;
            _context.next = 16;
            break;

          case 7:
            _context.next = 9;
            return fetch(src);

          case 9:
            response = _context.sent;
            _context.next = 12;
            return response.buffer ? response.buffer() : response.arrayBuffer();

          case 12:
            buffer = _context.sent;
            _context.next = 15;
            return buffer.constructor.name === 'Buffer' ? buffer : Buffer.from(buffer);

          case 15:
            body = _context.sent;

          case 16:
            extension = getImageFormat(body);
            return _context.abrupt('return', getImage(body, extension));

          case 18:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, _this);
  }));

  return function resolveImageFromUrl(_x3, _x4) {
    return _ref3.apply(this, arguments);
  };
}();

var resolveImage = function resolveImage(src) {
  var _ref4 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var _ref4$cache = _ref4.cache,
      cache = _ref4$cache === undefined ? true : _ref4$cache,
      options = _objectWithoutProperties(_ref4, ['cache']);

  var cacheKey = src.data ? src.data.toString() : src;

  if (cache && imagesCache.get(cacheKey)) {
    return imagesCache.get(cacheKey);
  }

  var image = void 0;
  if (isCompatibleBase64(src)) {
    image = resolveBase64Image(src);
  } else if (Buffer.isBuffer(src)) {
    image = resolveBufferImage(src);
  } else if ((typeof src === 'undefined' ? 'undefined' : _typeof(src)) === 'object' && src.data) {
    image = resolveImageFromData(src);
  } else {
    image = resolveImageFromUrl(src, options);
  }

  if (!image) {
    throw new Error('Cannot resolve image');
  }

  if (cache) {
    imagesCache.set(cacheKey, image);
  }

  return image;
};

/* eslint-disable no-cond-assign */
// Caches emoji images data
var emojis = {};
var regex = emojiRegex();

var reflect = function reflect(promise) {
  return function () {
    return promise.apply(undefined, arguments).then(function (v) {
      return v;
    }, function (e) {
      return e;
    });
  };
};

var fetchEmojiImage = reflect(resolveImage);

var getCodePoints = function getCodePoints(string) {
  return _Array$from(string).map(function (char) {
    return char.codePointAt(0).toString(16);
  }).join('-');
};

var buildEmojiUrl = function buildEmojiUrl(emoji) {
  var _Font$getEmojiSource = Font.getEmojiSource(),
      url = _Font$getEmojiSource.url,
      format = _Font$getEmojiSource.format;

  return '' + url + getCodePoints(emoji) + '.' + format;
};

var fetchEmojis = function fetchEmojis(string) {
  var emojiSource = Font.getEmojiSource();

  if (!emojiSource || !emojiSource.url) return [];

  var promises = [];

  var match = void 0;

  var _loop = function _loop() {
    var emoji = match[0];

    if (!emojis[emoji] || emojis[emoji].loading) {
      var emojiUrl = buildEmojiUrl(emoji);

      emojis[emoji] = { loading: true };

      promises.push(fetchEmojiImage(emojiUrl).then(function (image) {
        emojis[emoji].loading = false;
        emojis[emoji].data = image.data;
      }));
    }
  };

  while (match = regex.exec(string)) {
    _loop();
  }

  return promises;
};

var embedEmojis = function embedEmojis(fragments) {
  var result = [];

  for (var i = 0; i < fragments.length; i++) {
    var fragment = fragments[i];

    var match = void 0;
    var lastIndex = 0;

    while (match = regex.exec(fragment.string)) {
      var index = match.index;
      var _emoji = match[0];
      var emojiSize = fragment.attributes.fontSize;
      var chunk = fragment.string.slice(lastIndex, index + match[0].length);

      // If emoji image was found, we create a new fragment with the
      // correct attachment and object substitution character;
      if (emojis[_emoji] && emojis[_emoji].data) {
        result.push({
          string: chunk.replace(match, Attachment.CHARACTER),
          attributes: _extends({}, fragment.attributes, {
            attachment: new Attachment(emojiSize, emojiSize, {
              yOffset: Math.floor(emojiSize * 0.1),
              image: emojis[_emoji].data
            })
          })
        });
      } else {
        // If no emoji data, we just replace the emoji with a nodef char
        result.push({
          string: chunk.replace(match, String.fromCharCode(0)),
          attributes: fragment.attributes
        });
      }

      lastIndex = index + _emoji.length;
    }

    if (lastIndex < fragment.string.length) {
      result.push({
        string: fragment.string.slice(lastIndex),
        attributes: fragment.attributes
      });
    }
  }

  return result;
};

var Document$2 = function () {
  function Document(root, props) {
    _classCallCheck(this, Document);

    this.root = root;
    this.props = props;
    this.children = [];
    this.subpages = [];
  }

  Document.prototype.appendChild = function appendChild(child) {
    child.parent = this;
    this.children.push(child);
  };

  Document.prototype.removeChild = function removeChild(child) {
    var i = this.children.indexOf(child);
    child.parent = null;
    this.children.slice(i, 1);
  };

  Document.prototype.addMetaData = function addMetaData() {
    var _props = this.props,
        title = _props.title,
        author = _props.author,
        subject = _props.subject,
        keywords = _props.keywords,
        creator = _props.creator,
        producer = _props.producer;

    // The object keys need to start with a capital letter by the PDF spec

    if (title) this.root.instance.info.Title = title;
    if (author) this.root.instance.info.Author = author;
    if (subject) this.root.instance.info.Subject = subject;
    if (keywords) this.root.instance.info.Keywords = keywords;

    this.root.instance.info.Creator = creator || 'react-pdf';
    this.root.instance.info.Producer = producer || 'react-pdf';
  };

  Document.prototype.loadFonts = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
      var promises, listToExplore, node;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              promises = [];
              listToExplore = this.children.slice(0);


              while (listToExplore.length > 0) {
                node = listToExplore.shift();


                if (node.style && node.style.fontFamily) {
                  promises.push(Font.load(node.style.fontFamily, this.root.instance));
                }

                if (node.children) {
                  node.children.forEach(function (childNode) {
                    listToExplore.push(childNode);
                  });
                }
              }

              _context.next = 5;
              return _Promise.all(promises);

            case 5:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function loadFonts() {
      return _ref.apply(this, arguments);
    }

    return loadFonts;
  }();

  Document.prototype.loadEmojis = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
      var promises, listToExplore, node;
      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              promises = [];
              listToExplore = this.children.slice(0);


              while (listToExplore.length > 0) {
                node = listToExplore.shift();


                if (typeof node === 'string') {
                  promises.push.apply(promises, fetchEmojis(node));
                } else if (typeof node.value === 'string') {
                  promises.push.apply(promises, fetchEmojis(node.value));
                } else if (node.children) {
                  node.children.forEach(function (childNode) {
                    listToExplore.push(childNode);
                  });
                }
              }

              _context2.next = 5;
              return _Promise.all(promises);

            case 5:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function loadEmojis() {
      return _ref2.apply(this, arguments);
    }

    return loadEmojis;
  }();

  Document.prototype.loadImages = function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3() {
      var promises, listToExplore, node;
      return _regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              promises = [];
              listToExplore = this.children.slice(0);


              while (listToExplore.length > 0) {
                node = listToExplore.shift();


                if (node.name === 'Image') {
                  promises.push(node.fetch());
                }

                if (node.children) {
                  node.children.forEach(function (childNode) {
                    listToExplore.push(childNode);
                  });
                }
              }

              _context3.next = 5;
              return _Promise.all(promises);

            case 5:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function loadImages() {
      return _ref3.apply(this, arguments);
    }

    return loadImages;
  }();

  Document.prototype.loadAssets = function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4() {
      return _regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return _Promise.all([this.loadFonts(), this.loadImages()]);

            case 2:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    function loadAssets() {
      return _ref4.apply(this, arguments);
    }

    return loadAssets;
  }();

  Document.prototype.applyProps = function applyProps() {
    this.children.forEach(function (child) {
      return child.applyProps();
    });
  };

  Document.prototype.update = function update(newProps) {
    this.props = newProps;
  };

  Document.prototype.getLayoutData = function getLayoutData() {
    return {
      type: this.name,
      children: this.subpages.map(function (c) {
        return c.getLayoutData();
      })
    };
  };

  Document.prototype.wrapPages = function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5() {
      var pageCount, pages, _iterator, _isArray, _i, _ref6, page, wrapArea, subpages;

      return _regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              pageCount = 1;
              pages = [];
              _iterator = this.children, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _getIterator(_iterator);

            case 3:
              if (!_isArray) {
                _context5.next = 9;
                break;
              }

              if (!(_i >= _iterator.length)) {
                _context5.next = 6;
                break;
              }

              return _context5.abrupt('break', 27);

            case 6:
              _ref6 = _iterator[_i++];
              _context5.next = 13;
              break;

            case 9:
              _i = _iterator.next();

              if (!_i.done) {
                _context5.next = 12;
                break;
              }

              return _context5.abrupt('break', 27);

            case 12:
              _ref6 = _i.value;

            case 13:
              page = _ref6;
              wrapArea = page.size.height - (page.style.paddingBottom || 0);

              if (!page.wrap) {
                _context5.next = 23;
                break;
              }

              _context5.next = 18;
              return _wrapPages(page, wrapArea, pageCount);

            case 18:
              subpages = _context5.sent;


              pageCount += subpages.length;

              pages.push.apply(pages, subpages);
              _context5.next = 25;
              break;

            case 23:
              page.height = page.size.height;
              pages.push(page);

            case 25:
              _context5.next = 3;
              break;

            case 27:
              return _context5.abrupt('return', pages);

            case 28:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, this);
    }));

    function wrapPages() {
      return _ref5.apply(this, arguments);
    }

    return wrapPages;
  }();

  Document.prototype.renderPages = function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee6() {
      var j;
      return _regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return this.wrapPages();

            case 2:
              this.subpages = _context6.sent;
              j = 0;

            case 4:
              if (!(j < this.subpages.length)) {
                _context6.next = 11;
                break;
              }

              // Update dynamic text nodes with total pages info
              this.subpages[j].renderDynamicNodes({
                pageNumber: j + 1,
                totalPages: this.subpages.length
              }, function (node) {
                return node.name === 'Text';
              });
              _context6.next = 8;
              return this.subpages[j].render();

            case 8:
              j++;
              _context6.next = 4;
              break;

            case 11:
              return _context6.abrupt('return', this.subpages);

            case 12:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, this);
    }));

    function renderPages() {
      return _ref7.apply(this, arguments);
    }

    return renderPages;
  }();

  Document.prototype.render = function () {
    var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee7() {
      return _regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.prev = 0;

              this.addMetaData();
              this.applyProps();
              _context7.next = 5;
              return this.loadEmojis();

            case 5:
              _context7.next = 7;
              return this.loadAssets();

            case 7:
              _context7.next = 9;
              return this.renderPages();

            case 9:
              this.root.instance.end();
              Font.reset();
              _context7.next = 16;
              break;

            case 13:
              _context7.prev = 13;
              _context7.t0 = _context7['catch'](0);
              throw _context7.t0;

            case 16:
            case 'end':
              return _context7.stop();
          }
        }
      }, _callee7, this, [[0, 13]]);
    }));

    function render() {
      return _ref8.apply(this, arguments);
    }

    return render;
  }();

  _createClass(Document, [{
    key: 'name',
    get: function get() {
      return 'Document';
    }
  }]);

  return Document;
}();

Document$2.defaultProps = {
  author: null,
  keywords: null,
  subject: null,
  title: null
};

var upperFirst = function upperFirst(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

var matchPercent = function matchPercent(value) {
  return (/(-?\d+\.?\d*)%/g.exec(value)
  );
};

var Node$1 = function () {
  function Node() {
    _classCallCheck(this, Node);

    this.parent = null;
    this.children = [];
    this.computed = false;
    this.layout = Yoga.Node.createDefault();
  }

  Node.prototype.appendChild = function appendChild(child) {
    if (child) {
      child.parent = this;
      this.children.push(child);
      this.layout.insertChild(child.layout, this.layout.getChildCount());
    }
  };

  Node.prototype.appendChildBefore = function appendChildBefore(child, beforeChild) {
    var index = this.children.indexOf(beforeChild);

    if (index !== -1 && child) {
      child.parent = this;
      this.children.splice(index, 0, child);
      this.layout.insertChild(child.layout, index);
    }
  };

  Node.prototype.removeChild = function removeChild(child) {
    var index = this.children.indexOf(child);

    if (index !== -1) {
      child.parent = null;
      this.children.splice(index, 1);
      this.layout.removeChild(child.layout);
    }
  };

  Node.prototype.removeAllChilds = function removeAllChilds() {
    var children = [].concat(this.children);
    for (var i = 0; i < children.length; i++) {
      children[i].remove();
    }
  };

  Node.prototype.remove = function remove() {
    this.parent.removeChild(this);
  };

  Node.prototype.setDimension = function setDimension(attr, value) {
    var fixedMethod = 'set' + upperFirst(attr);
    var percentMethod = fixedMethod + 'Percent';
    var isPercent = matchPercent(value);

    if (isPercent) {
      this.layout[percentMethod](parseFloat(isPercent[1], 10));
    } else {
      this.layout[fixedMethod](value);
    }
  };

  Node.prototype.setPosition = function setPosition(edge, value) {
    var isPercent = matchPercent(value);

    if (isPercent) {
      this.layout.setPositionPercent(edge, parseFloat(isPercent[1], 10));
    } else {
      this.layout.setPosition(edge, value);
    }
  };

  Node.prototype.setPadding = function setPadding(edge, value) {
    var isPercent = matchPercent(value);

    if (isPercent) {
      this.layout.setPaddingPercent(edge, parseFloat(isPercent[1], 10));
    } else {
      this.layout.setPadding(edge, value);
    }
  };

  Node.prototype.setMargin = function setMargin(edge, value) {
    var isPercent = matchPercent(value);

    if (isPercent) {
      this.layout.setMarginPercent(edge, parseFloat(isPercent[1], 10));
    } else {
      this.layout.setMargin(edge, value);
    }
  };

  Node.prototype.setBorder = function setBorder(edge, value) {
    if (matchPercent(value)) {
      throw new Error('Node: You cannot set percentage border widths');
    }
    this.layout.setBorder(edge, value);
  };

  Node.prototype.getAbsoluteLayout = function getAbsoluteLayout() {
    var parent = this.parent;
    var parentLayout = parent && parent.getAbsoluteLayout ? parent.getAbsoluteLayout() : { left: 0, top: 0 };

    return {
      left: this.left + parentLayout.left,
      top: this.top + parentLayout.top,
      height: this.height,
      width: this.width
    };
  };

  Node.prototype.copyStyle = function copyStyle(node) {
    this.layout.copyStyle(node.layout);
  };

  Node.prototype.calculateLayout = function calculateLayout() {
    this.layout.calculateLayout();
    this.computed = true;
  };

  Node.prototype.isEmpty = function isEmpty() {
    return this.children.length === 0;
  };

  Node.prototype.markDirty = function markDirty() {
    return this.layout.markDirty();
  };

  Node.prototype.onAppendDynamically = function onAppendDynamically() {};

  _createClass(Node, [{
    key: 'position',
    get: function get() {
      return this.layout.getPositionType() === Yoga.POSITION_TYPE_ABSOLUTE ? 'absolute' : 'relative';
    },
    set: function set(value) {
      this.layout.setPositionType(value === 'absolute' ? Yoga.POSITION_TYPE_ABSOLUTE : Yoga.POSITION_TYPE_RELATIVE);
    }
  }, {
    key: 'top',
    get: function get() {
      return this.layout.getComputedTop() || 0;
    },
    set: function set(value) {
      this.setPosition(Yoga.EDGE_TOP, value);
    }
  }, {
    key: 'left',
    get: function get() {
      return this.layout.getComputedLeft() || 0;
    },
    set: function set(value) {
      this.setPosition(Yoga.EDGE_LEFT, value);
    }
  }, {
    key: 'right',
    get: function get() {
      return this.layout.getComputedRight() || 0;
    },
    set: function set(value) {
      this.setPosition(Yoga.EDGE_RIGHT, value);
    }
  }, {
    key: 'bottom',
    get: function get() {
      return this.layout.getComputedBottom() || 0;
    },
    set: function set(value) {
      this.setPosition(Yoga.EDGE_BOTTOM, value);
    }
  }, {
    key: 'width',
    get: function get() {
      return this.layout.getComputedWidth();
    },
    set: function set(value) {
      this.setDimension('width', value);
    }
  }, {
    key: 'minWidth',
    get: function get() {
      return this.layout.getMinWidth().value;
    },
    set: function set(value) {
      this.setDimension('minWidth', value);
    }
  }, {
    key: 'maxWidth',
    get: function get() {
      return this.layout.getMaxWidth().value;
    },
    set: function set(value) {
      this.setDimension('maxWidth', value);
    }
  }, {
    key: 'height',
    get: function get() {
      return this.layout.getComputedHeight();
    },
    set: function set(value) {
      this.setDimension('height', value);
    }
  }, {
    key: 'minHeight',
    get: function get() {
      return this.layout.getMinHeight().value;
    },
    set: function set(value) {
      this.setDimension('minHeight', value);
    }
  }, {
    key: 'maxHeight',
    get: function get() {
      return this.layout.getMaxHeight().value;
    },
    set: function set(value) {
      this.setDimension('maxHeight', value);
    }
  }, {
    key: 'paddingTop',
    get: function get() {
      return this.layout.getComputedPadding(Yoga.EDGE_TOP) || 0;
    },
    set: function set(value) {
      this.setPadding(Yoga.EDGE_TOP, value);
    }
  }, {
    key: 'paddingRight',
    get: function get() {
      return this.layout.getComputedPadding(Yoga.EDGE_RIGHT) || 0;
    },
    set: function set(value) {
      this.setPadding(Yoga.EDGE_RIGHT, value);
    }
  }, {
    key: 'paddingBottom',
    get: function get() {
      return this.layout.getComputedPadding(Yoga.EDGE_BOTTOM) || 0;
    },
    set: function set(value) {
      this.setPadding(Yoga.EDGE_BOTTOM, value);
    }
  }, {
    key: 'paddingLeft',
    get: function get() {
      return this.layout.getComputedPadding(Yoga.EDGE_LEFT) || 0;
    },
    set: function set(value) {
      this.setPadding(Yoga.EDGE_LEFT, value);
    }
  }, {
    key: 'marginTop',
    get: function get() {
      return this.layout.getComputedMargin(Yoga.EDGE_TOP) || 0;
    },
    set: function set(value) {
      this.setMargin(Yoga.EDGE_TOP, value);
    }
  }, {
    key: 'marginRight',
    get: function get() {
      return this.layout.getComputedMargin(Yoga.EDGE_RIGHT) || 0;
    },
    set: function set(value) {
      this.setMargin(Yoga.EDGE_RIGHT, value);
    }
  }, {
    key: 'marginBottom',
    get: function get() {
      return this.layout.getComputedMargin(Yoga.EDGE_BOTTOM) || 0;
    },
    set: function set(value) {
      this.setMargin(Yoga.EDGE_BOTTOM, value);
    }
  }, {
    key: 'marginLeft',
    get: function get() {
      return this.layout.getComputedMargin(Yoga.EDGE_LEFT) || 0;
    },
    set: function set(value) {
      this.setMargin(Yoga.EDGE_LEFT, value);
    }
  }, {
    key: 'borderTopWidth',
    get: function get() {
      return this.layout.getComputedBorder(Yoga.EDGE_TOP) || 0;
    },
    set: function set(value) {
      this.setBorder(Yoga.EDGE_TOP, value);
    }
  }, {
    key: 'borderRightWidth',
    get: function get() {
      return this.layout.getComputedBorder(Yoga.EDGE_RIGHT) || 0;
    },
    set: function set(value) {
      this.setBorder(Yoga.EDGE_RIGHT, value);
    }
  }, {
    key: 'borderBottomWidth',
    get: function get() {
      return this.layout.getComputedBorder(Yoga.EDGE_BOTTOM) || 0;
    },
    set: function set(value) {
      this.setBorder(Yoga.EDGE_BOTTOM, value);
    }
  }, {
    key: 'borderLeftWidth',
    get: function get() {
      return this.layout.getComputedBorder(Yoga.EDGE_LEFT) || 0;
    },
    set: function set(value) {
      this.setBorder(Yoga.EDGE_LEFT, value);
    }
  }, {
    key: 'padding',
    get: function get() {
      return {
        top: this.paddingTop,
        right: this.paddingRight,
        bottom: this.paddingBottom,
        left: this.paddingLeft
      };
    },
    set: function set(value) {
      this.paddingTop = value;
      this.paddingRight = value;
      this.paddingBottom = value;
      this.paddingLeft = value;
    }
  }, {
    key: 'margin',
    get: function get() {
      return {
        top: this.marginTop,
        right: this.marginRight,
        bottom: this.marginBottom,
        left: this.marginLeft
      };
    },
    set: function set(value) {
      this.marginTop = value;
      this.marginRight = value;
      this.marginBottom = value;
      this.marginLeft = value;
    }
  }]);

  return Node;
}();

var yogaValue = function yogaValue(prop, value) {
  var isAlignType = function isAlignType(prop) {
    return prop === 'alignItems' || prop === 'alignContent' || prop === 'alignSelf';
  };

  switch (value) {
    case 'auto':
      if (prop === 'alignSelf') {
        return Yoga.ALIGN_AUTO;
      }
      break;
    case 'flex':
      return Yoga.DISPLAY_FLEX;
    case 'none':
      return Yoga.DISPLAY_NONE;
    case 'row':
      return Yoga.FLEX_DIRECTION_ROW;
    case 'row-reverse':
      return Yoga.FLEX_DIRECTION_ROW_REVERSE;
    case 'column':
      return Yoga.FLEX_DIRECTION_COLUMN;
    case 'column-reverse':
      return Yoga.FLEX_DIRECTION_COLUMN_REVERSE;
    case 'stretch':
      return Yoga.ALIGN_STRETCH;
    case 'baseline':
      return Yoga.ALIGN_BASELINE;
    case 'space-around':
      if (prop === 'justifyContent') {
        return Yoga.JUSTIFY_SPACE_AROUND;
      } else if (isAlignType(prop)) {
        return Yoga.ALIGN_SPACE_AROUND;
      }
      break;
    case 'space-between':
      if (prop === 'justifyContent') {
        return Yoga.JUSTIFY_SPACE_BETWEEN;
      } else if (isAlignType(prop)) {
        return Yoga.ALIGN_SPACE_BETWEEN;
      }
      break;
    case 'around':
      return Yoga.JUSTIFY_SPACE_AROUND;
    case 'between':
      return Yoga.JUSTIFY_SPACE_BETWEEN;
    case 'wrap':
      return Yoga.WRAP_WRAP;
    case 'wrap-reverse':
      return Yoga.WRAP_WRAP_REVERSE;
    case 'nowrap':
      return Yoga.WRAP_NO_WRAP;
    case 'flex-start':
      if (prop === 'justifyContent') {
        return Yoga.JUSTIFY_FLEX_START;
      } else if (isAlignType(prop)) {
        return Yoga.ALIGN_FLEX_START;
      }
      break;
    case 'flex-end':
      if (prop === 'justifyContent') {
        return Yoga.JUSTIFY_FLEX_END;
      } else if (isAlignType(prop)) {
        return Yoga.ALIGN_FLEX_END;
      }
      break;
    case 'center':
      if (prop === 'justifyContent') {
        return Yoga.JUSTIFY_CENTER;
      } else if (isAlignType(prop)) {
        return Yoga.ALIGN_CENTER;
      }
      break;
    default:
      return value;
  }
};

var parseValue = function parseValue(value) {
  var match = /^(\d*\.?\d+)(in|mm|cm|pt)?$/g.exec(value);

  if (match) {
    return { value: parseFloat(match[1], 10), unit: match[2] || 'pt' };
  } else {
    return { value: value, unit: undefined };
  }
};

var parseScalar = function parseScalar(value) {
  var result = {};
  var scalar = parseValue(value);

  switch (scalar.unit) {
    case 'in':
      result = scalar.value * 72;
      break;
    case 'mm':
      result = scalar.value * (1 / 25.4) * 72;
      break;
    case 'cm':
      result = scalar.value * (1 / 2.54) * 72;
      break;
    default:
      result = scalar.value;
  }

  return result;
};

var hasOwnProperty = Object.prototype.hasOwnProperty;

var styleShortHands = {
  margin: {
    marginTop: true,
    marginRight: true,
    marginBottom: true,
    marginLeft: true
  },
  marginHorizontal: {
    marginLeft: true,
    marginRight: true
  },
  marginVertical: {
    marginTop: true,
    marginBottom: true
  },
  padding: {
    paddingTop: true,
    paddingRight: true,
    paddingBottom: true,
    paddingLeft: true
  },
  paddingHorizontal: {
    paddingLeft: true,
    paddingRight: true
  },
  paddingVertical: {
    paddingTop: true,
    paddingBottom: true
  },
  border: {
    borderTopColor: true,
    borderTopStyle: true,
    borderTopWidth: true,
    borderRightColor: true,
    borderRightStyle: true,
    borderRightWidth: true,
    borderBottomColor: true,
    borderBottomStyle: true,
    borderBottomWidth: true,
    borderLeftColor: true,
    borderLeftStyle: true,
    borderLeftWidth: true
  },
  borderTop: {
    borderTopColor: true,
    borderTopStyle: true,
    borderTopWidth: true
  },
  borderRight: {
    borderRightColor: true,
    borderRightStyle: true,
    borderRightWidth: true
  },
  borderBottom: {
    borderBottomColor: true,
    borderBottomStyle: true,
    borderBottomWidth: true
  },
  borderLeft: {
    borderLeftColor: true,
    borderLeftStyle: true,
    borderLeftWidth: true
  },
  borderColor: {
    borderTopColor: true,
    borderRightColor: true,
    borderBottomColor: true,
    borderLeftColor: true
  },
  borderRadius: {
    borderTopLeftRadius: true,
    borderTopRightRadius: true,
    borderBottomRightRadius: true,
    borderBottomLeftRadius: true
  },
  borderStyle: {
    borderTopStyle: true,
    borderRightStyle: true,
    borderBottomStyle: true,
    borderLeftStyle: true
  },
  borderWidth: {
    borderTopWidth: true,
    borderRightWidth: true,
    borderBottomWidth: true,
    borderLeftWidth: true
  }
};

// Expand the shorthand properties to isolate every declaration from the others.
var expandStyles = function expandStyles(style) {
  if (!style) return style;

  var propsArray = _Object$keys(style);
  var resolvedStyle = {};

  for (var i = 0; i < propsArray.length; i++) {
    var key = propsArray[i];
    var value = style[key];

    switch (key) {
      case 'display':
      case 'flex':
      case 'flexDirection':
      case 'flexWrap':
      case 'flexFlow':
      case 'flexGrow':
      case 'flexShrink':
      case 'flexBasis':
      case 'justifyContent':
      case 'alignSelf':
      case 'alignItems':
      case 'alignContent':
      case 'order':
        resolvedStyle[key] = yogaValue(key, value);
        break;
      case 'textAlignVertical':
        resolvedStyle.verticalAlign = value === 'center' ? 'middle' : value;
        break;
      case 'margin':
      case 'marginHorizontal':
      case 'marginVertical':
      case 'padding':
      case 'paddingHorizontal':
      case 'paddingVertical':
      case 'border':
      case 'borderTop':
      case 'borderRight':
      case 'borderBottom':
      case 'borderLeft':
      case 'borderColor':
      case 'borderRadius':
      case 'borderStyle':
      case 'borderWidth':
        {
          var expandedProps = styleShortHands[key];
          for (var propName in expandedProps) {
            if (hasOwnProperty.call(expandedProps, propName)) {
              resolvedStyle[propName] = value;
            }
          }
        }
        break;
      default:
        resolvedStyle[key] = value;
        break;
    }
  }

  return resolvedStyle;
};

var matchBorderShorthand = function matchBorderShorthand(value) {
  return value.match(/(\d+(px|in|mm|cm|pt)?)\s(\S+)\s(\S+)/);
};

// Transforms shorthand border values to correct value
var processBorders = function processBorders(key, value) {
  var match = matchBorderShorthand(value);

  if (match) {
    if (key.match(/.Color/)) {
      return match[4];
    } else if (key.match(/.Style/)) {
      return match[3];
    } else if (key.match(/.Width/)) {
      return match[1];
    } else {
      throw new Error('StyleSheet: Invalid \'' + value + '\' for \'' + key + '\'');
    }
  }

  return value;
};

var transformStyles = function transformStyles(style) {
  var expandedStyles = expandStyles(style);
  var propsArray = _Object$keys(expandedStyles);
  var resolvedStyle = {};

  for (var i = 0; i < propsArray.length; i++) {
    var key = propsArray[i];
    var value = expandedStyles[key];
    var isBorderStyle = key.match(/border/) && typeof value === 'string';
    var resolved = isBorderStyle ? processBorders(key, value) : value;

    resolvedStyle[key] = parseScalar(resolved);
  }

  return resolvedStyle;
};

var create = function create(styles) {
  return styles;
};

var flatten = function flatten(input) {
  if (!Array.isArray(input)) {
    input = [input];
  }

  var result = input.reduce(function (acc, style) {
    if (style) {
      _Object$keys(style).forEach(function (key) {
        if (style[key] !== null && style[key] !== undefined) {
          acc[key] = style[key];
        }
      });
    }

    return acc;
  }, {});

  return result;
};

var resolveMediaQueries = function resolveMediaQueries(input, container) {
  var result = _Object$keys(input).reduce(function (acc, key) {
    var _extends2;

    if (/@media/.test(key)) {
      var _matchMedia;

      return _extends({}, acc, matchMedia((_matchMedia = {}, _matchMedia[key] = input[key], _matchMedia), container));
    }

    return _extends({}, acc, (_extends2 = {}, _extends2[key] = input[key], _extends2));
  }, {});

  return result;
};

var resolve = function resolve(styles, container) {
  if (!styles) return null;

  styles = flatten(styles);
  styles = resolveMediaQueries(styles, container);
  styles = transformStyles(styles);

  return styles;
};

var absoluteFillObject = {
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0
};

var StyleSheet = {
  hairlineWidth: 1,
  create: create,
  resolve: resolve,
  flatten: flatten,
  absoluteFillObject: absoluteFillObject
};

var Debug = {
  debug: function debug() {
    var layout = this.getAbsoluteLayout();
    var padding = this.padding;
    var margin = this.margin;

    this.root.instance.save();

    this.debugContent(layout, margin, padding);
    this.debugPadding(layout, margin, padding);
    this.debugMargin(layout, margin);
    this.debugText(layout, margin);

    this.root.instance.restore();
  },
  debugText: function debugText(layout, margin) {
    var roundedWidth = Math.round(this.width + margin.left + margin.right);
    var roundedHeight = Math.round(this.height + margin.top + margin.bottom);

    this.root.instance.fontSize(4).opacity(1).fillColor('black').text(roundedWidth + ' x ' + roundedHeight, layout.left - margin.left, Math.max(layout.top - margin.top - 4, 1));
  },
  debugContent: function debugContent(layout, margin, padding) {
    this.root.instance.fillColor('#a1c6e7').opacity(0.5).rect(layout.left + padding.left, layout.top + padding.top, layout.width - padding.left - padding.right, layout.height - padding.top - padding.bottom).fill();
  },
  debugPadding: function debugPadding(layout, margin, padding) {
    this.root.instance.fillColor('#c4deb9').opacity(0.5);

    // Padding top
    this.root.instance.rect(layout.left + padding.left, layout.top, layout.width - padding.right - padding.left, padding.top).fill();

    // Padding left
    this.root.instance.rect(layout.left, layout.top, padding.left, layout.height).fill();

    // Padding right
    this.root.instance.rect(layout.left + layout.width - padding.right, layout.top, padding.right, layout.height).fill();

    // Padding bottom
    this.root.instance.rect(layout.left + padding.left, layout.top + layout.height - padding.bottom, layout.width - padding.right - padding.left, padding.bottom).fill();
  },
  debugMargin: function debugMargin(layout, margin) {
    this.root.instance.fillColor('#f8cca1').opacity(0.5);

    // Margin top
    this.root.instance.rect(layout.left, layout.top - margin.top, layout.width, margin.top).fill();

    // Margin left
    this.root.instance.rect(layout.left - margin.left, layout.top - margin.top, margin.left, layout.height + margin.top + margin.bottom).fill();

    // Margin right
    this.root.instance.rect(layout.left + layout.width, layout.top - margin.top, margin.right, layout.height + margin.top + margin.bottom).fill();

    // Margin bottom
    this.root.instance.rect(layout.left, layout.top + layout.height, layout.width, margin.bottom).fill();
  }
};

// Ref: https://www.w3.org/TR/css-backgrounds-3/#borders

// This constant is used to approximate a symmetrical arc using a cubic Bezier curve.
var KAPPA = 4.0 * ((Math.sqrt(2) - 1.0) / 3.0);

function drawBorders() {
  var instance = this.root.instance;

  var layout = this.getAbsoluteLayout();

  var borderTopWidth = this.borderTopWidth,
      borderLeftWidth = this.borderLeftWidth,
      borderRightWidth = this.borderRightWidth,
      borderBottomWidth = this.borderBottomWidth;

  var _getComputedStyles = this.getComputedStyles(),
      _getComputedStyles$bo = _getComputedStyles.borderTopLeftRadius,
      borderTopLeftRadius = _getComputedStyles$bo === undefined ? 0 : _getComputedStyles$bo,
      _getComputedStyles$bo2 = _getComputedStyles.borderTopRightRadius,
      borderTopRightRadius = _getComputedStyles$bo2 === undefined ? 0 : _getComputedStyles$bo2,
      _getComputedStyles$bo3 = _getComputedStyles.borderBottomLeftRadius,
      borderBottomLeftRadius = _getComputedStyles$bo3 === undefined ? 0 : _getComputedStyles$bo3,
      _getComputedStyles$bo4 = _getComputedStyles.borderBottomRightRadius,
      borderBottomRightRadius = _getComputedStyles$bo4 === undefined ? 0 : _getComputedStyles$bo4,
      _getComputedStyles$bo5 = _getComputedStyles.borderTopColor,
      borderTopColor = _getComputedStyles$bo5 === undefined ? 'black' : _getComputedStyles$bo5,
      _getComputedStyles$bo6 = _getComputedStyles.borderTopStyle,
      borderTopStyle = _getComputedStyles$bo6 === undefined ? 'solid' : _getComputedStyles$bo6,
      _getComputedStyles$bo7 = _getComputedStyles.borderLeftColor,
      borderLeftColor = _getComputedStyles$bo7 === undefined ? 'black' : _getComputedStyles$bo7,
      _getComputedStyles$bo8 = _getComputedStyles.borderLeftStyle,
      borderLeftStyle = _getComputedStyles$bo8 === undefined ? 'solid' : _getComputedStyles$bo8,
      _getComputedStyles$bo9 = _getComputedStyles.borderRightColor,
      borderRightColor = _getComputedStyles$bo9 === undefined ? 'black' : _getComputedStyles$bo9,
      _getComputedStyles$bo10 = _getComputedStyles.borderRightStyle,
      borderRightStyle = _getComputedStyles$bo10 === undefined ? 'solid' : _getComputedStyles$bo10,
      _getComputedStyles$bo11 = _getComputedStyles.borderBottomColor,
      borderBottomColor = _getComputedStyles$bo11 === undefined ? 'black' : _getComputedStyles$bo11,
      _getComputedStyles$bo12 = _getComputedStyles.borderBottomStyle,
      borderBottomStyle = _getComputedStyles$bo12 === undefined ? 'solid' : _getComputedStyles$bo12;

  var style = {
    borderTopColor: borderTopColor,
    borderTopWidth: borderTopWidth,
    borderTopStyle: borderTopStyle,
    borderLeftColor: borderLeftColor,
    borderLeftWidth: borderLeftWidth,
    borderLeftStyle: borderLeftStyle,
    borderRightColor: borderRightColor,
    borderRightWidth: borderRightWidth,
    borderRightStyle: borderRightStyle,
    borderBottomColor: borderBottomColor,
    borderBottomWidth: borderBottomWidth,
    borderBottomStyle: borderBottomStyle,
    borderTopLeftRadius: borderTopLeftRadius,
    borderTopRightRadius: borderTopRightRadius,
    borderBottomLeftRadius: borderBottomLeftRadius,
    borderBottomRightRadius: borderBottomRightRadius
  };

  var width = layout.width,
      height = layout.height;

  var rtr = Math.min(borderTopRightRadius, 0.5 * width, 0.5 * height);
  var rtl = Math.min(borderTopLeftRadius, 0.5 * width, 0.5 * height);
  var rbr = Math.min(borderBottomRightRadius, 0.5 * width, 0.5 * height);
  var rbl = Math.min(borderBottomLeftRadius, 0.5 * width, 0.5 * height);

  instance.save();

  if (borderTopWidth) {
    instance.save();
    clipBorderTop(instance, layout, style, rtr, rtl);
    fillBorderTop(instance, layout, style, rtr, rtl);
    instance.restore();
  }

  if (borderRightWidth) {
    instance.save();
    clipBorderRight(instance, layout, style, rtr, rbr);
    fillBorderRight(instance, layout, style, rtr, rbr);
    instance.restore();
  }

  if (borderBottomWidth) {
    instance.save();
    clipBorderBottom(instance, layout, style, rbl, rbr);
    fillBorderBottom(instance, layout, style, rbl, rbr);
    instance.restore();
  }

  if (borderLeftWidth) {
    instance.save();
    clipBorderLeft(instance, layout, style, rbl, rtl);
    fillBorderLeft(instance, layout, style, rbl, rtl);
    instance.restore();
  }

  instance.restore();
}

var clipBorderTop = function clipBorderTop(ctx, layout, style, rtr, rtl) {
  var top = layout.top,
      left = layout.left,
      width = layout.width,
      height = layout.height;
  var borderTopWidth = style.borderTopWidth,
      borderRightWidth = style.borderRightWidth,
      borderLeftWidth = style.borderLeftWidth;

  // Clip outer top border edge

  ctx.moveTo(left + rtl, top);
  ctx.lineTo(left + width - rtr, top);

  // Ellipse coefficients outer top right cap
  var c0 = rtr * (1.0 - KAPPA);

  // Clip outer top right cap
  ctx.bezierCurveTo(left + width - c0, top, left + width, top + c0, left + width, top + rtr);

  // Move down in case the margin exceedes the radius
  var topRightYCoord = top + Math.max(borderTopWidth, rtr);
  ctx.lineTo(left + width, topRightYCoord);

  // Clip inner top right cap
  ctx.lineTo(left + width - borderRightWidth, topRightYCoord);

  // Ellipse coefficients inner top right cap
  var innerTopRightRadiusX = Math.max(rtr - borderRightWidth, 0);
  var innerTopRightRadiusY = Math.max(rtr - borderTopWidth, 0);
  var c1 = innerTopRightRadiusX * (1.0 - KAPPA);
  var c2 = innerTopRightRadiusY * (1.0 - KAPPA);

  // Clip inner top right cap
  ctx.bezierCurveTo(left + width - borderRightWidth, top + borderTopWidth + c2, left + width - borderRightWidth - c1, top + borderTopWidth, left + width - borderRightWidth - innerTopRightRadiusX, top + borderTopWidth);

  // Clip inner top border edge
  ctx.lineTo(left + Math.max(rtl, borderLeftWidth), top + borderTopWidth);

  // Ellipse coefficients inner top left cap
  var innerTopLeftRadiusX = Math.max(rtl - borderLeftWidth, 0);
  var innerTopLeftRadiusY = Math.max(rtl - borderTopWidth, 0);
  var c3 = innerTopLeftRadiusX * (1.0 - KAPPA);
  var c4 = innerTopLeftRadiusY * (1.0 - KAPPA);
  var topLeftYCoord = top + Math.max(borderTopWidth, rtl);

  // Clip inner top left cap
  ctx.bezierCurveTo(left + borderLeftWidth + c3, top + borderTopWidth, left + borderLeftWidth, top + borderTopWidth + c4, left + borderLeftWidth, topLeftYCoord);
  ctx.lineTo(left, topLeftYCoord);

  // Move down in case the margin exceedes the radius
  ctx.lineTo(left, top + rtl);

  // Ellipse coefficients outer top left cap
  var c5 = rtl * (1.0 - KAPPA);

  // Clip outer top left cap
  ctx.bezierCurveTo(left, top + c5, left + c5, top, left + rtl, top);
  ctx.closePath();
  ctx.clip();

  // Clip border top cap joins
  if (borderRightWidth) {
    var trSlope = -borderTopWidth / borderRightWidth;
    ctx.moveTo(left + width / 2, trSlope * (-width / 2) + top);
    ctx.lineTo(left + width, top);
    ctx.lineTo(left, top);
    ctx.lineTo(left, top + height);
    ctx.closePath();
    ctx.clip();
  }

  if (borderLeftWidth) {
    var _trSlope = -borderTopWidth / borderLeftWidth;
    ctx.moveTo(left + width / 2, _trSlope * (-width / 2) + top);
    ctx.lineTo(left, top);
    ctx.lineTo(left + width, top);
    ctx.lineTo(left + width, top + height);
    ctx.closePath();
    ctx.clip();
  }
};

var fillBorderTop = function fillBorderTop(ctx, layout, style, rtr, rtl) {
  var top = layout.top,
      left = layout.left,
      width = layout.width;
  var borderTopColor = style.borderTopColor,
      borderTopWidth = style.borderTopWidth,
      borderTopStyle = style.borderTopStyle,
      borderRightWidth = style.borderRightWidth,
      borderLeftWidth = style.borderLeftWidth;


  var c0 = rtl * (1.0 - KAPPA);
  var c1 = rtr * (1.0 - KAPPA);

  ctx.moveTo(left, top + Math.max(rtl, borderTopWidth));
  ctx.bezierCurveTo(left, top + c0, left + c0, top, left + rtl, top);
  ctx.lineTo(left + width - rtr, top);
  ctx.bezierCurveTo(left + width - c1, top, left + width, top + c1, left + width, top + rtr);

  ctx.strokeColor(borderTopColor);
  ctx.lineWidth(Math.max(borderRightWidth, borderTopWidth, borderLeftWidth) * 2);

  if (borderTopStyle === 'dashed') {
    ctx.dash(borderTopWidth * 2, { space: borderTopWidth * 1.2 });
  } else if (borderTopStyle === 'dotted') {
    ctx.dash(borderTopWidth, { space: borderTopWidth * 1.2 });
  }

  ctx.stroke();
  ctx.undash();
};

var clipBorderRight = function clipBorderRight(ctx, layout, style, rtr, rbr) {
  var top = layout.top,
      left = layout.left,
      width = layout.width,
      height = layout.height;
  var borderTopWidth = style.borderTopWidth,
      borderRightWidth = style.borderRightWidth,
      borderBottomWidth = style.borderBottomWidth;

  // Clip outer right border edge

  ctx.moveTo(left + width, top + rtr);
  ctx.lineTo(left + width, top + height - rbr);

  // Ellipse coefficients outer bottom right cap
  var c0 = rbr * (1.0 - KAPPA);

  // Clip outer top right cap
  ctx.bezierCurveTo(left + width, top + height - c0, left + width - c0, top + height, left + width - rbr, top + height);

  // Move left in case the margin exceedes the radius
  var topBottomXCoord = left + width - Math.max(borderRightWidth, rbr);
  ctx.lineTo(topBottomXCoord, top + height);

  // Clip inner bottom right cap
  ctx.lineTo(topBottomXCoord, top + height - borderBottomWidth);

  // Ellipse coefficients inner bottom right cap
  var innerBottomRightRadiusX = Math.max(rbr - borderRightWidth, 0);
  var innerBottomRightRadiusY = Math.max(rbr - borderBottomWidth, 0);
  var c1 = innerBottomRightRadiusX * (1.0 - KAPPA);
  var c2 = innerBottomRightRadiusY * (1.0 - KAPPA);

  // Clip inner top right cap
  ctx.bezierCurveTo(left + width - borderRightWidth - c1, top + height - borderBottomWidth, left + width - borderRightWidth, top + height - borderBottomWidth - c2, left + width - borderRightWidth, top + height - Math.max(rbr, borderBottomWidth));

  // Clip inner right border edge
  ctx.lineTo(left + width - borderRightWidth, top + Math.max(rtr, borderTopWidth));

  // Ellipse coefficients inner top right cap
  var innerTopRightRadiusX = Math.max(rtr - borderRightWidth, 0);
  var innerTopRightRadiusY = Math.max(rtr - borderTopWidth, 0);
  var c3 = innerTopRightRadiusX * (1.0 - KAPPA);
  var c4 = innerTopRightRadiusY * (1.0 - KAPPA);
  var topRightXCoord = left + width - Math.max(rtr, borderRightWidth);

  // Clip inner top left cap
  ctx.bezierCurveTo(left + width - borderRightWidth, top + borderTopWidth + c4, left + width - borderRightWidth - c3, top + borderTopWidth, topRightXCoord, top + borderTopWidth);
  ctx.lineTo(topRightXCoord, top);

  // Move right in case the margin exceedes the radius
  ctx.lineTo(left + width - rtr, top);

  // Ellipse coefficients outer top right cap
  var c5 = rtr * (1.0 - KAPPA);

  // Clip outer top right cap
  ctx.bezierCurveTo(left + width - c5, top, left + width, top + c5, left + width, top + rtr);

  ctx.closePath();
  ctx.clip();

  // Clip border right cap joins
  if (borderTopWidth) {
    var trSlope = -borderTopWidth / borderRightWidth;
    ctx.moveTo(left + width / 2, trSlope * (-width / 2) + top);
    ctx.lineTo(left + width, top);
    ctx.lineTo(left + width, top + height);
    ctx.lineTo(left, top + height);
    ctx.closePath();
    ctx.clip();
  }

  if (borderBottomWidth) {
    var brSlope = borderBottomWidth / borderRightWidth;
    ctx.moveTo(left + width / 2, brSlope * (-width / 2) + top + height);
    ctx.lineTo(left + width, top + height);
    ctx.lineTo(left + width, top);
    ctx.lineTo(left, top);
    ctx.closePath();
    ctx.clip();
  }
};

var fillBorderRight = function fillBorderRight(ctx, layout, style, rtr, rbr) {
  var top = layout.top,
      left = layout.left,
      width = layout.width,
      height = layout.height;
  var borderRightColor = style.borderRightColor,
      borderRightStyle = style.borderRightStyle,
      borderRightWidth = style.borderRightWidth,
      borderTopWidth = style.borderTopWidth,
      borderBottomWidth = style.borderBottomWidth;


  var c0 = rbr * (1.0 - KAPPA);
  var c1 = rtr * (1.0 - KAPPA);

  ctx.moveTo(left + width - rtr, top);
  ctx.bezierCurveTo(left + width - c1, top, left + width, top + c1, left + width, top + rtr);
  ctx.lineTo(left + width, top + height - rbr);
  ctx.bezierCurveTo(left + width, top + height - c0, left + width - c0, top + height, left + width - rbr, top + height);

  ctx.strokeColor(borderRightColor);
  ctx.lineWidth(Math.max(borderRightWidth, borderTopWidth, borderBottomWidth) * 2);

  if (borderRightStyle === 'dashed') {
    ctx.dash(borderRightWidth * 2, { space: borderRightWidth * 1.2 });
  } else if (borderRightStyle === 'dotted') {
    ctx.dash(borderRightWidth, { space: borderRightWidth * 1.2 });
  }

  ctx.stroke();
  ctx.undash();
};

var clipBorderBottom = function clipBorderBottom(ctx, layout, style, rbl, rbr) {
  var top = layout.top,
      left = layout.left,
      width = layout.width,
      height = layout.height;
  var borderBottomWidth = style.borderBottomWidth,
      borderRightWidth = style.borderRightWidth,
      borderLeftWidth = style.borderLeftWidth;

  // Clip outer top border edge

  ctx.moveTo(left + width - rbr, top + height);
  ctx.lineTo(left + rbl, top + height);

  // Ellipse coefficients outer top right cap
  var c0 = rbl * (1.0 - KAPPA);

  // Clip outer top right cap
  ctx.bezierCurveTo(left + c0, top + height, left, top + height - c0, left, top + height - rbl);

  // Move up in case the margin exceedes the radius
  var bottomLeftYCoord = top + height - Math.max(borderBottomWidth, rbl);
  ctx.lineTo(left, bottomLeftYCoord);

  // Clip inner bottom left cap
  ctx.lineTo(left + borderLeftWidth, bottomLeftYCoord);

  // Ellipse coefficients inner top right cap
  var innerBottomLeftRadiusX = Math.max(rbl - borderLeftWidth, 0);
  var innerBottomLeftRadiusY = Math.max(rbl - borderBottomWidth, 0);
  var c1 = innerBottomLeftRadiusX * (1.0 - KAPPA);
  var c2 = innerBottomLeftRadiusY * (1.0 - KAPPA);

  // Clip inner bottom left cap
  ctx.bezierCurveTo(left + borderLeftWidth, top + height - borderBottomWidth - c2, left + borderLeftWidth + c1, top + height - borderBottomWidth, left + borderLeftWidth + innerBottomLeftRadiusX, top + height - borderBottomWidth);

  // Clip inner bottom border edge
  ctx.lineTo(left + width - Math.max(rbr, borderRightWidth), top + height - borderBottomWidth);

  // Ellipse coefficients inner top left cap
  var innerBottomRightRadiusX = Math.max(rbr - borderRightWidth, 0);
  var innerBottomRightRadiusY = Math.max(rbr - borderBottomWidth, 0);
  var c3 = innerBottomRightRadiusX * (1.0 - KAPPA);
  var c4 = innerBottomRightRadiusY * (1.0 - KAPPA);
  var bottomRightYCoord = top + height - Math.max(borderBottomWidth, rbr);

  // Clip inner top left cap
  ctx.bezierCurveTo(left + width - borderRightWidth - c3, top + height - borderBottomWidth, left + width - borderRightWidth, top + height - borderBottomWidth - c4, left + width - borderRightWidth, bottomRightYCoord);
  ctx.lineTo(left + width, bottomRightYCoord);

  // Move down in case the margin exceedes the radius
  ctx.lineTo(left + width, top + height - rbr);

  // Ellipse coefficients outer top left cap
  var c5 = rbr * (1.0 - KAPPA);

  // Clip outer top left cap
  ctx.bezierCurveTo(left + width, top + height - c5, left + width - c5, top + height, left + width - rbr, top + height);
  ctx.closePath();
  ctx.clip();

  // Clip border bottom cap joins
  if (borderRightWidth) {
    var brSlope = borderBottomWidth / borderRightWidth;
    ctx.moveTo(left + width / 2, brSlope * (-width / 2) + top + height);
    ctx.lineTo(left + width, top + height);
    ctx.lineTo(left, top + height);
    ctx.lineTo(left, top);
    ctx.closePath();
    ctx.clip();
  }

  if (borderLeftWidth) {
    var trSlope = -borderBottomWidth / borderLeftWidth;
    ctx.moveTo(left + width / 2, trSlope * (width / 2) + top + height);
    ctx.lineTo(left, top + height);
    ctx.lineTo(left + width, top + height);
    ctx.lineTo(left + width, top);
    ctx.closePath();
    ctx.clip();
  }
};

var fillBorderBottom = function fillBorderBottom(ctx, layout, style, rbl, rbr) {
  var top = layout.top,
      left = layout.left,
      width = layout.width,
      height = layout.height;
  var borderBottomColor = style.borderBottomColor,
      borderBottomStyle = style.borderBottomStyle,
      borderBottomWidth = style.borderBottomWidth,
      borderRightWidth = style.borderRightWidth,
      borderLeftWidth = style.borderLeftWidth;


  var c0 = rbl * (1.0 - KAPPA);
  var c1 = rbr * (1.0 - KAPPA);

  ctx.moveTo(left + width, top + height - rbr);
  ctx.bezierCurveTo(left + width, top + height - c1, left + width - c1, top + height, left + width - rbr, top + height);
  ctx.lineTo(left + rbl, top + height);
  ctx.bezierCurveTo(left + c0, top + height, left, top + height - c0, left, top + height - rbl);

  ctx.strokeColor(borderBottomColor);
  ctx.lineWidth(Math.max(borderBottomWidth, borderRightWidth, borderLeftWidth) * 2);

  if (borderBottomStyle === 'dashed') {
    ctx.dash(borderBottomWidth * 2, { space: borderBottomWidth * 1.2 });
  } else if (borderBottomStyle === 'dotted') {
    ctx.dash(borderBottomWidth, { space: borderBottomWidth * 1.2 });
  }

  ctx.stroke();
  ctx.undash();
};

var clipBorderLeft = function clipBorderLeft(ctx, layout, style, rbl, rtl) {
  var top = layout.top,
      left = layout.left,
      width = layout.width,
      height = layout.height;
  var borderTopWidth = style.borderTopWidth,
      borderLeftWidth = style.borderLeftWidth,
      borderBottomWidth = style.borderBottomWidth;

  // Clip outer left border edge

  ctx.moveTo(left, top + height - rbl);
  ctx.lineTo(left, top + rtl);

  // Ellipse coefficients outer top left cap
  var c0 = rtl * (1.0 - KAPPA);

  // Clip outer top left cap
  ctx.bezierCurveTo(left, top + c0, left + c0, top, left + rtl, top);

  // Move right in case the margin exceedes the radius
  var topLeftCoordX = left + Math.max(borderLeftWidth, rtl);
  ctx.lineTo(topLeftCoordX, top);

  // Clip inner top left cap
  ctx.lineTo(topLeftCoordX, top + borderTopWidth);

  // Ellipse coefficients inner top left cap
  var innerTopLeftRadiusX = Math.max(rtl - borderLeftWidth, 0);
  var innerTopLeftRadiusY = Math.max(rtl - borderTopWidth, 0);
  var c1 = innerTopLeftRadiusX * (1.0 - KAPPA);
  var c2 = innerTopLeftRadiusY * (1.0 - KAPPA);

  // Clip inner top right cap
  ctx.bezierCurveTo(left + borderLeftWidth + c1, top + borderTopWidth, left + borderLeftWidth, top + borderTopWidth + c2, left + borderLeftWidth, top + Math.max(rtl, borderTopWidth));

  // Clip inner left border edge
  ctx.lineTo(left + borderLeftWidth, top + height - Math.max(rbl, borderBottomWidth));

  // Ellipse coefficients inner bottom left cap
  var innerBottomLeftRadiusX = Math.max(rbl - borderLeftWidth, 0);
  var innerBottomLeftRadiusY = Math.max(rbl - borderBottomWidth, 0);
  var c3 = innerBottomLeftRadiusX * (1.0 - KAPPA);
  var c4 = innerBottomLeftRadiusY * (1.0 - KAPPA);
  var bottomLeftXCoord = left + Math.max(rbl, borderLeftWidth);

  // Clip inner top left cap
  ctx.bezierCurveTo(left + borderLeftWidth, top + height - borderBottomWidth - c4, left + borderLeftWidth + c3, top + height - borderBottomWidth, bottomLeftXCoord, top + height - borderBottomWidth);
  ctx.lineTo(bottomLeftXCoord, top + height);

  // Move left in case the margin exceedes the radius
  ctx.lineTo(left + rbl, top + height);

  // Ellipse coefficients outer top right cap
  var c5 = rbl * (1.0 - KAPPA);

  // Clip outer top right cap
  ctx.bezierCurveTo(left + c5, top + height, left, top + height - c5, left, top + height - rbl);

  ctx.closePath();
  ctx.clip();

  // Clip border right cap joins
  if (borderBottomWidth) {
    var trSlope = -borderBottomWidth / borderLeftWidth;
    ctx.moveTo(left + width / 2, trSlope * (width / 2) + top + height);
    ctx.lineTo(left, top + height);
    ctx.lineTo(left, top);
    ctx.lineTo(left + width, top);
    ctx.closePath();
    ctx.clip();
  }

  if (borderBottomWidth) {
    var _trSlope2 = -borderTopWidth / borderLeftWidth;
    ctx.moveTo(left + width / 2, _trSlope2 * (-width / 2) + top);
    ctx.lineTo(left, top);
    ctx.lineTo(left, top + height);
    ctx.lineTo(left + width, top + height);
    ctx.closePath();
    ctx.clip();
  }
};

var fillBorderLeft = function fillBorderLeft(ctx, layout, style, rbl, rtl) {
  var top = layout.top,
      left = layout.left,
      height = layout.height;
  var borderLeftColor = style.borderLeftColor,
      borderLeftStyle = style.borderLeftStyle,
      borderLeftWidth = style.borderLeftWidth,
      borderTopWidth = style.borderTopWidth,
      borderBottomWidth = style.borderBottomWidth;


  var c0 = rbl * (1.0 - KAPPA);
  var c1 = rtl * (1.0 - KAPPA);

  ctx.moveTo(left + rbl, top + height);
  ctx.bezierCurveTo(left + c0, top + height, left, top + height - c0, left, top + height - rbl);
  ctx.lineTo(left, top + rtl);
  ctx.bezierCurveTo(left, top + c1, left + c1, top, left + rtl, top);

  ctx.strokeColor(borderLeftColor);
  ctx.lineWidth(Math.max(borderLeftWidth, borderTopWidth, borderBottomWidth) * 2);

  if (borderLeftStyle === 'dashed') {
    ctx.dash(borderLeftWidth * 2, { space: borderLeftWidth * 1.2 });
  } else if (borderLeftStyle === 'dotted') {
    ctx.dash(borderLeftWidth, { space: borderLeftWidth * 1.2 });
  }

  ctx.stroke();
  ctx.undash();
};

var Borders = { drawBorders: drawBorders };

// This constant is used to approximate a symmetrical arc using a cubic
// Bezier curve.
var KAPPA$1 = 4.0 * ((Math.sqrt(2) - 1.0) / 3.0);

var Clipping = {
  clip: function clip() {
    var _getAbsoluteLayout = this.getAbsoluteLayout(),
        top = _getAbsoluteLayout.top,
        left = _getAbsoluteLayout.left,
        width = _getAbsoluteLayout.width,
        height = _getAbsoluteLayout.height;

    var _getComputedStyles = this.getComputedStyles(),
        _getComputedStyles$bo = _getComputedStyles.borderTopLeftRadius,
        borderTopLeftRadius = _getComputedStyles$bo === undefined ? 0 : _getComputedStyles$bo,
        _getComputedStyles$bo2 = _getComputedStyles.borderTopRightRadius,
        borderTopRightRadius = _getComputedStyles$bo2 === undefined ? 0 : _getComputedStyles$bo2,
        _getComputedStyles$bo3 = _getComputedStyles.borderBottomRightRadius,
        borderBottomRightRadius = _getComputedStyles$bo3 === undefined ? 0 : _getComputedStyles$bo3,
        _getComputedStyles$bo4 = _getComputedStyles.borderBottomLeftRadius,
        borderBottomLeftRadius = _getComputedStyles$bo4 === undefined ? 0 : _getComputedStyles$bo4;

    // Border top


    var rtr = Math.min(borderTopRightRadius, 0.5 * width, 0.5 * height);
    var ctr = rtr * (1.0 - KAPPA$1);

    this.root.instance.moveTo(left + rtr, top);
    this.root.instance.lineTo(left + width - rtr, top);
    this.root.instance.bezierCurveTo(left + width - ctr, top, left + width, top + ctr, left + width, top + rtr);

    // Border right
    var rbr = Math.min(borderBottomRightRadius, 0.5 * width, 0.5 * height);
    var cbr = rbr * (1.0 - KAPPA$1);

    this.root.instance.lineTo(left + width, top + height - rbr);
    this.root.instance.bezierCurveTo(left + width, top + height - cbr, left + width - cbr, top + height, left + width - rbr, top + height);

    // Border bottom
    var rbl = Math.min(borderBottomLeftRadius, 0.5 * width, 0.5 * height);
    var cbl = rbl * (1.0 - KAPPA$1);

    this.root.instance.lineTo(left + rbl, top + height);
    this.root.instance.bezierCurveTo(left + cbl, top + height, left, top + height - cbl, left, top + height - rbl);

    // Border left
    var rtl = Math.min(borderTopLeftRadius, 0.5 * width, 0.5 * height);
    var ctl = rtl * (1.0 - KAPPA$1);

    this.root.instance.lineTo(left, top + rtl);
    this.root.instance.bezierCurveTo(left, top + ctl, left + ctl, top, left + rtl, top);
    this.root.instance.closePath();
    this.root.instance.clip();
  }
};

var getRotation = function getRotation(transform) {
  var match = /rotate\((-?\d+.?\d+)(.+)\)/g.exec(transform);

  if (match && match[1] && match[2]) {
    var value = match[1];
    return match[2] === 'rad' ? value * 180 / Math.PI : value;
  }

  return 0;
};

var getTranslateX = function getTranslateX(transform) {
  var matchX = /translateX\((-?\d+\.?d*)\)/g.exec(transform);
  var matchGeneric = /translate\((-?\d+\.?d*).*,\s*(-?\d+\.?d*).*\)/g.exec(transform);

  if (matchX && matchX[1]) return matchX[1];
  if (matchGeneric && matchGeneric[1]) return matchGeneric[1];

  return 0;
};

var getTranslateY = function getTranslateY(transform) {
  var matchY = /translateY\((-?\d+\.?\d*)\)/g.exec(transform);
  var matchGeneric = /translate\((-?\d+\.?\d*).*,\s*(-?\d+\.?\d*).*\)/g.exec(transform);

  if (matchY && matchY[1]) return matchY[1];
  if (matchGeneric && matchGeneric[2]) return matchGeneric[2];

  return 0;
};

var getScaleX = function getScaleX(transform) {
  var matchX = /scaleX\((-?\d+\.?\d*)\)/g.exec(transform);
  var matchGeneric = /scale\((-?\d+\.?\d*).*,\s*(-?\d+\.?\d*).*\)/g.exec(transform);

  if (matchX && matchX[1]) return matchX[1];
  if (matchGeneric && matchGeneric[1]) return matchGeneric[1];

  return 1;
};

var getScaleY = function getScaleY(transform) {
  var matchY = /scaleY\((-?\d+\.?\d*)\)/g.exec(transform);
  var matchGeneric = /scale\((-?\d+\.?\d*).*,\s*(-?\d+\.?\d*).*\)/g.exec(transform);

  if (matchY && matchY[1]) return matchY[1];
  if (matchGeneric && matchGeneric[2]) return matchGeneric[2];

  return 1;
};

var getMatrix = function getMatrix(transform) {
  var match = /matrix\(([^,]+),([^,]+),([^,]+),([^,]+),([^,]+),([^,]+)\)/g.exec(transform);
  if (match) return match.slice(1, 7);
  return null;
};

var applySingleTransformation = function applySingleTransformation(element, transform) {
  var _element$getAbsoluteL = element.getAbsoluteLayout(),
      left = _element$getAbsoluteL.left,
      top = _element$getAbsoluteL.top,
      width = _element$getAbsoluteL.width,
      height = _element$getAbsoluteL.height;

  var origin = [left + width / 2, top + height / 2];

  if (/rotate/g.test(transform)) {
    element.root.instance.rotate(getRotation(transform), { origin: origin });
  } else if (/scaleX/g.test(transform)) {
    element.root.instance.scale(getScaleX(transform), 1, { origin: origin });
  } else if (/scaleY/g.test(transform)) {
    element.root.instance.scale(1, getScaleY(transform), { origin: origin });
  } else if (/scale/g.test(transform)) {
    element.root.instance.scale(getScaleX(transform), getScaleY(transform), {
      origin: origin
    });
  } else if (/translateX/g.test(transform)) {
    element.root.instance.translate(getTranslateX(transform), 1, { origin: origin });
  } else if (/translateY/g.test(transform)) {
    element.root.instance.translate(1, getTranslateY(transform), { origin: origin });
  } else if (/translate/g.test(transform)) {
    element.root.instance.translate(getTranslateX(transform), getTranslateY(transform), { origin: origin });
  } else if (/matrix/g.test(transform)) {
    var _element$root$instanc;

    (_element$root$instanc = element.root.instance).transform.apply(_element$root$instanc, getMatrix(transform));
  }
};

var Transformations = {
  applyTransformations: function applyTransformations() {
    var match = void 0;
    var re = /[a-zA-Z]+\([^)]+\)/g;
    var transform = this.style && this.style.transform || '';

    while ((match = re.exec(transform)) != null) {
      applySingleTransformation(this, match[0]);
    }
  }
};

var Base = function (_Node) {
  _inherits(Base, _Node);

  function Base(root, props) {
    _classCallCheck(this, Base);

    var _this = _possibleConstructorReturn(this, _Node.call(this));

    _this.root = root;
    _this.props = merge({}, _this.constructor.defaultProps, Base.defaultProps, props);

    warning(!_this.props.styles, '"styles" prop passed instead of "style" prop');
    return _this;
  }

  Base.prototype.appendChild = function appendChild(child) {
    _Node.prototype.appendChild.call(this, child);
    this.root.markDirty();
  };

  Base.prototype.appendChildBefore = function appendChildBefore(child, beforeChild) {
    _Node.prototype.appendChildBefore.call(this, child, beforeChild);
    this.root.markDirty();
  };

  Base.prototype.removeChild = function removeChild(child) {
    _Node.prototype.removeChild.call(this, child);
    this.root.markDirty();
  };

  Base.prototype.update = function update(newProps) {
    this.props = merge({}, this.constructor.defaultProps, Base.defaultProps, newProps);
    this.root.markDirty();
  };

  Base.prototype.applyProps = function applyProps() {
    var _this2 = this;

    var _page = this.page,
        size = _page.size,
        orientation = _page.orientation;


    this.style = StyleSheet.resolve(this.props.style, {
      width: size.width,
      height: size.height,
      orientation: orientation
    });

    toPairsIn(this.style).map(function (_ref) {
      var attribute = _ref[0],
          value = _ref[1];

      _this2.applyStyle(attribute, value);
    });

    this.children.forEach(function (child) {
      if (child.applyProps) {
        child.applyProps();
      }
    });
  };

  Base.prototype.applyStyle = function applyStyle(attribute, value) {
    var setter = 'set' + upperFirst(attribute);

    switch (attribute) {
      case 'marginTop':
      case 'marginRight':
      case 'marginBottom':
      case 'marginLeft':
      case 'paddingTop':
      case 'paddingRight':
      case 'paddingBottom':
      case 'paddingLeft':
      case 'borderTopWidth':
      case 'borderRightWidth':
      case 'borderBottomWidth':
      case 'borderLeftWidth':
      case 'position':
      case 'top':
      case 'right':
      case 'bottom':
      case 'left':
      case 'width':
      case 'height':
      case 'minHeight':
      case 'maxHeight':
      case 'minWidth':
      case 'maxWidth':
        this[attribute] = value;
        break;
      default:
        if (isFunction(this.layout[setter])) {
          this.layout[setter](value);
        }
    }
  };

  Base.prototype.getComputedStyles = function getComputedStyles() {
    var element = this.parent;
    var inheritedStyles = {};

    while (element && element.parent) {
      inheritedStyles = _extends({}, element.parent.style, element.style, inheritedStyles);
      element = element.parent;
    }

    return _extends({}, pick(inheritedStyles, inheritedProperties), this.style);
  };

  Base.prototype.getLayoutData = function getLayoutData() {
    var layout = this.getAbsoluteLayout();

    return {
      type: this.name,
      top: layout.top,
      left: layout.left,
      width: layout.width,
      height: layout.height,
      style: this.getComputedStyles(),
      children: this.children.map(function (c) {
        return c.getLayoutData();
      })
    };
  };

  Base.prototype.drawBackgroundColor = function drawBackgroundColor() {
    var _getAbsoluteLayout = this.getAbsoluteLayout(),
        left = _getAbsoluteLayout.left,
        top = _getAbsoluteLayout.top,
        width = _getAbsoluteLayout.width,
        height = _getAbsoluteLayout.height;

    var styles = this.getComputedStyles();

    if (styles.backgroundColor) {
      this.root.instance.save();

      this.clip();

      this.root.instance.fillColor(styles.backgroundColor).rect(left, top, width, height).fill().restore();
    }
  };

  Base.prototype.clone = function clone() {
    var clone = new this.constructor(this.root, this.props);

    clone.copyStyle(this);
    clone.style = this.style;

    return clone;
  };

  Base.prototype.onNodeSplit = function onNodeSplit(height, clone) {
    this.calculateLayout();

    clone.marginTop = 0;
    clone.paddingTop = 0;

    // If a height was given to the element, we need to substract the remaining wrapping height
    // If not, we just let Yoga calculate the appropiate height when layout get's calculated.
    if (clone.style.height) {
      clone.height = this.height - height;
    }

    this.height = height;
    this.marginBottom = 0;
    this.paddingBottom = 0;
  };

  Base.prototype.renderChildren = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
      var absoluteChilds, nonAbsoluteChilds, i, _i;

      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              absoluteChilds = this.children.filter(function (child) {
                return child.absolute;
              });
              nonAbsoluteChilds = this.children.filter(function (child) {
                return !child.absolute;
              });
              i = 0;

            case 3:
              if (!(i < nonAbsoluteChilds.length)) {
                _context.next = 9;
                break;
              }

              _context.next = 6;
              return nonAbsoluteChilds[i].render();

            case 6:
              i++;
              _context.next = 3;
              break;

            case 9:
              _i = 0;

            case 10:
              if (!(_i < absoluteChilds.length)) {
                _context.next = 16;
                break;
              }

              _context.next = 13;
              return absoluteChilds[_i].render();

            case 13:
              _i++;
              _context.next = 10;
              break;

            case 16:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function renderChildren() {
      return _ref2.apply(this, arguments);
    }

    return renderChildren;
  }();

  _createClass(Base, [{
    key: 'page',
    get: function get() {
      return this.parent.page;
    }
  }, {
    key: 'wrap',
    get: function get() {
      return this.props.wrap;
    }
  }, {
    key: 'break',
    get: function get() {
      return this.props.break;
    },
    set: function set(value) {
      this.props.break = value;
    }
  }, {
    key: 'fixed',
    get: function get() {
      return this.props.fixed;
    }
  }, {
    key: 'minPresenceAhead',
    get: function get() {
      return this.props.minPresenceAhead;
    }
  }, {
    key: 'absolute',
    get: function get() {
      return this.props.style.position === 'absolute';
    }
  }]);

  return Base;
}(Node$1);

Base.defaultProps = {
  style: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0
  },
  minPresenceAhead: 0
};

_Object$assign(Base.prototype, Debug);
_Object$assign(Base.prototype, Borders);
_Object$assign(Base.prototype, Clipping);
_Object$assign(Base.prototype, Transformations);

var TextInstance = function () {
  function TextInstance(root, value) {
    _classCallCheck(this, TextInstance);

    this.root = root;
    this.value = value;
    this.parent = null;
    this.props = {};
  }

  TextInstance.prototype.getLayoutData = function getLayoutData() {
    return this.value;
  };

  TextInstance.prototype.remove = function remove() {
    this.parent.removeChild(this);
  };

  TextInstance.prototype.clone = function clone() {
    return new this.constructor(this.root, this.value);
  };

  TextInstance.prototype.update = function update(value) {
    this.value = value;
    this.parent.computed = false;
    this.parent._container = null;
    this.root.markDirty();
  };

  _createClass(TextInstance, [{
    key: 'name',
    get: function get() {
      return 'TextInstance';
    }
  }]);

  return TextInstance;
}();

var PAGE_SIZES = {
  '4A0': [4767.87, 6740.79],
  '2A0': [3370.39, 4767.87],
  A0: [2383.94, 3370.39],
  A1: [1683.78, 2383.94],
  A2: [1190.55, 1683.78],
  A3: [841.89, 1190.55],
  A4: [595.28, 841.89],
  A5: [419.53, 595.28],
  A6: [297.64, 419.53],
  A7: [209.76, 297.64],
  A8: [147.4, 209.76],
  A9: [104.88, 147.4],
  A10: [73.7, 104.88],
  B0: [2834.65, 4008.19],
  B1: [2004.09, 2834.65],
  B2: [1417.32, 2004.09],
  B3: [1000.63, 1417.32],
  B4: [708.66, 1000.63],
  B5: [498.9, 708.66],
  B6: [354.33, 498.9],
  B7: [249.45, 354.33],
  B8: [175.75, 249.45],
  B9: [124.72, 175.75],
  B10: [87.87, 124.72],
  C0: [2599.37, 3676.54],
  C1: [1836.85, 2599.37],
  C2: [1298.27, 1836.85],
  C3: [918.43, 1298.27],
  C4: [649.13, 918.43],
  C5: [459.21, 649.13],
  C6: [323.15, 459.21],
  C7: [229.61, 323.15],
  C8: [161.57, 229.61],
  C9: [113.39, 161.57],
  C10: [79.37, 113.39],
  RA0: [2437.8, 3458.27],
  RA1: [1729.13, 2437.8],
  RA2: [1218.9, 1729.13],
  RA3: [864.57, 1218.9],
  RA4: [609.45, 864.57],
  SRA0: [2551.18, 3628.35],
  SRA1: [1814.17, 2551.18],
  SRA2: [1275.59, 1814.17],
  SRA3: [907.09, 1275.59],
  SRA4: [637.8, 907.09],
  EXECUTIVE: [521.86, 756.0],
  FOLIO: [612.0, 936.0],
  LEGAL: [612.0, 1008.0],
  LETTER: [612.0, 792.0],
  TABLOID: [792.0, 1224.0]
};

// Return page size in an object { width, height } given the passed size and orientation
// Accepts page type, arraoy or object as parameter
var getPageSize = function getPageSize(size) {
  var orientation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'portrait';

  var result = void 0;

  if (typeof size === 'string') {
    result = PAGE_SIZES[size.toUpperCase()];
  } else if (Array.isArray(size)) {
    result = size;
  } else if ((typeof size === 'undefined' ? 'undefined' : _typeof(size)) === 'object' && size.width && size.height) {
    result = [size.width, size.height];
  } else {
    throw new Error('Invalid Page size: ' + size);
  }

  return orientation === 'portrait' ? { width: result[0], height: result[1] } : { width: result[1], height: result[0] };
};

var RULER_WIDTH = 13;
var RULER_COLOR = 'white';
var RULER_FONT_SIZE = 5;
var DEFAULT_RULER_STEPS = 50;
var LINE_WIDTH = 0.5;
var LINE_COLOR = 'gray';
var GRID_COLOR = '#ababab';

var range = function range(max, steps) {
  return _Array$from({ length: Math.ceil(max / steps) }, function (_, i) {
    return i * steps;
  });
};

var matchPercentage = function matchPercentage(value) {
  var match = value.match(/(\d+\.?\d*)%/);
  if (match) {
    return 100 / parseFloat(match[1], 10);
  }

  return null;
};

var Ruler = {
  getRulerWidth: function getRulerWidth() {
    return RULER_WIDTH;
  },
  hasHorizontalRuler: function hasHorizontalRuler() {
    return this.props.ruler || this.props.horizontalRuler;
  },
  hasVerticalRuler: function hasVerticalRuler() {
    return this.props.ruler || this.props.verticalRuler;
  },
  getHorizontalSteps: function getHorizontalSteps() {
    var value = this.props.horizontalRulerSteps || this.props.rulerSteps || DEFAULT_RULER_STEPS;

    if (typeof value === 'string') {
      var percentage = matchPercentage(value);
      if (percentage) {
        var width = this.width - (this.hasVerticalRuler() ? RULER_WIDTH : 0);
        return width / percentage;
      }
      throw new Error('Page: Invalid horizontal steps value');
    }

    return value;
  },
  getVerticalSteps: function getVerticalSteps() {
    var value = this.props.verticalRulerSteps || this.props.rulerSteps || DEFAULT_RULER_STEPS;

    if (typeof value === 'string') {
      var percentage = matchPercentage(value);
      if (percentage) {
        var height = this.height - (this.hasHorizontalRuler() ? RULER_WIDTH : 0);
        return height / percentage;
      }
      throw new Error('Page: Invalid horizontal steps value');
    }

    return value;
  },
  renderRuler: function renderRuler() {
    var hasHorizontalRuler = this.hasHorizontalRuler();
    var hasVerticalRuler = this.hasVerticalRuler();

    if (hasHorizontalRuler || hasVerticalRuler) {
      this.root.instance.save().lineWidth(LINE_WIDTH).fontSize(RULER_FONT_SIZE).opacity(1);

      if (hasHorizontalRuler) this.drawHorizontalRuler();

      if (hasVerticalRuler) this.drawVerticalRuler();

      if (hasHorizontalRuler && hasVerticalRuler) {
        this.root.instance.rect(0, 0, RULER_WIDTH - LINE_WIDTH, RULER_WIDTH - LINE_WIDTH).fill(RULER_COLOR);
      }

      this.root.instance.restore();
    }
  },
  drawHorizontalRuler: function drawHorizontalRuler() {
    var _this = this;

    var offset = this.hasVerticalRuler() ? RULER_WIDTH : 0;

    this.root.instance.rect(offset, 0, this.width, RULER_WIDTH).fill(RULER_COLOR).moveTo(this.hasVerticalRuler() ? RULER_WIDTH : 0, RULER_WIDTH).lineTo(this.width, RULER_WIDTH).stroke(LINE_COLOR);

    var hRange = range(this.width, this.getHorizontalSteps());

    hRange.map(function (step) {
      _this.root.instance.moveTo(offset + step, 0).lineTo(offset + step, RULER_WIDTH).stroke(LINE_COLOR).fillColor('black').text('' + Math.round(step), offset + step + 1, 1);
    });

    hRange.map(function (step) {
      if (step !== 0) {
        _this.root.instance.moveTo(offset + step, RULER_WIDTH).lineTo(offset + step, _this.height).stroke(GRID_COLOR);
      }
    });
  },
  drawVerticalRuler: function drawVerticalRuler() {
    var _this2 = this;

    var offset = this.hasHorizontalRuler() ? RULER_WIDTH : 0;

    this.root.instance.rect(0, offset, RULER_WIDTH, this.height).fill(RULER_COLOR).moveTo(RULER_WIDTH, this.hasHorizontalRuler() ? RULER_WIDTH : 0).lineTo(RULER_WIDTH, this.height).stroke(LINE_COLOR);

    var vRange = range(this.height, this.getVerticalSteps());

    vRange.map(function (step) {
      _this2.root.instance.moveTo(0, offset + step).lineTo(RULER_WIDTH, offset + step).stroke(LINE_COLOR).fillColor('black').text('' + Math.round(step), 1, offset + step + 1);
    });

    vRange.map(function (step) {
      if (step !== 0) {
        _this2.root.instance.moveTo(RULER_WIDTH, offset + step).lineTo(_this2.width, offset + step).stroke(GRID_COLOR);
      }
    });
  }
};

var Page$1 = function (_Base) {
  _inherits(Page, _Base);

  function Page(root, props) {
    _classCallCheck(this, Page);

    var _this = _possibleConstructorReturn(this, _Base.call(this, root, props));

    _this._size = null;
    return _this;
  }

  Page.prototype.resetMargins = function resetMargins() {
    if (!!this.marginTop || !!this.marginBottom || !!this.marginLeft || !!this.marginRight) {
      warning(false, 'Margin values are not allowed on Page element. Use padding instead.');

      this.marginTop = 0;
      this.marginBottom = 0;
      this.marginLeft = 0;
      this.marginRight = 0;
    }
  };

  Page.prototype.applyProps = function applyProps() {
    _Base.prototype.applyProps.call(this);

    this.top = 0;
    this.left = 0;
    this.width = this.size.width;

    this.resetMargins();

    // Add some padding if ruler present, so we can see the whole page inside it
    var rulerWidth = this.getRulerWidth();

    if (this.hasHorizontalRuler()) {
      this.paddingTop = this.paddingTop + rulerWidth;
    }

    if (this.hasVerticalRuler()) {
      this.paddingLeft = this.paddingLeft + rulerWidth;
    }
  };

  Page.prototype.setPadding = function setPadding(edge, value) {
    var isPercent = matchPercent(value);
    var dimension = edge === Yoga.EDGE_TOP || edge === Yoga.EDGE_BOTTOM ? this.size.height : this.size.width;

    if (isPercent) {
      var percent = parseFloat(isPercent[1], 10) / 100;
      this.layout.setPadding(edge, dimension * percent);
    } else {
      this.layout.setPadding(edge, value);
    }
  };

  Page.prototype.addDynamicChild = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(parent, elements) {
      var children, i, child, type, props, instance, _instance;

      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (elements) {
                _context.next = 2;
                break;
              }

              return _context.abrupt('return');

            case 2:
              children = Array.isArray(elements) ? elements : [elements];
              i = 0;

            case 4:
              if (!(i < children.length)) {
                _context.next = 27;
                break;
              }

              child = children[i];
              type = child.type, props = child.props;

              if (!(typeof child === 'string')) {
                _context.next = 12;
                break;
              }

              instance = new TextInstance(this.root, child);

              parent.appendChild(instance);
              _context.next = 24;
              break;

            case 12:
              if (!(type !== Fragment)) {
                _context.next = 22;
                break;
              }

              _instance = createInstance(child, this.root);
              _context.next = 16;
              return _instance.onAppendDynamically();

            case 16:
              parent.appendChild(_instance);
              _instance.applyProps();
              _context.next = 20;
              return this.addDynamicChild(_instance, props.children);

            case 20:
              _context.next = 24;
              break;

            case 22:
              _context.next = 24;
              return this.addDynamicChild(parent, props.children);

            case 24:
              i++;
              _context.next = 4;
              break;

            case 27:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function addDynamicChild(_x, _x2) {
      return _ref.apply(this, arguments);
    }

    return addDynamicChild;
  }();

  Page.prototype.renderDynamicNodes = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(props, cb) {
      var listToExplore, node, condition, elements;
      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              listToExplore = this.children.slice(0);

            case 1:
              if (!(listToExplore.length > 0)) {
                _context2.next = 14;
                break;
              }

              node = listToExplore.shift();
              condition = cb ? cb(node) : true;

              if (!(condition && node.props.render)) {
                _context2.next = 11;
                break;
              }

              node.removeAllChilds();
              elements = node.props.render(props);
              _context2.next = 9;
              return this.addDynamicChild(node, elements);

            case 9:
              if (!node.fixed) node.props.render = null;
              return _context2.abrupt('continue', 1);

            case 11:

              if (node.children) {
                listToExplore.push.apply(listToExplore, node.children);
              }
              _context2.next = 1;
              break;

            case 14:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function renderDynamicNodes(_x3, _x4) {
      return _ref2.apply(this, arguments);
    }

    return renderDynamicNodes;
  }();

  Page.prototype.nodeWillWrap = function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(props) {
      return _regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return this.renderDynamicNodes(props);

            case 2:
              this.calculateLayout();

            case 3:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function nodeWillWrap(_x5) {
      return _ref3.apply(this, arguments);
    }

    return nodeWillWrap;
  }();

  Page.prototype.onNodeSplit = function onNodeSplit(height, clone) {
    clone.marginTop = 0;
    this.marginBottom = 0;
    this.calculateLayout();
  };

  Page.prototype.clone = function clone() {
    var clone = _Base.prototype.clone.call(this);
    clone._size = this.size;
    return clone;
  };

  Page.prototype.render = function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4() {
      var instance;
      return _regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              instance = this.root.instance;


              this.height = this.size.height;
              this.calculateLayout();

              instance.addPage({
                size: [this.size.width, this.size.height],
                margin: 0
              });

              if (this.style.backgroundColor) {
                instance.fillColor(this.style.backgroundColor).rect(0, 0, this.size.width, this.size.height).fill();
              }

              _context4.next = 7;
              return this.renderChildren();

            case 7:

              if (this.props.debug) this.debug();

              this.renderRuler();

            case 9:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    function render() {
      return _ref4.apply(this, arguments);
    }

    return render;
  }();

  _createClass(Page, [{
    key: 'name',
    get: function get() {
      return 'Page';
    }
  }, {
    key: 'document',
    get: function get() {
      return this.parent;
    }
  }, {
    key: 'page',
    get: function get() {
      return this;
    }
  }, {
    key: 'orientation',
    get: function get() {
      return this.props.orientation;
    }
  }, {
    key: 'size',
    get: function get() {
      if (this._size) return this._size;

      this._size = getPageSize(this.props.size, this.orientation);

      // Adjust size for ruler
      if (this.hasHorizontalRuler()) {
        this._size.width += this.getRulerWidth();
      }

      if (this.hasVerticalRuler()) {
        this._size.height += this.getRulerWidth();
      }

      return this._size;
    }
  }]);

  return Page;
}(Base);

Page$1.defaultProps = {
  size: 'A4',
  orientation: 'portrait',
  style: {},
  wrap: true
};


_Object$assign(Page$1.prototype, Ruler);

var View$1 = function (_Base) {
  _inherits(View, _Base);

  function View() {
    _classCallCheck(this, View);

    return _possibleConstructorReturn(this, _Base.apply(this, arguments));
  }

  View.prototype.render = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              this.root.instance.save();
              this.applyTransformations();
              this.drawBackgroundColor();
              this.drawBorders();
              _context.next = 6;
              return this.renderChildren();

            case 6:
              if (this.props.debug) this.debug();
              this.root.instance.restore();

            case 8:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function render() {
      return _ref.apply(this, arguments);
    }

    return render;
  }();

  _createClass(View, [{
    key: 'name',
    get: function get() {
      return 'View';
    }
  }]);

  return View;
}(Base);

View$1.defaultProps = {
  style: {},
  wrap: true
};

var PROTOCOL_REGEXP = /^(http|https|ftp|ftps|mailto)\:\/\//i;



var getURL = function getURL(value) {
  if (typeof value === 'string' && !value.match(PROTOCOL_REGEXP)) {
    return 'http://' + value;
  }

  return value;
};

var capitalize = function capitalize(value) {
  return value.replace(/(^|\s)\S/g, function (l) {
    return l.toUpperCase();
  });
};

var IGNORABLE_CODEPOINTS = [8232, // LINE_SEPARATOR
8233];

var buildSubsetForFont = function buildSubsetForFont(font) {
  return IGNORABLE_CODEPOINTS.reduce(function (acc, codePoint) {
    if (font.hasGlyphForCodePoint && font.hasGlyphForCodePoint(codePoint)) {
      return acc;
    }
    return [].concat(acc, [String.fromCharCode(codePoint)]);
  }, []);
};

var ignoreChars = function ignoreChars(fragments) {
  return fragments.map(function (fragment) {
    var charSubset = buildSubsetForFont(fragment.attributes.font);
    var subsetRegex = new RegExp(charSubset.join('|'));

    return {
      string: fragment.string.replace(subsetRegex, ''),
      attributes: fragment.attributes
    };
  });
};

var PREPROCESSORS = [ignoreChars, embedEmojis];

var transformText = function transformText(text, transformation) {
  switch (transformation) {
    case 'uppercase':
      return text.toUpperCase();
    case 'lowercase':
      return text.toLowerCase();
    case 'capitalize':
      return capitalize(text);
    default:
      return text;
  }
};

var getFragments = function getFragments(instance) {
  if (!instance) return [{ string: '' }];

  var fragments = [];

  var _instance$getComputed = instance.getComputedStyles(),
      _instance$getComputed2 = _instance$getComputed.color,
      color = _instance$getComputed2 === undefined ? 'black' : _instance$getComputed2,
      backgroundColor = _instance$getComputed.backgroundColor,
      _instance$getComputed3 = _instance$getComputed.fontFamily,
      fontFamily = _instance$getComputed3 === undefined ? 'Helvetica' : _instance$getComputed3,
      _instance$getComputed4 = _instance$getComputed.fontSize,
      fontSize = _instance$getComputed4 === undefined ? 18 : _instance$getComputed4,
      _instance$getComputed5 = _instance$getComputed.textAlign,
      textAlign = _instance$getComputed5 === undefined ? 'left' : _instance$getComputed5,
      position = _instance$getComputed.position,
      top = _instance$getComputed.top,
      bottom = _instance$getComputed.bottom,
      lineHeight = _instance$getComputed.lineHeight,
      textDecoration = _instance$getComputed.textDecoration,
      textDecorationColor = _instance$getComputed.textDecorationColor,
      textDecorationStyle = _instance$getComputed.textDecorationStyle,
      textTransform = _instance$getComputed.textTransform,
      letterSpacing = _instance$getComputed.letterSpacing;

  instance.children.forEach(function (child) {
    if (child.value !== null && child.value !== undefined) {
      var obj = Font.getFont(fontFamily);
      var font = obj ? obj.data : fontFamily;
      var string = transformText(child.value, textTransform);

      fragments.push({
        string: string,
        attributes: {
          font: font,
          color: color,
          fontSize: fontSize,
          backgroundColor: backgroundColor,
          align: textAlign,
          link: instance.src,
          characterSpacing: letterSpacing,
          underlineStyle: textDecorationStyle,
          underline: textDecoration === 'underline',
          underlineColor: textDecorationColor || color,
          lineHeight: lineHeight ? lineHeight * fontSize : null,
          yOffset: position === 'relative' ? -top || bottom || 0 : null
        }
      });
    } else {
      if (child) {
        var _fragments;

        (_fragments = fragments).push.apply(_fragments, getFragments(child));
      }
    }
  });

  for (var _iterator = PREPROCESSORS, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _getIterator(_iterator);;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    var preprocessor = _ref;

    fragments = preprocessor(fragments);
  }

  return fragments;
};

var getAttributedString = function getAttributedString(instance) {
  return AttributedString.fromFragments(getFragments(instance)).trim();
};

var PDFRenderer$2 = createPDFRenderer({ Rect: Rect });

var Text$1 = function (_Base) {
  _inherits(Text, _Base);

  function Text(root, props) {
    _classCallCheck(this, Text);

    var _this = _possibleConstructorReturn(this, _Base.call(this, root, props));

    _this.start = 0;
    _this.end = 0;
    _this.computed = false;
    _this._container = null;
    _this._attributedString = null;
    _this._layoutEngine = null;
    _this.renderCallback = props.render;
    _this.layout.setMeasureFunc(_this.measureText.bind(_this));
    return _this;
  }

  Text.prototype.appendChild = function appendChild(child) {
    if (child) {
      child.parent = this;
      this.children.push(child);
      this.computed = false;
      this._attributedString = null;
      this.markDirty();
    }
  };

  Text.prototype.removeChild = function removeChild(child) {
    var index = this.children.indexOf(child);

    if (index !== -1) {
      child.parent = null;
      this.children.splice(index, 1);
      this.computed = false;
      this._attributedString = null;
      this.markDirty();
    }
  };

  Text.prototype.lineIndexAtHeight = function lineIndexAtHeight(height) {
    var counter = 0;
    for (var i = 0; i < this.lines.length; i++) {
      var line = this.lines[i];

      if (counter + line.height > height) {
        return i;
      }

      counter += line.height;
    }

    return this.lines.length;
  };

  Text.prototype.heightAtLineIndex = function heightAtLineIndex(index) {
    var counter = 0;

    for (var i = 0; i < index; i++) {
      var line = this.lines[i];
      counter += line.height;
    }

    return counter;
  };

  Text.prototype.layoutText = function layoutText(width, height) {
    // IF height null or NaN, we take some liberty on layout height
    var containerHeight = height || this.page.size.height;

    // Text layout is expensive. That's why we ensure to only do it once
    // (except dynamic nodes. Those change content and needs to relayout every time)
    if (!this._container || this.props.render) {
      var path = new Path().rect(0, 0, width, containerHeight);
      var container = new Container(path);
      var attributedString = this.attributedString;

      // Do the actual text layout
      this.layoutEngine.layout(attributedString, [container]);
      this._container = container;
    }

    // Get the total amount of rendered lines
    var linesCount = this._container.blocks.reduce(function (acc, block) {
      return acc + block.lines.length;
    }, 0);

    this.computed = true;
    this.end = linesCount + 1;
  };

  Text.prototype.measureText = function measureText(width, widthMode, height, heightMode) {
    if (widthMode === Yoga.MEASURE_MODE_EXACTLY) {
      this.layoutText(width);

      return { height: this.style.flexGrow ? NaN : this.linesHeight };
    }

    if (widthMode === Yoga.MEASURE_MODE_AT_MOST || heightMode === Yoga.MEASURE_MODE_AT_MOST) {
      this.layoutText(width, height);

      return {
        height: this.linesHeight,
        width: Math.min(width, this.linesWidth)
      };
    }

    return {};
  };

  Text.prototype.getComputedStyles = function getComputedStyles() {
    var styles = _Base.prototype.getComputedStyles.call(this);

    // Inherit relative positioning for inline childs
    if (this.parent && this.parent.name === 'Text' && this.parent.style.position === 'relative') {
      styles.top = styles.top || this.parent.style.top;
      styles.bottom = styles.bottom || this.parent.style.bottom;
      styles.position = styles.position || 'relative';
    }

    // Apply default link styles
    if (this.src) {
      styles.color = styles.color || 'blue';
      styles.textDecoration = styles.textDecoration || 'underline';
    }

    return styles;
  };

  Text.prototype.wrapHeight = function wrapHeight(height) {
    var _props = this.props,
        orphans = _props.orphans,
        widows = _props.widows;

    var linesQuantity = this.lines.length;
    var sliceHeight = height - this.paddingTop;
    var slicedLine = this.lineIndexAtHeight(sliceHeight);

    if (linesQuantity < orphans) {
      return height;
    } else if (slicedLine < orphans || linesQuantity < orphans + widows) {
      return 0;
    } else if (linesQuantity === orphans + widows) {
      return this.heightAtLineIndex(orphans);
    } else if (linesQuantity - slicedLine < widows) {
      return height - this.heightAtLineIndex(widows - 1);
    }

    return height;
  };

  Text.prototype.onNodeSplit = function onNodeSplit(height, clone) {
    var wrapHeight = this.wrapHeight(height);
    var slicedLineIndex = this.lineIndexAtHeight(wrapHeight);

    clone.marginTop = 0;
    clone.paddingTop = 0;
    clone.start = slicedLineIndex;
    clone.attributedString = this.attributedString;

    this.height = wrapHeight;
    this.marginBottom = 0;
    this.paddingBottom = 0;
    this.end = slicedLineIndex;
  };

  Text.prototype.clone = function clone() {
    var text = _Base.prototype.clone.call(this);

    text.layoutEngine = this.layoutEngine;

    // Save calculated layout for non-dynamic clone elements
    if (!this.props.render && !this.props.fixed) {
      text._container = this._container;
    }

    return text;
  };

  Text.prototype.render = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
      var padding, _getAbsoluteLayout, top, left, initialX, renderer;

      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              this.root.instance.save();
              this.applyTransformations();
              this.drawBackgroundColor();
              this.drawBorders();

              // Calculate text layout if needed
              // This can happen if measureText was not called by Yoga
              if (!this.computed) {
                this.layoutText(this.width - this.padding.left - this.padding.right, this.height - this.padding.top - this.padding.bottom);
              }

              padding = this.padding;
              _getAbsoluteLayout = this.getAbsoluteLayout(), top = _getAbsoluteLayout.top, left = _getAbsoluteLayout.left;

              // We translate lines based on Yoga container

              initialX = this.lines[0] ? this.lines[0].rect.y : 0;


              this.lines.forEach(function (line) {
                line.rect.x += left + padding.left;
                line.rect.y += top + padding.top - initialX;
              });

              renderer = new PDFRenderer$2(this.root.instance, {
                outlineLines: false
              });


              renderer.render(this.container);

              if (this.props.debug) {
                this.debug();
              }

              this.root.instance.restore();

            case 13:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function render() {
      return _ref.apply(this, arguments);
    }

    return render;
  }();

  _createClass(Text, [{
    key: 'name',
    get: function get() {
      return 'Text';
    }
  }, {
    key: 'src',
    get: function get() {
      return getURL(this.props.src || this.props.href);
    }
  }, {
    key: 'attributedString',
    get: function get() {
      if (!this._attributedString) {
        this._attributedString = getAttributedString(this);
      }
      return this._attributedString;
    },
    set: function set(value) {
      this._attributedString = value;
    }
  }, {
    key: 'container',
    get: function get() {
      var lines = this._container.blocks.reduce(function (acc, block) {
        return [].concat(acc, block.lines);
      }, []);

      return _extends({}, this._container, {
        blocks: [{ lines: lines.splice(this.start, this.end) }]
      });
    }
  }, {
    key: 'lines',
    get: function get() {
      if (!this.container) return [];

      return this.container.blocks.reduce(function (acc, block) {
        return [].concat(acc, block.lines);
      }, []);
    }
  }, {
    key: 'linesHeight',
    get: function get() {
      if (!this._container) return -1;
      return this.lines.reduce(function (acc, line) {
        return acc + line.height;
      }, 0);
    }
  }, {
    key: 'linesWidth',
    get: function get() {
      if (!this._container) return -1;
      return Math.max.apply(Math, this.lines.map(function (line) {
        return line.advanceWidth;
      }));
    }
  }, {
    key: 'layoutEngine',
    get: function get() {
      if (!this._layoutEngine) {
        var hyphenationPenalty = this.props.hyphenationPenalty;

        var hyphenationCallback = Font.getHyphenationCallback();
        this._layoutEngine = new LayoutEngine$1({
          hyphenationCallback: hyphenationCallback,
          hyphenationPenalty: hyphenationPenalty
        });
      }

      return this._layoutEngine;
    },
    set: function set(instance) {
      this._layoutEngine = instance;
    }
  }]);

  return Text;
}(Base);

Text$1.defaultProps = {
  wrap: true,
  widows: 2,
  orphans: 2
};

var Link$1 = function (_Base) {
  _inherits(Link, _Base);

  function Link() {
    _classCallCheck(this, Link);

    return _possibleConstructorReturn(this, _Base.apply(this, arguments));
  }

  Link.prototype.render = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
      var _getAbsoluteLayout, top, left, width, height;

      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _getAbsoluteLayout = this.getAbsoluteLayout(), top = _getAbsoluteLayout.top, left = _getAbsoluteLayout.left, width = _getAbsoluteLayout.width, height = _getAbsoluteLayout.height;

              this.root.instance.link(left, top, width, height, this.src);
              _context.next = 4;
              return this.renderChildren();

            case 4:
              if (this.props.debug) this.debug();

            case 5:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function render() {
      return _ref.apply(this, arguments);
    }

    return render;
  }();

  _createClass(Link, [{
    key: 'name',
    get: function get() {
      return 'Link';
    }
  }, {
    key: 'src',
    get: function get() {
      return getURL(this.props.src || this.props.href);
    }
  }]);

  return Link;
}(Base);

var Note$1 = function (_Base) {
  _inherits(Note, _Base);

  function Note() {
    _classCallCheck(this, Note);

    return _possibleConstructorReturn(this, _Base.apply(this, arguments));
  }

  Note.prototype.appendChild = function appendChild(child) {
    if (child.name !== 'TextInstance') {
      throw new Error('Note only accepts string children');
    }

    if (child) {
      child.parent = this;
      this.children.push(child);
    }
  };

  Note.prototype.removeChild = function removeChild(child) {
    var index = this.children.indexOf(child);

    if (index !== -1) {
      child.parent = null;
      this.children.splice(index, 1);
    }
  };

  Note.prototype.applyProps = function applyProps() {
    _Base.prototype.applyProps.call(this);
    this.height = 0;
    this.width = 0;
  };

  Note.prototype.render = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
      var _getAbsoluteLayout, top, left, value;

      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _getAbsoluteLayout = this.getAbsoluteLayout(), top = _getAbsoluteLayout.top, left = _getAbsoluteLayout.left;
              value = this.children[0] ? this.children[0].value : '';


              this.root.instance.note(left, top, 0, 0, value);

            case 3:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function render() {
      return _ref.apply(this, arguments);
    }

    return render;
  }();

  _createClass(Note, [{
    key: 'name',
    get: function get() {
      return 'Note';
    }
  }]);

  return Note;
}(Base);

Note$1.defaultProps = {};

var SAFETY_HEIGHT = 10;

// We manage two bounding boxes in this class:
//  - Yoga node: Image bounding box. Adjust based on image and page size
//  - Image node: Real image container. In most cases equals Yoga node, except if image is bigger than page

var Image$1 = function (_Base) {
  _inherits(Image, _Base);

  function Image(root, props) {
    _classCallCheck(this, Image);

    var _this = _possibleConstructorReturn(this, _Base.call(this, root, props));

    _this.image = null;
    _this.layout.setMeasureFunc(_this.measureImage.bind(_this));
    return _this;
  }

  Image.prototype.shouldGrow = function shouldGrow() {
    return !!this.getComputedStyles().flexGrow;
  };

  Image.prototype.measureImage = function measureImage(width, widthMode, height, heightMode) {
    var imageMargin = this.margin;
    var pagePadding = this.page.padding;
    var pageArea = this.page.size.height - pagePadding.top - pagePadding.bottom - imageMargin.top - imageMargin.bottom - SAFETY_HEIGHT;

    // Skip measure if image data not present yet
    if (!this.image) return { width: 0, height: 0 };

    if (widthMode === Yoga.MEASURE_MODE_EXACTLY && heightMode === Yoga.MEASURE_MODE_UNDEFINED) {
      var scaledHeight = width / this.ratio;
      return { height: Math.min(pageArea, scaledHeight) };
    }

    if (heightMode === Yoga.MEASURE_MODE_EXACTLY && (widthMode === Yoga.MEASURE_MODE_AT_MOST || widthMode === Yoga.MEASURE_MODE_UNDEFINED)) {
      return { width: Math.min(height * this.ratio, width) };
    }

    if (widthMode === Yoga.MEASURE_MODE_EXACTLY && heightMode === Yoga.MEASURE_MODE_AT_MOST) {
      var _scaledHeight = width / this.ratio;
      return { height: Math.min(height, pageArea, _scaledHeight) };
    }

    if (widthMode === Yoga.MEASURE_MODE_AT_MOST && heightMode === Yoga.MEASURE_MODE_AT_MOST) {
      if (this.ratio > 1) {
        return {
          width: width,
          height: Math.min(width / this.ratio, height)
        };
      } else {
        return {
          width: Math.min(height * this.ratio, width),
          height: height
        };
      }
    }

    return { height: height, width: width };
  };

  Image.prototype.fetch = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
      var _props, src, cache, safePath, allowDangerousPaths;

      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _props = this.props, src = _props.src, cache = _props.cache, safePath = _props.safePath, allowDangerousPaths = _props.allowDangerousPaths;
              _context.prev = 1;
              _context.next = 4;
              return resolveImage(src, {
                cache: cache,
                safePath: safePath,
                allowDangerousPaths: allowDangerousPaths
              });

            case 4:
              this.image = _context.sent;
              _context.next = 11;
              break;

            case 7:
              _context.prev = 7;
              _context.t0 = _context['catch'](1);

              this.image = { width: 0, height: 0 };
              console.warn(_context.t0.message);

            case 11:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this, [[1, 7]]);
    }));

    function fetch$$1() {
      return _ref.apply(this, arguments);
    }

    return fetch$$1;
  }();

  Image.prototype.clone = function clone() {
    var clone = _Base.prototype.clone.call(this);
    clone.image = this.image;
    return clone;
  };

  Image.prototype.onAppendDynamically = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return this.fetch();

            case 2:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function onAppendDynamically() {
      return _ref2.apply(this, arguments);
    }

    return onAppendDynamically;
  }();

  Image.prototype.renderImage = function renderImage() {
    var padding = this.padding;

    var _getAbsoluteLayout = this.getAbsoluteLayout(),
        left = _getAbsoluteLayout.left,
        top = _getAbsoluteLayout.top;

    this.root.instance.save();

    // Clip path to keep image inside border radius
    this.clip();

    if (this.image.data) {
      // Inner offset between yoga node and image box
      // Makes image centered inside Yoga node
      var width = Math.min(this.height * this.ratio, this.width) - padding.left - padding.right;
      var height = this.height - padding.top - padding.bottom;
      var xOffset = Math.max((this.width - width) / 2, 0);

      if (width !== 0 && height !== 0) {
        this.root.instance.image(this.image.data, left + padding.left + xOffset, top + padding.top, { width: width, height: height });
      } else {
        warning(false, 'Image with src \'' + this.props.src + '\' skipped due to invalid dimensions');
      }
    }

    this.root.instance.restore();
  };

  Image.prototype.render = function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3() {
      return _regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              this.root.instance.save();
              this.applyTransformations();
              this.drawBackgroundColor();
              this.renderImage();
              this.drawBorders();

              if (this.props.debug) {
                this.debug();
              }

              this.root.instance.restore();

            case 7:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function render() {
      return _ref3.apply(this, arguments);
    }

    return render;
  }();

  _createClass(Image, [{
    key: 'name',
    get: function get() {
      return 'Image';
    }
  }, {
    key: 'ratio',
    get: function get() {
      return this.image.data ? this.image.width / this.image.height : 1;
    }
  }]);

  return Image;
}(Base);

Image$1.defaultProps = {
  wrap: false,
  cache: true
};

var constructors = {
  ROOT: Root,
  PAGE: Page$1,
  TEXT: Text$1,
  LINK: Link$1,
  VIEW: View$1,
  NOTE: Note$1,
  IMAGE: Image$1,
  DOCUMENT: Document$2,
  TEXT_INSTANCE: TextInstance
};

function createInstance(element, root) {
  var type = element.type,
      _element$props = element.props,
      props = _element$props === undefined ? {} : _element$props;


  if (constructors[type]) {
    return new constructors[type](root, props);
  }

  throw new Error('Invalid element of type ' + type + ' passed to PDF renderer');
}

var propsEqual = function propsEqual(a, b) {
  var oldPropsKeys = _Object$keys(a);
  var newPropsKeys = _Object$keys(b);

  if (oldPropsKeys.length !== newPropsKeys.length) {
    return false;
  }

  for (var i = 0; i < oldPropsKeys.length; i++) {
    var propName = oldPropsKeys[i];

    if (propName === 'render') {
      if (!a[propName] !== !b[propName]) {
        return false;
      }
      continue;
    }

    if (propName !== 'children' && a[propName] !== b[propName]) {
      if (_typeof(a[propName]) === 'object' && _typeof(b[propName]) === 'object' && propsEqual(a[propName], b[propName])) {
        continue;
      }

      return false;
    }

    if (propName === 'children' && (typeof a[propName] === 'string' || typeof b[propName] === 'string')) {
      return a[propName] === b[propName];
    }
  }

  return true;
};

// If the Link has a strign child or render prop, substitute the instance by a Text,
// that will ultimately render the inline Link via the textkit PDF renderer.
var shouldReplaceLink = function shouldReplaceLink(type, props) {
  return type === 'LINK' && (typeof props.children === 'string' || Array.isArray(props.children) || props.render);
};

var PDFRenderer = ReactFiberReconciler({
  supportsMutation: true,
  appendInitialChild: function appendInitialChild(parentInstance, child) {
    parentInstance.appendChild(child);
  },
  createInstance: function createInstance$$1(type, props, internalInstanceHandle) {
    var instanceType = shouldReplaceLink(type, props) ? 'TEXT' : type;
    return createInstance({ type: instanceType, props: props }, internalInstanceHandle);
  },
  createTextInstance: function createTextInstance(text, rootContainerInstance) {
    return createInstance({ type: 'TEXT_INSTANCE', props: text }, rootContainerInstance);
  },
  finalizeInitialChildren: function finalizeInitialChildren(element, type, props) {
    return false;
  },
  getPublicInstance: function getPublicInstance(instance) {
    return instance;
  },
  prepareForCommit: function prepareForCommit() {
    // Noop
  },
  prepareUpdate: function prepareUpdate(element, type, oldProps, newProps) {
    return !propsEqual(oldProps, newProps);
  },
  resetAfterCommit: function resetAfterCommit() {
    // Noop
  },
  resetTextContent: function resetTextContent(element) {
    // Noop
  },
  getRootHostContext: function getRootHostContext() {
    return emptyObject;
  },
  getChildHostContext: function getChildHostContext() {
    return emptyObject;
  },
  shouldSetTextContent: function shouldSetTextContent(type, props) {
    return false;
  },


  now: Date.now,

  useSyncScheduling: true,

  appendChild: function appendChild(parentInstance, child) {
    parentInstance.appendChild(child);
  },
  appendChildToContainer: function appendChildToContainer(parentInstance, child) {
    parentInstance.appendChild(child);
  },
  insertBefore: function insertBefore(parentInstance, child, beforeChild) {
    parentInstance.appendChildBefore(child, beforeChild);
  },
  removeChild: function removeChild(parentInstance, child) {
    parentInstance.removeChild(child);
  },
  removeChildFromContainer: function removeChildFromContainer(parentInstance, child) {
    parentInstance.removeChild(child);
  },
  commitTextUpdate: function commitTextUpdate(textInstance, oldText, newText) {
    textInstance.update(newText);
  },
  commitUpdate: function commitUpdate(instance, updatePayload, type, oldProps, newProps) {
    instance.update(newProps);
  }
});

var version = "1.2.0";

var View = 'VIEW';
var Text = 'TEXT';
var Link = 'LINK';
var Page = 'PAGE';
var Note = 'NOTE';
var Image = 'IMAGE';
var Document$1 = 'DOCUMENT';

var pdf = function pdf(input) {
  var toBlob = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
      var stream;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return container.render();

            case 2:
              stream = container.instance.pipe(BlobStream());
              return _context.abrupt('return', new _Promise(function (resolve, reject) {
                stream.on('finish', function () {
                  try {
                    var blob = stream.toBlob('application/pdf');

                    callOnRender({ blob: blob });

                    resolve(blob);
                  } catch (error) {
                    reject(error);
                  }
                });

                stream.on('error', reject);
              }));

            case 4:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function toBlob() {
      return _ref.apply(this, arguments);
    };
  }();

  var container = createInstance({ type: 'ROOT' });
  var mountNode = PDFRenderer.createContainer(container);

  if (input) updateContainer(input);

  function callOnRender() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (container.document.props.onRender) {
      var layoutData = container.document.getLayoutData();
      container.document.props.onRender(_extends({}, params, { layoutData: layoutData }));
    }
  }

  function isDirty() {
    return container.isDirty;
  }

  function updateContainer(doc) {
    PDFRenderer.updateContainer(doc, mountNode, null);
  }

  function toBuffer() {
    callOnRender();

    container.render();

    return container.instance;
  }

  function toString() {
    var result = '';
    container.render();

    return new _Promise(function (resolve, reject) {
      try {
        container.instance.on('data', function (buffer) {
          result += buffer;
        });

        container.instance.on('end', function () {
          callOnRender({ string: result });
          resolve(result);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  return {
    isDirty: isDirty,
    updateContainer: updateContainer,
    toBuffer: toBuffer,
    toBlob: toBlob,
    toString: toString
  };
};

/* eslint-disable no-unused-vars */
var Document$$1 = function Document$$1(_ref) {
  var children = _ref.children,
      props = _objectWithoutProperties(_ref, ['children']);

  return React.createElement(
    Document$1,
    props,
    children
  );
};

var InternalBlobProvider = function (_React$PureComponent) {
  _inherits(InternalBlobProvider, _React$PureComponent);

  function InternalBlobProvider(props) {
    _classCallCheck(this, InternalBlobProvider);

    // Create new root container for this render
    var _this = _possibleConstructorReturn(this, _React$PureComponent.call(this, props));

    _this.state = { blob: null, url: null, loading: true, error: null };
    _this.instance = pdf();
    return _this;
  }

  InternalBlobProvider.prototype.componentDidMount = function componentDidMount() {
    this.renderDocument();
    this.onDocumentUpdate();
  };

  InternalBlobProvider.prototype.componentDidUpdate = function componentDidUpdate() {
    this.renderDocument();

    if (this.instance.isDirty() && !this.state.error) {
      this.onDocumentUpdate();
    }
  };

  InternalBlobProvider.prototype.renderDocument = function renderDocument() {
    this.instance.updateContainer(this.props.document);
  };

  InternalBlobProvider.prototype.onDocumentUpdate = function onDocumentUpdate() {
    var _this2 = this;

    var oldBlobUrl = this.state.url;

    this.instance.toBlob().then(function (blob) {
      _this2.setState({ blob: blob, url: URL.createObjectURL(blob), loading: false }, function () {
        return URL.revokeObjectURL(oldBlobUrl);
      });
    }).catch(function (error) {
      _this2.setState({ error: error });
      console.error(error);
      throw error;
    });
  };

  InternalBlobProvider.prototype.render = function render() {
    return this.props.children(this.state);
  };

  return InternalBlobProvider;
}(React.PureComponent);

var BlobProvider = function BlobProvider(_ref2) {
  var doc = _ref2.document,
      children = _ref2.children;

  if (!doc) {
    warning(false, 'You should pass a valid document to BlobProvider');
    return null;
  }

  return React.createElement(
    InternalBlobProvider,
    { document: doc },
    children
  );
};

var PDFViewer = function PDFViewer(_ref3) {
  var className = _ref3.className,
      style = _ref3.style,
      children = _ref3.children,
      innerRef = _ref3.innerRef,
      props = _objectWithoutProperties(_ref3, ['className', 'style', 'children', 'innerRef']);

  return React.createElement(
    InternalBlobProvider,
    { document: children },
    function (_ref4) {
      var url = _ref4.url;
      return React.createElement('iframe', _extends({
        className: className,
        ref: innerRef,
        src: url,
        style: Array.isArray(style) ? flatStyles(style) : style
      }, props));
    }
  );
};

var PDFDownloadLink = function PDFDownloadLink(_ref5) {
  var doc = _ref5.document,
      className = _ref5.className,
      style = _ref5.style,
      children = _ref5.children,
      _ref5$fileName = _ref5.fileName,
      fileName = _ref5$fileName === undefined ? 'document.pdf' : _ref5$fileName;

  if (!doc) {
    warning(false, 'You should pass a valid document to PDFDownloadLink');
    return null;
  }

  var downloadOnIE = function downloadOnIE(blob) {
    return function () {
      if (window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(blob, fileName);
      }
    };
  };

  return React.createElement(
    InternalBlobProvider,
    { document: doc },
    function (params) {
      return React.createElement(
        'a',
        {
          className: className,
          download: fileName,
          href: params.url,
          onClick: downloadOnIE(params.blob),
          style: Array.isArray(style) ? flatStyles(style) : style
        },
        typeof children === 'function' ? children(params) : children
      );
    }
  );
};

var dom = {
  pdf: pdf,
  View: View,
  Text: Text,
  Link: Link,
  Page: Page,
  Font: Font,
  Note: Note,
  Image: Image,
  version: version,
  Document: Document$$1,
  PDFViewer: PDFViewer,
  StyleSheet: StyleSheet,
  PDFRenderer: PDFRenderer,
  BlobProvider: BlobProvider,
  createInstance: createInstance,
  PDFDownloadLink: PDFDownloadLink
};

export { Document$$1 as Document, BlobProvider, PDFViewer, PDFDownloadLink, pdf, View, Text, Link, Page, Font, Note, Image, version, StyleSheet, PDFRenderer, createInstance };
export default dom;
//# sourceMappingURL=react-pdf.browser.es.js.map

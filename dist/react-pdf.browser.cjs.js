'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _classCallCheck = _interopDefault(require('babel-runtime/helpers/classCallCheck'));
var _possibleConstructorReturn = _interopDefault(require('babel-runtime/helpers/possibleConstructorReturn'));
var _inherits = _interopDefault(require('babel-runtime/helpers/inherits'));
var _objectWithoutProperties = _interopDefault(require('babel-runtime/helpers/objectWithoutProperties'));
var React = require('react');
var React__default = _interopDefault(React);
var warning = _interopDefault(require('fbjs/lib/warning'));
var _extends = _interopDefault(require('babel-runtime/helpers/extends'));
var _regeneratorRuntime = _interopDefault(require('babel-runtime/regenerator'));
var _Promise = _interopDefault(require('babel-runtime/core-js/promise'));
var _asyncToGenerator = _interopDefault(require('babel-runtime/helpers/asyncToGenerator'));
var BlobStream = _interopDefault(require('blob-stream'));
var _typeof = _interopDefault(require('babel-runtime/helpers/typeof'));
var _Object$keys = _interopDefault(require('babel-runtime/core-js/object/keys'));
var ReactFiberReconciler = _interopDefault(require('react-reconciler'));
var emptyObject = _interopDefault(require('fbjs/lib/emptyObject'));
var _createClass = _interopDefault(require('babel-runtime/helpers/createClass'));
var PDFDocument = require('@react-pdf/pdfkit');
var PDFDocument__default = _interopDefault(PDFDocument);
var textkitCore = require('@react-pdf/textkit-core');
var scriptItemizer = _interopDefault(require('@react-pdf/script-itemizer'));
var justificationEngine = _interopDefault(require('@textkit/justification-engine'));
var textDecorationEngine = _interopDefault(require('@textkit/text-decoration-engine'));
var lineFragmentGenerator = _interopDefault(require('@textkit/line-fragment-generator'));
var _getIterator = _interopDefault(require('babel-runtime/core-js/get-iterator'));
var createLinebreaker = _interopDefault(require('@textkit/linebreaker'));
var english = _interopDefault(require('hyphenation.en-us'));
var Hypher = _interopDefault(require('hypher'));
var isUrl = _interopDefault(require('is-url'));
var fontkit = _interopDefault(require('@react-pdf/fontkit'));
var fetch = _interopDefault(require('isomorphic-fetch'));
var _wrapPages = _interopDefault(require('page-wrapping'));
var _Array$from = _interopDefault(require('babel-runtime/core-js/array/from'));
var emojiRegex = _interopDefault(require('emoji-regex'));
var _JSON$stringify = _interopDefault(require('babel-runtime/core-js/json/stringify'));
var PNG = _interopDefault(require('@react-pdf/png-js'));
var _Object$assign = _interopDefault(require('babel-runtime/core-js/object/assign'));
var toPairsIn = _interopDefault(require('lodash.topairsin'));
var isFunction = _interopDefault(require('lodash.isfunction'));
var upperFirst = _interopDefault(require('lodash.upperfirst'));
var Yoga = _interopDefault(require('yoga-layout-prebuilt'));
var pick = _interopDefault(require('lodash.pick'));
var merge = _interopDefault(require('lodash.merge'));
var matchMedia = _interopDefault(require('media-engine'));
var createPDFRenderer = _interopDefault(require('@textkit/pdf-renderer'));

var inheritedProperties = ['color', 'fontFamily', 'fontSize', 'fontStyle', 'fontWeight', 'letterSpacing', 'textDecoration', 'lineHeight', 'textAlign', 'visibility', 'wordSpacing'];

var flatStyles = function flatStyles(stylesArray) {
  return stylesArray.reduce(function (acc, style) {
    return _extends({}, acc, style);
  }, {});
};

var StandardFont = function () {
  function StandardFont(src) {
    _classCallCheck(this, StandardFont);

    this.name = src;
    this.src = PDFDocument.PDFFont.open(null, src);
    this.glyphs = {};
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
    if (!this.glyphs[id]) {
      this.glyphs[id] = this.src.font.characterToGlyph(id);
    }

    return {
      id: id,
      _font: this.src,
      name: this.glyphs[id]
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

        this.fallbackFontInstance = null;
      }

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

          var defaultFont = void 0;

          if (typeof run.attributes.font === 'string') {
            defaultFont = new StandardFont(run.attributes.font);
          } else {
            defaultFont = run.attributes.font;
          }

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
            var font = defaultFont;

            // If the default font does not have a glyph
            // and the fallback font does, we use it
            if (!defaultFont.hasGlyphForCodePoint(codePoint) && this.fallbackFont.hasGlyphForCodePoint(codePoint)) {
              font = this.fallbackFont;
            }

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
          if (!this.fallbackFontInstance) {
            this.fallbackFontInstance = new StandardFont('Helvetica');
          }

          return this.fallbackFontInstance;
        }
      }]);

      return FontSubstitutionEngine;
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

linebreak.glue = function (width, stretch, shrink) {
  return {
    type: 'glue',
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

var SOFT_HYPHEN_HEX = '\xAD';
var NO_BREAK_SPACE_DECIMAL = 160;

var getWords = function getWords(glyphString) {
  var words = [];
  var start = glyphString.start;

  var lastIndex = 0;

  for (var _iterator = glyphString, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _getIterator(_iterator);;) {
    var _ref2;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref2 = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref2 = _i.value;
    }

    var _ref = _ref2;
    var index = _ref.index;

    var codePoint = glyphString.codePointAtGlyphIndex(index);

    // Not break words in no-break-spaces
    if (codePoint === NO_BREAK_SPACE_DECIMAL) {
      continue;
    }

    if (glyphString.isWhiteSpace(index - start)) {
      var _word = glyphString.slice(lastIndex, index - start);

      if (_word.length > 0) {
        words.push(_word);
      }

      lastIndex = index - start + 1;
    }
  }

  if (lastIndex < glyphString.end) {
    var word = glyphString.slice(lastIndex, glyphString.end - glyphString.start);
    words.push(word);
  }

  return words;
};

var h = new Hypher(english);
var hyphenateString = function hyphenateString(string) {
  if (string.includes(SOFT_HYPHEN_HEX)) {
    return string.split(SOFT_HYPHEN_HEX);
  }

  return h.hyphenate(string);
};

var hyphenateWord = function hyphenateWord(glyphString) {
  var hyphenated = hyphenateString(glyphString.string);

  var index = 0;
  var parts = hyphenated.map(function (part) {
    var res = glyphString.slice(index, index + part.length);
    index += part.length;
    return res;
  });

  return parts;
};

var hyphenate = function hyphenate(words) {
  return words.map(function (word) {
    return hyphenateWord(word);
  });
};

var formatter = function formatter(measureText, textAlign, callback) {
  var spaceWidth = measureText(' ');
  var hyphenWidth = measureText('-');
  var hyphenPenalty = !textAlign || textAlign === 'justify' ? 100 : 600;
  var opts = {
    width: 3,
    stretch: 6,
    shrink: 9
  };

  return function (glyphString) {
    var nodes = [];
    var words = getWords(glyphString);
    var spaceStretch = spaceWidth * opts.width / opts.stretch;
    var spaceShrink = spaceWidth * opts.width / opts.shrink;
    var hyphenationCallback = callback || hyphenate;
    var hyphenatedWords = hyphenationCallback(words, glyphString);

    hyphenatedWords.forEach(function (word, index, array) {
      if (word.length > 1) {
        word.forEach(function (part, partIndex, partArray) {
          var isLastPart = partIndex === word.length - 1;

          nodes.push(linebreak.box(measureText(part), part, !isLastPart));

          if (partIndex !== partArray.length - 1) {
            nodes.push(linebreak.penalty(hyphenWidth, hyphenPenalty, 1));
          }
        });
      } else {
        nodes.push(linebreak.box(measureText(word[0]), word[0]));
      }
      if (index === array.length - 1) {
        nodes.push(linebreak.glue(0, linebreak.infinity, 0));
        nodes.push(linebreak.penalty(0, -linebreak.infinity, 1));
      } else {
        nodes.push(linebreak.glue(spaceWidth, spaceStretch, spaceShrink));
      }
    });

    return nodes;
  };
};

var HYPHEN = 0x002d;
var TOLERANCE_LIMIT = 40;

var lineBreaker = (function () {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      hyphenationCallback = _ref.hyphenationCallback;

  return function (Textkit) {
    var TextkitLinebreaker = createLinebreaker()(Textkit);
    var fallbackLinebreaker = new TextkitLinebreaker();

    return function () {
      function KPLineBreaker(tolerance) {
        _classCallCheck(this, KPLineBreaker);

        this.tolerance = tolerance || 4;
      }

      KPLineBreaker.prototype.suggestLineBreak = function suggestLineBreak(glyphString, width, paragraphStyle) {
        var tolerance = this.tolerance;
        var measuredWidth = this.measureWidth(glyphString);
        var nodes = formatter(measuredWidth, paragraphStyle.align, hyphenationCallback)(glyphString);
        var breaks = [];

        // Try again with a higher tolerance if the line breaking failed.
        while (breaks.length === 0 && tolerance < TOLERANCE_LIMIT) {
          breaks = linebreak(nodes, [width], { tolerance: tolerance });
          tolerance += 2;
        }

        // Fallback to textkit default's linebreaking algorithm if K&P fails
        if (breaks.length === 0) {
          var fallback = fallbackLinebreaker.suggestLineBreak(glyphString, width, paragraphStyle);
          if (fallback) return fallback;

          // If fallback didn't worked, we split workd based on width
          var index = glyphString.glyphIndexAtOffset(width) - 1;
          glyphString.insertGlyph(index, HYPHEN);
          return { position: index + 1 };
        }

        if (!breaks[1]) {
          return { position: glyphString.end };
        }

        var breakNode = this.findBreakNode(nodes, breaks[1].position);
        var breakIndex = breakNode.value.end - glyphString.start;

        if (breakNode.hyphenated) {
          glyphString.insertGlyph(breakIndex, HYPHEN);
          return { position: breakIndex + 1 };
        }

        // We kep the blank space at the end of the line to avoid justification issues
        var offset = glyphString.isWhiteSpace(breakIndex) ? 1 : 0;
        return { position: breakIndex + offset };
      };

      KPLineBreaker.prototype.measureWidth = function measureWidth(glyphString) {
        var _glyphString$glyphRun = glyphString.glyphRuns[0].attributes,
            font = _glyphString$glyphRun.font,
            fontSize = _glyphString$glyphRun.fontSize;


        return function (word) {
          if (typeof word === 'string') {
            var scale = fontSize / font.unitsPerEm;
            return font.layout(word).positions[0].xAdvance * scale;
          }

          return word.advanceWidth;
        };
      };

      KPLineBreaker.prototype.findBreakNode = function findBreakNode(nodes, position) {
        var index = position - 1;

        while (!nodes[index].value) {
          index -= 1;
        }

        return nodes[index];
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
    var hyphenationCallback = _ref.hyphenationCallback;

    _classCallCheck(this, LayoutEngine$$1);

    var engines = {
      scriptItemizer: scriptItemizer(),
      decorationEngine: textDecorationEngine(),
      lineFragmentGenerator: lineFragmentGenerator(),
      fontSubstitutionEngine: fontSubstitutionEngine(),
      lineBreaker: lineBreaker({ hyphenationCallback: hyphenationCallback }),
      justificationEngine: justificationEngine({ shrinkWhitespaceFactor: shrinkWhitespaceFactor })
    };

    return _possibleConstructorReturn(this, _BaseLayoutEngine.call(this, engines));
  }

  return LayoutEngine$$1;
}(textkitCore.LayoutEngine);

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

            // We cache the font to avoid fetching it many time

            if (!(font && !font.data && !font.loading)) {
              _context.next = 11;
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
            _context.next = 11;
            break;

          case 10:
            font.data = fontkit.openSync(font.src);

          case 11:

            // If the font wasn't added to the document yet (aka. loaded), we do.
            // This prevents calling `registerFont` many times for the same font.
            // Fonts loaded state will be resetted after document is closed.
            if (font && !font.loaded) {
              font.loaded = true;
              font.loading = false;
              doc.registerFont(fontFamily, font.data);
            }

            if (!(!font && !standardFonts.includes(fontFamily))) {
              _context.next = 14;
              break;
            }

            throw new Error('Font family not registered: ' + fontFamily + '. Please register it calling Font.register() method.');

          case 14:
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

var Root = function () {
  function Root() {
    _classCallCheck(this, Root);

    this.isDirty = false;
    this.document = null;
    this.instance = null;
    this._layoutEngine = null;
  }

  Root.prototype.appendChild = function appendChild(child) {
    this.document = child;
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
              this.instance = new PDFDocument__default({ autoFirstPage: false });
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
  }, {
    key: 'layoutEngine',
    get: function get() {
      if (!this._layoutEngine) {
        var hyphenationCallback = Font.getHyphenationCallback();
        this._layoutEngine = new LayoutEngine$1({ hyphenationCallback: hyphenationCallback });
      }

      return this._layoutEngine;
    }
  }]);

  return Root;
}();

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

var imagesCache = createCache({ limit: 30 });

var isValidFormat = function isValidFormat(format) {
  var lower = format.toLowerCase();
  return lower === 'jpg' || lower === 'jpeg' || lower === 'png';
};

var isCompatibleBase64 = function isCompatibleBase64(src) {
  return (/data:image\/[a-zA-Z]*;base64,[^"]*/g.test(src)
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
  var match = /data:image\/([a-zA-Z]*);base64,([^"]*)/g.exec(src);
  var format = match[1];
  var data = match[2];

  if (!isValidFormat(format)) {
    throw new Error('Base64 image invalid format: ' + format);
  }

  return new _Promise(function (resolve) {
    return resolve(getImage(Buffer.from(data, 'base64'), format));
  });
};

var resolveLocalImage = function resolveLocalImage(src) {
  if (src.data && src.format) {
    return new _Promise(function (resolve) {
      return resolve(getImage(src.data, src.format));
    });
  }

  throw new Error('Invalid data given for local file: ' + _JSON$stringify(src));
};

var resolveRemoteImage = function resolveRemoteImage(src) {
  return fetch(src).then(function (response) {
    if (response.buffer) {
      return response.buffer();
    }
    return response.arrayBuffer();
  }).then(function (buffer) {
    if (buffer.constructor.name === 'Buffer') {
      return buffer;
    }
    return Buffer.from(buffer);
  }).then(function (body) {
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

    return getImage(body, extension);
  });
};

var resolveImage = function resolveImage(src) {
  var cache = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  if (cache && imagesCache.get(src)) return imagesCache.get(src);

  var image = void 0;
  if (isCompatibleBase64(src)) {
    image = resolveBase64Image(src);
  } else if ((typeof src === 'undefined' ? 'undefined' : _typeof(src)) === 'object') {
    image = resolveLocalImage(src);
  } else {
    image = resolveRemoteImage(src);
  }

  if (cache) {
    imagesCache.set(src, image);
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
          string: chunk.replace(match, textkitCore.Attachment.CHARACTER),
          attributes: _extends({}, fragment.attributes, {
            attachment: new textkitCore.Attachment(emojiSize, emojiSize, {
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

  Document.prototype.wrapPages = function wrapPages() {
    var pageCount = 1;

    var pages = this.children.reduce(function (acc, page) {
      var wrapArea = page.size.height - (page.style.paddingBottom || 0);
      if (page.wrap) {
        var subpages = _wrapPages(page, wrapArea, pageCount);

        pageCount += subpages.length;

        return [].concat(acc, subpages);
      } else {
        page.height = page.size.height;
        return [].concat(acc, [page]);
      }
    }, []);

    return pages;
  };

  Document.prototype.renderPages = function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5() {
      var subpages, j;
      return _regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              subpages = this.wrapPages();
              j = 0;

            case 2:
              if (!(j < subpages.length)) {
                _context5.next = 9;
                break;
              }

              // Update dynamic text nodes with total pages info
              subpages[j].renderDynamicNodes({
                pageNumber: j + 1,
                totalPages: subpages.length
              }, function (node) {
                return node.name === 'Text';
              });
              _context5.next = 6;
              return subpages[j].render();

            case 6:
              j++;
              _context5.next = 2;
              break;

            case 9:
              return _context5.abrupt('return', subpages);

            case 10:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, this);
    }));

    function renderPages() {
      return _ref5.apply(this, arguments);
    }

    return renderPages;
  }();

  Document.prototype.render = function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee6() {
      return _regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.prev = 0;

              this.addMetaData();
              this.applyProps();
              _context6.next = 5;
              return this.loadEmojis();

            case 5:
              _context6.next = 7;
              return this.loadAssets();

            case 7:
              _context6.next = 9;
              return this.renderPages();

            case 9:
              this.root.instance.end();
              Font.reset();
              _context6.next = 16;
              break;

            case 13:
              _context6.prev = 13;
              _context6.t0 = _context6['catch'](0);
              throw _context6.t0;

            case 16:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, this, [[0, 13]]);
    }));

    function render() {
      return _ref6.apply(this, arguments);
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

var PERCENT = /^(\d+)?%$/g;

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
    var isPercent = PERCENT.exec(value);

    if (isPercent) {
      this.layout[percentMethod](parseInt(isPercent[1], 10));
    } else {
      this.layout[fixedMethod](value);
    }
  };

  Node.prototype.setPosition = function setPosition(edge, value) {
    var isPercent = PERCENT.exec(value);

    if (isPercent) {
      this.layout.setPositionPercent(edge, parseInt(isPercent[1], 10));
    } else {
      this.layout.setPosition(edge, value);
    }
  };

  Node.prototype.setPadding = function setPadding(edge, value) {
    var isPercent = PERCENT.exec(value);

    if (isPercent) {
      this.layout.setPaddingPercent(edge, parseInt(isPercent[1], 10));
    } else {
      this.layout.setPadding(edge, value);
    }
  };

  Node.prototype.setMargin = function setMargin(edge, value) {
    var isPercent = PERCENT.exec(value);

    if (isPercent) {
      this.layout.setMarginPercent(edge, parseInt(isPercent[1], 10));
    } else {
      this.layout.setMargin(edge, value);
    }
  };

  Node.prototype.setBorder = function setBorder(edge, value) {
    if (PERCENT.exec(value)) {
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

var Borders = {
  drawBorders: function drawBorders() {
    var _getAbsoluteLayout = this.getAbsoluteLayout(),
        left = _getAbsoluteLayout.left,
        top = _getAbsoluteLayout.top,
        width = _getAbsoluteLayout.width,
        height = _getAbsoluteLayout.height;

    var _borderTopWidth = this.borderTopWidth,
        borderTopWidth = _borderTopWidth === undefined ? 0 : _borderTopWidth,
        _borderRightWidth = this.borderRightWidth,
        borderRightWidth = _borderRightWidth === undefined ? 0 : _borderRightWidth,
        _borderBottomWidth = this.borderBottomWidth,
        borderBottomWidth = _borderBottomWidth === undefined ? 0 : _borderBottomWidth,
        _borderLeftWidth = this.borderLeftWidth,
        borderLeftWidth = _borderLeftWidth === undefined ? 0 : _borderLeftWidth;

    var _getComputedStyles = this.getComputedStyles(),
        _getComputedStyles$bo = _getComputedStyles.borderTopLeftRadius,
        borderTopLeftRadius = _getComputedStyles$bo === undefined ? 0 : _getComputedStyles$bo,
        _getComputedStyles$bo2 = _getComputedStyles.borderTopRightRadius,
        borderTopRightRadius = _getComputedStyles$bo2 === undefined ? 0 : _getComputedStyles$bo2,
        _getComputedStyles$bo3 = _getComputedStyles.borderBottomRightRadius,
        borderBottomRightRadius = _getComputedStyles$bo3 === undefined ? 0 : _getComputedStyles$bo3,
        _getComputedStyles$bo4 = _getComputedStyles.borderBottomLeftRadius,
        borderBottomLeftRadius = _getComputedStyles$bo4 === undefined ? 0 : _getComputedStyles$bo4,
        _getComputedStyles$bo5 = _getComputedStyles.borderTopColor,
        borderTopColor = _getComputedStyles$bo5 === undefined ? 'black' : _getComputedStyles$bo5,
        _getComputedStyles$bo6 = _getComputedStyles.borderRightColor,
        borderRightColor = _getComputedStyles$bo6 === undefined ? 'black' : _getComputedStyles$bo6,
        _getComputedStyles$bo7 = _getComputedStyles.borderBottomColor,
        borderBottomColor = _getComputedStyles$bo7 === undefined ? 'black' : _getComputedStyles$bo7,
        _getComputedStyles$bo8 = _getComputedStyles.borderLeftColor,
        borderLeftColor = _getComputedStyles$bo8 === undefined ? 'black' : _getComputedStyles$bo8,
        _getComputedStyles$bo9 = _getComputedStyles.borderTopStyle,
        borderTopStyle = _getComputedStyles$bo9 === undefined ? 'solid' : _getComputedStyles$bo9,
        _getComputedStyles$bo10 = _getComputedStyles.borderRightStyle,
        borderRightStyle = _getComputedStyles$bo10 === undefined ? 'solid' : _getComputedStyles$bo10,
        _getComputedStyles$bo11 = _getComputedStyles.borderBottomStyle,
        borderBottomStyle = _getComputedStyles$bo11 === undefined ? 'solid' : _getComputedStyles$bo11,
        _getComputedStyles$bo12 = _getComputedStyles.borderLeftStyle,
        borderLeftStyle = _getComputedStyles$bo12 === undefined ? 'solid' : _getComputedStyles$bo12;

    // Save current graphics stack


    this.root.instance.save();

    // border top
    this.drawHorizontalBorder([left + (borderTopLeftRadius > 0 ? borderTopWidth / 2 : 0), top + borderTopWidth / 2], [left + width - (borderTopRightRadius > 0 ? borderTopWidth / 2 : 0), top + borderTopWidth / 2], borderTopLeftRadius, borderTopRightRadius, borderTopWidth, borderTopColor, borderTopStyle);

    // border right
    this.drawVerticalBorder([left + width - borderRightWidth / 2, top + (borderTopRightRadius > 0 ? borderRightWidth / 2 : 0)], [left + width - borderRightWidth / 2, top + height - (borderBottomRightRadius > 0 ? borderRightWidth / 2 : 0)], -borderTopRightRadius, -borderBottomRightRadius, borderRightWidth, borderRightColor, borderRightStyle);

    // border bottom
    this.drawHorizontalBorder([left + width - (borderBottomRightRadius > 0 ? borderBottomWidth / 2 : 0), top + height - borderBottomWidth / 2], [left + (borderBottomLeftRadius > 0 ? borderBottomWidth / 2 : 0), top + height - borderBottomWidth / 2], -borderBottomRightRadius, -borderBottomLeftRadius, borderBottomWidth, borderBottomColor, borderBottomStyle);

    // border left
    this.drawVerticalBorder([left + borderLeftWidth / 2, top + height - (borderBottomLeftRadius > 0 ? borderLeftWidth / 2 : 0)], [left + borderLeftWidth / 2, top + (borderTopLeftRadius > 0 ? borderLeftWidth / 2 : 0)], borderBottomLeftRadius, borderTopLeftRadius, borderLeftWidth, borderLeftColor, borderLeftStyle);

    // Restore graphics stack to avoid side effects
    this.root.instance.restore();
  },
  traceBorder: function traceBorder(style, width) {
    switch (style) {
      case 'dashed':
        this.root.instance.dash(width * 2, { space: width * 1.2 }).stroke();
        break;
      case 'dotted':
        this.root.instance.dash(width, { space: width * 1.2 }).stroke();
        break;
      default:
        this.root.instance.stroke();
    }
  },
  drawHorizontalBorder: function drawHorizontalBorder(p1, p2, r1, r2, width, color, style) {
    if (width <= 0) return;

    this.root.instance.lineWidth(width).moveTo(p1[0], p1[1] + r1).quadraticCurveTo(p1[0], p1[1], p1[0] + r1, p1[1]).lineTo(p2[0] - r2, p2[1]).quadraticCurveTo(p2[0], p2[1], p2[0], p2[1] + r2).strokeColor(color);

    this.traceBorder(style, width);
  },
  drawVerticalBorder: function drawVerticalBorder(p1, p2, r1, r2, width, color, style) {
    if (width <= 0) return;

    this.root.instance.lineWidth(width).moveTo(p1[0] + r1, p1[1]).quadraticCurveTo(p1[0], p1[1], p1[0], p1[1] - r1).lineTo(p2[0], p2[1] + r2).quadraticCurveTo(p2[0], p2[1], p2[0] + r2, p2[1]).strokeColor(color);

    this.traceBorder(style, width);
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

  Base.prototype.drawBackgroundColor = function drawBackgroundColor() {
    var _getAbsoluteLayout = this.getAbsoluteLayout(),
        left = _getAbsoluteLayout.left,
        top = _getAbsoluteLayout.top,
        width = _getAbsoluteLayout.width,
        height = _getAbsoluteLayout.height;

    var styles = this.getComputedStyles();

    // We can't set individual radius for each corner on PDF, so we get the higher
    var borderRadius = Math.max(styles.borderTopLeftRadius, styles.borderTopRightRadius, styles.borderBottomRightRadius, styles.borderBottomLeftRadius) || 0;

    if (styles.backgroundColor) {
      this.root.instance.fillColor(styles.backgroundColor).roundedRect(left, top, width, height, borderRadius).fill();
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

  Base.prototype.update = function update(newProps) {
    this.props = merge({}, this.constructor.defaultProps, Base.defaultProps, newProps);
    this.root.markDirty();
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
_Object$assign(Base.prototype, Transformations);

var TextInstance = function () {
  function TextInstance(root, value) {
    _classCallCheck(this, TextInstance);

    this.root = root;
    this.value = value;
    this.parent = null;
    this.props = {};
  }

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
    if (!!this.style.marginTop || !!this.style.marginBottom || !!this.style.marginLeft || !!this.style.marginRight) {
      warning(false, 'Margin values are not allowed on Page element. Use padding instead.');

      this.style.marginTop = 0;
      this.style.marginBottom = 0;
      this.style.marginLeft = 0;
      this.style.marginRight = 0;
    }
  };

  Page.prototype.applyProps = function applyProps() {
    this.top = 0;
    this.left = 0;
    this.style = StyleSheet.resolve(this.props.style);

    this.resetMargins();

    this.layout.setWidth(this.size.width);

    // Add some padding if ruler present, so we can see the whole page inside it
    var rulerWidth = this.getRulerWidth();
    var _style = this.style,
        _style$paddingTop = _style.paddingTop,
        paddingTop = _style$paddingTop === undefined ? 0 : _style$paddingTop,
        _style$paddingLeft = _style.paddingLeft,
        paddingLeft = _style$paddingLeft === undefined ? 0 : _style$paddingLeft;


    if (this.hasHorizontalRuler()) {
      this.style.paddingTop = paddingTop + rulerWidth;
    }

    if (this.hasVerticalRuler()) {
      this.style.paddingLeft = paddingLeft + rulerWidth;
    }

    _Base.prototype.applyProps.call(this);
  };

  Page.prototype.addDynamicChild = function addDynamicChild(parent, elements) {
    if (!elements) return;
    var children = Array.isArray(elements) ? elements : [elements];

    for (var i = 0; i < children.length; i++) {
      var child = children[i];
      var type = child.type,
          props = child.props;


      if (typeof child === 'string') {
        var instance = new TextInstance(this.root, child);
        parent.appendChild(instance);
      } else if (type !== React.Fragment) {
        var _instance = createInstance(child, this.root);
        parent.appendChild(_instance);
        _instance.applyProps();
        this.addDynamicChild(_instance, props.children);
      } else {
        this.addDynamicChild(parent, props.children);
      }
    }
  };

  Page.prototype.renderDynamicNodes = function renderDynamicNodes(props, cb) {
    var listToExplore = this.children.slice(0);

    while (listToExplore.length > 0) {
      var node = listToExplore.shift();
      var condition = cb ? cb(node) : true;

      if (condition && node.props.render) {
        node.removeAllChilds();
        var elements = node.props.render(props);
        this.addDynamicChild(node, elements);
        if (!node.fixed) node.props.render = null;
        continue;
      }

      if (node.children) {
        listToExplore.push.apply(listToExplore, node.children);
      }
    }
  };

  Page.prototype.nodeWillWrap = function nodeWillWrap(props) {
    this.renderDynamicNodes(props);
    this.calculateLayout();
  };

  Page.prototype.onNodeSplit = function onNodeSplit(height, clone) {
    clone.marginTop = 0;
    this.marginBottom = 0;
    this.calculateLayout();
  };

  Page.prototype.update = function update(newProps) {};

  Page.prototype.clone = function clone() {
    var clone = _Base.prototype.clone.call(this);
    clone._size = this.size;
    return clone;
  };

  Page.prototype.render = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
      var instance;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
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

              _context.next = 7;
              return this.renderChildren();

            case 7:

              if (this.props.debug) this.debug();

              this.renderRuler();

            case 9:
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
      if (this._size) {
        return this._size;
      }

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
  var src = value;

  if (typeof src === 'string' && !src.match(PROTOCOL_REGEXP)) {
    src = 'http://' + src;
  }

  return src;
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
      return upperFirst(text);
    default:
      return text;
  }
};

var getFragments = function getFragments(instance) {
  var fragments = [];

  var _instance$getComputed = instance.getComputedStyles(),
      _instance$getComputed2 = _instance$getComputed.color,
      color = _instance$getComputed2 === undefined ? 'black' : _instance$getComputed2,
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
  return textkitCore.AttributedString.fromFragments(getFragments(instance)).trim();
};

var INFINITY = 999999;
var PDFRenderer$2 = createPDFRenderer({ Rect: textkitCore.Rect });

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
    height = height || INFINITY;

    // Text layout is expensive. That's why we ensure to only do it once
    // (except dynamic nodes. Those change content and needs to relayout every time)
    if (!this._container || this.props.render) {
      var path = new textkitCore.Path().rect(0, 0, width, height);
      var container = new textkitCore.Container(path);
      var attributedString = this.attributedString;

      // Do the actual text layout
      this.root.layoutEngine.layout(attributedString, [container]);
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
      return this.heightAtLineIndex(orphans - 1);
    } else if (linesQuantity - slicedLine < widows) {
      return height - this.heightAtLineIndex(widows - 1);
    }

    return height;
  };

  Text.prototype.onNodeSplit = function onNodeSplit(height, clone) {
    var wrapHeight = this.wrapHeight(height);
    var slicedLineIndex = this.lineIndexAtHeight(wrapHeight);
    var slicedLine = this.lines[slicedLineIndex - 1];

    clone.marginTop = 0;
    clone.paddingTop = 0;
    clone.start = slicedLineIndex;
    clone.attributedString = this.attributedString.slice(slicedLine ? slicedLine.stringEnd : 0, this.attributedString.length);

    this.height = wrapHeight;
    this.marginBottom = 0;
    this.paddingBottom = 0;
    this.end = slicedLineIndex;
  };

  Text.prototype.clone = function clone() {
    var text = _Base.prototype.clone.call(this);

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
      var imageWidth = Math.min(this.image.width, width);

      return {
        width: imageWidth,
        height: imageWidth / this.ratio
      };
    }

    return { height: height, width: width };
  };

  Image.prototype.fetch = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return resolveImage(this.props.src, this.props.cache);

            case 3:
              this.image = _context.sent;
              _context.next = 10;
              break;

            case 6:
              _context.prev = 6;
              _context.t0 = _context['catch'](0);

              this.image = { width: 0, height: 0 };
              console.warn(_context.t0.message);

            case 10:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this, [[0, 6]]);
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

  Image.prototype.render = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
      var padding, _getAbsoluteLayout, left, top, width, height, xOffset;

      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              padding = this.padding;
              _getAbsoluteLayout = this.getAbsoluteLayout(), left = _getAbsoluteLayout.left, top = _getAbsoluteLayout.top;


              this.root.instance.save();
              this.applyTransformations();
              this.drawBackgroundColor();
              this.drawBorders();

              if (this.image.data) {
                // Inner offset between yoga node and image box
                // Makes image centered inside Yoga node
                width = Math.min(this.height * this.ratio, this.width) - padding.left - padding.right;
                height = this.height - padding.top - padding.bottom;
                xOffset = Math.max((this.width - width) / 2, 0);


                if (width !== 0 && height !== 0) {
                  this.root.instance.image(this.image.data, left + padding.left + xOffset, top + padding.top, { width: width, height: height });
                } else {
                  warning(false, 'Image with src \'' + this.props.src + '\' skipped due to invalid dimensions');
                }
              }

              if (this.props.debug) {
                this.debug();
              }

              this.root.instance.restore();

            case 9:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function render() {
      return _ref2.apply(this, arguments);
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

var objectsEqual = function objectsEqual(a, b) {
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
      if (_typeof(a[propName]) === 'object' && _typeof(b[propName]) === 'object' && objectsEqual(a[propName], b[propName])) {
        continue;
      }

      return false;
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
    return !objectsEqual(oldProps, newProps);
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

var version = "1.0.0-alpha.24";

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

                    if (container.document.props.onRender) {
                      container.document.props.onRender({ blob: blob });
                    }

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

  function isDirty() {
    return container.isDirty;
  }

  function updateContainer(doc) {
    PDFRenderer.updateContainer(doc, mountNode, null);
  }

  function toBuffer() {
    if (container.document.props.onRender) {
      container.document.props.onRender();
    }

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
          if (container.document.props.onRender) {
            container.document.props.onRender({ string: result });
          }

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

  return React__default.createElement(
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

    if (this.instance.isDirty()) {
      this.onDocumentUpdate();
    }
  };

  InternalBlobProvider.prototype.renderDocument = function renderDocument() {
    this.instance.updateContainer(this.props.document);
  };

  InternalBlobProvider.prototype.onDocumentUpdate = function onDocumentUpdate() {
    var _this2 = this;

    this.instance.toBlob().then(function (blob) {
      _this2.setState({ blob: blob, url: URL.createObjectURL(blob), loading: false });
    }).catch(function (error) {
      _this2.setState({ error: error });
      throw error;
    });
  };

  InternalBlobProvider.prototype.render = function render() {
    return this.props.children(this.state);
  };

  return InternalBlobProvider;
}(React__default.PureComponent);

var BlobProvider = function BlobProvider(_ref2) {
  var doc = _ref2.document,
      children = _ref2.children;

  if (!doc) {
    warning(false, 'You should pass a valid document to BlobProvider');
    return null;
  }

  return React__default.createElement(
    InternalBlobProvider,
    { document: doc },
    children
  );
};

var PDFViewer = function PDFViewer(_ref3) {
  var className = _ref3.className,
      style = _ref3.style,
      children = _ref3.children;

  return React__default.createElement(
    InternalBlobProvider,
    { document: children },
    function (_ref4) {
      var url = _ref4.url;
      return React__default.createElement('iframe', {
        className: className,
        src: url,
        style: Array.isArray(style) ? flatStyles(style) : style
      });
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

  return React__default.createElement(
    InternalBlobProvider,
    { document: doc },
    function (params) {
      return React__default.createElement(
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

exports.Document = Document$$1;
exports.BlobProvider = BlobProvider;
exports.PDFViewer = PDFViewer;
exports.PDFDownloadLink = PDFDownloadLink;
exports['default'] = dom;
exports.pdf = pdf;
exports.View = View;
exports.Text = Text;
exports.Link = Link;
exports.Page = Page;
exports.Font = Font;
exports.Note = Note;
exports.Image = Image;
exports.version = version;
exports.StyleSheet = StyleSheet;
exports.PDFRenderer = PDFRenderer;
exports.createInstance = createInstance;
//# sourceMappingURL=react-pdf.browser.cjs.js.map

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _inheritsLoose = _interopDefault(require('@babel/runtime/helpers/inheritsLoose'));
var _objectWithoutPropertiesLoose = _interopDefault(require('@babel/runtime/helpers/objectWithoutPropertiesLoose'));
var _extends = _interopDefault(require('@babel/runtime/helpers/extends'));
var React = _interopDefault(require('react'));
var _regeneratorRuntime = _interopDefault(require('@babel/runtime/regenerator'));
var _asyncToGenerator = _interopDefault(require('@babel/runtime/helpers/asyncToGenerator'));
var BlobStream = _interopDefault(require('blob-stream'));
var PDFDocument = require('@react-pdf/pdfkit');
var PDFDocument__default = _interopDefault(PDFDocument);
var ReactFiberReconciler = _interopDefault(require('react-reconciler'));
var R = require('ramda');
require('is-url');
var fontkit = _interopDefault(require('@react-pdf/fontkit'));
var fetch = _interopDefault(require('cross-fetch'));
var PNG = _interopDefault(require('@react-pdf/png-js'));
var emojiRegex = _interopDefault(require('emoji-regex'));
var matchMedia = _interopDefault(require('media-engine'));
var Yoga = _interopDefault(require('yoga-layout-prebuilt'));
var layoutEngine = _interopDefault(require('@react-pdf/textkit/layout'));
var linebreaker = _interopDefault(require('@react-pdf/textkit/engines/linebreaker'));
var justification = _interopDefault(require('@react-pdf/textkit/engines/justification'));
var textDecoration = _interopDefault(require('@react-pdf/textkit/engines/textDecoration'));
var scriptItemizer = _interopDefault(require('@react-pdf/textkit/engines/scriptItemizer'));
var wordHyphenation = _interopDefault(require('@react-pdf/textkit/engines/wordHyphenation'));
var _createClass = _interopDefault(require('@babel/runtime/helpers/createClass'));
var AttributedString = _interopDefault(require('@react-pdf/textkit/attributedString'));
var PDFRenderer = _interopDefault(require('@react-pdf/textkit/renderers/pdf'));

/**
 * Checks if two sets of props are equal (recursively)
 *
 * @param {Object} props A
 * @param {Object} props B
 * @returns {Boolean} props equals?
 *
 */
var propsEqual = function propsEqual(a, b) {
  var oldPropsKeys = Object.keys(a);
  var newPropsKeys = Object.keys(b);

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
      if (typeof a[propName] === 'object' && typeof b[propName] === 'object' && propsEqual(a[propName], b[propName])) {
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

var emptyObject = {};

var createRenderer = function createRenderer(onChange) {
  return ReactFiberReconciler({
    supportsMutation: true,
    appendInitialChild: function appendInitialChild(parentInstance, child) {
      parentInstance.children.push(child);
      onChange();
    },
    createInstance: function createInstance(type, _ref) {
      var style = _ref.style,
          children = _ref.children,
          props = _objectWithoutPropertiesLoose(_ref, ["style", "children"]);

      return {
        type: type,
        box: {},
        style: style || {},
        props: props || {},
        children: []
      };
    },
    createTextInstance: function createTextInstance(text, rootContainerInstance) {
      return {
        type: 'TEXT_INSTANCE',
        value: text
      };
    },
    finalizeInitialChildren: function finalizeInitialChildren(element, type, props) {
      return false;
    },
    getPublicInstance: function getPublicInstance(instance) {
      return instance;
    },
    prepareForCommit: function prepareForCommit() {// Noop
    },
    prepareUpdate: function prepareUpdate(element, type, oldProps, newProps) {
      return !propsEqual(oldProps, newProps);
    },
    resetAfterCommit: function resetAfterCommit(a, b, c) {// Noop
    },
    resetTextContent: function resetTextContent(element) {// Noop
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
      parentInstance.children.push(child);
      onChange();
    },
    appendChildToContainer: function appendChildToContainer(parentInstance, child) {
      parentInstance.children.push(child);
      onChange();
    },
    insertBefore: function insertBefore(parentInstance, child, beforeChild) {
      var index = parentInstance.children.indexOf(beforeChild);
      if (index !== -1 && child) parentInstance.children.splice(index, 0, child);
      onChange();
    },
    removeChild: function removeChild(parentInstance, child) {
      var index = parentInstance.children.indexOf(child);
      if (index !== -1) parentInstance.children.splice(index, 1);
      onChange();
    },
    removeChildFromContainer: function removeChildFromContainer(parentInstance, child) {
      var index = parentInstance.children.indexOf(child);
      if (index !== -1) parentInstance.children.splice(index, 1);
      onChange();
    },
    commitTextUpdate: function commitTextUpdate(textInstance, oldText, newText) {
      textInstance.value = newText;
      onChange();
    },
    commitUpdate: function commitUpdate(instance, updatePayload, type, oldProps, newProps) {
      var style = newProps.style,
          props = _objectWithoutPropertiesLoose(newProps, ["style"]);

      instance.props = props;
      instance.style = style;
      onChange();
    }
  });
};

var VIEW = 'VIEW';
var TEXT = 'TEXT';
var LINK = 'LINK';
var PAGE = 'PAGE';
var NOTE = 'NOTE';
var IMAGE = 'IMAGE';
var DOCUMENT = 'DOCUMENT';
var CANVAS = 'CANVAS';
var TEXT_INSTANCE = 'TEXT_INSTANCE';
var DPI = 72; // 72pt per inch.
// https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight#Common_weight_name_mapping

var FONT_WEIGHTS = {
  thin: 100,
  hairline: 100,
  ultralight: 200,
  extralight: 200,
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  demibold: 600,
  bold: 700,
  ultrabold: 800,
  extrabold: 800,
  heavy: 900,
  black: 900
};
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
var PORTRAIT = 'portrait';
var LANDSCAPE = 'landscape';
var INHERITED_PROPERTIES = ['color', 'fontFamily', 'fontSize', 'fontStyle', 'fontWeight', 'letterSpacing', 'opacity', 'textDecoration', 'lineHeight', 'textAlign', 'visibility', 'wordSpacing'];
var RULER_WIDTH = 13;
var RULER_COLOR = 'white';
var RULER_FONT_SIZE = 6;
var DEFAULT_RULER_STEPS = 50;
var LINE_WIDTH = 0.5;
var LINE_COLOR = 'gray';
var GRID_COLOR = '#ababab';

var BOX_MODEL_REGEX = /\d+(px|in|mm|cm|pt|%|vw|vh)?/g;
var OBJECT_POSITION_REGEX = /\d+(px|in|mm|cm|pt|%|vw|vh)?/g;
var BORDER_SHORTHAND_REGEX = /(\d+(px|in|mm|cm|pt|vw|vh)?)\s(\S+)\s(\S+)/;
var TRANSFORM_ORIGIN_REGEX = /(-?\d+(px|in|mm|cm|pt|%|vw|vh)?)|top|right|bottom|left|center/g;
var matchBoxModel = R.match(BOX_MODEL_REGEX);
var matchObjectPosition = R.match(OBJECT_POSITION_REGEX);
var matchBorderShorthand = R.match(BORDER_SHORTHAND_REGEX);
var matchTransformOrigin = R.match(TRANSFORM_ORIGIN_REGEX);

var isFontWeightStyle = function isFontWeightStyle(key) {
  return key.match(/^fontWeight/);
};

var isBorderStyle = function isBorderStyle(key, value) {
  return key.match(/^border(Top|Right|Bottom|Left)(Color|Width|Style)/) && typeof value === 'string';
};

var isBoxModelStyle = function isBoxModelStyle(key, value) {
  return key.match(/^(margin)|(padding)/) && typeof value === 'string';
};

var isObjectPositionStyle = function isObjectPositionStyle(key, value) {
  return key.match(/^objectPosition/) && typeof value === 'string';
};

var isTransformOriginStyle = function isTransformOriginStyle(key, value) {
  return key.match(/^transformOrigin/) && typeof value === 'string';
};

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
      throw new Error("StyleSheet: Invalid '" + value + "' for '" + key + "'");
    }
  }

  return value;
};

var processBoxModel = function processBoxModel(key, value) {
  var match = matchBoxModel(value);

  if (match) {
    if (key.match(/.Top/)) {
      return match[0];
    } else if (key.match(/.Right/)) {
      return match[1] || match[0];
    } else if (key.match(/.Bottom/)) {
      return match[2] || match[0];
    } else if (key.match(/.Left/)) {
      return match[3] || match[1] || match[0];
    } else {
      throw new Error("StyleSheet: Invalid '" + value + "' for '" + key + "'");
    }
  }

  return value;
};

var processFontWeight = function processFontWeight(key, value) {
  if (!value) return FONT_WEIGHTS.normal;
  if (typeof value === 'number') return value;
  return FONT_WEIGHTS[value.toLowerCase()];
};
var processObjectPosition = function processObjectPosition(key, value) {
  var match = matchObjectPosition(value);

  if (match) {
    if (key.match(/.X/)) {
      return match[0];
    } else if (key.match(/.Y/)) {
      return match[1];
    } else {
      throw new Error("StyleSheet: Invalid '" + value + "' for '" + key + "'");
    }
  }

  return value;
};

var transformOffsetKeywords = function transformOffsetKeywords(value) {
  switch (value) {
    case 'top':
    case 'left':
      return '0%';

    case 'right':
    case 'bottom':
      return '100%';

    case 'center':
      return '50%';

    default:
      return value;
  }
}; // Transforms shorthand transformOrigin values


var processTransformOrigin = function processTransformOrigin(key, value) {
  var match = matchTransformOrigin(value);

  if (match) {
    var result;

    if (key.match(/.X/)) {
      result = match[0];
    } else if (key.match(/.Y/)) {
      result = match[1] || match[0];
    } else {
      throw new Error("StyleSheet: Invalid '" + value + "' for '" + key + "'");
    }

    return transformOffsetKeywords(result);
  }

  return value;
};

var matchNumber = R.when(R.is(String), R.compose(R.complement(R.isEmpty), R.match(/^-?\d*\.?\d*$/)));
var castFloat = R.when(matchNumber, function (v) {
  return parseFloat(v, 10);
});

var transformStyles = function transformStyles(style) {
  var propsArray = Object.keys(style);
  var resolvedStyle = {};

  for (var i = 0; i < propsArray.length; i++) {
    var key = propsArray[i];
    var value = style[key];
    resolvedStyle[key] = R.compose(castFloat, R.cond([[isBorderStyle, processBorders], [isBoxModelStyle, processBoxModel], [isObjectPositionStyle, processObjectPosition], [isTransformOriginStyle, processTransformOrigin], [isFontWeightStyle, processFontWeight], [R.T, R.always(value)]]))(key, value);
  }

  return resolvedStyle;
};

var fetchFont =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee(src, options) {
    var response, buffer;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return fetch(src, options);

          case 2:
            response = _context.sent;
            _context.next = 5;
            return response.buffer ? response.buffer() : response.arrayBuffer();

          case 5:
            buffer = _context.sent;
            return _context.abrupt("return", buffer.constructor.name === 'Buffer' ? buffer : Buffer.from(buffer));

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function fetchFont(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var FontSource =
/*#__PURE__*/
function () {
  function FontSource(src, fontFamily, fontStyle, fontWeight, options) {
    this.src = src;
    this.fontFamily = fontFamily;
    this.fontStyle = fontStyle || 'normal';
    this.fontWeight = processFontWeight(fontWeight) || 400;
    this.data = null;
    this.loading = false;
    this.options = options;
  }

  var _proto = FontSource.prototype;

  _proto.load =
  /*#__PURE__*/
  function () {
    var _load = _asyncToGenerator(
    /*#__PURE__*/
    _regeneratorRuntime.mark(function _callee2() {
      var _this = this;

      var _this$options, headers, body, _this$options$method, method, data;

      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              this.loading = true;

              _this$options = this.options, headers = _this$options.headers, body = _this$options.body, _this$options$method = _this$options.method, method = _this$options$method === void 0 ? 'GET' : _this$options$method;
              _context2.next = 5;
              return fetchFont(this.src, {
                method: method,
                body: body,
                headers: headers
              });

            case 5:
              data = _context2.sent;
              this.data = fontkit.create(data);
              _context2.next = 12;
              break;

            case 9:
              _context2.next = 11;
              return new Promise(function (resolve, reject) {
                return fontkit.open(_this.src, function (err, data) {
                  return err ? reject(err) : resolve(data);
                });
              });

            case 11:
              this.data = _context2.sent;

            case 12:
              this.loading = false;

            case 13:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function load() {
      return _load.apply(this, arguments);
    }

    return load;
  }();

  return FontSource;
}();

var Font =
/*#__PURE__*/
function () {
  Font.create = function create(family) {
    return new Font(family);
  };

  function Font(family) {
    this.family = family;
    this.sources = [];
  }

  var _proto2 = Font.prototype;

  _proto2.register = function register(_ref2) {
    var src = _ref2.src,
        fontWeight = _ref2.fontWeight,
        fontStyle = _ref2.fontStyle,
        options = _objectWithoutPropertiesLoose(_ref2, ["src", "fontWeight", "fontStyle"]);

    this.sources.push(new FontSource(src, this.fontFamily, fontStyle, fontWeight, options));
  };

  _proto2.resolve = function resolve(descriptor) {
    var _descriptor$fontWeigh = descriptor.fontWeight,
        fontWeight = _descriptor$fontWeigh === void 0 ? 400 : _descriptor$fontWeigh,
        _descriptor$fontStyle = descriptor.fontStyle,
        fontStyle = _descriptor$fontStyle === void 0 ? 'normal' : _descriptor$fontStyle;
    var styleSources = this.sources.filter(function (s) {
      return s.fontStyle === fontStyle;
    }); // Weight resolution. https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight#Fallback_weights

    var exactFit = styleSources.find(function (s) {
      return s.fontWeight === fontWeight;
    });
    if (exactFit) return exactFit;
    var res;

    if (fontWeight >= 400 && fontWeight <= 500) {
      var leftOffset = styleSources.filter(function (s) {
        return s.fontWeight <= fontWeight;
      });
      var rightOffset = styleSources.filter(function (s) {
        return s.fontWeight > 500;
      });
      var fit = styleSources.filter(function (s) {
        return s.fontWeight >= fontWeight && s.fontWeight < 500;
      });
      res = fit[0] || leftOffset[leftOffset.length - 1] || rightOffset[0];
    }

    var lt = styleSources.filter(function (s) {
      return s.fontWeight < fontWeight;
    });
    var gt = styleSources.filter(function (s) {
      return s.fontWeight > fontWeight;
    });

    if (fontWeight < 400) {
      res = lt[lt.length - 1] || gt[0];
    }

    if (fontWeight > 500) {
      res = gt[0] || lt[lt.length - 1];
    }

    if (!res) {
      throw new Error("Could not resolve font for " + this.fontFamily + ", fontWeight " + fontWeight);
    }

    return res;
  };

  return Font;
}();

var emojiSource;
var registerEmojiSource = function registerEmojiSource(_ref) {
  var url = _ref.url,
      _ref$format = _ref.format,
      format = _ref$format === void 0 ? 'png' : _ref$format;
  emojiSource = {
    url: url,
    format: format
  };
};
var getEmojiSource = function getEmojiSource() {
  return emojiSource;
};
var emoji = {
  registerEmojiSource: registerEmojiSource,
  getEmojiSource: getEmojiSource
};

var standardFonts = ['Courier', 'Courier-Bold', 'Courier-Oblique', 'Helvetica', 'Helvetica-Bold', 'Helvetica-Oblique', 'Times-Roman', 'Times-Bold', 'Times-Italic'];

var hyphenationCallback;
var registerHyphenationCallback = function registerHyphenationCallback(callback) {
  hyphenationCallback = callback;
};
var getHyphenationCallback = function getHyphenationCallback() {
  return hyphenationCallback;
};
var hyphenation = {
  registerHyphenationCallback: registerHyphenationCallback,
  getHyphenationCallback: getHyphenationCallback
};

function printWarning(format) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  var argIndex = 0;
  var message = 'Warning: ' + format.replace(/%s/g, function () {
    return args[argIndex++];
  });

  if (typeof console !== 'undefined') {
    console.error(message);
  }

  try {
    throw new Error(message);
  } catch (x) {}
}

var __DEV__ = process.env.NODE_ENV !== 'production';

var warning = __DEV__ ? function (condition, format) {
  if (format === undefined) {
    throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
  }

  if (!condition) {
    for (var _len2 = arguments.length, args = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
      args[_key2 - 2] = arguments[_key2];
    }

    printWarning.apply(void 0, [format].concat(args));
  }
} : function () {};

var fonts = {};

var register = function register(src, data) {
  if (typeof src === 'object') {
    data = src;
  } else {
    warning(false, 'Font.register will not longer accept the font source as first argument. Please move it into the data object. For more info refer to https://react-pdf.org/fonts');
    data.src = src;
  }

  var _data = data,
      family = _data.family;

  if (!fonts[family]) {
    fonts[family] = Font.create(family);
  } // Bulk loading


  if (data.fonts) {
    for (var i = 0; i < data.fonts.length; i++) {
      fonts[family].register(_extends({
        family: family
      }, data.fonts[i]));
    }
  } else {
    fonts[family].register(data);
  }
};

var getRegisteredFonts = function getRegisteredFonts() {
  return fonts;
};

var getRegisteredFontFamilies = function getRegisteredFontFamilies() {
  return Object.keys(fonts);
};

var getFont = function getFont(descriptor) {
  var fontFamily = descriptor.fontFamily;
  var isStandard = standardFonts.includes(fontFamily);
  if (isStandard) return null;

  if (!fonts[fontFamily]) {
    throw new Error("Font family not registered: " + fontFamily + ". Please register it calling Font.register() method.");
  }

  return fonts[fontFamily].resolve(descriptor);
};

var load =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee(descriptor) {
    var fontFamily, isStandard, font;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            fontFamily = descriptor.fontFamily;
            isStandard = standardFonts.includes(fontFamily);

            if (!isStandard) {
              _context.next = 4;
              break;
            }

            return _context.abrupt("return");

          case 4:
            font = getFont(descriptor); // We cache the font to avoid fetching it many times

            if (!(!font.data && !font.loading)) {
              _context.next = 8;
              break;
            }

            _context.next = 8;
            return font.load();

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function load(_x) {
    return _ref.apply(this, arguments);
  };
}();

var reset = function reset() {
  for (var _font in fonts) {
    if (fonts.hasOwnProperty(_font)) {
      fonts[_font].data = null;
    }
  }
};

var clear = function clear() {
  fonts = {};
};

var Font$1 = _extends({
  register: register,
  getRegisteredFonts: getRegisteredFonts,
  getRegisteredFontFamilies: getRegisteredFontFamilies,
  getFont: getFont,
  load: load,
  clear: clear,
  reset: reset
}, emoji, hyphenation);

/**
 * Checks if node is image
 *
 * @param {Object} node
 * @returns {Boolean} is node image?
 */

var isImage = R.propEq('type', IMAGE);

var fs = {};

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
  this.data = null;
  this.width = null;
  this.height = null;
  this.data = data;

  if (data.readUInt16BE(0) !== 0xffd8) {
    throw new Error('SOI not found in JPEG');
  }

  var marker;
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

  var marker;
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

var createCache = function createCache(_temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      _ref$limit = _ref.limit,
      limit = _ref$limit === void 0 ? 100 : _ref$limit;

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
    reset: function reset() {
      cache = {};
      keys = [];
    },
    length: function length() {
      return keys.length;
    }
  };
};

var IMAGE_CACHE = createCache({
  limit: 30
});
var getAbsoluteLocalPath = function getAbsoluteLocalPath(src) {
  {
    throw new Error('Cannot check local paths in client-side environment');
  }

  var _url$parse = fs.parse(src),
      protocol = _url$parse.protocol,
      auth = _url$parse.auth,
      host = _url$parse.host,
      port = _url$parse.port,
      hostname = _url$parse.hostname,
      pathname = _url$parse.path;

  var absolutePath = fs.resolve(pathname);

  if (protocol && protocol !== 'file:' || auth || host || port || hostname) {
    return undefined;
  }

  return absolutePath;
};

var fetchLocalFile = function fetchLocalFile(src) {
  return new Promise(function (resolve, reject) {
    try {
      {
        return reject(new Error('Cannot fetch local file in this environemnt'));
      }

      var absolutePath = getAbsoluteLocalPath(src);

      if (!absolutePath) {
        return reject(new Error("Cannot fetch non-local path: " + src));
      }

      fs.readFile(absolutePath, function (err, data) {
        return err ? reject(err) : resolve(data);
      });
    } catch (err) {
      reject(err);
    }
  });
};

var fetchRemoteFile =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee(uri, options) {
    var response, buffer;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return fetch(uri, options);

          case 2:
            response = _context.sent;
            _context.next = 5;
            return response.buffer ? response.buffer() : response.arrayBuffer();

          case 5:
            buffer = _context.sent;
            return _context.abrupt("return", buffer.constructor.name === 'Buffer' ? buffer : Buffer.from(buffer));

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function fetchRemoteFile(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var isValidFormat = function isValidFormat(format) {
  var lower = format.toLowerCase();
  return lower === 'jpg' || lower === 'jpeg' || lower === 'png';
};

var guessFormat = function guessFormat(buffer) {
  var format;

  if (JPEG.isValid(buffer)) {
    format = 'jpg';
  } else if (PNG.isValid(buffer)) {
    format = 'png';
  }

  return format;
};

var isCompatibleBase64 = function isCompatibleBase64(_ref2) {
  var uri = _ref2.uri;
  return /^data:image\/[a-zA-Z]*;base64,[^"]*/g.test(uri);
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

var resolveBase64Image = function resolveBase64Image(_ref3) {
  var uri = _ref3.uri;
  var match = /^data:image\/([a-zA-Z]*);base64,([^"]*)/g.exec(uri);
  var format = match[1];
  var data = match[2];

  if (!isValidFormat(format)) {
    throw new Error("Base64 image invalid format: " + format);
  }

  return new Promise(function (resolve) {
    return resolve(getImage(Buffer.from(data, 'base64'), format));
  });
};

var resolveImageFromData = function resolveImageFromData(src) {
  if (src.data && src.format) {
    return new Promise(function (resolve) {
      return resolve(getImage(src.data, src.format));
    });
  }

  throw new Error("Invalid data given for local file: " + JSON.stringify(src));
};

var resolveBufferImage = function resolveBufferImage(buffer) {
  var format = guessFormat(buffer);

  if (format) {
    return new Promise(function (resolve) {
      return resolve(getImage(buffer, format));
    });
  }
};

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

var resolveImageFromUrl =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee2(src) {
    var uri, body, headers, _src$method, method, data, extension;

    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            uri = src.uri, body = src.body, headers = src.headers, _src$method = src.method, method = _src$method === void 0 ? 'GET' : _src$method;

            {
              _context2.next = 7;
              break;
            }

            _context2.next = 4;
            return fetchLocalFile(uri);

          case 4:
            _context2.t0 = _context2.sent;
            _context2.next = 10;
            break;

          case 7:
            _context2.next = 9;
            return fetchRemoteFile(uri, {
              body: body,
              headers: headers,
              method: method
            });

          case 9:
            _context2.t0 = _context2.sent;

          case 10:
            data = _context2.t0;
            extension = getImageFormat(data);
            return _context2.abrupt("return", getImage(data, extension));

          case 13:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function resolveImageFromUrl(_x3) {
    return _ref4.apply(this, arguments);
  };
}();

var resolveImage = function resolveImage(src, _temp) {
  var _ref5 = _temp === void 0 ? {} : _temp,
      _ref5$cache = _ref5.cache,
      cache = _ref5$cache === void 0 ? true : _ref5$cache;

  var cacheKey = src.data ? src.data.toString() : src.uri;

  if (cache && IMAGE_CACHE.get(cacheKey)) {
    return IMAGE_CACHE.get(cacheKey);
  }

  var image;

  if (isCompatibleBase64(src)) {
    image = resolveBase64Image(src);
  } else if (Buffer.isBuffer(src)) {
    image = resolveBufferImage(src);
  } else if (typeof src === 'object' && src.data) {
    image = resolveImageFromData(src);
  } else {
    image = resolveImageFromUrl(src);
  }

  if (!image) {
    throw new Error('Cannot resolve image');
  }

  if (cache) {
    IMAGE_CACHE.set(cacheKey, image);
  }

  return image;
};

/**
 * Get image source
 *
 * @param {Object} image node
 * @returns {String} image src
 */

var getSource = R.compose(R.when(R.is(String), function (src) {
  return {
    uri: src
  };
}), R.either(R.path(['props', 'src']), R.path(['props', 'source'])));

var fetchImage =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee(node) {
    var src, cache;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            src = getSource(node);
            cache = node.props.cache;

            if (src) {
              _context.next = 5;
              break;
            }

            warning(false, 'Image should receive either a "src" or "source" prop');
            return _context.abrupt("return");

          case 5:
            _context.prev = 5;
            _context.next = 8;
            return resolveImage(src, {
              cache: cache
            });

          case 8:
            node.image = _context.sent;
            _context.next = 15;
            break;

          case 11:
            _context.prev = 11;
            _context.t0 = _context["catch"](5);
            node.image = {
              width: 0,
              height: 0
            };
            console.warn(_context.t0.message);

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[5, 11]]);
  }));

  return function fetchImage(_x) {
    return _ref.apply(this, arguments);
  };
}();

var emojis = {};
var regex = emojiRegex();

var reflect = function reflect(promise) {
  return function () {
    return promise.apply(void 0, arguments).then(function (v) {
      return v;
    }, function (e) {
      return e;
    });
  };
}; // Returns a function to be able to mock resolveImage.


var makeFetchEmojiImage = function makeFetchEmojiImage() {
  return reflect(resolveImage);
};
/**
 * When an emoji as no color, it might still have 2 parts,
 * the canonical emoji and an empty string.
 * ex.
 *   (no color) Array.from('❤️') => ["❤", "️"]
 *   (w/ color) Array.from('👍🏿') => ["👍", "🏿"]
 *
 * The empty string needs to be removed otherwise the generated
 * url will be incorect.
 */


var _removeNoColor = function _removeNoColor(x) {
  return x !== '️';
};

var getCodePoints = function getCodePoints(string) {
  return Array.from(string).filter(_removeNoColor).map(function (char) {
    return char.codePointAt(0).toString(16);
  }).join('-');
};

var buildEmojiUrl = function buildEmojiUrl(emoji) {
  var _Font$getEmojiSource = Font$1.getEmojiSource(),
      url = _Font$getEmojiSource.url,
      format = _Font$getEmojiSource.format;

  return "" + url + getCodePoints(emoji) + "." + format;
};

var fetchEmojis = function fetchEmojis(string) {
  var emojiSource = Font$1.getEmojiSource();
  if (!emojiSource || !emojiSource.url) return [];
  var promises = [];
  var match;

  var _loop = function _loop() {
    var emoji = match[0];

    if (!emojis[emoji] || emojis[emoji].loading) {
      var emojiUrl = buildEmojiUrl(emoji);
      emojis[emoji] = {
        loading: true
      };
      var fetchEmojiImage = makeFetchEmojiImage();
      promises.push(fetchEmojiImage({
        uri: emojiUrl
      }).then(function (image) {
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
      var emoji = match[0];
      var emojiSize = fragment.attributes.fontSize;
      var chunk = fragment.string.slice(lastIndex, index + match[0].length); // If emoji image was found, we create a new fragment with the
      // correct attachment and object substitution character;

      if (emojis[emoji] && emojis[emoji].data) {
        result.push({
          string: chunk.replace(match, String.fromCharCode(0xfffc)),
          attributes: _extends({}, fragment.attributes, {
            attachment: {
              width: emojiSize,
              height: emojiSize,
              yOffset: Math.floor(emojiSize * 0.1),
              image: emojis[emoji].data
            }
          })
        });
      } else {
        // If no emoji data, we just replace the emoji with a nodef char
        result.push({
          string: chunk.replace(match, String.fromCharCode(0)),
          attributes: fragment.attributes
        });
      }

      lastIndex = index + emoji.length;
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

/**
 * Get all asset promises that need to be resolved
 *
 * @param {Object} root node
 * @returns {Array} asset promises
 */

var fetchAssets = function fetchAssets(node) {
  var promises = [];
  var listToExplore = node.children.slice(0);

  while (listToExplore.length > 0) {
    var _node = listToExplore.shift();

    if (isImage(_node)) {
      promises.push(fetchImage(_node));
    }

    if (_node.style && _node.style.fontFamily) {
      promises.push(Font$1.load(_node.style));
    }

    if (typeof _node === 'string') {
      promises.push.apply(promises, fetchEmojis(_node));
    }

    if (typeof _node.value === 'string') {
      promises.push.apply(promises, fetchEmojis(_node.value));
    }

    if (_node.children) {
      _node.children.forEach(function (childNode) {
        listToExplore.push(childNode);
      });
    }
  }

  return promises;
};
/**
 * Fetch image, font and emoji assets in parallel.
 * Layout process will not be resumed until promise resolves.
 *
 * @param {Object} root node
 * @returns {Object} root node
 */


var resolveAssets = function resolveAssets(node) {
  return R.compose(R.then(R.always(node)), function (p) {
    return Promise.all(p);
  }, fetchAssets)(node);
};

/**
 * Remove nil values from array
 *
 * @param {Array} array
 * @returns {Array} array without nils
 */

var compact = R.filter(Boolean);
/**
 * Checks if value is array
 *
 * @param {any} value
 * @returns {Boolean} is value an array
 */

var isArray = R.is(Array);
/**
 * Checks if value is not an array
 *
 * @param {any} value
 * @returns {Boolean} isn't value an array
 */

var isNotArray = R.complement(isArray);
/**
 * Casts value to array
 *
 * @param {any} value
 * @returns {Array} casted value
 */

var castArray = R.when(isNotArray, function (v) {
  return [v];
});
/**
 * Merges style objects array
 *
 * @param {Array} style objects array
 * @returns {Object} merged style object
 */

var mergeStyles = function mergeStyles(styles) {
  return styles.reduce(function (acc, style) {
    var s = isArray(style) ? flatten(style) : style;
    Object.keys(s).forEach(function (key) {
      if (s[key] !== null && s[key] !== undefined) {
        acc[key] = s[key];
      }
    });
    return acc;
  }, {});
};
/**
 * Flattens an array of style objects, into one aggregated style object.
 *
 * @param {Array} style objects array
 * @returns {Object} flatted style object
 */


var flatten = R.compose(mergeStyles, compact, castArray);

var hasOwnProperty = Object.prototype.hasOwnProperty;
/**
 * Expand rules
 */

var styleShorthands = {
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
  },
  objectPosition: {
    objectPositionX: true,
    objectPositionY: true
  },
  transformOrigin: {
    transformOriginX: true,
    transformOriginY: true
  }
};
var expandedKeys = R.keys(styleShorthands);
/**
 * Expand the shorthand properties to isolate every declaration from the others.
 *
 * @param { Object } style object
 * @returns { Object } expanded style object
 */

var expandStyles = function expandStyles(style) {
  if (!style) return style;
  var propsArray = Object.keys(style);
  var resolvedStyle = {};

  for (var i = 0; i < propsArray.length; i++) {
    var key = propsArray[i];
    var value = style[key];

    if (R.includes(key, expandedKeys)) {
      var expandedProps = styleShorthands[key];

      for (var propName in expandedProps) {
        if (hasOwnProperty.call(expandedProps, propName)) {
          resolvedStyle[propName] = value;
        }
      }
    } else {
      resolvedStyle[key] = value;
    }
  }

  return resolvedStyle;
};

/**
 * Parses scalar value in value and unit pairs
 *
 * @param {String} scalar value
 * @returns {Object} parsed value
 */

var parseValue = function parseValue(value) {
  var match = /^(-?\d*\.?\d+)(in|mm|cm|pt|vh|vw)?$/g.exec(value);
  return match ? {
    value: parseFloat(match[1], 10),
    unit: match[2] || 'pt'
  } : {
    value: value,
    unit: undefined
  };
};
/**
 * Transform given scalar value
 *
 * @param {Object} container
 * @param {String} styles value
 * @returns {Object} transformed value
 */


var transformUnit = R.curryN(2, function (container, value) {
  var scalar = parseValue(value);

  switch (scalar.unit) {
    case 'in':
      return scalar.value * DPI;

    case 'mm':
      return scalar.value * (1 / 25.4) * DPI;

    case 'cm':
      return scalar.value * (1 / 2.54) * DPI;

    case 'vh':
      return scalar.value * (container.height / 100);

    case 'vw':
      return scalar.value * (container.width / 100);

    default:
      return scalar.value;
  }
});
/**
 * Transform units on given styles object.
 * Container is given to calculate vh and vw
 *
 * @param {Object} container
 * @param {Object} styles object
 * @returns {Object} transformed styles
 */

var transformUnits = function transformUnits(container, styles) {
  return R.map(transformUnit(container), styles);
};

var transformUnits$1 = R.curryN(2, transformUnits);

/**
 * Resolves media queries in styles object
 *
 * @param {Object} container
 * @param {Object} styles object
 */

var resolveMediaQueries = function resolveMediaQueries(container, styles) {
  return Object.keys(styles).reduce(function (acc, key) {
    var _extends2;

    if (/@media/.test(key)) {
      var _matchMedia;

      return _extends({}, acc, matchMedia((_matchMedia = {}, _matchMedia[key] = styles[key], _matchMedia), container));
    }

    return _extends({}, acc, (_extends2 = {}, _extends2[key] = styles[key], _extends2));
  }, {});
};

var resolveMediaQueries$1 = R.curryN(2, resolveMediaQueries);

/**
 * Resolves styles
 *
 * @param {Object} container
 * @param {Object} style object
 * @returns {Object} resolved style object
 */

var resolveStyles = function resolveStyles(container) {
  return R.compose(transformUnits$1(container), transformStyles, expandStyles, resolveMediaQueries$1(container), flatten);
};
/**
 * Resolves node styles
 *
 * @param {Object} container
 * @param {Object} document node
 * @returns {Object} node (and subnodes) with resolved styles
 */


var resolveNodeStyles = function resolveNodeStyles(page) {
  return function (node) {
    var container = R.propOr({}, 'box', page);
    return R.evolve({
      style: resolveStyles(container),
      children: R.map(resolveNodeStyles(page))
    })(node);
  };
};
/**
 * Resolves page styles
 *
 * @param {Object} document page
 * @returns {Object} document page with resolved styles
 */


var resolvePageStyles = function resolvePageStyles(page) {
  var pageBox = R.propOr({}, 'box', page);
  return R.evolve({
    children: R.map(resolveNodeStyles(page)),
    style: R.compose(transformUnits$1(pageBox), transformStyles, expandStyles, flatten)
  })(page);
};
/**
 * Resolves root styles
 *
 * @param {Object} document root
 * @returns {Object} document root with resolved styles
 */


var resolveStyles$1 = R.evolve({
  children: R.map(R.evolve({
    children: R.map(resolvePageStyles)
  }))
});

/**
 * Sort children by zIndex value
 *
 * @param {Object} node
 * @returns {Object} node
 */

var resolveZIndex = function resolveZIndex(node) {
  return R.evolve({
    children: R.compose(R.map(resolveZIndex), R.sortBy(R.path(['style', 'zIndex'])))
  })(node);
};

/**
 * Checks if page should render vertical ruler
 *
 * @param {Object} page
 * @returns {boolean} has vertical ruler
 */

var hasVerticalRuler = R.either(R.hasPath(['props', 'ruler']), R.hasPath(['props', 'verticalRuler']));

/**
 * Checks if page should render horizontal ruler
 *
 * @param {Object} page
 * @returns {boolean} has horizontal ruler
 */

var hasHorizontalRuler = R.either(R.hasPath(['props', 'ruler']), R.hasPath(['props', 'horizontalRuler']));

/**
 * Adjust page size given ruler props
 *
 * @param {Object} page
 * @returns {boolean} page with size altered by ruler props
 */

var adjustPageSize = R.compose(R.when(hasVerticalRuler, R.evolve({
  box: {
    height: R.add(RULER_WIDTH)
  },
  children: R.map(R.evolve({
    box: {
      top: R.add(RULER_WIDTH)
    }
  }))
})), R.when(hasHorizontalRuler, R.evolve({
  box: {
    width: R.add(RULER_WIDTH)
  },
  children: R.map(R.evolve({
    box: {
      left: R.add(RULER_WIDTH)
    }
  }))
})));
/**
 * Adjust pages size given ruler props
 *
 * @param {Object} root
 * @returns {boolean} root with pages size altered by ruler props
 */

var resolveRulers = R.evolve({
  children: R.map(R.evolve({
    children: R.map(adjustPageSize)
  }))
});

var isPercent = function isPercent(value) {
  return /((-)?\d+\.?\d*)%/g.exec(value);
};
/**
 * Get percentage value of input
 *
 * @param {String} value
 * @returns {Object} percent value (if matches)
 */


var matchPercent = function matchPercent(value) {
  var match = isPercent(value);

  if (match) {
    var _value = parseFloat(match[1], 10);

    var percent = _value / 100;
    return {
      value: _value,
      percent: percent,
      absValue: Math.abs(_value),
      absPercent: Math.abs(percent)
    };
  }

  return null;
};

var getTransformStyle = function getTransformStyle(s) {
  return R.pathOr('50%', ['style', s]);
};
/**
 * Get node origin
 *
 * @param {Object} node
 * @returns {Object} node origin
 */


var getOrigin = function getOrigin(node) {
  if (!node.box) return {};
  var _node$box = node.box,
      left = _node$box.left,
      top = _node$box.top,
      width = _node$box.width,
      height = _node$box.height;
  var transformOriginX = getTransformStyle('transformOriginX')(node);
  var transformOriginY = getTransformStyle('transformOriginY')(node);
  var percentX = matchPercent(transformOriginX);
  var percentY = matchPercent(transformOriginY);
  var offsetX = percentX ? width * percentX.percent : transformOriginX;
  var offsetY = percentY ? height * percentY.percent : transformOriginY;
  return {
    left: left + offsetX,
    top: top + offsetY
  };
};

/**
 * Resolve node origin
 *
 * @param {Object} node
 * @returns {Object} node with origin attribute
 */

var resolveNodeOrigin = function resolveNodeOrigin(node) {
  return R.compose(R.evolve({
    children: R.map(resolveNodeOrigin)
  }), R.converge(R.assoc('origin'), [getOrigin, R.identity]))(node);
};
/**
 * Resolve document origins
 *
 * @param {Object} document root
 * @returns {Object} documrnt root
 */


var resolveOrigin = R.evolve({
  children: R.map(R.evolve({
    children: R.map(resolveNodeOrigin)
  }))
});

var VALID_ORIENTATIONS = [PORTRAIT, LANDSCAPE];
/**
 * Get page orientation. Defaults to landscape
 *
 * @param { Object } page object
 * @returns { String } page orientation
 */

var getOrientation = R.compose(R.ifElse(R.includes(R.__, VALID_ORIENTATIONS), R.identity, R.always(PORTRAIT)), R.pathOr(PORTRAIT, ['props', 'orientation']));

var isLandscape = R.compose(R.equals(LANDSCAPE), getOrientation);

/**
 * Transforms array into size object
 *
 * @param {Array} array
 * @returns {Object} size object with width and height
 */

var toSizeObject = R.applySpec({
  width: R.prop(0),
  height: R.prop(1)
});
/**
 * Flip size object
 *
 * @param {Object} size object
 * @returns {Object} flipped size object
 */

var flipSizeObject = R.applySpec({
  width: R.prop('height'),
  height: R.prop('width')
});
/**
 * Returns size object from a given string
 *
 * @param {String} page size string
 * @returns {Object} size object with width and height
 */

var getStringSize = R.compose(toSizeObject, R.prop(R.__, PAGE_SIZES), R.toUpper);
/**
 * Returns size object from a single number
 *
 * @param {Number} page size number
 * @returns {Object} size object with width and height
 */

var getNumberSize = R.compose(toSizeObject, function (v) {
  return [v];
});
/**
 * Throws invalid size error
 *
 * @param {String} invalid page size input
 */

var throwInvalidError = function throwInvalidError(size) {
  throw new Error("Invalid Page size: " + JSON.stringify(size));
};
/**
 * Return page size in an object { width, height }
 *
 * @param {Object} page instance
 * @returns {Object} size object with width and height
 */


var getSize = function getSize(page) {
  var size = R.compose(R.cond([[R.is(String), getStringSize], [R.is(Array), toSizeObject], [R.is(Number), getNumberSize], [R.is(Object), R.identity], [R.T, throwInvalidError]]), R.pathOr('A4', ['props', 'size']))(page);
  return isLandscape(page) ? flipSizeObject(size) : size;
};

/**
 * Add empt box prop if not present in node
 *
 * @param {Object} node
 * @returns {Object} node with box prop
 */

var assocIfNil = function assocIfNil(key, value, target) {
  return R.when(R.compose(R.isNil, R.prop(key)), R.assoc(key, value))(target);
};

var assocIfNil$1 = R.curryN(3, assocIfNil);

/**
 * Resolves page size
 *
 * @param {Object} page
 * @returns {Object} page with resolved size in style attribute
 */

var resolvePageSize = function resolvePageSize(key) {
  return function (page) {
    var _R$evolve;

    var size = getSize(page);
    return R.evolve((_R$evolve = {}, _R$evolve[key] = R.merge(R.__, size), _R$evolve))(page);
  };
};
/**
 * Resolves page sizes
 *
 * @param {Object} document root
 * @returns {Object} document root with resolved page sizes
 */

var resolvePageSizes = function resolvePageSizes(key) {
  return R.evolve({
    children: R.map(R.evolve({
      children: R.map(R.compose(resolvePageSize(key), assocIfNil$1(key, {})))
    }))
  });
};

var isNotNil = R.complement(R.isNil);
/**
 * Takes a list of predicates and returns the first predicate result that returns true for a given list of arguments
 *
 * @param  {...any} predicates
 * @param  {any} value
 */

var firstPass = function firstPass() {
  for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  return function (value) {
    var res;

    for (var _i = 0; _i < fns.length; _i++) {
      var fn = fns[_i];
      res = fn(value);
      if (isNotNil(res)) return res;
    }

    return res;
  };
};

var getComputedMargin = function getComputedMargin(edge) {
  return function (node) {
    var yogaNode = node._yogaNode;
    return yogaNode ? yogaNode.getComputedMargin(edge) : null;
  };
};
/**
 * Get Yoga computed magins. Zero otherwise
 *
 * @param {Object} node
 * @return {Object} margins
 */


var getMargin = R.applySpec({
  marginTop: firstPass(getComputedMargin(Yoga.EDGE_TOP), R.path(['box', 'marginTop']), R.path(['style', 'marginTop']), R.path(['style', 'marginVertical']), R.path(['style', 'margin']), R.always(0)),
  marginRight: firstPass(getComputedMargin(Yoga.EDGE_RIGHT), R.path(['box', 'marginRight']), R.path(['style', 'marginRight']), R.path(['style', 'marginHorizontal']), R.path(['style', 'margin']), R.always(0)),
  marginBottom: firstPass(getComputedMargin(Yoga.EDGE_BOTTOM), R.path(['box', 'marginBottom']), R.path(['style', 'marginBottom']), R.path(['style', 'marginVertical']), R.path(['style', 'margin']), R.always(0)),
  marginLeft: firstPass(getComputedMargin(Yoga.EDGE_LEFT), R.path(['box', 'marginLeft']), R.path(['style', 'marginLeft']), R.path(['style', 'marginHorizontal']), R.path(['style', 'margin']), R.always(0))
});

var getComputedPadding = function getComputedPadding(edge) {
  return function (node) {
    var yogaNode = node._yogaNode;
    return yogaNode ? yogaNode.getComputedPadding(edge) : null;
  };
};
/**
 * Get Yoga computed magins. Zero otherwise
 *
 * @param {Object} node
 * @return {Object} paddings
 */


var getPadding = R.applySpec({
  paddingTop: firstPass(getComputedPadding(Yoga.EDGE_TOP), R.path(['box', 'paddingTop']), R.path(['style', 'paddingTop']), R.path(['style', 'paddingVertical']), R.path(['style', 'padding']), R.always(0)),
  paddingRight: firstPass(getComputedPadding(Yoga.EDGE_RIGHT), R.path(['box', 'paddingRight']), R.path(['style', 'paddingRight']), R.path(['style', 'paddingHorizontal']), R.path(['style', 'padding']), R.always(0)),
  paddingBottom: firstPass(getComputedPadding(Yoga.EDGE_BOTTOM), R.path(['box', 'paddingBottom']), R.path(['style', 'paddingBottom']), R.path(['style', 'paddingVertical']), R.path(['style', 'padding']), R.always(0)),
  paddingLeft: firstPass(getComputedPadding(Yoga.EDGE_LEFT), R.path(['box', 'paddingLeft']), R.path(['style', 'paddingLeft']), R.path(['style', 'paddingHorizontal']), R.path(['style', 'padding']), R.always(0))
});

var getTop = function getTop(yogaNode) {
  return yogaNode ? yogaNode.getComputedTop() : 0;
};

var getRight = function getRight(yogaNode) {
  return yogaNode ? yogaNode.getComputedRight() : 0;
};

var getBottom = function getBottom(yogaNode) {
  return yogaNode ? yogaNode.getComputedBottom() : 0;
};

var getLeft = function getLeft(yogaNode) {
  return yogaNode ? yogaNode.getComputedLeft() : 0;
};
/**
 * Get Yoga computed position. Zero otherwise
 *
 * @param {Object} node
 * @return {Object} position
 */


var getPosition = function getPosition(node) {
  var yogaNode = node._yogaNode;
  return R.applySpec({
    top: getTop,
    right: getRight,
    bottom: getBottom,
    left: getLeft
  })(yogaNode);
};

var DEFAULT_DIMENSION = {
  width: 0,
  height: 0
};
/**
 * Get Yoga computed dimensions. Zero otherwise
 *
 * @param {Object} node
 * @return {Object} dimensions
 */

var getDimension = function getDimension(node) {
  var yogaNode = node._yogaNode;
  if (!yogaNode) return DEFAULT_DIMENSION;
  return {
    width: yogaNode.getComputedWidth(),
    height: yogaNode.getComputedHeight()
  };
};

var getComputedBorder = function getComputedBorder(edge) {
  return function (yogaNode) {
    return yogaNode ? yogaNode.getComputedBorder(edge) : 0;
  };
};
/**
 * Get Yoga computed border width. Zero otherwise
 *
 * @param {Object} node
 * @return {Object} border widths
 */


var getBorderWidth = function getBorderWidth(node) {
  var yogaNode = node._yogaNode;
  return R.applySpec({
    borderTopWidth: getComputedBorder(Yoga.EDGE_TOP),
    borderRightWidth: getComputedBorder(Yoga.EDGE_RIGHT),
    borderBottomWidth: getComputedBorder(Yoga.EDGE_BOTTOM),
    borderLeftWidth: getComputedBorder(Yoga.EDGE_LEFT)
  })(yogaNode);
};

/**
 * Capitalize first letter of string
 *
 * @param {String} string
 * @returns {String} capitalized string
 */

var upperFirst = R.ifElse(R.isNil, R.identity, R.compose(R.join(''), R.juxt([R.compose(R.toUpper, R.head), R.tail])));

/**
 * Set generic yoga attribute to node's Yoga instance, handing `auto`, edges and percentage cases
 *
 * @param {String} property
 * @param {Number} edge
 * @param {any} value
 * @param {Object} node instance
 * @return {Object} node instance
 */

var setYogaValue = function setYogaValue(attr, edge) {
  return function (value) {
    return R.tap(function (node) {
      var yogaNode = node._yogaNode;

      if (!R.isNil(value) && yogaNode) {
        var hasEdge = R.complement(R.isNil)(edge);
        var fixedMethod = "set" + upperFirst(attr);
        var autoMethod = fixedMethod + "Auto";
        var percentMethod = fixedMethod + "Percent";
        var percent = matchPercent(value);

        if (percent && !yogaNode[percentMethod]) {
          throw new Error("You can't pass percentage values to " + attr + " property");
        }

        if (percent) {
          hasEdge ? yogaNode[percentMethod](edge, percent.value) : yogaNode[percentMethod](percent.value);
        } else if (value === 'auto') {
          hasEdge ? yogaNode[autoMethod](edge) : yogaNode[autoMethod]();
        } else {
          hasEdge ? yogaNode[fixedMethod](edge, value) : yogaNode[fixedMethod](value);
        }
      }
    });
  };
};

/**
 * Set flex attribute to node's Yoga instance
 *
 * @param {Number} flex value
 * @param {Object} node instance
 * @return {Object} node instance
 */

var setFlex = setYogaValue('flex');

/**
 * Set display attribute to node's Yoga instance
 *
 * @param {String} display
 * @param {Object} node instance
 * @return {Object} node instance
 */

var setDisplay = function setDisplay(value) {
  return R.tap(function (node) {
    var yogaNode = node._yogaNode;

    if (yogaNode) {
      yogaNode.setDisplay(value === 'none' ? Yoga.DISPLAY_NONE : Yoga.DISPLAY_FLEX);
    }
  });
};

/**
 * Set overflow attribute to node's Yoga instance
 *
 * @param {String} overflow value
 * @param {Object} node instance
 * @return {Object} node instance
 */

var setOverflow = function setOverflow(value) {
  return R.tap(function (node) {
    var yogaNode = node._yogaNode;

    if (!R.isNil(value) && yogaNode) {
      var yogaValue = R.cond([[R.equals('hidden'), R.always(Yoga.OVERFLOW_HIDDEN)], [R.equals('scroll'), R.always(Yoga.OVERFLOW_SCROLL)], [R.T, R.always(Yoga.OVERFLOW_VISIBLE)]])(value);
      yogaNode.setOverflow(yogaValue);
    }
  });
};

/**
 * Set flex wrap attribute to node's Yoga instance
 *
 * @param {String} flex wrap value
 * @param {Object} node instance
 * @return {Object} node instance
 */

var setFlexWrap = function setFlexWrap(value) {
  return R.tap(function (node) {
    var yogaNode = node._yogaNode;

    if (yogaNode) {
      var yogaValue = R.cond([[R.equals('wrap'), R.always(Yoga.WRAP_WRAP)], [R.equals('wrap-reverse'), R.always(Yoga.WRAP_WRAP_REVERSE)], [R.T, R.always(Yoga.WRAP_NO_WRAP)]])(value);
      yogaNode.setFlexWrap(yogaValue);
    }
  });
};

/**
 * Set flex grow attribute to node's Yoga instance
 *
 * @param {Number} flex grow value
 * @param {Object} node instance
 * @return {Object} node instance
 */

var setFlexGrow = R.compose(setYogaValue('flexGrow'), R.defaultTo(0));

/**
 * Set flex basis attribute to node's Yoga instance
 *
 * @param {Number} flex basis value
 * @param {Object} node instance
 * @return {Object} node instance
 */

var setFlexBasis = setYogaValue('flexBasis');

/**
 * Set generic align attribute to node's Yoga instance
 *
 * @param {String} specific align property
 * @param {String} align value
 * @param {Object} node instance
 * @return {Object} node instance
 */

var setAlign = function setAlign(attr) {
  return function (value) {
    return R.tap(function (node) {
      var yogaNode = node._yogaNode;

      if (yogaNode) {
        var yogaValue = R.cond([[R.equals('flex-start'), R.always(Yoga.ALIGN_FLEX_START)], [R.equals('center'), R.always(Yoga.ALIGN_CENTER)], [R.equals('flex-end'), R.always(Yoga.ALIGN_FLEX_END)], [R.equals('stretch'), R.always(Yoga.ALIGN_STRETCH)], [R.equals('baseline'), R.always(Yoga.ALIGN_BASELINE)], [R.equals('space-between'), R.always(Yoga.ALIGN_SPACE_BETWEEN)], [R.equals('space-around'), R.always(Yoga.ALIGN_SPACE_AROUND)], [R.T, R.always(Yoga.ALIGN_AUTO)]])(value);
        yogaNode["setAlign" + upperFirst(attr)](yogaValue);
      }
    });
  };
};

/**
 * Set align self attribute to node's Yoga instance
 *
 * @param {String} align value
 * @param {Object} node instance
 * @return {Object} node instance
 */

var setAlignSelf = setAlign('self');

/**
 * Set flex shrink attribute to node's Yoga instance
 *
 * @param {Number} flex shrink value
 * @param {Object} node instance
 * @return {Object} node instance
 */

var setFlexShrink = R.compose(setYogaValue('flexShrink'), R.defaultTo(1));

/**
 * Set aspect ratio attribute to node's Yoga instance
 *
 * @param {Number} ratio
 * @param {Object} node instance
 * @return {Object} node instance
 */

var setAspectRatio = function setAspectRatio(value) {
  return R.tap(function (node) {
    var yogaNode = node._yogaNode;

    if (!R.isNil(value) && yogaNode) {
      yogaNode.setAspectRatio(value);
    }
  });
};

/**
 * Set align content attribute to node's Yoga instance
 *
 * @param {String} align value
 * @param {Object} node instance
 * @return {Object} node instance
 */

var setAlignContent = setAlign('content');

/**
 * Set position type attribute to node's Yoga instance
 *
 * @param {String} position type
 * @param {Object} node instance
 * @return {Object} node instance
 */

var setPositionType = function setPositionType(value) {
  return R.tap(function (node) {
    var yogaNode = node._yogaNode;

    if (!R.isNil(value) && yogaNode) {
      yogaNode.setPositionType(value === 'absolute' ? Yoga.POSITION_TYPE_ABSOLUTE : Yoga.POSITION_TYPE_RELATIVE);
    }
  });
};

var isRow = R.equals('row');
var isRowReverse = R.equals('row-reverse');
var isColumnReverse = R.equals('column-reverse');
/**
 * Set flex direction attribute to node's Yoga instance
 *
 * @param {String} flex direction value
 * @param {Object} node instance
 * @return {Object} node instance
 */

var setFlexDirection = function setFlexDirection(value) {
  return R.tap(function (node) {
    var yogaNode = node._yogaNode;

    if (yogaNode) {
      var yogaValue = R.cond([[isRow, R.always(Yoga.FLEX_DIRECTION_ROW)], [isRowReverse, R.always(Yoga.FLEX_DIRECTION_ROW_REVERSE)], [isColumnReverse, R.always(Yoga.FLEX_DIRECTION_COLUMN_REVERSE)], [R.T, R.always(Yoga.FLEX_DIRECTION_COLUMN)]])(value);
      yogaNode.setFlexDirection(yogaValue);
    }
  });
};

/**
 * Set justify content attribute to node's Yoga instance
 *
 * @param {String} justify content value
 * @param {Object} node instance
 * @return {Object} node instance
 */

var setJustifyContent = function setJustifyContent(value) {
  return R.tap(function (node) {
    var yogaNode = node._yogaNode;

    if (!R.isNil(value) && yogaNode) {
      var yogaValue = R.cond([[R.equals('center'), R.always(Yoga.JUSTIFY_CENTER)], [R.equals('flex-end'), R.always(Yoga.JUSTIFY_FLEX_END)], [R.equals('space-between'), R.always(Yoga.JUSTIFY_SPACE_BETWEEN)], [R.equals('space-around'), R.always(Yoga.JUSTIFY_SPACE_AROUND)], [R.equals('space-evenly'), R.always(Yoga.JUSTIFY_SPACE_EVENLY)], [R.T, R.always(Yoga.JUSTIFY_FLEX_START)]])(value);
      yogaNode.setJustifyContent(yogaValue);
    }
  });
};

/**
 * Set margin top attribute to node's Yoga instance
 *
 * @param {Number} margin top
 * @param {Object} node instance
 * @return {Object} node instance
 */

var setMarginTop = setYogaValue('margin', Yoga.EDGE_TOP);
/**
 * Set margin right attribute to node's Yoga instance
 *
 * @param {Number} margin right
 * @param {Object} node instance
 * @return {Object} node instance
 */

var setMarginRight = setYogaValue('margin', Yoga.EDGE_RIGHT);
/**
 * Set margin bottom attribute to node's Yoga instance
 *
 * @param {Number} margin bottom
 * @param {Object} node instance
 * @return {Object} node instance
 */

var setMarginBottom = setYogaValue('margin', Yoga.EDGE_BOTTOM);
/**
 * Set margin left attribute to node's Yoga instance
 *
 * @param {Number} margin left
 * @param {Object} node instance
 * @return {Object} node instance
 */

var setMarginLeft = setYogaValue('margin', Yoga.EDGE_LEFT);
/**
 * Set all margins at once
 *
 * @param {Number} margin
 * @param {Object} node instance
 * @return {Object} node instance
 */

var setMargin = function setMargin(margin) {
  return R.tap(function (node) {
    setMarginTop(margin)(node);
    setMarginRight(margin)(node);
    setMarginBottom(margin)(node);
    setMarginLeft(margin)(node);
  });
};

/**
 * Set padding top attribute to node's Yoga instance
 *
 * @param {Number} padding top
 * @param {Object} node instance
 * @return {Object} node instance
 */

var setPaddingTop = setYogaValue('padding', Yoga.EDGE_TOP);
/**
 * Set padding right attribute to node's Yoga instance
 *
 * @param {Number} padding right
 * @param {Object} node instance
 * @return {Object} node instance
 */

var setPaddingRight = setYogaValue('padding', Yoga.EDGE_RIGHT);
/**
 * Set padding bottom attribute to node's Yoga instance
 *
 * @param {Number} padding bottom
 * @param {Object} node instance
 * @return {Object} node instance
 */

var setPaddingBottom = setYogaValue('padding', Yoga.EDGE_BOTTOM);
/**
 * Set padding left attribute to node's Yoga instance
 *
 * @param {Number} padding left
 * @param {Object} node instance
 * @return {Object} node instance
 */

var setPaddingLeft = setYogaValue('padding', Yoga.EDGE_LEFT);

/**
 * Set border top attribute to node's Yoga instance
 *
 * @param {Number} border top width
 * @param {Object} node instance
 * @return {Object} node instance
 */

var setBorderTop = setYogaValue('border', Yoga.EDGE_TOP);
/**
 * Set border right attribute to node's Yoga instance
 *
 * @param {Number} border right width
 * @param {Object} node instance
 * @return {Object} node instance
 */

var setBorderRight = setYogaValue('border', Yoga.EDGE_RIGHT);
/**
 * Set border bottom attribute to node's Yoga instance
 *
 * @param {Number} border bottom width
 * @param {Object} node instance
 * @return {Object} node instance
 */

var setBorderBottom = setYogaValue('border', Yoga.EDGE_BOTTOM);
/**
 * Set border left attribute to node's Yoga instance
 *
 * @param {Number} border left width
 * @param {Object} node instance
 * @return {Object} node instance
 */

var setBorderLeft = setYogaValue('border', Yoga.EDGE_LEFT);

/**
 * Set position top attribute to node's Yoga instance
 *
 * @param {Number} position top
 * @param {Object} node instance
 * @return {Object} node instance
 */

var setPositionTop = setYogaValue('position', Yoga.EDGE_TOP);
/**
 * Set position right attribute to node's Yoga instance
 *
 * @param {Number} position right
 * @param {Object} node instance
 * @return {Object} node instance
 */

var setPositionRight = setYogaValue('position', Yoga.EDGE_RIGHT);
/**
 * Set position bottom attribute to node's Yoga instance
 *
 * @param {Number} position bottom
 * @param {Object} node instance
 * @return {Object} node instance
 */

var setPositionBottom = setYogaValue('position', Yoga.EDGE_BOTTOM);
/**
 * Set position left attribute to node's Yoga instance
 *
 * @param {Number} position left
 * @param {Object} node instance
 * @return {Object} node instance
 */

var setPositionLeft = setYogaValue('position', Yoga.EDGE_LEFT);

/**
 * Set width to node's Yoga instance
 *
 * @param {Number} width
 * @param {Object} node instance
 * @return {Object} node instance
 */

var setWidth = setYogaValue('width');
/**
 * Set min width to node's Yoga instance
 *
 * @param {Number} min width
 * @param {Object} node instance
 * @return {Object} node instance
 */

var setMinWidth = setYogaValue('minWidth');
/**
 * Set max width to node's Yoga instance
 *
 * @param {Number} max width
 * @param {Object} node instance
 * @return {Object} node instance
 */

var setMaxWidth = setYogaValue('maxWidth');
/**
 * Set height to node's Yoga instance
 *
 * @param {Number} height
 * @param {Object} node instance
 * @return {Object} node instance
 */

var setHeight = setYogaValue('height');
/**
 * Set min height to node's Yoga instance
 *
 * @param {Number} min height
 * @param {Object} node instance
 * @return {Object} node instance
 */

var setMinHeight = setYogaValue('minHeight');
/**
 * Set max height to node's Yoga instance
 *
 * @param {Number} max height
 * @param {Object} node instance
 * @return {Object} node instance
 */

var setMaxHeight = setYogaValue('maxHeight');

/**
 * Checks if node is text
 *
 * @param {Object} node
 * @returns {Boolean} is node text?
 */

var isText = R.propEq('type', TEXT);

/**
 * Checks if node is note
 *
 * @param {Object} node
 * @returns {Boolean} is node note?
 */

var isNote = R.propEq('type', NOTE);

/**
 * Checks if node is page
 *
 * @param {Object} node
 * @returns {Boolean} is node page?
 */

var isPage = R.propEq('type', PAGE);

/**
 * Checks if node is canvas
 *
 * @param {Object} node
 * @returns {Boolean} is node canvas?
 */

var isCanvas = R.propEq('type', CANVAS);

var StandardFont =
/*#__PURE__*/
function () {
  function StandardFont(src) {
    this.name = src;
    this.src = PDFDocument.PDFFont.open(null, src);
  }

  var _proto = StandardFont.prototype;

  _proto.layout = function layout(str) {
    var _this = this;

    var _this$src$encode = this.src.encode(str),
        encoded = _this$src$encode[0],
        positions = _this$src$encode[1];

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

  _proto.glyphForCodePoint = function glyphForCodePoint(codePoint) {
    var glyph = this.getGlyph(codePoint);
    glyph.advanceWidth = 400;
    return glyph;
  };

  _proto.getGlyph = function getGlyph(id) {
    return {
      id: id,
      _font: this.src,
      codePoints: [id],
      isLigature: false,
      name: this.src.font.characterToGlyph(id)
    };
  };

  _proto.hasGlyphForCodePoint = function hasGlyphForCodePoint(codePoint) {
    return this.src.font.characterToGlyph(codePoint) !== '.notdef';
  } // Based on empirical observation
  ;

  _createClass(StandardFont, [{
    key: "ascent",
    get: function get() {
      return 900;
    } // Based on empirical observation

  }, {
    key: "descent",
    get: function get() {
      switch (this.name) {
        case 'Times-Roman':
        case 'Times-Bold':
        case 'Times-Italic':
          return -220;

        case 'Courier':
        case 'Courier-Bold':
        case 'Courier-Oblique':
          return -230;

        default:
          return -200;
      }
    }
  }, {
    key: "lineGap",
    get: function get() {
      return 0;
    }
  }, {
    key: "unitsPerEm",
    get: function get() {
      return 1000;
    }
  }]);

  return StandardFont;
}();

var fontCache = {};
var IGNORED_CODE_POINTS = [173];
var getFontSize = R.pathOr(12, ['attributes', 'fontSize']);

var getOrCreateFont = function getOrCreateFont(name) {
  if (fontCache[name]) return fontCache[name];
  var font = new StandardFont(name);
  fontCache[name] = font;
  return font;
};

var getFallbackFont = function getFallbackFont() {
  return getOrCreateFont('Helvetica');
};

var shouldFallbackToFont = function shouldFallbackToFont(codePoint, font) {
  return !IGNORED_CODE_POINTS.includes(codePoint) && !font.hasGlyphForCodePoint(codePoint) && getFallbackFont().hasGlyphForCodePoint(codePoint);
};

var fontSubstitution = function fontSubstitution() {
  return function (_ref) {
    var string = _ref.string,
        runs = _ref.runs;
    var lastFont = null;
    var lastIndex = 0;
    var index = 0;
    var res = [];

    for (var _iterator = runs, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
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

      var _fontSize = getFontSize(run);

      var defaultFont = typeof run.attributes.font === 'string' ? getOrCreateFont(run.attributes.font) : run.attributes.font;

      if (string.length === 0) {
        res.push({
          start: 0,
          end: 0,
          attributes: {
            font: defaultFont
          }
        });
        break;
      }

      for (var _iterator2 = string.slice(run.start, run.end), _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
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
        var shouldFallback = shouldFallbackToFont(codePoint, defaultFont);
        var font = shouldFallback ? getFallbackFont() : defaultFont; // If the default font does not have a glyph and the fallback font does, we use it

        if (font !== lastFont) {
          if (lastFont) {
            res.push({
              start: lastIndex,
              end: index,
              attributes: {
                font: lastFont,
                scale: lastFont ? _fontSize / lastFont.unitsPerEm : 0
              }
            });
          }

          lastFont = font;
          lastIndex = index;
        }

        index += char.length;
      }
    }

    if (lastIndex < string.length) {
      var fontSize = getFontSize(R.last(runs));
      res.push({
        start: lastIndex,
        end: string.length,
        attributes: {
          font: lastFont,
          scale: lastFont ? fontSize / lastFont.unitsPerEm : 0
        }
      });
    }

    return {
      string: string,
      runs: res
    };
  };
};

/**
 * Capitalize first letter of each word
 *
 * @param {String} string
 * @returns {String} capitalized string
 */
var capitalize = function capitalize(value) {
  if (!value) return value;
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

/**
 * Checks if node is text intance
 *
 * @param {Object} node
 * @returns {Boolean} is node text intance?
 */

var isTextInstance = R.propEq('type', TEXT_INSTANCE);

var PREPROCESSORS = [ignoreChars, embedEmojis];
/**
 * Apply transformation to text string
 *
 * @param {String} text
 * @param {String} transformation type
 * @returns {String} transformed text
 */

var transformText = function transformText(text, transformation) {
  switch (transformation) {
    case 'uppercase':
      return text.toUpperCase();

    case 'lowercase':
      return text.toLowerCase();

    case 'capitalize':
      return capitalize(text);

    case 'upperfirst':
      return upperFirst(text);

    default:
      return text;
  }
};
/**
 * Get textkit framgents of given node object
 *
 * @param {Object} instance node
 * @returns {Array} text fragments
 */


var getFragments = function getFragments(instance) {
  if (!instance) return [{
    string: ''
  }];
  var fragments = [];
  var _instance$style = instance.style,
      _instance$style$color = _instance$style.color,
      color = _instance$style$color === void 0 ? 'black' : _instance$style$color,
      backgroundColor = _instance$style.backgroundColor,
      _instance$style$fontF = _instance$style.fontFamily,
      fontFamily = _instance$style$fontF === void 0 ? 'Helvetica' : _instance$style$fontF,
      fontWeight = _instance$style.fontWeight,
      fontStyle = _instance$style.fontStyle,
      _instance$style$fontS = _instance$style.fontSize,
      fontSize = _instance$style$fontS === void 0 ? 18 : _instance$style$fontS,
      _instance$style$textA = _instance$style.textAlign,
      textAlign = _instance$style$textA === void 0 ? 'left' : _instance$style$textA,
      lineHeight = _instance$style.lineHeight,
      textDecoration = _instance$style.textDecoration,
      textDecorationColor = _instance$style.textDecorationColor,
      textDecorationStyle = _instance$style.textDecorationStyle,
      textTransform = _instance$style.textTransform,
      letterSpacing = _instance$style.letterSpacing,
      textIndent = _instance$style.textIndent,
      opacity = _instance$style.opacity;
  var obj = Font$1.getFont({
    fontFamily: fontFamily,
    fontWeight: fontWeight,
    fontStyle: fontStyle
  });
  var font = obj ? obj.data : fontFamily;
  var attributes = {
    font: font,
    color: color,
    opacity: opacity,
    fontSize: fontSize,
    backgroundColor: backgroundColor,
    align: textAlign,
    indent: textIndent,
    link: instance.src,
    characterSpacing: letterSpacing,
    underlineStyle: textDecorationStyle,
    underline: textDecoration === 'underline',
    underlineColor: textDecorationColor || color,
    strike: textDecoration === 'line-through',
    strikeStyle: textDecorationStyle,
    strikeColor: textDecorationColor || color,
    lineHeight: lineHeight ? lineHeight * fontSize : null
  };
  instance.children.forEach(function (child) {
    if (isImage(child)) {
      fragments.push({
        string: String.fromCharCode(0xfffc),
        attributes: _extends({}, attributes, {
          attachment: {
            width: child.style.width || fontSize,
            height: child.style.height || fontSize,
            image: child.image.data
          }
        })
      });
    } else if (isTextInstance(child)) {
      fragments.push({
        string: transformText(child.value, textTransform),
        attributes: attributes
      });
    } else {
      if (child) {
        var _fragments;

        (_fragments = fragments).push.apply(_fragments, getFragments(child));
      }
    }
  });

  for (var _i = 0; _i < PREPROCESSORS.length; _i++) {
    var preprocessor = PREPROCESSORS[_i];
    fragments = preprocessor(fragments);
  }

  return fragments;
};
/**
 * Get textkit attributed string from text node
 *
 * @param {Object} instance node
 * @returns {Object} attributed string
 */


var getAttributedString = function getAttributedString(instance) {
  return AttributedString.fromFragments(getFragments(instance));
};

var engines = {
  linebreaker: linebreaker,
  justification: justification,
  textDecoration: textDecoration,
  scriptItemizer: scriptItemizer,
  wordHyphenation: wordHyphenation,
  fontSubstitution: fontSubstitution
};
var engine = layoutEngine(engines);
/**
 * Get layout container for specific text node
 *
 * @param {Object} node
 * @param {Number} width
 * @param {Number} height
 * @returns {Object} layout container
 */

var getContainer = function getContainer(node, width, height) {
  var maxLines = R.path(['style', 'maxLines'], node);
  var textOverflow = R.path(['style', 'textOverflow'], node);
  return {
    x: 0,
    y: 0,
    width: width,
    maxLines: maxLines,
    height: height || Infinity,
    truncateMode: textOverflow
  };
};
/**
 * Get text layout options for specific text node
 *
 * @param {Object} node instance
 * @returns {Object} layout options
 */


var getLayoutOptions = function getLayoutOptions(node) {
  return {
    hyphenationPenalty: node.props.hyphenationPenalty,
    hyphenationCallback: Font$1.getHyphenationCallback(),
    shrinkWhitespaceFactor: {
      before: -0.5,
      after: -0.5
    }
  };
};
/**
 * Get text lines for given node
 *
 * @param {Object} node
 * @param {Number} container width
 * @param {Number} container height
 * @returns {Array} layout lines
 */


var layoutText = R.compose(R.reduce(R.concat, []), R.converge(engine, [getAttributedString, getContainer, getLayoutOptions])); // TODO: Do it memoizable?

/**
 * Get lines width (if any)
 *
 * @param {Object} node
 * @returns {Number} lines width
 */

var linesWidth = function linesWidth(node) {
  if (!node.lines) return -1;
  return Math.max.apply(Math, node.lines.map(function (line) {
    return AttributedString.advanceWidth(line);
  }));
};

/**
 * Get lines height (if any)
 *
 * @param {Object} node
 * @returns {Number} lines height
 */
var linesHeight = function linesHeight(node) {
  if (!node.lines) return -1;
  return node.lines.reduce(function (acc, line) {
    return acc + line.box.height;
  }, 0);
};

/**
 * Yoga text measure function
 *
 * @param {Object} page
 * @param {Object} node
 * @param {Number} width
 * @param {Number} widthMode
 * @param {Number} height
 * @param {Number} heightMode
 * @returns {Object} text width and height
 */

var measureText = function measureText(page, node, width, widthMode, height, heightMode) {
  if (widthMode === Yoga.MEASURE_MODE_EXACTLY) {
    if (!node.lines) node.lines = layoutText(node, width, height);
    return {
      height: linesHeight(node)
    };
  }

  if (widthMode === Yoga.MEASURE_MODE_AT_MOST) {
    if (!node.lines) node.lines = layoutText(node, width, height);
    return {
      height: linesHeight(node),
      width: Math.min(width, linesWidth(node))
    };
  }

  return {};
};

var measureText$1 = R.curryN(6, measureText);

/**
 * Get image ratio
 *
 * @param {Object} image node
 * @returns {Number} image ratio
 */

var getRatio = R.ifElse(R.hasPath(['image', 'data']), function (node) {
  return node.image.width / node.image.height;
}, R.always(1));

/**
 * Checks if page has auto height
 *
 * @param {Object} page
 * @returns {Boolean} is page height auto
 */

var isHeightAuto = R.pathSatisfies(R.isNil, ['box', 'height']);

var SAFETY_HEIGHT = 10;
/**
 * Yoga image measure function
 *
 * @param {Object} page
 * @param {Object} node
 * @param {Number} width
 * @param {Number} widthMode
 * @param {Number} height
 * @param {Number} heightMode
 * @returns {Object} image width and height
 */

var measureImage = function measureImage(page, node, width, widthMode, height, heightMode) {
  var imageRatio = getRatio(node);
  var imageMargin = getMargin(node);
  var pagePadding = getPadding(page);
  var pageArea = isHeightAuto(page) ? Infinity : page.box.height - pagePadding.paddingTop - pagePadding.paddingBottom - imageMargin.marginTop - imageMargin.marginBottom - SAFETY_HEIGHT; // Skip measure if image data not present yet

  if (!node.image) return {
    width: 0,
    height: 0
  };

  if (widthMode === Yoga.MEASURE_MODE_EXACTLY && heightMode === Yoga.MEASURE_MODE_UNDEFINED) {
    var scaledHeight = width / imageRatio;
    return {
      height: Math.min(pageArea, scaledHeight)
    };
  }

  if (heightMode === Yoga.MEASURE_MODE_EXACTLY && (widthMode === Yoga.MEASURE_MODE_AT_MOST || widthMode === Yoga.MEASURE_MODE_UNDEFINED)) {
    return {
      width: Math.min(height * imageRatio, width)
    };
  }

  if (widthMode === Yoga.MEASURE_MODE_EXACTLY && heightMode === Yoga.MEASURE_MODE_AT_MOST) {
    var _scaledHeight = width / imageRatio;

    return {
      height: Math.min(height, pageArea, _scaledHeight)
    };
  }

  if (widthMode === Yoga.MEASURE_MODE_AT_MOST && heightMode === Yoga.MEASURE_MODE_AT_MOST) {
    if (imageRatio > 1) {
      return {
        width: width,
        height: Math.min(width / imageRatio, height)
      };
    } else {
      return {
        width: Math.min(height * imageRatio, width),
        height: height
      };
    }
  }

  return {
    height: height,
    width: width
  };
};

var measureImage$1 = R.curryN(6, measureImage);

var SAFETY_HEIGHT$1 = 10;
var getMax = R.reduce(R.max, -Infinity);
/**
 * Helper object to predict canvas size
 * TODO: Implement remaining functions (as close as possible);
 */

var measureCtx = function measureCtx() {
  var ctx = {};
  var points = [];

  var nil = function nil() {
    return ctx;
  };

  var addPoint = function addPoint(x, y) {
    return points.push([x, y]);
  };

  var moveTo = R.compose(nil, addPoint);

  var rect = function rect(x, y, w, h) {
    addPoint(x, y);
    addPoint(x + w, y);
    addPoint(x, y + h);
    addPoint(x + w, y + h);
    return ctx;
  };

  var ellipse = function ellipse(x, y, rx, ry) {
    ry = ry || rx;
    addPoint(x - rx, y - ry);
    addPoint(x + rx, y - ry);
    addPoint(x + rx, y + ry);
    addPoint(x - rx, y + ry);
    return ctx;
  };

  var polygon = function polygon() {
    points.push.apply(points, arguments);
    return nil();
  }; // Change dimensions


  ctx.rect = rect;
  ctx.moveTo = moveTo;
  ctx.lineTo = moveTo;
  ctx.circle = ellipse;
  ctx.polygon = polygon;
  ctx.ellipse = ellipse;
  ctx.roundedRect = rect; // To be implemented

  ctx.text = nil;
  ctx.path = nil;
  ctx.lineWidth = nil;
  ctx.bezierCurveTo = nil;
  ctx.quadraticCurveTo = nil;
  ctx.scale = nil;
  ctx.rotate = nil;
  ctx.translate = nil; // These don't really change dimensions

  ctx.dash = nil;
  ctx.clip = nil;
  ctx.save = nil;
  ctx.fill = nil;
  ctx.font = nil;
  ctx.stroke = nil;
  ctx.lineCap = nil;
  ctx.opacity = nil;
  ctx.restore = nil;
  ctx.lineJoin = nil;
  ctx.fontSize = nil;
  ctx.fillColor = nil;
  ctx.miterLimit = nil;
  ctx.strokeColor = nil;
  ctx.fillOpacity = nil;
  ctx.strokeOpacity = nil;
  ctx.linearGradient = nil;
  ctx.radialGradient = nil;

  ctx.getWidth = function () {
    return R.compose(getMax, R.pluck(0))(points);
  };

  ctx.getHeight = function () {
    return R.compose(getMax, R.pluck(1))(points);
  };

  return ctx;
};
/**
 * Yoga canbas measure function
 *
 * @param {Object} page
 * @param {Object} node
 * @param {Number} width
 * @param {Number} widthMode
 * @param {Number} height
 * @param {Number} heightMode
 * @returns {Object} canvas width and height
 */


var measureCanvas = function measureCanvas(page, node) {
  var imageMargin = getMargin(node);
  var pagePadding = getPadding(page);
  var pageArea = isHeightAuto(page) ? Infinity : page.box.height - pagePadding.paddingTop - pagePadding.paddingBottom - imageMargin.marginTop - imageMargin.marginBottom - SAFETY_HEIGHT$1;
  var ctx = measureCtx();
  node.props.paint(ctx);
  var width = ctx.getWidth();
  var height = Math.min(pageArea, ctx.getHeight());
  return {
    height: height,
    width: width
  };
};

var measureCanvas$1 = R.curryN(6, measureCanvas);

var YOGA_NODE = '_yogaNode';
var YOGA_CONFIG = Yoga.Config.create();
YOGA_CONFIG.setPointScaleFactor(0);

var setNodeHeight = function setNodeHeight(node) {
  return R.ifElse(isPage, setHeight(node.box.height), setHeight(node.box.height || node.style.height));
};
/**
 * Set styles valeus into yoga node before layout calculation
 *
 * @param {Object} node
 * @returns {Object} node
 */


var setYogaValues = R.tap(function (node) {
  R.compose(setNodeHeight(node), setWidth(node.style.width), setMinWidth(node.style.minWidth), setMaxWidth(node.style.maxWidth), setMinHeight(node.style.minHeight), setMaxHeight(node.style.maxHeight), setMarginTop(node.style.marginTop), setMarginRight(node.style.marginRight), setMarginBottom(node.style.marginBottom), setMarginLeft(node.style.marginLeft), setPaddingTop(node.style.paddingTop), setPaddingRight(node.style.paddingRight), setPaddingBottom(node.style.paddingBottom), setPaddingLeft(node.style.paddingLeft), setPositionType(node.style.position), setPositionTop(node.style.top), setPositionRight(node.style.right), setPositionBottom(node.style.bottom), setPositionLeft(node.style.left), setBorderTop(node.style.borderTopWidth), setBorderRight(node.style.borderRightWidth), setBorderBottom(node.style.borderBottomWidth), setBorderLeft(node.style.borderLeftWidth), setDisplay(node.style.display), setFlexDirection(node.style.flexDirection), setAlignSelf(node.style.alignSelf), setAlignContent(node.style.alignContent), setJustifyContent(node.style.justifyContent), setFlexWrap(node.style.flexWrap), setOverflow(node.style.overflow), setAspectRatio(node.style.aspectRatio), setFlex(node.style.flex), setFlexBasis(node.style.flexBasis), setFlexGrow(node.style.flexGrow), setFlexShrink(node.style.flexShrink))(node);
});
/**
 * Inserts child into parent' yoga node
 *
 * @param {Object} parent
 * @param {Object} node
 * @param {Object} node
 */

var insertYogaNodes = function insertYogaNodes(parent) {
  return R.tap(function (child) {
    return parent.insertChild(child[YOGA_NODE], parent.getChildCount());
  });
};

var setMeasureFunc = function setMeasureFunc(page) {
  return function (node) {
    var yogaNode = node[YOGA_NODE];

    if (isText(node)) {
      yogaNode.setMeasureFunc(measureText$1(page, node));
    }

    if (isImage(node)) {
      yogaNode.setMeasureFunc(measureImage$1(page, node));
    }

    if (isCanvas(node)) {
      yogaNode.setMeasureFunc(measureCanvas$1(page, node));
    }

    return node;
  };
};

var isNotText = R.complement(isText);
var isNotNote = R.complement(isNote);
var isLayoutElement = R.both(isNotText, isNotNote);
var isNotTextInstance = R.complement(isTextInstance);
/**
 * Creates and add yoga node to document tree
 * Handles measure function for text and image nodes
 *
 * @param {Object} node
 * @returns {Object} node with appended yoga node
 */

var createYogaNodes = function createYogaNodes(page) {
  return function (node) {
    var yogaNode = Yoga.Node.createWithConfig(YOGA_CONFIG);
    return R.compose(setMeasureFunc(page), R.when(isLayoutElement, R.evolve({
      children: R.map(R.compose(insertYogaNodes(yogaNode), createYogaNodes(page)))
    })), setYogaValues, R.assoc(YOGA_NODE, yogaNode))(node);
  };
};
/**
 * Performs yoga calculation
 *
 * @param {Object} node
 * @returns {Object} node
 */


var calculateLayout = R.tap(function (page) {
  return page[YOGA_NODE].calculateLayout();
});
/**
 * Saves Yoga layout result into 'box' attribute of node
 *
 * @param {Object} node
 * @returns {Object} node with box data
 */

var persistDimensions = function persistDimensions(node) {
  return R.evolve({
    children: R.map(R.when(isNotTextInstance, persistDimensions)),
    box: R.always(R.mergeAll([getPadding(node), getMargin(node), getBorderWidth(node), getPosition(node), getDimension(node)]))
  })(node);
};
/**
 * Removes and destroys yoga node frm document tree
 *
 * @param {Object} node
 * @returns {Object} node without yoga node
 */


var destroyYogaNodes = function destroyYogaNodes(node) {
  return R.compose(R.dissoc(YOGA_NODE), R.tap(function (n) {
    return Yoga.Node.destroy(n[YOGA_NODE]);
  }), R.evolve({
    children: R.map(R.when(isLayoutElement, destroyYogaNodes))
  }))(node);
};
/**
 * Calculates page object layout using Yoga.
 * Takes node values from 'box' and 'style' attributes, and persist them back into 'box'
 * Destroy yoga values at the end.
 *
 * @param {Object} page object
 * @returns {Object} page object with correct 'box' layout attributes
 */


var resolvePageDimensions = function resolvePageDimensions(page) {
  return R.ifElse(R.isNil, R.always(null), R.compose(destroyYogaNodes, persistDimensions, calculateLayout, createYogaNodes(page)))(page);
};
/**
 * Calculates root object layout using Yoga.
 *
 * @param {Object} root object
 * @returns {Object} root object with correct 'box' layout attributes
 */

var resolveDimensions = R.evolve({
  children: R.map(R.evolve({
    children: R.map(resolvePageDimensions)
  }))
});

var shouldLayoutText = function shouldLayoutText(node) {
  return isText(node) && !node.lines;
};
/**
 * Performs text layout on text node if wasn't calculated before.
 * Text layout is usually performed on Yoga's layout process (via setMeasureFunc),
 * but we need to layout those nodes with fixed width and height.
 *
 * @param {Object} node
 * @returns {Object} layouted node
 */


var resolveTextLayout = function resolveTextLayout(node) {
  return R.compose(R.evolve({
    children: R.map(resolveTextLayout)
  }), R.when(shouldLayoutText, R.compose(R.converge(R.assoc('lines'), [R.converge(layoutText, [R.identity, R.path(['box', 'width']), R.path(['box', 'height'])]), R.identity]))))(node);
};

/**
 * Get styles sub group of inherited properties
 *
 * @param {Object} style object
 * @returns {Object} style object only with inherited properties
 */

var getInheritStyles = R.compose(R.pick(INHERITED_PROPERTIES), R.propOr({}, 'style'));
/**
 * Merges styles with node
 *
 * @param {Object} style object
 * @param {Object} node
 * @returns {Object} node with styles merged
 */

var mergeStyles$1 = function mergeStyles(styles) {
  return R.evolve({
    style: R.merge(styles)
  });
};
/**
 * Inherit style values from the root to the leafs
 *
 * @param {Object} document root
 * @returns {Object} document root with inheritance
 *
 */


var resolveInheritance = function resolveInheritance(node) {
  var inheritStyles = getInheritStyles(node);
  return R.evolve({
    children: R.map(R.compose(resolveInheritance, mergeStyles$1(inheritStyles)))
  })(node);
};

/**
 * Removes margins on node
 *
 * @param {Object} node
 * @returns {Object} node without margins
 */

var removeMargins = R.compose(setMargin(0), R.dissocPath(['style', 'margin']), R.dissocPath(['style', 'marginTop']), R.dissocPath(['style', 'marginRight']), R.dissocPath(['style', 'marginBottom']), R.dissocPath(['style', 'marginLeft']), R.dissocPath(['style', 'marginHorizontal']), R.dissocPath(['style', 'marginVertical']));

/**
 * Remove page margins
 *
 * @param {Object} document root
 * @returns {Object} documrnt root without margins on pages
 */

var resolvePageMargins = R.evolve({
  children: R.map(R.evolve({
    children: R.map(removeMargins)
  }))
});

/**
 * Get many nodes height
 *
 * @param {Array} nodes
 * @return {number} nodes height
 */

var getNodesHeight = function getNodesHeight(nodes) {
  var max = 0;
  var min = Infinity;
  if (R.isEmpty(nodes)) return 0;

  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    min = Math.min(min, node.box.top);
    max = Math.max(max, node.box.top + node.box.height);
  }

  return max - min;
};

var getWrap = R.ifElse(R.anyPass([isNote, isImage, isCanvas]), R.always(false), R.pathOr(true, ['props', 'wrap']));
var getBreak = R.pathOr(false, ['props', 'break']);
var getMinPresenceAhead = R.path(['props', 'minPresenceAhead']);

var defaultPresenceAhead = function defaultPresenceAhead(element) {
  return function (height) {
    return Math.min(element.box.height, height);
  };
};

var getPresenceAhead = function getPresenceAhead(elements, height) {
  var result = 0;

  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];
    if (!element.box) continue;
    var isElementInside = height > element.box.top;
    var presenceAhead = element.props.presenceAhead || defaultPresenceAhead(element);

    if (element && isElementInside) {
      result += presenceAhead(height - element.box.top);
    }
  }

  return result;
};

var shouldBreak = function shouldBreak(child, futureElements, height) {
  var minPresenceAhead = getMinPresenceAhead(child);
  var presenceAhead = getPresenceAhead(futureElements, height);
  var futureHeight = getNodesHeight(futureElements);
  var shouldSplit = height < child.box.top + child.box.height;
  var shouldWrap = getWrap(child);
  return getBreak(child) || !shouldWrap && shouldSplit || minPresenceAhead < futureHeight && presenceAhead < minPresenceAhead;
};

var getPaddingBottom = R.pathOr(0, ['style', 'paddingBottom']);

var getContentArea = function getContentArea(page) {
  var paddingBottom = getPaddingBottom(page);
  var height = R.path(['style', 'height'], page);
  return height - paddingBottom;
};

var getHeight = R.path(['box', 'height']);
var getTop$1 = R.pathOr(0, ['box', 'top']);
var getChildren = R.propOr([], 'children');
var setChildren = R.assoc('children');
var setHeight$1 = R.assocPath(['box', 'height']);
var setBreak = R.assocPath(['props', 'break']);

var breakChildren = function breakChildren(height, node) {
  var children = getChildren(node);
  var offset = null;
  var nextElements = [];
  var currentElements = [];

  for (var i = 0; i < children.length; i++) {
    var child = children[i];
    var childTop = getTop$1(child);
    var childHeight = getHeight(child);
    var futureElements = children.slice(i + 1);
    var shouldBreak$1 = shouldBreak(child, futureElements, height);

    if (shouldBreak$1) {
      offset = childTop;
      nextElements = R.compose(R.prepend(setBreak(false, child)), R.slice(i + 1, Infinity))(children);
      break;
    }

    var _breakChildren = breakChildren(height, child),
        currentChildren = _breakChildren[0],
        nextChildren = _breakChildren[1],
        childsOffset = _breakChildren[2];

    if (R.isNil(childsOffset)) {
      currentElements.push(setChildren(currentChildren, child));
      continue;
    }

    offset = childTop + childsOffset;
    currentElements.push(R.compose(setChildren(currentChildren), setHeight$1(Math.ceil(offset / height) * height - childTop))(child));
    nextElements = R.compose(R.prepend(R.compose(setChildren(nextChildren), setHeight$1(child.box.height - childHeight))(child)), R.slice(i + 1, Infinity))(children);
    break;
  }

  return [currentElements, nextElements, offset];
};

var breakNode = function breakNode(height) {
  return function (node) {
    var _breakChildren2 = breakChildren(height, node),
        currentChildren = _breakChildren2[0],
        nextChildren = _breakChildren2[1],
        offset = _breakChildren2[2];

    if (R.isNil(offset)) return [node];
    var currentNode = R.compose(setChildren(currentChildren), setHeight$1(Math.ceil(offset / height) * height))(node);
    var nextNode = R.compose(setChildren(nextChildren), setHeight$1(node.box.height - offset))(node);
    return [currentNode, nextNode];
  };
};

var breakPage = function breakPage(page) {
  var pages = [];
  var height = getContentArea(page);
  var subpages = breakNode(height)(page);
  var current = subpages[0];
  var nextPage = subpages[1];
  pages.push(current);

  while (nextPage) {
    subpages = R.compose(breakNode(height), resolvePageDimensions, setHeight$1(null))(nextPage);
    current = subpages[0];
    nextPage = subpages[1];
    pages.push(current);
  }

  return pages;
};

var resolvePageBreaks = R.evolve({
  children: R.map(R.evolve({
    children: R.compose(R.flatten, R.map(breakPage))
  }))
});

var getTop$2 = R.pathOr(0, ['box', 'top']);
var getHeight$1 = R.path(['box', 'height']);
var getChildren$1 = R.propOr([], 'children');
var isElementOutside = R.useWith(R.lte, [R.identity, getTop$2]);

var splitNodes = function splitNodes(height, nodes) {
  var currentChildren = [];
  var nextChildren = [];

  for (var i = 0; i < nodes.length; i++) {
    var child = nodes[i];

    var _splitNode = splitNode(height, child),
        currentChild = _splitNode[0],
        nextChild = _splitNode[1];

    if (currentChild) currentChildren.push(currentChild);
    if (nextChild) nextChildren.push(nextChild);
  }

  return [currentChildren, nextChildren];
};

var splitChildren = function splitChildren(height, node) {
  var children = getChildren$1(node);
  var availableHeight = height - getTop$2(node);
  return splitNodes(availableHeight, children);
};

var splitNode = R.curryN(2, function (height, node) {
  if (!node) return [null, null];
  var nodeTop = getTop$2(node);
  var nodeHeight = getHeight$1(node);
  var isOutside = isElementOutside(height, node);
  var shouldSplit = height < nodeTop + nodeHeight;

  if (isOutside) {
    var next = R.evolve({
      box: {
        top: R.subtract(R.__, height)
      }
    })(node);
    return [null, next, false];
  }

  if (shouldSplit) {
    var _splitChildren = splitChildren(height, node),
        currentChilds = _splitChildren[0],
        nextChildren = _splitChildren[1];

    var current = R.evolve({
      children: R.always(currentChilds),
      style: {
        borderBottomLeftRadius: R.always(0),
        borderBottomRightRadius: R.always(0)
      },
      box: {
        height: R.when(R.always(shouldSplit), R.always(height - nodeTop))
      }
    })(node);

    var _next = R.evolve({
      children: R.always(nextChildren),
      style: {
        borderTopLeftRadius: R.always(0),
        borderTopRightRadius: R.always(0)
      },
      box: {
        top: R.always(0),
        height: R.subtract(R.__, height - nodeTop)
      }
    })(node);

    return [current, _next];
  }

  return [node, null, false];
});

var getPaddingBottom$1 = R.pathOr(0, ['style', 'paddingBottom']);

var getWrappingArea = function getWrappingArea(page) {
  var paddingBottom = getPaddingBottom$1(page);
  var height = R.path(['style', 'height'], page);
  return height - paddingBottom;
};

var splitPage = function splitPage(page) {
  if (!page) return [];
  var height = getWrappingArea(page);
  var splittedPage = splitNode(height, page);
  var pages = [splittedPage[0]];
  var nextPage = splittedPage[1];

  while (nextPage !== null) {
    splittedPage = splitNode(height, nextPage);
    pages.push(splittedPage[0]);
    nextPage = splittedPage[1];
  }

  return pages;
};

var resolvePageSplitting = R.evolve({
  children: R.map(R.evolve({
    children: R.compose(R.flatten, R.map(splitPage))
  }))
});

var restorePageSize = R.evolve({
  children: R.map(R.evolve({
    children: R.map(resolvePageSize('box'))
  }))
});
var resolvePageWrapping = R.compose(restorePageSize, resolvePageSplitting, resolvePageBreaks);

/**
 * Get node underlying text value
 *
 * @param {Object} node
 * @returns {String} node text content
 */

var getNodeText = function getNodeText(node) {
  return R.cond([[R.is(String), R.identity], [isTextInstance, R.prop('value')], [R.T, R.compose(getNodesText, R.propOr([], 'children'))]])(node);
};
/**
 * Get underlying text value of several nodes
 *
 * @param {Array} nodes
 * @returns {String} nodes text content
 */


var getNodesText = R.compose(R.join(''), R.map(getNodeText));
/**
 * Transforms string to text instance
 *
 * @param {String} value
 * @returns {Array} text intance
 */

var wrapTextInstance = function wrapTextInstance(value) {
  return [{
    type: 'TEXT_INSTANCE',
    value: value
  }];
};
/**
 * Cast Note children as a text instance
 *
 * @param {Object} node
 * @returns {Object} node with resolved note children
 */


var resolveNoteChildren = function resolveNoteChildren(node) {
  return R.ifElse(isNote, R.evolve({
    children: R.compose(wrapTextInstance, getNodesText)
  }), R.evolve({
    children: R.map(resolveNoteChildren)
  }))(node);
};

/*
 * Translates page percentage horizontal paddings in fixed ones
 *
 * @param {Object} page container
 * @param {String} padding value
 * @returns {Object} translated padding value
 */

var resolvePageHorizontalPadding = function resolvePageHorizontalPadding(container) {
  return function (value) {
    var match = matchPercent(value);
    return match ? match.percent * container.width : value;
  };
};
/**
 * Translates page percentage vertical paddings in fixed ones
 *
 * @param {Object} page container
 * @param {String} padding value
 * @returns {Object} translated padding value
 */


var resolvePageVerticalPadding = function resolvePageVerticalPadding(container) {
  return function (value) {
    var match = matchPercent(value);
    return match ? match.percent * container.height : value;
  };
};
/**
 * Translates page percentage paddings in fixed ones
 *
 * @param {Object} page
 * @returns {Object} page with fixed paddings
 */


var resolvePagePaddings = function resolvePagePaddings(page) {
  return R.evolve({
    style: R.evolve({
      paddingLeft: resolvePageHorizontalPadding(page.box),
      paddingRight: resolvePageHorizontalPadding(page.box),
      paddingTop: resolvePageVerticalPadding(page.box),
      paddingBottom: resolvePageVerticalPadding(page.box)
    })
  })(page);
};
/**
 * Translates all pages percentage paddings in fixed ones
 *
 * @param {Object} document root
 * @returns {Object} document root with translated page paddings
 */


var resolvePagePaddings$1 = R.evolve({
  children: R.map(R.evolve({
    children: R.map(resolvePagePaddings)
  }))
});

/**
 *
 * @param {Object} container width and height
 * @param {String | Number} value border radius value
 * @returns {Number} fixed border radius value
 */

var resolveRadius = function resolveRadius(container) {
  return function (value) {
    var match = matchPercent(value);
    return match ? match.percent * Math.min(container.width, container.height) : value;
  };
};
/**
 * Transforms percent border radius into fixed values
 *
 * @param {Object} node
 * @returns {Object} node
 */


var resolvePercentRadius = function resolvePercentRadius(node) {
  return R.evolve({
    children: R.map(resolvePercentRadius),
    style: R.evolve({
      borderTopLeftRadius: resolveRadius(node.box),
      borderTopRightRadius: resolveRadius(node.box),
      borderBottomRightRadius: resolveRadius(node.box),
      borderBottomLeftRadius: resolveRadius(node.box)
    })
  })(node);
};

/**
 * Transform percent height into fixed
 *
 * @param {String | number} height
 * @return {number} height
 */

var transformHeight = function transformHeight(pageArea) {
  return function (height) {
    var match = matchPercent(height);
    return match ? match.percent * pageArea : height;
  };
};
/**
 * Get page area (height minus paddings)
 *
 * @param {Object} page
 * @return {number} page area
 */


var getPageArea = function getPageArea(page) {
  var pageHeight = R.path(['style', 'height'], page);
  var pagePaddingTop = R.pathOr(0, ['style', 'paddingTop'], page);
  var pagePaddingBottom = R.pathOr(0, ['style', 'paddingBottom'], page);
  return pageHeight - pagePaddingTop - pagePaddingBottom;
};
/**
 * Checks if page has height
 *
 * @param {Object} page
 * @return {boolean} page has height
 */


var hasHeight = R.hasPath(['style', 'height']);
/**
 * Transform node percent height to fixed
 *
 * @param {Object} page
 * @param {Object} node
 * @return {Object} transformed node
 */

var resolveNodePercentHeight = function resolveNodePercentHeight(page) {
  return function (node) {
    if (hasHeight(page)) {
      var pageArea = getPageArea(page);
      return R.evolve({
        style: {
          height: transformHeight(pageArea)
        }
      })(node);
    }

    return node;
  };
};
/**
 * Transform page immediate children with percent height to fixed
 *
 * @param {Object} page
 * @return {Object} transformed page
 */


var resolvePagePercentHeight = function resolvePagePercentHeight(page) {
  return R.evolve({
    children: R.map(resolveNodePercentHeight(page))
  })(page);
};
/**
 * Transform all page immediate children with percent height to fixed
 *
 * @param {Object} document root
 * @return {Object} transformed document root
 */


var resolvePercentHeight = R.evolve({
  children: R.map(R.evolve({
    children: R.map(resolvePagePercentHeight)
  }))
});

/**
 * Checks if node is link
 *
 * @param {Object} node
 * @returns {Boolean} is node link?
 */

var isLink = R.propEq('type', LINK);

/**
 * Checks if node has render prop
 *
 * @param {Object} node
 * @returns {Boolean} has render prop?
 */

var hasRenderProp = R.hasPath(['props', 'render']);
/**
 * Checks if all children of node are text instances
 *
 * @param {Object} node
 * @returns {Boolean} are all children text instances?
 */

var hasTextInstanceChilds = R.compose(R.all(isTextInstance), R.propOr([], 'children'));
/**
 * If the Link has a strign child or render prop, substitute the instance by a Text,
 * that will ultimately render the inline Link via the textkit PDF renderer.
 *
 * @param {Object} node
 * @returns {Object} node with link substitution
 */

var resolveLinkSubstitution = function resolveLinkSubstitution(node) {
  return R.evolve({
    children: R.map(R.ifElse(R.both(isLink, R.either(hasRenderProp, hasTextInstanceChilds)), R.assoc('type', TEXT), resolveLinkSubstitution))
  })(node);
};

/**
 * Translates relative coordinates to absolute coordinates
 *
 * @param {Object} root node
 * @returns {Object} root node with absolute coordinates
 */

var resolveAbsoluteCoordinates = function resolveAbsoluteCoordinates(node) {
  var top = R.pathOr(0, ['box', 'top'], node);
  var left = R.pathOr(0, ['box', 'left'], node);
  return R.evolve({
    children: R.map(R.compose(resolveAbsoluteCoordinates, R.evolve({
      box: R.evolve({
        top: R.add(top),
        bottom: R.add(top),
        left: R.add(left),
        right: R.add(left)
      }),
      origin: R.evolve({
        top: R.add(top),
        left: R.add(left)
      })
    })))
  })(node);
};

/**
 * Performs right-to-left function composition with async functions support
 *
 * @param  {...any} functions
 */

var asyncCompose = function asyncCompose() {
  for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  return (
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee(value) {
        var _iterator, _isArray, _i, _ref2, fn;

        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _iterator = R.reverse(fns), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();

              case 1:
                if (!_isArray) {
                  _context.next = 7;
                  break;
                }

                if (!(_i >= _iterator.length)) {
                  _context.next = 4;
                  break;
                }

                return _context.abrupt("break", 17);

              case 4:
                _ref2 = _iterator[_i++];
                _context.next = 11;
                break;

              case 7:
                _i = _iterator.next();

                if (!_i.done) {
                  _context.next = 10;
                  break;
                }

                return _context.abrupt("break", 17);

              case 10:
                _ref2 = _i.value;

              case 11:
                fn = _ref2;
                _context.next = 14;
                return fn(value);

              case 14:
                value = _context.sent;

              case 15:
                _context.next = 1;
                break;

              case 17:
                return _context.abrupt("return", value);

              case 18:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }()
  );
};

var startTimer = function startTimer(name) {
  return R.tap(function () {
    return console.time(name);
  });
};

var endTimer = function endTimer(name) {
  return R.tap(function () {
    return console.timeEnd(name);
  });
};

var resolvePageSizeStyle = resolvePageSizes('style');
var layout = asyncCompose(resolveAbsoluteCoordinates, resolveRulers, resolveOrigin, endTimer('resolvePageBreaks'), resolvePageWrapping, startTimer('resolvePageBreaks'), resolveTextLayout, resolvePercentRadius, resolveZIndex, resolveDimensions, resolveAssets, resolveInheritance, resolvePercentHeight, resolvePagePaddings$1, resolveStyles$1, resolveNoteChildren, resolveLinkSubstitution, resolvePageMargins, resolvePageSizeStyle);

var save = function save(ctx) {
  return R.tap(function () {
    return ctx.save();
  });
};

var restore = function restore(ctx) {
  return R.tap(function () {
    return ctx.restore();
  });
};

var renderText = function renderText(ctx, node) {
  var _node$box = node.box,
      top = _node$box.top,
      left = _node$box.left;
  var paddingTop = R.pathOr(0, ['box', 'paddingTop'], node);
  var paddingLeft = R.pathOr(0, ['box', 'paddingLeft'], node);
  var initialY = node.lines[0] ? node.lines[0].box.y : 0;
  ctx.save();
  ctx.translate(left + paddingLeft, top + paddingTop - initialY);
  PDFRenderer.render(ctx, [node.lines]);
  ctx.restore();
  return node;
};

var renderText$1 = R.curryN(2, renderText);

var renderPage = function renderPage(ctx, node) {
  var _node$box = node.box,
      width = _node$box.width,
      height = _node$box.height;
  ctx.addPage({
    size: [width, height],
    margin: 0
  });
  return node;
};

var renderPage$1 = R.curryN(2, renderPage);

var PROTOCOL_REGEXP = /^([a-z]+\:(\/\/)?)/i;
/**
 * Add protocol th URL if valid
 *
 * @param {String} value url
 * @returns {String} corrected url
 */

var getURL = function getURL(value) {
  if (!value) return '';

  if (typeof value === 'string' && !value.match(PROTOCOL_REGEXP)) {
    return "http://" + value;
  }

  return value;
};

var getSource$1 = R.compose(getURL, R.either(R.path(['props', 'src']), R.path(['props', 'href'])));

var renderLink = function renderLink(ctx, node) {
  var _node$box = node.box,
      top = _node$box.top,
      left = _node$box.left,
      width = _node$box.width,
      height = _node$box.height;
  var src = getSource$1(node);
  ctx.link(left, top, width, height, src);
  return node;
};

var renderLink$1 = R.curryN(2, renderLink);

var renderNote = function renderNote(ctx, node) {
  var _node$box = node.box,
      top = _node$box.top,
      left = _node$box.left;
  var value = node.children[0] ? node.children[0].value : '';
  ctx.note(left, top, 0, 0, value);
  return node;
};

var renderNote$1 = R.curryN(2, renderNote);

// Bezier curve.

var KAPPA = 4.0 * ((Math.sqrt(2) - 1.0) / 3.0);

var clipNode = function clipNode(ctx, node) {
  var _node$box = node.box,
      top = _node$box.top,
      left = _node$box.left,
      width = _node$box.width,
      height = _node$box.height;
  var _node$style = node.style,
      _node$style$borderTop = _node$style.borderTopLeftRadius,
      borderTopLeftRadius = _node$style$borderTop === void 0 ? 0 : _node$style$borderTop,
      _node$style$borderTop2 = _node$style.borderTopRightRadius,
      borderTopRightRadius = _node$style$borderTop2 === void 0 ? 0 : _node$style$borderTop2,
      _node$style$borderBot = _node$style.borderBottomRightRadius,
      borderBottomRightRadius = _node$style$borderBot === void 0 ? 0 : _node$style$borderBot,
      _node$style$borderBot2 = _node$style.borderBottomLeftRadius,
      borderBottomLeftRadius = _node$style$borderBot2 === void 0 ? 0 : _node$style$borderBot2; // Border top

  var rtr = Math.min(borderTopRightRadius, 0.5 * width, 0.5 * height);
  var ctr = rtr * (1.0 - KAPPA);
  ctx.moveTo(left + rtr, top);
  ctx.lineTo(left + width - rtr, top);
  ctx.bezierCurveTo(left + width - ctr, top, left + width, top + ctr, left + width, top + rtr); // Border right

  var rbr = Math.min(borderBottomRightRadius, 0.5 * width, 0.5 * height);
  var cbr = rbr * (1.0 - KAPPA);
  ctx.lineTo(left + width, top + height - rbr);
  ctx.bezierCurveTo(left + width, top + height - cbr, left + width - cbr, top + height, left + width - rbr, top + height); // Border bottom

  var rbl = Math.min(borderBottomLeftRadius, 0.5 * width, 0.5 * height);
  var cbl = rbl * (1.0 - KAPPA);
  ctx.lineTo(left + rbl, top + height);
  ctx.bezierCurveTo(left + cbl, top + height, left, top + height - cbl, left, top + height - rbl); // Border left

  var rtl = Math.min(borderTopLeftRadius, 0.5 * width, 0.5 * height);
  var ctl = rtl * (1.0 - KAPPA);
  ctx.lineTo(left, top + rtl);
  ctx.bezierCurveTo(left, top + ctl, left + ctl, top, left + rtl, top);
  ctx.closePath();
  ctx.clip();
  return node;
};

var clipNode$1 = R.curryN(2, clipNode);

var isNumeric = function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

var applyContainObjectFit = function applyContainObjectFit(cw, ch, iw, ih, px, py) {
  var cr = cw / ch;
  var ir = iw / ih;
  var pxp = matchPercent(px);
  var pyp = matchPercent(py);
  var pxv = pxp ? pxp.percent : 0.5;
  var pyv = pyp ? pyp.percent : 0.5;

  if (cr > ir) {
    var height = ch;
    var width = height * ir;
    var yOffset = isNumeric(py) ? py : 0;
    var xOffset = isNumeric(px) ? px : (cw - width) * pxv;
    return {
      width: width,
      height: height,
      xOffset: xOffset,
      yOffset: yOffset
    };
  } else {
    var _width = cw;

    var _height = _width / ir;

    var _xOffset = isNumeric(px) ? px : 0;

    var _yOffset = isNumeric(py) ? py : (ch - _height) * pyv;

    return {
      width: _width,
      height: _height,
      yOffset: _yOffset,
      xOffset: _xOffset
    };
  }
};

var applyNoneObjectFit = function applyNoneObjectFit(cw, ch, iw, ih, px, py) {
  var width = iw;
  var height = ih;
  var pxp = matchPercent(px);
  var pyp = matchPercent(py);
  var pxv = pxp ? pxp.percent : 0.5;
  var pyv = pyp ? pyp.percent : 0.5;
  var xOffset = isNumeric(px) ? px : (cw - width) * pxv;
  var yOffset = isNumeric(py) ? py : (ch - height) * pyv;
  return {
    width: width,
    height: height,
    xOffset: xOffset,
    yOffset: yOffset
  };
};

var applyCoverObjectFit = function applyCoverObjectFit(cw, ch, iw, ih, px, py) {
  var ir = iw / ih;
  var cr = cw / ch;
  var pxp = matchPercent(px);
  var pyp = matchPercent(py);
  var pxv = pxp ? pxp.percent : 0.5;
  var pyv = pyp ? pyp.percent : 0.5;

  if (cr > ir) {
    var width = cw;
    var height = width / ir;
    var xOffset = isNumeric(px) ? px : 0;
    var yOffset = isNumeric(py) ? py : (ch - height) * pyv;
    return {
      width: width,
      height: height,
      yOffset: yOffset,
      xOffset: xOffset
    };
  } else {
    var _height2 = ch;

    var _width2 = _height2 * ir;

    var _xOffset2 = isNumeric(px) ? px : (cw - _width2) * pxv;

    var _yOffset2 = isNumeric(py) ? py : 0;

    return {
      width: _width2,
      height: _height2,
      xOffset: _xOffset2,
      yOffset: _yOffset2
    };
  }
};

var applyScaleDownObjectFit = function applyScaleDownObjectFit(cw, ch, iw, ih, px, py) {
  var containDimension = applyContainObjectFit(cw, ch, iw, ih, px, py);
  var noneDimension = applyNoneObjectFit(cw, ch, iw, ih, px, py);
  return containDimension.width < noneDimension.width ? containDimension : noneDimension;
};

var applyFillObjectFit = function applyFillObjectFit(cw, ch, px, py) {
  return {
    width: cw,
    height: ch,
    xOffset: matchPercent(px) ? 0 : px || 0,
    yOffset: matchPercent(py) ? 0 : py || 0
  };
};

var resolveObjectFit = function resolveObjectFit(type, cw, ch, iw, ih, px, py) {
  if (type === void 0) {
    type = 'fill';
  }

  switch (type) {
    case 'contain':
      return applyContainObjectFit(cw, ch, iw, ih, px, py);

    case 'cover':
      return applyCoverObjectFit(cw, ch, iw, ih, px, py);

    case 'none':
      return applyNoneObjectFit(cw, ch, iw, ih, px, py);

    case 'scale-down':
      return applyScaleDownObjectFit(cw, ch, iw, ih, px, py);

    default:
      return applyFillObjectFit(cw, ch, px, py);
  }
};

var drawImage = function drawImage(ctx) {
  return function (node) {
    var _node$box = node.box,
        left = _node$box.left,
        top = _node$box.top;
    var _node$style = node.style,
        opacity = _node$style.opacity,
        objectPositionX = _node$style.objectPositionX,
        objectPositionY = _node$style.objectPositionY;
    var paddingTop = node.box.paddingLeft || 0;
    var paddingRight = node.box.paddingRight || 0;
    var paddingBottom = node.box.paddingBottom || 0;
    var paddingLeft = node.box.paddingLeft || 0;

    var _resolveObjectFit = resolveObjectFit(node.style.objectFit, node.box.width - paddingLeft - paddingRight, node.box.height - paddingTop - paddingBottom, node.image.width, node.image.height, objectPositionX, objectPositionY),
        width = _resolveObjectFit.width,
        height = _resolveObjectFit.height,
        xOffset = _resolveObjectFit.xOffset,
        yOffset = _resolveObjectFit.yOffset;

    if (node.image.data) {
      if (width !== 0 && height !== 0) {
        ctx.fillOpacity(opacity || 1).image(node.image.data, left + paddingLeft + xOffset, top + paddingTop + yOffset, {
          width: width,
          height: height
        });
      } else {
        warning(false, "Image with src '" + node.props.src + "' skipped due to invalid dimensions");
      }
    }

    return node;
  };
};

var renderImage = function renderImage(ctx, node) {
  R.compose(restore(ctx), drawImage(ctx), clipNode$1(ctx), save(ctx))(node);
  return node;
};

var renderImage$1 = R.curryN(2, renderImage);

var availableMethods = ['dash', 'clip', 'save', 'path', 'fill', 'font', 'text', 'rect', 'scale', 'moveTo', 'lineTo', 'stroke', 'rotate', 'circle', 'lineCap', 'opacity', 'ellipse', 'polygon', 'restore', 'lineJoin', 'fontSize', 'fillColor', 'lineWidth', 'translate', 'miterLimit', 'strokeColor', 'fillOpacity', 'roundedRect', 'strokeOpacity', 'bezierCurveTo', 'quadraticCurveTo', 'linearGradient', 'radialGradient'];

var painter = function painter(ctx) {
  var p = availableMethods.reduce(function (acc, prop) {
    var _extends2;

    return _extends({}, acc, (_extends2 = {}, _extends2[prop] = function () {
      ctx[prop].apply(ctx, arguments);
      return p;
    }, _extends2));
  }, {});
  return p;
};

var defaultsZero = R.pathOr(0);

var renderCanvas = function renderCanvas(ctx, node) {
  var _node$box = node.box,
      top = _node$box.top,
      left = _node$box.left,
      width = _node$box.width,
      height = _node$box.height;
  var paddingLeft = defaultsZero('paddingLeft', node.box);
  var paddingRight = defaultsZero('paddingRight', node.box);
  var paddingTop = defaultsZero('paddingTop', node.box);
  var paddingBottom = defaultsZero('paddingBottom', node.box);
  var availableWidth = width - paddingLeft - paddingRight;
  var availableHeight = height - paddingTop - paddingBottom;
  warning(availableWidth && availableHeight, 'Canvas element has null width or height. Please provide valid values via the `style` prop in order to correctly render it.');
  ctx.save().translate(left + paddingLeft, top + paddingTop);

  if (node.props.paint) {
    node.props.paint(painter(ctx), availableWidth, availableHeight);
  }

  ctx.restore();
  return node;
};

var renderCanvas$1 = R.curryN(2, renderCanvas);

var range = function range(max, steps) {
  return Array.from({
    length: Math.ceil(max / steps)
  }, function (_, i) {
    return i * steps;
  });
};

var matchPercentage = function matchPercentage(value) {
  var match = matchPercent(value);
  return match ? 100 / match.value : null;
};

var getVerticalSteps = function getVerticalSteps(page) {
  var value = page.props.horizontalRulerSteps || page.props.rulerSteps || DEFAULT_RULER_STEPS;

  if (typeof value === 'string') {
    var percentage = matchPercentage(value);

    if (percentage) {
      var width = page.box.width - (hasVerticalRuler(page) ? RULER_WIDTH : 0);
      return width / percentage;
    }

    throw new Error('Page: Invalid horizontal steps value');
  }

  return value;
};

var getHorizontalSteps = function getHorizontalSteps(page) {
  var value = page.props.verticalRulerSteps || page.props.rulerSteps || DEFAULT_RULER_STEPS;

  if (typeof value === 'string') {
    var percentage = matchPercentage(value);

    if (percentage) {
      var height = page.box.height - (hasVerticalRuler(page) ? RULER_WIDTH : 0);
      return height / percentage;
    }

    throw new Error('Page: Invalid horizontal steps value');
  }

  return value;
};

var renderVerticalRuler = function renderVerticalRuler(ctx) {
  return function (page) {
    var width = page.box.width;
    var height = page.box.height;
    var offset = hasHorizontalRuler(page) ? RULER_WIDTH : 0;
    var hRange = range(width, getVerticalSteps(page));
    ctx.rect(offset, 0, width, RULER_WIDTH).fill(RULER_COLOR).moveTo(offset, RULER_WIDTH).lineTo(width, RULER_WIDTH).stroke(LINE_COLOR);
    hRange.map(function (step) {
      ctx.moveTo(offset + step, 0).lineTo(offset + step, RULER_WIDTH).stroke(LINE_COLOR).fillColor('black').text("" + Math.round(step), offset + step + 1, 1);

      if (step !== 0) {
        ctx.moveTo(offset + step, RULER_WIDTH).lineTo(offset + step, height).stroke(GRID_COLOR);
      }
    });
    return page;
  };
};

var renderHorizontalRuler = function renderHorizontalRuler(ctx) {
  return function (page) {
    var width = page.box.width;
    var height = page.box.height;
    var offset = hasVerticalRuler(page) ? RULER_WIDTH : 0;
    var hRange = range(height, getHorizontalSteps(page));
    ctx.rect(0, offset, RULER_WIDTH, height).fill(RULER_COLOR).moveTo(RULER_WIDTH, hasHorizontalRuler(page) ? RULER_WIDTH : 0).lineTo(RULER_WIDTH, height).stroke(LINE_COLOR);
    hRange.map(function (step) {
      ctx.moveTo(0, offset + step).lineTo(RULER_WIDTH, offset + step).stroke(LINE_COLOR).fillColor('black').text("" + Math.round(step), 1, offset + step + 1);

      if (step !== 0) {
        ctx.moveTo(RULER_WIDTH, offset + step).lineTo(width, offset + step).stroke(GRID_COLOR);
      }
    });
    return page;
  };
};

var renderRulers = function renderRulers(ctx, page) {
  ctx.save().lineWidth(LINE_WIDTH).fontSize(RULER_FONT_SIZE).opacity(1);
  R.compose(R.when(hasVerticalRuler, renderVerticalRuler(ctx)), R.when(hasHorizontalRuler, renderHorizontalRuler(ctx)))(page);
  ctx.restore();
  return page;
};

var renderRulers$1 = R.curryN(2, renderRulers);

var getDocumentProp = function getDocumentProp(target) {
  return function (or, prop) {
    return R.pathOr(or, ['children', 0, 'props', prop], target);
  };
};

var setPDFMetadata = function setPDFMetadata(target) {
  return function (key, value) {
    if (value) target.info[key] = value;
  };
};
/**
 * Set document instance metadata
 *
 * @param {Object} ctx document instance
 * @param {Object} root document root
 */


var addMetadata = function addMetadata(ctx, root) {
  var getProp = getDocumentProp(root);
  var setProp = setPDFMetadata(ctx);
  var title = getProp(null, 'title');
  var author = getProp(null, 'author');
  var subject = getProp(null, 'subject');
  var keywords = getProp(null, 'keywords');
  var creator = getProp('react-pdf', 'creator');
  var producer = getProp('react-pdf', 'producer');
  setProp('Title', title);
  setProp('Author', author);
  setProp('Subject', subject);
  setProp('Keywords', keywords);
  setProp('Creator', creator);
  setProp('Producer', producer);
  return root;
};

var addMetadata$1 = R.curryN(2, addMetadata);

var CONTENT_COLOR = '#a1c6e7';
var PADDING_COLOR = '#c4deb9';
var MARGIN_COLOR = '#f8cca1';
var shouldDebug = R.pathEq(['props', 'debug'], true); // TODO: Draw debug boxes using clipping to enhance quality

var debugContent = function debugContent(ctx, node) {
  var _node$box = node.box,
      left = _node$box.left,
      top = _node$box.top,
      width = _node$box.width,
      height = _node$box.height,
      paddingLeft = _node$box.paddingLeft,
      paddingTop = _node$box.paddingTop,
      paddingRight = _node$box.paddingRight,
      paddingBottom = _node$box.paddingBottom;
  ctx.fillColor(CONTENT_COLOR).opacity(0.5).rect(left + paddingLeft, top + paddingTop, width - paddingLeft - paddingRight, height - paddingTop - paddingBottom).fill();
};

var debugPadding = function debugPadding(ctx, node) {
  var _node$box2 = node.box,
      left = _node$box2.left,
      top = _node$box2.top,
      width = _node$box2.width,
      height = _node$box2.height,
      paddingLeft = _node$box2.paddingLeft,
      paddingTop = _node$box2.paddingTop,
      paddingRight = _node$box2.paddingRight,
      paddingBottom = _node$box2.paddingBottom;
  ctx.fillColor(PADDING_COLOR).opacity(0.5); // Padding top

  ctx.rect(left + paddingLeft, top, width - paddingRight - paddingLeft, paddingTop).fill(); // Padding left

  ctx.rect(left, top, paddingLeft, height).fill(); // Padding right

  ctx.rect(left + width - paddingRight, top, paddingRight, height).fill(); // Padding bottom

  ctx.rect(left + paddingLeft, top + height - paddingBottom, width - paddingRight - paddingLeft, paddingBottom).fill();
};

var debugMargin = function debugMargin(ctx, node) {
  var _node$box3 = node.box,
      left = _node$box3.left,
      top = _node$box3.top,
      width = _node$box3.width,
      height = _node$box3.height,
      marginLeft = _node$box3.marginLeft,
      marginTop = _node$box3.marginTop,
      marginRight = _node$box3.marginRight,
      marginBottom = _node$box3.marginBottom;
  ctx.fillColor(MARGIN_COLOR).opacity(0.5); // Margin top

  ctx.rect(left, top - marginTop, width, marginTop).fill(); // Margin left

  ctx.rect(left - marginLeft, top - marginTop, marginLeft, height + marginTop + marginBottom).fill(); // Margin right

  ctx.rect(left + width, top - marginTop, marginRight, height + marginTop + marginBottom).fill(); // Margin bottom

  ctx.rect(left, top + height, width, marginBottom).fill();
};

var debugText = function debugText(ctx, node) {
  var _node$box4 = node.box,
      left = _node$box4.left,
      top = _node$box4.top,
      width = _node$box4.width,
      height = _node$box4.height,
      marginLeft = _node$box4.marginLeft,
      marginTop = _node$box4.marginTop,
      marginRight = _node$box4.marginRight,
      marginBottom = _node$box4.marginBottom;
  var roundedWidth = Math.round(width + marginLeft + marginRight);
  var roundedHeight = Math.round(height + marginTop + marginBottom);
  ctx.fontSize(4).opacity(1).fillColor('black').text(roundedWidth + " x " + roundedHeight, left - marginLeft, Math.max(top - marginTop - 4, 1));
};

var debugOrigin = function debugOrigin(ctx, node) {
  if (node.origin) {
    ctx.circle(node.origin.left, node.origin.top, 3).fill('red').circle(node.origin.left, node.origin.top, 5).stroke('red');
  }
};

var renderDebug = function renderDebug(ctx, node) {
  if (!shouldDebug(node)) return node;
  ctx.save();
  debugContent(ctx, node);
  debugPadding(ctx, node);
  debugMargin(ctx, node);
  debugText(ctx, node);
  debugOrigin(ctx, node);
  ctx.restore();
  return node;
};

var renderDebug$1 = R.curryN(2, renderDebug);

// This constant is used to approximate a symmetrical arc using a cubic Bezier curve.

var KAPPA$1 = 4.0 * ((Math.sqrt(2) - 1.0) / 3.0);

var clipBorderTop = function clipBorderTop(ctx, layout, style, rtr, rtl) {
  var top = layout.top,
      left = layout.left,
      width = layout.width,
      height = layout.height;
  var borderTopWidth = style.borderTopWidth,
      borderRightWidth = style.borderRightWidth,
      borderLeftWidth = style.borderLeftWidth; // Clip outer top border edge

  ctx.moveTo(left + rtl, top);
  ctx.lineTo(left + width - rtr, top); // Ellipse coefficients outer top right cap

  var c0 = rtr * (1.0 - KAPPA$1); // Clip outer top right cap

  ctx.bezierCurveTo(left + width - c0, top, left + width, top + c0, left + width, top + rtr); // Move down in case the margin exceedes the radius

  var topRightYCoord = top + Math.max(borderTopWidth, rtr);
  ctx.lineTo(left + width, topRightYCoord); // Clip inner top right cap

  ctx.lineTo(left + width - borderRightWidth, topRightYCoord); // Ellipse coefficients inner top right cap

  var innerTopRightRadiusX = Math.max(rtr - borderRightWidth, 0);
  var innerTopRightRadiusY = Math.max(rtr - borderTopWidth, 0);
  var c1 = innerTopRightRadiusX * (1.0 - KAPPA$1);
  var c2 = innerTopRightRadiusY * (1.0 - KAPPA$1); // Clip inner top right cap

  ctx.bezierCurveTo(left + width - borderRightWidth, top + borderTopWidth + c2, left + width - borderRightWidth - c1, top + borderTopWidth, left + width - borderRightWidth - innerTopRightRadiusX, top + borderTopWidth); // Clip inner top border edge

  ctx.lineTo(left + Math.max(rtl, borderLeftWidth), top + borderTopWidth); // Ellipse coefficients inner top left cap

  var innerTopLeftRadiusX = Math.max(rtl - borderLeftWidth, 0);
  var innerTopLeftRadiusY = Math.max(rtl - borderTopWidth, 0);
  var c3 = innerTopLeftRadiusX * (1.0 - KAPPA$1);
  var c4 = innerTopLeftRadiusY * (1.0 - KAPPA$1);
  var topLeftYCoord = top + Math.max(borderTopWidth, rtl); // Clip inner top left cap

  ctx.bezierCurveTo(left + borderLeftWidth + c3, top + borderTopWidth, left + borderLeftWidth, top + borderTopWidth + c4, left + borderLeftWidth, topLeftYCoord);
  ctx.lineTo(left, topLeftYCoord); // Move down in case the margin exceedes the radius

  ctx.lineTo(left, top + rtl); // Ellipse coefficients outer top left cap

  var c5 = rtl * (1.0 - KAPPA$1); // Clip outer top left cap

  ctx.bezierCurveTo(left, top + c5, left + c5, top, left + rtl, top);
  ctx.closePath();
  ctx.clip(); // Clip border top cap joins

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
  var c0 = rtl * (1.0 - KAPPA$1);
  var c1 = rtr * (1.0 - KAPPA$1);
  ctx.moveTo(left, top + Math.max(rtl, borderTopWidth));
  ctx.bezierCurveTo(left, top + c0, left + c0, top, left + rtl, top);
  ctx.lineTo(left + width - rtr, top);
  ctx.bezierCurveTo(left + width - c1, top, left + width, top + c1, left + width, top + rtr);
  ctx.strokeColor(borderTopColor);
  ctx.lineWidth(Math.max(borderRightWidth, borderTopWidth, borderLeftWidth) * 2);

  if (borderTopStyle === 'dashed') {
    ctx.dash(borderTopWidth * 2, {
      space: borderTopWidth * 1.2
    });
  } else if (borderTopStyle === 'dotted') {
    ctx.dash(borderTopWidth, {
      space: borderTopWidth * 1.2
    });
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
      borderBottomWidth = style.borderBottomWidth; // Clip outer right border edge

  ctx.moveTo(left + width, top + rtr);
  ctx.lineTo(left + width, top + height - rbr); // Ellipse coefficients outer bottom right cap

  var c0 = rbr * (1.0 - KAPPA$1); // Clip outer top right cap

  ctx.bezierCurveTo(left + width, top + height - c0, left + width - c0, top + height, left + width - rbr, top + height); // Move left in case the margin exceedes the radius

  var topBottomXCoord = left + width - Math.max(borderRightWidth, rbr);
  ctx.lineTo(topBottomXCoord, top + height); // Clip inner bottom right cap

  ctx.lineTo(topBottomXCoord, top + height - borderBottomWidth); // Ellipse coefficients inner bottom right cap

  var innerBottomRightRadiusX = Math.max(rbr - borderRightWidth, 0);
  var innerBottomRightRadiusY = Math.max(rbr - borderBottomWidth, 0);
  var c1 = innerBottomRightRadiusX * (1.0 - KAPPA$1);
  var c2 = innerBottomRightRadiusY * (1.0 - KAPPA$1); // Clip inner top right cap

  ctx.bezierCurveTo(left + width - borderRightWidth - c1, top + height - borderBottomWidth, left + width - borderRightWidth, top + height - borderBottomWidth - c2, left + width - borderRightWidth, top + height - Math.max(rbr, borderBottomWidth)); // Clip inner right border edge

  ctx.lineTo(left + width - borderRightWidth, top + Math.max(rtr, borderTopWidth)); // Ellipse coefficients inner top right cap

  var innerTopRightRadiusX = Math.max(rtr - borderRightWidth, 0);
  var innerTopRightRadiusY = Math.max(rtr - borderTopWidth, 0);
  var c3 = innerTopRightRadiusX * (1.0 - KAPPA$1);
  var c4 = innerTopRightRadiusY * (1.0 - KAPPA$1);
  var topRightXCoord = left + width - Math.max(rtr, borderRightWidth); // Clip inner top left cap

  ctx.bezierCurveTo(left + width - borderRightWidth, top + borderTopWidth + c4, left + width - borderRightWidth - c3, top + borderTopWidth, topRightXCoord, top + borderTopWidth);
  ctx.lineTo(topRightXCoord, top); // Move right in case the margin exceedes the radius

  ctx.lineTo(left + width - rtr, top); // Ellipse coefficients outer top right cap

  var c5 = rtr * (1.0 - KAPPA$1); // Clip outer top right cap

  ctx.bezierCurveTo(left + width - c5, top, left + width, top + c5, left + width, top + rtr);
  ctx.closePath();
  ctx.clip(); // Clip border right cap joins

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
  var c0 = rbr * (1.0 - KAPPA$1);
  var c1 = rtr * (1.0 - KAPPA$1);
  ctx.moveTo(left + width - rtr, top);
  ctx.bezierCurveTo(left + width - c1, top, left + width, top + c1, left + width, top + rtr);
  ctx.lineTo(left + width, top + height - rbr);
  ctx.bezierCurveTo(left + width, top + height - c0, left + width - c0, top + height, left + width - rbr, top + height);
  ctx.strokeColor(borderRightColor);
  ctx.lineWidth(Math.max(borderRightWidth, borderTopWidth, borderBottomWidth) * 2);

  if (borderRightStyle === 'dashed') {
    ctx.dash(borderRightWidth * 2, {
      space: borderRightWidth * 1.2
    });
  } else if (borderRightStyle === 'dotted') {
    ctx.dash(borderRightWidth, {
      space: borderRightWidth * 1.2
    });
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
      borderLeftWidth = style.borderLeftWidth; // Clip outer top border edge

  ctx.moveTo(left + width - rbr, top + height);
  ctx.lineTo(left + rbl, top + height); // Ellipse coefficients outer top right cap

  var c0 = rbl * (1.0 - KAPPA$1); // Clip outer top right cap

  ctx.bezierCurveTo(left + c0, top + height, left, top + height - c0, left, top + height - rbl); // Move up in case the margin exceedes the radius

  var bottomLeftYCoord = top + height - Math.max(borderBottomWidth, rbl);
  ctx.lineTo(left, bottomLeftYCoord); // Clip inner bottom left cap

  ctx.lineTo(left + borderLeftWidth, bottomLeftYCoord); // Ellipse coefficients inner top right cap

  var innerBottomLeftRadiusX = Math.max(rbl - borderLeftWidth, 0);
  var innerBottomLeftRadiusY = Math.max(rbl - borderBottomWidth, 0);
  var c1 = innerBottomLeftRadiusX * (1.0 - KAPPA$1);
  var c2 = innerBottomLeftRadiusY * (1.0 - KAPPA$1); // Clip inner bottom left cap

  ctx.bezierCurveTo(left + borderLeftWidth, top + height - borderBottomWidth - c2, left + borderLeftWidth + c1, top + height - borderBottomWidth, left + borderLeftWidth + innerBottomLeftRadiusX, top + height - borderBottomWidth); // Clip inner bottom border edge

  ctx.lineTo(left + width - Math.max(rbr, borderRightWidth), top + height - borderBottomWidth); // Ellipse coefficients inner top left cap

  var innerBottomRightRadiusX = Math.max(rbr - borderRightWidth, 0);
  var innerBottomRightRadiusY = Math.max(rbr - borderBottomWidth, 0);
  var c3 = innerBottomRightRadiusX * (1.0 - KAPPA$1);
  var c4 = innerBottomRightRadiusY * (1.0 - KAPPA$1);
  var bottomRightYCoord = top + height - Math.max(borderBottomWidth, rbr); // Clip inner top left cap

  ctx.bezierCurveTo(left + width - borderRightWidth - c3, top + height - borderBottomWidth, left + width - borderRightWidth, top + height - borderBottomWidth - c4, left + width - borderRightWidth, bottomRightYCoord);
  ctx.lineTo(left + width, bottomRightYCoord); // Move down in case the margin exceedes the radius

  ctx.lineTo(left + width, top + height - rbr); // Ellipse coefficients outer top left cap

  var c5 = rbr * (1.0 - KAPPA$1); // Clip outer top left cap

  ctx.bezierCurveTo(left + width, top + height - c5, left + width - c5, top + height, left + width - rbr, top + height);
  ctx.closePath();
  ctx.clip(); // Clip border bottom cap joins

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
  var c0 = rbl * (1.0 - KAPPA$1);
  var c1 = rbr * (1.0 - KAPPA$1);
  ctx.moveTo(left + width, top + height - rbr);
  ctx.bezierCurveTo(left + width, top + height - c1, left + width - c1, top + height, left + width - rbr, top + height);
  ctx.lineTo(left + rbl, top + height);
  ctx.bezierCurveTo(left + c0, top + height, left, top + height - c0, left, top + height - rbl);
  ctx.strokeColor(borderBottomColor);
  ctx.lineWidth(Math.max(borderBottomWidth, borderRightWidth, borderLeftWidth) * 2);

  if (borderBottomStyle === 'dashed') {
    ctx.dash(borderBottomWidth * 2, {
      space: borderBottomWidth * 1.2
    });
  } else if (borderBottomStyle === 'dotted') {
    ctx.dash(borderBottomWidth, {
      space: borderBottomWidth * 1.2
    });
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
      borderBottomWidth = style.borderBottomWidth; // Clip outer left border edge

  ctx.moveTo(left, top + height - rbl);
  ctx.lineTo(left, top + rtl); // Ellipse coefficients outer top left cap

  var c0 = rtl * (1.0 - KAPPA$1); // Clip outer top left cap

  ctx.bezierCurveTo(left, top + c0, left + c0, top, left + rtl, top); // Move right in case the margin exceedes the radius

  var topLeftCoordX = left + Math.max(borderLeftWidth, rtl);
  ctx.lineTo(topLeftCoordX, top); // Clip inner top left cap

  ctx.lineTo(topLeftCoordX, top + borderTopWidth); // Ellipse coefficients inner top left cap

  var innerTopLeftRadiusX = Math.max(rtl - borderLeftWidth, 0);
  var innerTopLeftRadiusY = Math.max(rtl - borderTopWidth, 0);
  var c1 = innerTopLeftRadiusX * (1.0 - KAPPA$1);
  var c2 = innerTopLeftRadiusY * (1.0 - KAPPA$1); // Clip inner top right cap

  ctx.bezierCurveTo(left + borderLeftWidth + c1, top + borderTopWidth, left + borderLeftWidth, top + borderTopWidth + c2, left + borderLeftWidth, top + Math.max(rtl, borderTopWidth)); // Clip inner left border edge

  ctx.lineTo(left + borderLeftWidth, top + height - Math.max(rbl, borderBottomWidth)); // Ellipse coefficients inner bottom left cap

  var innerBottomLeftRadiusX = Math.max(rbl - borderLeftWidth, 0);
  var innerBottomLeftRadiusY = Math.max(rbl - borderBottomWidth, 0);
  var c3 = innerBottomLeftRadiusX * (1.0 - KAPPA$1);
  var c4 = innerBottomLeftRadiusY * (1.0 - KAPPA$1);
  var bottomLeftXCoord = left + Math.max(rbl, borderLeftWidth); // Clip inner top left cap

  ctx.bezierCurveTo(left + borderLeftWidth, top + height - borderBottomWidth - c4, left + borderLeftWidth + c3, top + height - borderBottomWidth, bottomLeftXCoord, top + height - borderBottomWidth);
  ctx.lineTo(bottomLeftXCoord, top + height); // Move left in case the margin exceedes the radius

  ctx.lineTo(left + rbl, top + height); // Ellipse coefficients outer top right cap

  var c5 = rbl * (1.0 - KAPPA$1); // Clip outer top right cap

  ctx.bezierCurveTo(left + c5, top + height, left, top + height - c5, left, top + height - rbl);
  ctx.closePath();
  ctx.clip(); // Clip border right cap joins

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
  var c0 = rbl * (1.0 - KAPPA$1);
  var c1 = rtl * (1.0 - KAPPA$1);
  ctx.moveTo(left + rbl, top + height);
  ctx.bezierCurveTo(left + c0, top + height, left, top + height - c0, left, top + height - rbl);
  ctx.lineTo(left, top + rtl);
  ctx.bezierCurveTo(left, top + c1, left + c1, top, left + rtl, top);
  ctx.strokeColor(borderLeftColor);
  ctx.lineWidth(Math.max(borderLeftWidth, borderTopWidth, borderBottomWidth) * 2);

  if (borderLeftStyle === 'dashed') {
    ctx.dash(borderLeftWidth * 2, {
      space: borderLeftWidth * 1.2
    });
  } else if (borderLeftStyle === 'dotted') {
    ctx.dash(borderLeftWidth, {
      space: borderLeftWidth * 1.2
    });
  }

  ctx.stroke();
  ctx.undash();
};

var shouldRenderBorders = function shouldRenderBorders(node) {
  return node.box && (node.box.borderTopWidth || node.box.borderRightWidth || node.box.borderBottomWidth || node.box.borderLeftWidth);
};

var renderBorders = function renderBorders(ctx, node) {
  if (!shouldRenderBorders(node)) return node;
  var _node$box = node.box,
      width = _node$box.width,
      height = _node$box.height,
      borderTopWidth = _node$box.borderTopWidth,
      borderLeftWidth = _node$box.borderLeftWidth,
      borderRightWidth = _node$box.borderRightWidth,
      borderBottomWidth = _node$box.borderBottomWidth;
  var _node$style = node.style,
      opacity = _node$style.opacity,
      _node$style$borderTop = _node$style.borderTopLeftRadius,
      borderTopLeftRadius = _node$style$borderTop === void 0 ? 0 : _node$style$borderTop,
      _node$style$borderTop2 = _node$style.borderTopRightRadius,
      borderTopRightRadius = _node$style$borderTop2 === void 0 ? 0 : _node$style$borderTop2,
      _node$style$borderBot = _node$style.borderBottomLeftRadius,
      borderBottomLeftRadius = _node$style$borderBot === void 0 ? 0 : _node$style$borderBot,
      _node$style$borderBot2 = _node$style.borderBottomRightRadius,
      borderBottomRightRadius = _node$style$borderBot2 === void 0 ? 0 : _node$style$borderBot2,
      _node$style$borderTop3 = _node$style.borderTopColor,
      borderTopColor = _node$style$borderTop3 === void 0 ? 'black' : _node$style$borderTop3,
      _node$style$borderTop4 = _node$style.borderTopStyle,
      borderTopStyle = _node$style$borderTop4 === void 0 ? 'solid' : _node$style$borderTop4,
      _node$style$borderLef = _node$style.borderLeftColor,
      borderLeftColor = _node$style$borderLef === void 0 ? 'black' : _node$style$borderLef,
      _node$style$borderLef2 = _node$style.borderLeftStyle,
      borderLeftStyle = _node$style$borderLef2 === void 0 ? 'solid' : _node$style$borderLef2,
      _node$style$borderRig = _node$style.borderRightColor,
      borderRightColor = _node$style$borderRig === void 0 ? 'black' : _node$style$borderRig,
      _node$style$borderRig2 = _node$style.borderRightStyle,
      borderRightStyle = _node$style$borderRig2 === void 0 ? 'solid' : _node$style$borderRig2,
      _node$style$borderBot3 = _node$style.borderBottomColor,
      borderBottomColor = _node$style$borderBot3 === void 0 ? 'black' : _node$style$borderBot3,
      _node$style$borderBot4 = _node$style.borderBottomStyle,
      borderBottomStyle = _node$style$borderBot4 === void 0 ? 'solid' : _node$style$borderBot4;
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
  var rtr = Math.min(borderTopRightRadius, 0.5 * width, 0.5 * height);
  var rtl = Math.min(borderTopLeftRadius, 0.5 * width, 0.5 * height);
  var rbr = Math.min(borderBottomRightRadius, 0.5 * width, 0.5 * height);
  var rbl = Math.min(borderBottomLeftRadius, 0.5 * width, 0.5 * height);
  ctx.save();
  ctx.strokeOpacity(opacity);

  if (borderTopWidth) {
    ctx.save();
    clipBorderTop(ctx, node.box, style, rtr, rtl);
    fillBorderTop(ctx, node.box, style, rtr, rtl);
    ctx.restore();
  }

  if (borderRightWidth) {
    ctx.save();
    clipBorderRight(ctx, node.box, style, rtr, rbr);
    fillBorderRight(ctx, node.box, style, rtr, rbr);
    ctx.restore();
  }

  if (borderBottomWidth) {
    ctx.save();
    clipBorderBottom(ctx, node.box, style, rbl, rbr);
    fillBorderBottom(ctx, node.box, style, rbl, rbr);
    ctx.restore();
  }

  if (borderLeftWidth) {
    ctx.save();
    clipBorderLeft(ctx, node.box, style, rbl, rtl);
    fillBorderLeft(ctx, node.box, style, rbl, rtl);
    ctx.restore();
  }

  ctx.restore();
  return node;
};

var renderBorders$1 = R.curryN(2, renderBorders);

var drawBackground = function drawBackground(ctx) {
  return function (node) {
    if (node.box && node.style.backgroundColor) {
      var _node$box = node.box,
          top = _node$box.top,
          left = _node$box.left,
          width = _node$box.width,
          height = _node$box.height;
      ctx.fillOpacity(node.style.opacity || 1).fillColor(node.style.backgroundColor).rect(left, top, width, height).fill();
    }

    return node;
  };
};

var shouldRenderBackground = R.hasPath(['style', 'backgroundColor']);

var renderBackground = function renderBackground(ctx, node) {
  R.when(shouldRenderBackground, R.compose(restore(ctx), drawBackground(ctx), clipNode$1(ctx), save(ctx)))(node);
  return node;
};

var renderBackground$1 = R.curryN(2, renderBackground);

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

var applySingleTransformation = function applySingleTransformation(ctx, transform, origin) {
  if (/rotate/g.test(transform)) {
    ctx.rotate(getRotation(transform), {
      origin: origin
    });
  } else if (/scaleX/g.test(transform)) {
    ctx.scale(getScaleX(transform), 1, {
      origin: origin
    });
  } else if (/scaleY/g.test(transform)) {
    ctx.scale(1, getScaleY(transform), {
      origin: origin
    });
  } else if (/scale/g.test(transform)) {
    ctx.scale(getScaleX(transform), getScaleY(transform), {
      origin: origin
    });
  } else if (/translateX/g.test(transform)) {
    ctx.translate(getTranslateX(transform), 1, {
      origin: origin
    });
  } else if (/translateY/g.test(transform)) {
    ctx.translate(1, getTranslateY(transform), {
      origin: origin
    });
  } else if (/translate/g.test(transform)) {
    ctx.translate(getTranslateX(transform), getTranslateY(transform), {
      origin: origin
    });
  } else if (/matrix/g.test(transform)) {
    ctx.transform.apply(ctx, getMatrix(transform));
  }
};

var applyTransformations = function applyTransformations(ctx, node) {
  if (!node.origin) return node;
  var match;
  var re = /[a-zA-Z]+\([^)]+\)/g;
  var origin = [node.origin.left, node.origin.top];
  var transform = node.style && node.style.transform || '';

  while ((match = re.exec(transform)) != null) {
    applySingleTransformation(ctx, match[0], origin);
  }

  return node;
};

var applyTransformations$1 = R.curryN(2, applyTransformations);

var isNotText$1 = R.complement(isText);

var renderNode = function renderNode(ctx) {
  return function (node) {
    var renderChildren = R.tap(R.compose(R.forEach(renderNode(ctx)), R.pathOr([], ['children'])));
    return R.compose(restore(ctx), renderDebug$1(ctx), R.when(isNotText$1, renderChildren), R.cond([[isText, renderText$1(ctx)], [isLink, renderLink$1(ctx)], [isNote, renderNote$1(ctx)], [isImage, renderImage$1(ctx)], [isCanvas, renderCanvas$1(ctx)], [R.T, R.identity]]), renderBorders$1(ctx), renderBackground$1(ctx), applyTransformations$1(ctx), save(ctx), R.when(isPage, renderPage$1(ctx)))(node);
  };
};

var renderDocument = function renderDocument(ctx) {
  return R.compose(R.forEach(R.compose(renderRulers$1(ctx), renderNode(ctx))), R.pathOr([], ['children']));
};

var renderRoot = function renderRoot(ctx) {
  return R.compose(R.forEach(renderDocument(ctx)), R.pathOr([], ['children']));
};

var render = function render(ctx, root) {
  addMetadata$1(ctx)(root);
  renderRoot(ctx)(root);
  ctx.end();
  Font$1.reset();
  return ctx;
};

var create = function create(styles) {
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
  flatten: flatten,
  absoluteFillObject: absoluteFillObject
};

var version = "1.6.0";

var View = VIEW;
var Text = TEXT;
var Link = LINK;
var Page = PAGE;
var Note = NOTE;
var Image = IMAGE;
var Document = DOCUMENT;
var Canvas = CANVAS;

var pdf = function pdf(input) {
  var _isDirty = true;
  var container = {
    type: 'ROOT',
    children: []
  };
  var PDFRenderer = createRenderer(markAsDirty);
  var mountNode = PDFRenderer.createContainer(container);
  if (input) updateContainer(input);

  function isDirty() {
    return _isDirty;
  }

  function markAsDirty() {
    _isDirty = true;
  }

  var render$1 =
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(
    /*#__PURE__*/
    _regeneratorRuntime.mark(function _callee() {
      var ctx, layout$1, instance;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              ctx = new PDFDocument__default({
                autoFirstPage: false
              }); // let layout;
              // for (let i = 0; i < 10; i++) {

              console.time('layout');
              _context.next = 4;
              return layout(container);

            case 4:
              layout$1 = _context.sent;
              console.timeEnd('layout'); // }

              instance = render(ctx, layout$1);
              _isDirty = false; // console.log(layout);

              return _context.abrupt("return", instance);

            case 9:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function render() {
      return _ref.apply(this, arguments);
    };
  }();

  var renderWithContext =
  /*#__PURE__*/
  function () {
    var _ref2 = _asyncToGenerator(
    /*#__PURE__*/
    _regeneratorRuntime.mark(function _callee2(ctx) {
      var layout$1, instance;
      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return layout(container);

            case 2:
              layout$1 = _context2.sent;
              instance = render(ctx, layout$1);
              _isDirty = false;
              return _context2.abrupt("return", instance);

            case 6:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function renderWithContext(_x) {
      return _ref2.apply(this, arguments);
    };
  }();

  var layout$1 =
  /*#__PURE__*/
  function () {
    var _ref3 = _asyncToGenerator(
    /*#__PURE__*/
    _regeneratorRuntime.mark(function _callee3() {
      return _regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              return _context3.abrupt("return", layout(container));

            case 1:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function layout() {
      return _ref3.apply(this, arguments);
    };
  }();

  function updateContainer(doc) {
    PDFRenderer.updateContainer(doc, mountNode, null);
  }

  function toBlob() {
    return _toBlob.apply(this, arguments);
  } // async function toBuffer() {
  //   await container.render();
  //   callOnRender();
  //   return container.instance;
  // }
  // function toString() {
  //   let result = '';
  //   container.render();
  //   return new Promise((resolve, reject) => {
  //     try {
  //       container.instance.on('data', function(buffer) {
  //         result += buffer;
  //       });
  //       container.instance.on('end', function() {
  //         callOnRender({ string: result });
  //         resolve(result);
  //       });
  //     } catch (error) {
  //       reject(error);
  //     }
  //   });
  // }


  function _toBlob() {
    _toBlob = _asyncToGenerator(
    /*#__PURE__*/
    _regeneratorRuntime.mark(function _callee4() {
      var instance, stream;
      return _regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return render$1();

            case 2:
              instance = _context4.sent;
              stream = instance.pipe(BlobStream());
              return _context4.abrupt("return", new Promise(function (resolve, reject) {
                stream.on('finish', function () {
                  try {
                    var blob = stream.toBlob('application/pdf');
                    resolve(blob);
                  } catch (error) {
                    reject(error);
                  }
                });
                stream.on('error', reject);
              }));

            case 5:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));
    return _toBlob.apply(this, arguments);
  }

  return {
    layout: layout$1,
    isDirty: isDirty,
    container: container,
    updateContainer: updateContainer,
    renderWithContext: renderWithContext,
    // toBuffer,
    toBlob: toBlob,
    toString: toString
  };
};

var svgpath = require('svgpath');

var queue = require('queue');

var canvasInstance = function canvasInstance(canvas) {
  var instance = {};
  var images = {};
  var ctx = canvas.getContext('2d');
  var fillColor = 'white';

  var nil = function nil() {
    return instance;
  };

  instance.info = {};
  instance.end = nil;
  instance.font = nil;

  instance.translate = function (x, y) {
    ctx.translate(x, y);
    return instance;
  };

  instance.addPage = function (_ref) {
    var size = _ref.size;
    canvas.width = size[0];
    canvas.height = size[1];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  instance.save = function () {
    ctx.save();
    return instance;
  };

  instance.restore = function () {
    ctx.restore();
    return instance;
  };

  instance.moveTo = function (x, y) {
    ctx.moveTo(x, y);
    return instance;
  };

  instance.lineTo = function (x, y) {
    ctx.lineTo(x, y);
    return instance;
  };

  instance.bezierCurveTo = function (a, b, c, d, e, f) {
    ctx.bezierCurveTo(a, b, c, d, e, f);
    return instance;
  };

  instance.closePath = function () {
    ctx.closePath();
    return instance;
  };

  instance.clip = function () {
    ctx.clip();
    return instance;
  };

  instance.fillColor = function (color) {
    fillColor = color;
    return instance;
  };

  instance.rect = function (a, b, c, d) {
    ctx.rect(a, b, c, d);
    return instance;
  };

  instance.fill = function () {
    ctx.fillStyle = fillColor;
    ctx.fill();
    return instance;
  };

  instance.fillOpacity = function (opacity) {
    ctx.globalAlpha = opacity;
    return instance;
  };

  instance._addGlyphs = function (glyphs, positions) {
    var xAdvance = 0;
    var fontSize = 20;
    var unitsPerEm = 2048;

    for (var i = 0; i < glyphs.length; i++) {
      var glyph = glyphs[i];
      var position = positions[i];
      var path = svgpath(glyph.path.toSVG()).scale(1, -1).scale(fontSize / unitsPerEm).translate(xAdvance, 0).toString();
      xAdvance += position.xAdvance;
      ctx.fillStyle = '#000';
      var p = new Path2D(path);
      ctx.stroke(p);
      ctx.fill(p);
    }

    return instance;
  };

  instance.image = function (data, x, y, _ref2) {
    var width = _ref2.width,
        height = _ref2.height;
    var base64Data = btoa(String.fromCharCode.apply(null, data));

    if (images[base64Data]) {
      ctx.drawImage(images[base64Data], x, y, width, height);
    } else {
      var img = document.createElement('img');
      img.src = 'data:image/png;base64,' + base64Data;
      images[base64Data] = img;

      img.onload = function () {
        ctx.drawImage(img, x, y, width, height);
      };
    }

    return instance;
  };

  instance.clear = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return instance;
};

var CanvasViewer =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(CanvasViewer, _React$Component);

  function CanvasViewer() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    _this.ctx = null;
    _this.instance = pdf();
    _this.renderQueue = queue({
      autostart: true,
      concurrency: 1
    });
    _this.state = {
      layout: null,
      error: null
    };

    _this.onRenderFailed = function (error) {
      _this.setState({
        error: error
      });

      console.error(error);
    };

    _this.onRenderSuccessful = function (layout) {
      _this.setState({
        layout: layout
      });
    };

    return _this;
  }

  var _proto = CanvasViewer.prototype;

  _proto.componentDidMount = function componentDidMount() {
    this.ctx = canvasInstance(this.canvas);
    this.queueDocumentRender(this.props.children);
    this.renderQueue.on('error', this.onRenderFailed);
    this.renderQueue.on('success', this.onRenderSuccessful);
  };

  _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
    if (prevProps.children !== this.props.children) {
      this.queueDocumentRender(this.props.children);
    }
  };

  _proto.queueDocumentRender = function queueDocumentRender(doc) {
    var _this2 = this;

    this.renderQueue.splice(0, this.renderQueue.length, function () {
      _this2.instance.updateContainer(doc);

      if (_this2.instance.isDirty() && !_this2.state.error) {
        return _this2.instance.renderWithContext(_this2.ctx);
      }

      return Promise.resolve();
    });
  };

  _proto.render = function render() {
    var _this3 = this;

    return React.createElement("canvas", {
      height: 900,
      id: "myCanvas",
      ref: function ref(_ref3) {
        return _this3.canvas = _ref3;
      },
      style: {
        border: '1px solid black'
      },
      width: 900
    });
  };

  return CanvasViewer;
}(React.Component);

var queue$1 = require('queue');

var flatStyles = function flatStyles(stylesArray) {
  return stylesArray.reduce(function (acc, style) {
    return _extends({}, acc, style);
  }, {});
};

var Document$1 = function Document$1(_ref) {
  var children = _ref.children,
      props = _objectWithoutPropertiesLoose(_ref, ["children"]);

  return React.createElement(Document, props, children);
};

var InternalBlobProvider =
/*#__PURE__*/
function (_React$PureComponent) {
  _inheritsLoose(InternalBlobProvider, _React$PureComponent);

  function InternalBlobProvider() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$PureComponent.call.apply(_React$PureComponent, [this].concat(args)) || this;
    _this.instance = pdf();
    _this.renderQueue = queue$1({
      autostart: true,
      concurrency: 1
    });
    _this.state = {
      blob: null,
      url: null,
      loading: true,
      error: null
    };

    _this.onRenderFailed = function (error) {
      _this.setState({
        error: error
      });

      console.error(error);
    };

    _this.onRenderSuccessful = function (blob) {
      var oldBlobUrl = _this.state.url;

      _this.setState({
        blob: blob,
        url: URL.createObjectURL(blob),
        loading: false
      }, function () {
        return URL.revokeObjectURL(oldBlobUrl);
      });
    };

    return _this;
  }

  var _proto = InternalBlobProvider.prototype;

  _proto.componentDidMount = function componentDidMount() {
    this.queueDocumentRender(this.props.document);
    this.renderQueue.on('error', this.onRenderFailed);
    this.renderQueue.on('success', this.onRenderSuccessful);
  };

  _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
    if (prevProps.document !== this.props.document) {
      this.queueDocumentRender(this.props.document);
    }
  };

  _proto.queueDocumentRender = function queueDocumentRender(doc) {
    var _this2 = this;

    this.renderQueue.splice(0, this.renderQueue.length, function () {
      _this2.instance.updateContainer(doc);

      if (_this2.instance.isDirty() && !_this2.state.error) {
        return _this2.instance.toBlob();
      }

      return Promise.resolve();
    });
  };

  _proto.render = function render() {
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

  return React.createElement(InternalBlobProvider, {
    document: doc
  }, children);
};
var PDFViewer = function PDFViewer(_ref3) {
  var className = _ref3.className,
      style = _ref3.style,
      children = _ref3.children,
      innerRef = _ref3.innerRef,
      props = _objectWithoutPropertiesLoose(_ref3, ["className", "style", "children", "innerRef"]);

  return React.createElement(InternalBlobProvider, {
    document: children
  }, function (_ref4) {
    var url = _ref4.url;
    return React.createElement("iframe", _extends({
      className: className,
      ref: innerRef,
      src: url,
      style: Array.isArray(style) ? flatStyles(style) : style
    }, props));
  });
};
var PDFDownloadLink = function PDFDownloadLink(_ref5) {
  var doc = _ref5.document,
      className = _ref5.className,
      style = _ref5.style,
      children = _ref5.children,
      _ref5$fileName = _ref5.fileName,
      fileName = _ref5$fileName === void 0 ? 'document.pdf' : _ref5$fileName;

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

  return React.createElement(InternalBlobProvider, {
    document: doc
  }, function (params) {
    return React.createElement("a", {
      className: className,
      download: fileName,
      href: params.url,
      onClick: downloadOnIE(params.blob),
      style: Array.isArray(style) ? flatStyles(style) : style
    }, typeof children === 'function' ? children(params) : children);
  });
};
var dom = {
  pdf: pdf,
  View: View,
  Text: Text,
  Link: Link,
  Page: Page,
  Font: Font$1,
  Note: Note,
  Image: Image,
  Canvas: Canvas,
  version: version,
  Document: Document$1,
  PDFViewer: PDFViewer,
  StyleSheet: StyleSheet,
  CanvasViewer: CanvasViewer,
  BlobProvider: BlobProvider,
  PDFDownloadLink: PDFDownloadLink
};

exports.Document = Document$1;
exports.BlobProvider = BlobProvider;
exports.PDFViewer = PDFViewer;
exports.PDFDownloadLink = PDFDownloadLink;
exports.default = dom;
exports.pdf = pdf;
exports.View = View;
exports.Text = Text;
exports.Link = Link;
exports.Page = Page;
exports.Font = Font$1;
exports.Note = Note;
exports.Image = Image;
exports.Canvas = Canvas;
exports.version = version;
exports.StyleSheet = StyleSheet;
exports.CanvasViewer = CanvasViewer;
//# sourceMappingURL=react-pdf.browser.cjs.js.map

import { pathOr, last, flatten } from 'ramda';

import Font from '../../font';
import StandardFont from './standardFont';

const fontCache = {};

const IGNORED_CODE_POINTS = [173];

const STANDARD_FONT_ALIASES = {
  'sans-serif': 'Helvetica',
  serif: 'Times-Roman',
  monospace: 'Courier',
};

const getFontSize = pathOr(12, ['attributes', 'fontSize']);

const getFallbackFont = () => {
  return getFontStack({ font: 'Helvetica' })[0];
};

const toFontNameStack = (...fontFamilyObjects) =>
  flatten(
    fontFamilyObjects.map(fontFamilies =>
      typeof fontFamilies === 'string'
        ? fontFamilies.split(',').map(f => f.trim())
        : Array.from(fontFamilies || []),
    ),
  ).reduce(
    (fonts, font) => (fonts.includes(font) ? fonts : [...fonts, font]),
    [],
  );

const getFontStack = ({ font, fontFamily, fontStyle, fontWeight }) =>
  toFontNameStack(font, fontFamily).map(fontFamilyName => {
    if (typeof fontFamilyName !== 'string') return fontFamilyName;

    const name =
      STANDARD_FONT_ALIASES[fontFamilyName] ||
      fontFamilyName + fontStyle ||
      '' + fontWeight ||
      '';

    if (fontCache[name]) return fontCache[name];

    fontCache[name] = Font.getFont({
      fontFamily: fontFamilyName,
      fontWeight,
      fontStyle,
    });

    if (!fontCache[name] || !fontCache[name].data) {
      fontCache[name] = new StandardFont(fontFamilyName);
    }

    return fontCache[name];
  });

const pickFontFromFontStack = (codePoint, fontStack) => {
  const fontStackWithFallbackFont = [...fontStack, getFallbackFont()];
  for (const font of fontStackWithFallbackFont) {
    if (
      !IGNORED_CODE_POINTS.includes(codePoint) &&
      font &&
      font.hasGlyphForCodePoint &&
      font.hasGlyphForCodePoint(codePoint)
    ) {
      return font;
    }
  }
  return null;
};

const fontSubstitution = () => ({ string, runs }) => {
  let lastFont = null;
  let lastIndex = 0;
  let index = 0;

  const res = [];

  for (const run of runs) {
    const fontSize = getFontSize(run);
    const fontStack = getFontStack(run.attributes);

    if (string.length === 0) {
      res.push({ start: 0, end: 0, attributes: { font: fontStack } });
      break;
    }

    for (const char of string.slice(run.start, run.end)) {
      const codePoint = char.codePointAt();
      const font = pickFontFromFontStack(codePoint, fontStack);

      // If the default font does not have a glyph and the fallback font does, we use it
      if (font && font !== lastFont) {
        if (lastFont) {
          res.push({
            start: lastIndex,
            end: index,
            attributes: {
              font: lastFont,
              scale: lastFont ? fontSize / lastFont.unitsPerEm : 0,
            },
          });
        }

        lastFont = font;
        lastIndex = index;
      }

      index += char.length;
    }
  }

  if (lastIndex < string.length) {
    const fontSize = getFontSize(last(runs));

    res.push({
      start: lastIndex,
      end: string.length,
      attributes: {
        font: lastFont,
        scale: lastFont ? fontSize / lastFont.unitsPerEm : 0,
      },
    });
  }

  return { string, runs: res };
};

export default fontSubstitution;

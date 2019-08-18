/** @jsx react.createElement */

const REACT_PDF_CSS_PROPERTIES = [
  // Flexbox

  'alignContent',
  'alignItems',
  'alignSelf',
  'flex',
  'flexDirection',
  'flexWrap',
  'flexFlow',
  'flexGrow',
  'flexShrink',
  'flexBasis',
  'justifyContent',
  'order',

  // Layout

  'bottom',
  'display',
  'left',
  'position',
  'right',
  'top',

  // Dimension

  'height',
  'maxHeight',
  'maxWidth',
  'minHeight',
  'minWidth',
  'width',

  // Color

  'backgroundColor',
  'color',
  'opacity',

  // Text

  'fontSize',
  'fontFamily',
  'fontStyle',
  'fontWeight',
  'letterSpacing',
  'lineHeight',
  'maxLines',
  'textAlign',
  'textDecoration',
  'textDecorationColor',
  'textDecorationStyle',
  'textIndent',
  'textOverflow',
  'textTransform',

  // Sizing/positioning,

  'objectFit',
  'objectPosition',
  'objectPositionX',
  'objectPositionY',

  // Margin/padding,

  'margin',
  'marginHorizontal',
  'marginVertical',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'padding',
  'paddingHorizontal',
  'paddingVertical',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',

  // Transformations

  'transform',
  'transformOrigin',
  'transformOriginX',
  'transformOriginY',

  // Borders

  'border',
  'borderTop',
  'borderTopColor',
  'borderTopStyle',
  'borderTopWidth',
  'borderRight',
  'borderRightColor',
  'borderRightStyle',
  'borderRightWidth',
  'borderBottom',
  'borderBottomColor',
  'borderBottomStyle',
  'borderBottomWidth',
  'borderLeft',
  'borderLeftColor',
  'borderLeftStyle',
  'borderLeftWidth',
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderBottomRightRadius',
  'borderBottomLeftRadius',
];

const domNodeToReactComponentTree = ({ node, ...options } = {}) => {
  const react = options.React || {
    createElement: (el, props, children) => [el, props, children],
  };
  const win = options.global || (typeof window !== 'undefined' ? window : {});
  if (!('Element' in win) || !('Text' in win)) {
    throw new TypeError(
      'Cannot find a global object implementing DOM interfaces',
    );
  }
  const blacklist = options.blacklist || [];

  const nodeComputedStyle =
    node instanceof win.Element ? win.getComputedStyle(node) : {};
  const Node = node.nodeName.toLowerCase();
  if (blacklist.includes(Node)) {
    return null;
  }
  const attrs = {
    ...Array.from(node.attributes || []).reduce(
      (allAttrs, attr) => ({
        ...allAttrs,
        [attr.name.replace(/^class$/u, 'className')]: attr.value,
      }),
      {},
    ),
    ...(nodeComputedStyle.length
      ? {
          style: REACT_PDF_CSS_PROPERTIES.reduce((computedStyles, propName) => {
            if (nodeComputedStyle[propName]) {
              computedStyles[propName] = nodeComputedStyle[propName];
            }
            return computedStyles;
          }, {}),
        }
      : {}),
  };
  const children = Array.from(node.childNodes || []).reduce(
    (nodes, childNode) => {
      if (!childNode) {
        return nodes;
      }
      if (childNode instanceof win.Text) {
        return [
          ...nodes,
          (childNode.innerText || childNode.textContent || '').replace(
            /[\s\n]+/gu,
            ' ',
          ),
        ];
      }
      return [
        ...nodes,
        domNodeToReactComponentTree({ node: childNode, ...options }),
      ];
    },
    [],
  );

  console.log(Node, { attrs, children });

  return <Node {...attrs}>{children}</Node>;
};

export default domNodeToReactComponentTree;

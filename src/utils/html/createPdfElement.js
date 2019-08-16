/* eslint-disable react/prop-types */

import React from 'react';
import { View } from '../../node';
import {
  BodyText,
  BodyTextBold,
  BodyTextItalic,
  BodyTextLink,
  DefinitionData,
  DefinitionList,
  DefinitionTerm,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  OrderedList,
  PaddedImage,
  Subscript,
  Superscript,
  UnorderedList,
  Table,
  TableData,
  TableHeader,
  TableHeading,
  TableRow,
  TableBody,
} from './styledComponents';

const BlockLevelWithChild = Child => ({ children, ...props }) => (
  <View>
    <Child {...props}>{children}</Child>
  </View>
);

const OrphanProtected = Component => ({ children, ...props }) => (
  <Component minPresenceAhead={24} {...props}>
    {children}
  </Component>
);

const jsxComponents = {
  a: BodyTextLink,
  b: BodyTextBold,
  div: View,
  dd: DefinitionData,
  dl: DefinitionList,
  dt: DefinitionTerm,
  em: BodyTextItalic,
  figure: View,
  h1: BlockLevelWithChild(OrphanProtected(Heading1)),
  h2: BlockLevelWithChild(OrphanProtected(Heading2)),
  h3: BlockLevelWithChild(OrphanProtected(Heading3)),
  h4: BlockLevelWithChild(OrphanProtected(Heading4)),
  h5: BlockLevelWithChild(OrphanProtected(Heading5)),
  h6: BlockLevelWithChild(OrphanProtected(Heading6)),
  i: BodyTextItalic,
  img: PaddedImage,
  li: BodyText,
  math: BlockLevelWithChild(BodyText),
  ol: OrderedList,
  p: BlockLevelWithChild(BodyText),
  section: View,
  span: BodyText,
  strong: BodyTextBold,
  sub: Subscript,
  sup: Superscript,
  table: Table,
  tbody: TableBody,
  td: TableData,
  thead: TableHeader,
  th: TableHeading,
  tr: TableRow,
  ul: UnorderedList,
};

const createPdfElement = (Component, ...args) =>
  jsxComponents[Component]
    ? React.createElement(jsxComponents[Component], ...args)
    : null;

export default createPdfElement;

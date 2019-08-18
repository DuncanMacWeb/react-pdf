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

export const Noop = () => null;

const jsxComponents = {
  a: BodyTextLink,
  b: BodyTextBold,
  button: BodyText,
  body: View,
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
  iframe: Noop,
  img: PaddedImage,
  label: BodyText,
  li: BodyText,
  main: View,
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
  u: BodyText,
  ul: UnorderedList,
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

const createPdfElement = (Component, props, ...children) => {
  const Renderable = jsxComponents[Component] || View;
  return (
    <ErrorBoundary>
      <Renderable {...props}>{children}</Renderable>
    </ErrorBoundary>
  );
};

export default createPdfElement;

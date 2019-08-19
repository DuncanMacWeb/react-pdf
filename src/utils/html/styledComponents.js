/* eslint-disable react/prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Link, Image } from '../../node';

export const cssColorWhite = { color: 'white' };
export const cssColorLinkOnDarkBackground = { color: '#00A1CE' };
export const cssColorLinkOnLightBackground = { color: '#0c7dbb' };
export const cssColorTextOnLightBackground = { color: '#2e2e2e' };

export const cssFontSansRegular = {
  // fontFamily: 'sans-serif',
};
export const cssFontSansBold = {
  // fontFamily: 'sans-serif',
  fontWeight: 'bold',
};
export const cssFontSansItalic = {
  // fontFamily: 'sans-serif',
  fontStyle: 'italic',
};
export const cssFontSansBoldItalic = {
  // fontFamily: 'sans-serif',
  fontWeight: 'bold',
  fontStyle: 'italic',
};
export const cssFontSerifRegular = {
  // fontFamily: 'sans-serif',
};
export const cssFontSerifBold = {
  // fontFamily: 'sans-serif',
  fontWeight: 'bold',
};
export const cssFontSerifItalic = {
  // fontFamily: 'sans-serif',
  fontStyle: 'italic',
};
export const cssFontSerifBoldItalic = {
  // fontFamily: 'sans-serif',
  fontWeight: 'bold',
  fontStyle: 'italic',
};

export const cssFontSizeBodyText = { fontSize: '12pt' };
export const cssFontSizeTableText = { fontSize: '10pt' };
export const cssFontSizeSuperSubscript = { fontSize: '8pt' };

export const cssBodyTextStyles = {
  ...cssFontSizeBodyText,
  lineHeight: '1.5',
  ...cssColorTextOnLightBackground,
};

export const cssBannerTitleText = {
  ...cssFontSansRegular,
  fontSize: '12pt',
  lineHeight: '1.5',
};

const directionToFlexDirection = (direction = 'row') => direction; // eslint-disable-line no-shadow
// eslint-disable-next-line
const alignToFlexAlignment = (align = 'flex-start') =>
  align === 'right' || align === 'bottom'
    ? 'flex-end'
    : align === 'left' || align === 'top'
    ? 'flex-start'
    : align;
// eslint-disable-next-line
const justifyToFlexAlignment = (justify = 'flex-start') =>
  justify === 'right' || justify === 'bottom'
    ? 'flex-end'
    : justify === 'left' || justify === 'top'
    ? 'flex-start'
    : justify;
export const FlexContainer = ({
  direction,
  align,
  justify,
  children,
  style,
  ...props
}) => (
  <View
    {...props}
    style={{
      display: 'flex',
      flexDirection: directionToFlexDirection(direction),
      alignItems: alignToFlexAlignment(align),
      justifyContent: justifyToFlexAlignment(justify),
      maxWidth: '100%',
      width: '100%',
      ...style,
    }}
  >
    {children}
  </View>
);
export const cssMarginMajorHeading = { margin: '18pt 0 12pt 0' };
export const cssMarginMinorHeading = { margin: '12pt 0 8pt 0' };

export const cssFontSizeHeading1 = { fontSize: '24pt' };
export const cssFontSizeHeading2 = { fontSize: '18pt' };
export const cssFontSizeHeading3 = { fontSize: '16pt' };
export const cssFontSizeHeading4 = { fontSize: '14pt' };
export const cssFontSizeHeading5 = { fontSize: '12pt' };
export const cssFontSizeHeading6 = { fontSize: '10pt' };
export const cssLineHeightHeading = { lineHeight: '1.5' };

export const BodyText = ({ children, style, ...props }) => (
  <Text
    {...props}
    style={{
      ...cssFontSansRegular,
      ...cssBodyTextStyles,
      ...style,
    }}
  >
    {children}
  </Text>
);

export const BodyTextItalic = ({ children, style, ...props }) => (
  <Text
    {...props}
    style={{
      ...cssFontSansItalic,
      ...cssBodyTextStyles,
      ...style,
    }}
  >
    {children}
  </Text>
);

export const BodyTextBold = ({ children, style, ...props }) => (
  <Text
    {...props}
    style={{
      ...cssFontSansBold,
      ...cssBodyTextStyles,
      ...style,
    }}
  >
    {children}
  </Text>
);

export const BodyTextLink = ({ children, style, ...props }) => (
  <Link
    {...props}
    style={{
      ...cssFontSansRegular,
      ...cssFontSizeBodyText,
      ...cssColorLinkOnLightBackground,
      ...style,
    }}
  >
    {children}
  </Link>
);

export const Heading1 = ({ children, style, ...props }) => (
  <Text
    {...props}
    style={{
      ...cssFontSansBold,
      ...cssFontSizeHeading1,
      ...cssLineHeightHeading,
      ...cssMarginMajorHeading,
      ...style,
    }}
  >
    {children}
  </Text>
);

export const Heading2 = ({ children, style, ...props }) => (
  <Text
    {...props}
    style={{
      ...cssFontSansBold,
      ...cssFontSizeHeading2,
      ...cssLineHeightHeading,
      ...cssMarginMajorHeading,
      ...style,
    }}
  >
    {children}
  </Text>
);

export const Heading3 = ({ children, style, ...props }) => (
  <Text
    {...props}
    style={{
      ...cssFontSansRegular,
      ...cssFontSizeHeading3,
      ...cssLineHeightHeading,
      ...cssMarginMinorHeading,
      ...style,
    }}
  >
    {children}
  </Text>
);

export const Heading4 = ({ children, style, ...props }) => (
  <Text
    {...props}
    style={{
      ...cssFontSansRegular,
      ...cssFontSizeHeading4,
      ...cssLineHeightHeading,
      ...cssMarginMinorHeading,
      ...style,
    }}
  >
    {children}
  </Text>
);

export const Heading4Link = ({ children, style, ...props }) => (
  <Link
    {...props}
    style={{
      ...cssFontSansRegular,
      ...cssFontSizeHeading4,
      ...cssLineHeightHeading,
      ...cssMarginMinorHeading,
      ...cssColorLinkOnLightBackground,
      textDecoration: 'none',
      textDecorationColor: 'white',
      ...style,
    }}
  >
    {children}
  </Link>
);

export const Heading5 = ({ children, style, ...props }) => (
  <Text
    {...props}
    style={{
      ...cssFontSansRegular,
      ...cssFontSizeHeading5,
      ...cssLineHeightHeading,
      ...cssMarginMinorHeading,
      ...style,
    }}
  >
    {children}
  </Text>
);

export const Heading6 = ({ children, style, ...props }) => (
  <Text
    {...props}
    style={{
      ...cssFontSansRegular,
      ...cssFontSizeHeading6,
      ...cssLineHeightHeading,
      ...cssMarginMinorHeading,
      textTransform: 'uppercase',
      ...style,
    }}
  >
    {children}
  </Text>
);

const ListContainer = ({ children, style, ...props }) => (
  <View
    {...props}
    style={{
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
    }}
  >
    {children}
  </View>
);

const StyledListCounter = ({ children, style, ...props }) => (
  <View
    {...props}
    style={{
      alignSelf: 'flex-start',
      width: '6%',
      ...style,
    }}
  >
    {children}
  </View>
);

const ListCounterText = ({ children, style, ...props }) => (
  <Text
    {...props}
    style={{
      ...cssFontSansRegular,
      ...cssBodyTextStyles,
      ...style,
    }}
  >
    {children}
  </Text>
);

export const PaddedImage = ({ children, style, ...props }) => (
  <Image
    {...props}
    style={{
      objectFit: 'contain',
      padding: '5pt',
      ...style,
    }}
  >
    {children}
  </Image>
);

const ListCounter = ({ children, ...props }) => (
  <StyledListCounter {...props}>
    <ListCounterText>{children}</ListCounterText>
  </StyledListCounter>
);

const StyledListItem = ({ children, style, ...props }) => (
  <View
    {...props}
    style={{
      width: '93%',
      ...style,
    }}
  >
    {children}
  </View>
);

const ListItemText = ({ children, style, ...props }) => (
  <Text
    {...props}
    style={{
      ...cssFontSansRegular,
      ...style,
    }}
  >
    {children}
  </Text>
);

const ListItem = ({ children, ...props }) => (
  <StyledListItem {...props}>
    <ListItemText>{children}</ListItemText>
  </StyledListItem>
);

export const listElement = counterFn => ({ children, ...props }) =>
  React.Children.map(children, (Child, i) => (
    <ListContainer>
      <ListCounter {...props}>{counterFn(i)}</ListCounter>
      <ListItem>{Child}</ListItem>
    </ListContainer>
  )) || null;

export const OrderedList = listElement(i => `${i + 1}. `);
export const UnorderedList = listElement(() => '• ');

export const DefinitionList = ({ children, ...props }) => (
  <ListContainer {...props}>{children}</ListContainer>
);

export const DefinitionData = ({ children, ...props }) => (
  <ListItem {...props}>{children}</ListItem>
);

export const DefinitionTerm = ({ children, ...props }) => (
  <ListCounter {...props}>{children}</ListCounter>
);

export const Superscript = ({ children, style, ...props }) => (
  <Text
    {...props}
    style={{
      ...cssFontSizeSuperSubscript,
      top: '0',
      ...style,
    }}
  >
    {children}
  </Text>
);

export const Subscript = ({ children, style, ...props }) => (
  <Text
    {...props}
    style={{
      ...cssFontSizeSuperSubscript,
      bottom: '-2',
      ...style,
    }}
  >
    {children}
  </Text>
);

const FullWidthView = FlexContainer;

export const Table = ({ children, style, ...props }) => (
  <View
    {...props}
    style={{
      margin: '12pt 0',
      ...style,
    }}
  >
    {children}
  </View>
);

export const TableHeader = View;

export const TableBody = View;

export const TableRow = ({ children }) => (
  <FullWidthView align="stretch">
    {React.Children.toArray(children).map((child, i, arr) => (
      <View
        style={{
          paddingBottom: '3pt',
          paddingTop: '3pt',
          paddingLeft: i ? '3pt' : 0,
          paddingRight: i + 1 === arr.length ? 0 : '3pt',
          width: `${Math.floor(100 / arr.length)}%`,
        }}
      >
        {child}
      </View>
    ))}
  </FullWidthView>
);
TableRow.propTypes = {
  children: PropTypes.node.isRequired,
};

export const TableData = ({ children, style, ...props }) => (
  <Text
    {...props}
    style={{
      ...cssFontSansRegular,
      ...cssFontSizeTableText,
      ...cssColorTextOnLightBackground,
      ...style,
    }}
  >
    {children}
  </Text>
);

export const TableHeading = ({ children, style, ...props }) => (
  <Text
    {...props}
    style={{
      ...cssFontSansBold,
      ...cssFontSizeTableText,
      ...cssColorTextOnLightBackground,
      width: '100%',
      ...style,
    }}
  >
    {children}
  </Text>
);

/* eslint-disable react/prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { View, Image } from '../../node';
import styled, { css } from '@react-pdf/styled-components';

export const cssColorDarkBackground = '#2e2e2e';
export const cssColorElsevierOrange = '#e9711c';
export const cssColorWhite = css`
  color: white;
`;
export const cssColorLinkOnDarkBackground = css`
  color: #00a1ce;
`;
export const cssColorLinkOnLightBackground = css`
  color: #0c7dbb;
`;
export const cssColorTextOnLightBackground = css`
  color: #2e2e2e;
`;

export const cssFontSansRegular = css`
  font-family: sans-serif;
`;
export const cssFontSansBold = css`
  font-family: sans-serif;
  font-weight: bold;
`;
export const cssFontSansItalic = css`
  font-family: sans-serif;
  font-style: italic;
`;
export const cssFontSansBoldItalic = css`
  font-family: sans-serif;
  font-weight: bold;
  font-style: italic;
`;
export const cssFontSerifRegular = css`
  font-family: sans-serif;
`;
export const cssFontSerifBold = css`
  font-family: sans-serif;
  font-weight: bold;
`;
export const cssFontSerifItalic = css`
  font-family: sans-serif;
  font-style: italic;
`;
export const cssFontSerifBoldItalic = css`
  font-family: sans-serif;
  font-weight: bold;
  font-style: italic;
`;

export const cssFontSizeBodyText = css`
  font-size: 12pt;
`;
export const cssFontSizeTableText = css`
  font-size: 10pt;
`;
export const cssFontSizeSuperSubscript = css`
  font-size: 8pt;
`;

export const cssSnippetsLeftMargin = '90pt';
export const cssSnippetsRightMargin = '100pt';
export const cssMarginBodyText = css`
  margin: 0 0 8pt 0;
`;

export const cssBodyTextStyles = css`
  ${cssFontSizeBodyText}
  line-height: 1.5;
  ${cssMarginBodyText}
  ${cssColorTextOnLightBackground}
`;

export const cssBannerTitleText = css`
  ${cssFontSansRegular}
  font-size: 12pt;
  line-height: 1.5;
`;

const direction = ({ direction = 'row' }) => direction; // eslint-disable-line no-shadow
// eslint-disable-next-line
const alignToFlexAlignment = ({ align = 'flex-start' }) =>
  align === 'right' || align === 'bottom'
    ? 'flex-end'
    : align === 'left' || align === 'top'
    ? 'flex-start'
    : align;
// eslint-disable-next-line
const justifyToFlexAlignment = ({ justify = 'flex-start' }) =>
  justify === 'right' || justify === 'bottom'
    ? 'flex-end'
    : justify === 'left' || justify === 'top'
    ? 'flex-start'
    : justify;
export const FlexContainer = styled.View`
  display: flex;
  flex-direction: ${direction};
  align-items: ${alignToFlexAlignment}
  justify-content: ${justifyToFlexAlignment};
  max-width: 100%;
  width: 100%;
`;
export const cssMarginMajorHeading = css`
  margin: 18pt 0 12pt 0;
`;
export const cssMarginMinorHeading = css`
  margin: 12pt 0 8pt 0;
`;

export const cssFontSizeHeading1 = css`
  font-size: 24pt;
`;
export const cssFontSizeHeading2 = css`
  font-size: 18pt;
`;
export const cssFontSizeHeading3 = css`
  font-size: 16pt;
`;
export const cssFontSizeHeading4 = css`
  font-size: 14pt;
`;
export const cssFontSizeHeading5 = css`
  font-size: 12pt;
`;
export const cssFontSizeHeading6 = css`
  font-size: 10pt;
`;
export const cssLineHeightHeading = css`
  line-height: 1.5;
`;

export const BodyText = styled.Text`
  ${cssFontSansRegular}
  ${cssBodyTextStyles}
`;

export const BodyTextItalic = styled.Text`
  ${cssFontSansItalic}
  ${cssBodyTextStyles}
`;

export const BodyTextBold = styled.Text`
  ${cssFontSansBold}
  ${cssBodyTextStyles}
`;

export const BodyTextLink = styled.Link`
  ${cssFontSansRegular}
  ${cssFontSizeBodyText}
  ${cssColorLinkOnLightBackground}
  text-decoration: none;
  text-decoration-color: white;
`;

export const Heading1 = styled.Text`
  ${cssFontSansBold}
  ${cssFontSizeHeading1}
  ${cssLineHeightHeading}
  ${cssMarginMajorHeading}
`;

export const Heading2 = styled.Text`
  ${cssFontSansBold}
  ${cssFontSizeHeading2}
  ${cssLineHeightHeading}
  ${cssMarginMajorHeading}
`;

export const Heading3 = styled.Text`
  ${cssFontSansRegular}
  ${cssFontSizeHeading3}
  ${cssLineHeightHeading}
  ${cssMarginMinorHeading}
`;

export const Heading4 = styled.Text`
  ${cssFontSansRegular}
  ${cssFontSizeHeading4}
  ${cssLineHeightHeading}
  ${cssMarginMinorHeading}
`;

export const Heading4Link = styled.Link`
  ${cssFontSansRegular}
  ${cssFontSizeHeading4}
  ${cssLineHeightHeading}
  ${cssMarginMinorHeading}
  ${cssColorLinkOnLightBackground}
  text-decoration: none;
  text-decoration-color: white;
`;

export const Heading5 = styled.Text`
  ${cssFontSansRegular}
  ${cssFontSizeHeading5}
  ${cssLineHeightHeading}
  ${cssMarginMinorHeading}
`;

export const Heading6 = styled.Text`
  ${cssFontSansRegular}
  ${cssFontSizeHeading6}
  ${cssLineHeightHeading}
  ${cssMarginMinorHeading}
  text-transform: uppercase;
`;

export const BookLink = styled.Link`
  ${cssFontSizeBodyText}
  ${cssColorLinkOnLightBackground}
  line-height: 1.5;
  ${cssMarginBodyText}
  text-decoration: none;
  text-decoration-color: white;
`;

const ListContainer = styled.View`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  ${cssMarginBodyText}
`;

const StyledListCounter = styled.View`
  align-self: flex-start;
  width: 6%;
`;

const ListCounterText = styled.Text`
  ${cssFontSansRegular}
  ${cssBodyTextStyles}
`;

export const PaddedImage = styled(Image)`
  object-fit: contain;
  padding: 5pt;
`;

const ListCounter = ({ children, ...props }) => (
  <StyledListCounter {...props}>
    <ListCounterText>{children}</ListCounterText>
  </StyledListCounter>
);

const StyledListItem = styled.View`
  width: 93%;
`;

const ListItemText = styled.Text`
  ${cssFontSansRegular}
`;

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

export const Superscript = styled.Text`
  ${cssFontSizeSuperSubscript}
  top: 0;
`;

export const Subscript = styled.Text`
  ${cssFontSizeSuperSubscript}
  bottom: -2;
`;

const BlueBox = styled.View``;
const NavigateButton = styled.View`
  background-color: #007398;
  height: 24pt;
  width: 24pt;
`;
export const NavigateRight = () => (
  <NavigateButton>
    <BlueBox>&gt;</BlueBox>
  </NavigateButton>
);
export const NavigateRightButton = ({ children }) => (
  <FlexContainer>
    <NavigateRight />
    <View>{children}</View>
  </FlexContainer>
);
NavigateRightButton.propTypes = {
  children: PropTypes.node.isRequired,
};

const FullWidthView = FlexContainer;

export const Table = styled.View`
  margin: 12pt 0;
`;

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

export const TableData = styled.Text`
  ${cssFontSansRegular}
  ${cssFontSizeTableText}
  ${cssColorTextOnLightBackground}
`;

export const TableHeading = styled.Text`
  ${cssFontSansBold}
  ${cssFontSizeTableText}
  ${cssColorTextOnLightBackground}
  width: 100%;
`;

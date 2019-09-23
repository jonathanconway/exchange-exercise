import baseStyled, { ThemedStyledInterface } from "styled-components";

const spacing = {
  xxsmall: .25,
  xsmall: .5,
  small: 1,
  medium: 2
};

const sizes = {
  iconXSmall: .7,
  header: 3.25,
  buttonSmall: 1.5
};

const typography = {
  sizes: {
    small: 1,
    medium: 1.2,
    large: 1.5,
    xlarge: 2.9
  }
};

const colors = {
  foreground: "#ffffff",

  body: {
    backgroundShade1: "#3c86f0",
    backgroundShade2: "#1457bc",
    backgroundShade3: "#1a6deb",
    backgroundShade4: "#1762d1",
    backgroundShade5: "#094096"
  },

  error: {
    background: "#FFAC12",
    foreground: "#000000"
  },
  info: {
    background: "#FFD312",
    foreground: "#000000"
  }
};

const borders = {
  radius: 1,
  sizes: {
    regular: 3
  }
};

const theme = {
  spacing,
  sizes,
  typography,
  colors,
  borders
};

export { theme };

export type Theme = typeof theme;

export const styled = baseStyled as ThemedStyledInterface<Theme>;
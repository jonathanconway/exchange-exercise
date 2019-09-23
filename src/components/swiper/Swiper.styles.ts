import { styled } from "../../theme";

export const Container = styled.div`
  position: relative;
  display: flex;
  overflow: hidden;
  justify-content: center;

  & > div {
    &:first-child {
      height: 100%;
    }
  }
`;

export const Indicator = styled.div`
  ${({ theme }) => `
    display: inline-block;
    position: absolute;
    width: auto;
    height: ${theme.sizes.buttonSmall}rem;
    bottom: ${theme.sizes.buttonSmall + theme.spacing.xsmall}rem;
    margin: auto;
  `}
`;

export const IndicatorNotch = styled.b<{ isActive: boolean }>`
  ${({ theme, isActive }) => `
    display: inline-block;
    height: ${theme.sizes.iconXSmall}rem;
    width: ${theme.sizes.iconXSmall}rem;
    border-radius: 100%;
    background-color: ${theme.colors.foreground};
    margin: ${theme.spacing.xsmall}rem;
    opacity: .5;

    ${isActive
      ? `opacity: 1;`
      : undefined}
  `}
`;


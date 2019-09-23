import { styled } from "../../../theme";
import { ArrowDropDown } from "@material-ui/icons";

import { HeaderButton } from "../Header.styles";

export const StyledSelectRatesButton = styled(HeaderButton)`
  ${({ theme }) => `
    position: relative;
    min-width: 10rem;
    padding: ${theme.spacing.xxsmall}rem ${theme.spacing.medium}rem ${theme.spacing.xxsmall}rem ${theme.spacing.xsmall + theme.spacing.xxsmall}rem;
    border: solid 1px ${theme.colors.body.backgroundShade1};
    background-color: ${theme.colors.body.backgroundShade4};

    > * {
      line-height: 2.2rem;
    }
  `}
`;

export const DropdownArrow = styled(ArrowDropDown)`
  ${({ theme }) => `
    &.MuiSvgIcon-root {
      position: absolute;
      right: ${theme.spacing.xxsmall}rem;
      top: 0;
      height: 100%;
    }
  `}
`;

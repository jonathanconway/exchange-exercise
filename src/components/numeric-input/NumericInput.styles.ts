import Cleave from "cleave.js/react";

import { styled } from "../../theme";

export const StyledCleave = styled(Cleave)`
  ${({ theme }) => `
    width: 100%;
    padding: 0;
    background-color: transparent;
    border: none;
    text-align: right;
    outline: none;
    font-size: ${theme.typography.sizes.xlarge}rem;
    color: ${theme.colors.foreground};
    caret-color: ${theme.colors.foreground};
  `}
`;
import { styled } from "../../../theme";

export const Container = styled.span`
  ${({ theme }) => `
    font-size: ${theme.typography.sizes.medium}rem;
    margin-top: ${theme.spacing.xsmall}rem;
    white-space: nowrap;
  `}
`;
import { styled } from "../../theme";

export const SymbolPart = styled.span`
  ${({ theme }) => `
    font-size: ${theme.typography.sizes.small}rem;
  `}
`;

export const NumberLeftPart = styled.span``;

export const NumberRightPart = styled.span`
  ${({ theme }) => `
    font-size: ${theme.typography.sizes.small}rem;
  `}
`;

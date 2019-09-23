import { styled } from "../../theme";

export const Container = styled.header`
  ${({ theme }) => `
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: ${theme.sizes.header}rem;
  `}
`;

export const HeaderButton = styled.button`
  ${({ theme }) => `
    border: none;
    background-color: transparent;
    color: ${theme.colors.foreground};
    font-size: ${theme.typography.sizes.medium}rem;
    height: 2.8rem;
    border-radius: .5rem;
    padding: 0.75rem;
    margin: 0.25rem;

    &:disabled {
      opacity: .5;
    }
  `}
`;

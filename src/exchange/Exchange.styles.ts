import { styled } from "../theme";

export const Container = styled.div`
  ${({ theme }) => `
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: ${theme.colors.body.backgroundShade3};
    color: ${theme.colors.foreground};
  `}
`;

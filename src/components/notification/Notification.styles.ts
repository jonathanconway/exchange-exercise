import { styled } from "../../theme";
import { NotificationType } from "../../App.types";

export const Container = styled.div<{ readonly type: NotificationType }>`
  ${({ theme, type }) => `
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    padding: ${theme.spacing.small}rem;
    margin: ${theme.spacing.medium}rem;
    border-radius: ${theme.borders.radius}rem;
    
    border: solid ${theme.borders.sizes.regular}px ${theme.colors[type].foreground};
    background-color: ${theme.colors[type].background};
    color: ${theme.colors[type].foreground};

    font-size: ${theme.typography.sizes.large}rem;
    z-index: 100;
  `}
`;

export const Title = styled.div<{ readonly type: NotificationType }>`
  ${({ theme, type }) => `
    border-bottom: solid ${theme.borders.sizes.regular}px ${theme.colors[type].foreground};
    color: ${theme.colors[type].foreground};
    padding-bottom: ${theme.spacing.small}rem;
    margin-bottom: ${theme.spacing.small}rem;
  `}
`;

export const Body = styled.div`
`;


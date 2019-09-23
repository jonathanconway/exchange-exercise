import { styled } from "../../theme";

export const Container = styled.div`
  flex: 1;
`;

const downArrowShapeHeight = 20;

export const StackContent = styled.div<{ readonly childrenLength: number }>`
  ${({ theme, childrenLength }) => `
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 60%; // Allow space for mobile native keyboard
    background-color: ${theme.colors.body.backgroundShade3};

    & > * {
      display: flex;
      flex: 1;
      
      // Shape the lower border of the panel to look like an arrow pointing down
      &:not(:last-of-type) {
        clip-path: polygon(${[`0% 0%`,
                              `100% 0%`,
                              `100% calc(100% - ${downArrowShapeHeight - 1}px)`,
                              `55% calc(100% - ${downArrowShapeHeight - 1}px)`,
                              `50% 100%`,
                              `45% calc(100% - ${downArrowShapeHeight - 1}px)`,
                              `0% calc(100% - ${downArrowShapeHeight - 1}px)`].join(",")});
      }
      
      // Offset the vertical gap created by the use of clip-path above.
      &:not(:first-of-type) {
        margin-top: -${downArrowShapeHeight - 1}px;
        padding-top: ${downArrowShapeHeight / 2}px;
      }

      ${Array(childrenLength).fill(0).map(i => `
        &:nth-child(${i + 1}) {
          z-index: ${childrenLength - i};
        }

        &:nth-child(1) {
          background-color: ${theme.colors.body.backgroundShade3};
        }
        
        &:nth-child(2) {
          background-color: ${theme.colors.body.backgroundShade2};
        }
      `).join("")}
    }
  `}
`;

export const MobileKeyboardSpacer = styled.b`
  ${({ theme }) => `
    display: flex;
    height: 40%;
    background-color: ${theme.colors.body.backgroundShade5};
  `}
`;
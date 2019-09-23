import { styled } from "../../theme";

export const SpinnerIcon = styled.span<{ readonly size: "small" | "large" }>`
  ${({ size }) => {
    const spinnerWidth = size === "small" ? 1.5 : 3,
          spinnerBorderWidth = size === "small" ? 0.25 : 0.5;
    
    return `
      position: absolute;
      margin-left: ${-(spinnerWidth / 2) - spinnerBorderWidth}rem;
      margin-top: ${-(spinnerWidth / 2) - spinnerBorderWidth}rem;
      left: 50%;
      top: 50%;
      padding: 0;
      width: ${spinnerWidth}rem;
      height: ${spinnerWidth}rem;
      animation: App-logo-spin infinite 1s linear;
      border-radius: 100%;
      font-weight: bold;
      border: solid ${spinnerBorderWidth}rem transparent;
      border-left: solid ${spinnerBorderWidth}rem white;

      @keyframes App-logo-spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    `;
  }}
`;

export const SpinnerContainer = styled.span`
  position: relative;
`;
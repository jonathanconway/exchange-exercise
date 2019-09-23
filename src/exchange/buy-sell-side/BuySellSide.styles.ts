import { styled } from "../../theme";

export const SwiperCard = styled.div`
  display: flex;
  flex-direction: row;
  color: white;
  padding: 1.5rem;
  box-sizing: border-box;
`;

export const SwiperCardText = styled.span`
  ${({ theme }) => `
    opacity: .5;
    margin-top: ${theme.spacing.xsmall}rem;
    position: relative;
    display: inline-block;
  `}
`;

const swiperCardColumn = `
  display: flex;
  flex-direction: column;
`;
  
export const SwiperCardLeft = styled.div`
  ${swiperCardColumn}
  width: 28%;
`;
  
export const SwiperCardRight = styled.div`
  ${({ theme }) => `
    ${swiperCardColumn}
    font-size: ${theme.typography.sizes.medium}rem;
    text-align: right;
  `}
`;

export const CurrencyCode = styled.span`
  ${({ theme }) => `
    font-size: ${theme.typography.sizes.xlarge}rem;
  `}
`;

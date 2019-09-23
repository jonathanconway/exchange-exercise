import React from "react";

import { Container, HeaderButton } from "./Header.styles";
import { BuySellCurrencyCodes } from "../Exchange.types";
import { SpinnerContainer } from "../../components/spinner/Spinner.styles";
import { SelectRatesButton } from "./select-rates-button/SelectRatesButton";
import { Spinner } from "../../components/spinner/Spinner";

interface HeaderProps {
  readonly currencies: Partial<BuySellCurrencyCodes>;
  readonly amount: { [side: string]: number | undefined };

  readonly isLoadingRates: boolean;

  readonly rate: (currencies: BuySellCurrencyCodes) => number;  
  readonly transferAmountBetweenPockets: (sellAmount: number, buyAmount: number, currencies: BuySellCurrencyCodes) => void;
}

/**
 * Header, containing Exchange-wide actions.
 */
export const Header = (props: HeaderProps) => {

  // Make the exchange if user requests it.
  const handleClickExchange = () => {
    if (props.amount.sell && props.amount.buy &&
        props.currencies.sell && props.currencies.buy)
    {
      props.transferAmountBetweenPockets(
        props.amount.sell,
        props.amount.buy,
        props.currencies as BuySellCurrencyCodes);
    }
  };

  return (
    <Container>
      <HeaderButton>Cancel</HeaderButton>

      <SpinnerContainer>
        <SelectRatesButton
          currencies={props.currencies}
          rate={((props.currencies.sell && props.currencies.buy)
                  ? props.rate(props.currencies as BuySellCurrencyCodes)
                  : undefined)}
        />
        {props.isLoadingRates && <Spinner size="small" />}
      </SpinnerContainer>

      <HeaderButton
        disabled={!props.amount.sell || !props.amount.buy || !props.currencies.sell || !props.currencies.buy}
        onClick={handleClickExchange}>
          Exchange
      </HeaderButton>
    </Container>
  );

};
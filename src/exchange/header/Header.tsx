import React, { useContext } from "react";

import { Container, HeaderButton } from "./Header.styles";
import { BuySellCurrencyCodes } from "../Exchange.types";
import { SpinnerContainer } from "../../components/spinner/Spinner.styles";
import { SelectRatesButton } from "./select-rates-button/SelectRatesButton";
import { Spinner } from "../../components/spinner/Spinner";
import { ExchangeContext } from "../Exchange.context";


/**
 * Header, containing Exchange-wide actions.
 */
export const Header = () => {

  const {
    currencies,
    amount,
    isLoadingRates,
    rates,
    transferAmountBetweenPockets,
  } = useContext(ExchangeContext);

  // Make the exchange if user requests it.
  const handleClickExchange = () => {
    if (amount.sell && amount.buy && currencies.sell && currencies.buy) {
      transferAmountBetweenPockets(
        amount.sell,
        amount.buy,
        currencies as BuySellCurrencyCodes);
    }
  };

  return (
    <Container>
      <HeaderButton>Cancel</HeaderButton>

      <SpinnerContainer>
        <SelectRatesButton
          currencies={currencies}
          rate={(currencies.sell && currencies.buy)
                  ? rates && rates[currencies.sell][currencies.buy].rate
                  : undefined}
        />
        {isLoadingRates && <Spinner size="small" />}
      </SpinnerContainer>

      <HeaderButton
        disabled={!amount.sell || !amount.buy || !currencies.sell || !currencies.buy}
        onClick={handleClickExchange}>
          Exchange
      </HeaderButton>
    </Container>
  );

};
import React from "react";

import { MoneyAmount } from "../../components/money-amount/MoneyAmount";
import { Container } from "./ExchangeRate.styles";
import { BuySellCurrencyCodes } from "../Exchange.types";

interface ExchangeRateProps {
  readonly currencies?: Partial<BuySellCurrencyCodes>;
  readonly rate?: number;
}

/**
 * Exchange rate between sell/buy currencies, where the sell side is 1.
 */
export const ExchangeRate = (props: ExchangeRateProps) => {
  return (
    (props.rate && props.currencies && props.currencies.sell && props.currencies.buy)
      ? <Container>
          <MoneyAmount amount={1} currencyCode={props.currencies.sell} />
          <span> = </span>
          <MoneyAmount amount={props.rate} currencyCode={props.currencies.buy} />
        </Container>
      : <></>
  );
};
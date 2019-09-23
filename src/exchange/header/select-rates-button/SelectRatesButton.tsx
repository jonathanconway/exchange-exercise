import React from "react";

import { StyledSelectRatesButton, DropdownArrow } from "./SelectRatesButton.styles";
import { ExchangeRate } from "../../exchange-rate/ExchangeRate";
import { BuySellCurrencyCodes } from "../../Exchange.types";

interface SelectRatesButtonProps {
  readonly currencies?: Partial<BuySellCurrencyCodes>;
  readonly rate?: number;
}

export const SelectRatesButton = (props: SelectRatesButtonProps) => (
  <StyledSelectRatesButton>
    <ExchangeRate
      currencies={props.currencies}
      rate={props.rate}
    />
    <DropdownArrow />
  </StyledSelectRatesButton>
);
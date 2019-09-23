import React, { useContext } from "react";

import { Container } from "./BuySellAmountInput.styles";
import { NumericInput } from "../../../components/numeric-input/NumericInput";
import { Side } from "../../Exchange.types";
import { ExchangeContext } from "../../Exchange.context";

interface BuySellAmountInputProps {
  readonly value?: number;
  readonly side: Side;
  
  readonly onChange: (value: number) => void;
}

const sideToPrefix = {
  "sell": "-",
  "buy": "+",
}

/**
 * An input into which the user can enter a sell or buy amount.
 */
export const BuySellAmountInput = ({
  value,
  side,
  onChange
}: BuySellAmountInputProps) => {
  const handleInput = (newValue: number) => {
    onChange(Math.abs(newValue));
  };

  const {
    rates,
    currencies
  } = useContext(ExchangeContext);

  if (!(side && currencies[side] && rates && currencies && currencies.buy && currencies.sell)) {
    return null;
  }

  const rate = rates[currencies[side as Side]!][currencies[side === "buy" ? "sell" : "buy"]!].rate;

  // Maximum the user can enter, such that it won't be converted to a value that
  // exceeds the maximum allowed value of 10,000.
  const max = (10000 / rate) - 1;

  return (
    <Container>
      <NumericInput
        maxValue={max}
        prefix={sideToPrefix[side]}
        onChange={handleInput}
        value={value || 0}
      />
    </Container>
  );
};
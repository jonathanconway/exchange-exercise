import React from "react";

import { Container } from "./BuySellAmountInput.styles";
import { NumericInput } from "../../../components/numeric-input/NumericInput";
import { Side } from "../../Exchange.types";

interface BuySellAmountInputProps {
  readonly value?: number;
  readonly side: Side;
  readonly autoFocus?: boolean;
  readonly onChange: (value: number) => void;
}

const sideToPrefix = {
  "sell": "-",
  "buy": "+",
}

/**
 * An input into which the user can enter a sell or buy amount.
 */
export const BuySellAmountInput = (props: BuySellAmountInputProps) => {
  const handleInput = (newValue: number) => {
    props.onChange(Math.abs(newValue));
  };

  return (
    <Container>
      <NumericInput
        prefix={sideToPrefix[props.side]}
        onChange={handleInput}
        value={props.value || 0}
      />
    </Container>
  );
};
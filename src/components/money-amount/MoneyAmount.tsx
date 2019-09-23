import React from "react";

import { SymbolPart, NumberLeftPart, NumberRightPart } from "./MoneyAmount.styles";
import { CurrencySymbol } from "../currency-symbol/CurrencySymbol";

interface MoneyAmountProps {
  readonly amount?: number;
  readonly currencyCode: string;
}

/**
 * Displays a monetary amount with currency symbol.
 */
export const MoneyAmount = (props: MoneyAmountProps) => {
  if (props.amount === undefined) {
    return null;
  }

  const amountAsString = props.amount.toString(),
        amountSplitByDot = amountAsString.split("."),
        amountIntegerPart = Number(amountSplitByDot[0]).toLocaleString(),
        amountFractionalPart = amountSplitByDot[1],
        amountFractionalLeftPart = (amountFractionalPart || "").slice(0, 2),
        amountFractionalRightPart = (amountFractionalPart || "").slice(2, 4),
        amountLeftPart = amountIntegerPart + (amountFractionalLeftPart ? "." + amountFractionalLeftPart : ""),
        amountRightPart = amountFractionalRightPart;

  return (
    <>
      <SymbolPart><CurrencySymbol currencyCode={props.currencyCode} /></SymbolPart>
      <NumberLeftPart>{amountLeftPart}</NumberLeftPart>
      <NumberRightPart>{amountRightPart}</NumberRightPart>
    </>
  );
};
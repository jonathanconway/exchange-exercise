import React from "react";

import { SymbolPart, NumberLeftPart, NumberRightPart } from "./MoneyAmount.styles";
import { CurrencySymbol } from "../currency-symbol/CurrencySymbol";

interface MoneyAmountProps {
  readonly amount?: number;
  readonly currencyCode: string;
}

/**
 * Split an amount into left and right parts.
 * 
 * Left part: integer part and two decimal places.
 * Right part: following two decimal places.
 * 
 * For example:
 *   Given: 12.3322
 *   Output:
 *     { leftPart: 12.33, rightPart: 22 }
 * 
 * @param amount Amount to split.
 */
const splitAmount = (amount: number) => {
  const amountAsString = amount.toString(),
        amountSplitByDot = amountAsString.split("."),
        amountIntegerPart = Number(amountSplitByDot[0]).toLocaleString(), // Remove any commas
        amountFractionalPart = amountSplitByDot[1],
        amountFractionalLeftPart = (amountFractionalPart || "").slice(0, 2),
        amountFractionalRightPart = (amountFractionalPart || "").slice(2, 4),
        amountLeftPart = amountIntegerPart + (amountFractionalLeftPart ? "." + amountFractionalLeftPart : ""),
        amountRightPart = amountFractionalRightPart;

  return {
    amountLeftPart,
    amountRightPart
  };
};

/**
 * Displays a monetary amount with currency symbol.
 */
export const MoneyAmount = ({ amount, currencyCode }: MoneyAmountProps) => {
  if (amount === undefined) {
    return null;
  }

  const { amountLeftPart, amountRightPart } = splitAmount(amount);

  return (
    <>
      <SymbolPart><CurrencySymbol currencyCode={currencyCode} /></SymbolPart>
      <NumberLeftPart>{amountLeftPart}</NumberLeftPart>
      <NumberRightPart>{amountRightPart}</NumberRightPart>
    </>
  );
};
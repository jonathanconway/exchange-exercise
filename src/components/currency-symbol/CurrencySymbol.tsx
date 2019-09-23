import React from "react";

import currencySymbols from "./currency-symbols.json";

interface CurrencySymbolMap {
  [currencyCode: string]: string;
}

interface CurrencySymbolProps {
  readonly currencyCode: string;
}

/**
 * Displays the symbol for a given currency.
 * For example, '£' for pounds (GBP).
 */
export const CurrencySymbol = ({ currencyCode }: CurrencySymbolProps) => <>
  {(currencySymbols as CurrencySymbolMap)[currencyCode]}
</>;
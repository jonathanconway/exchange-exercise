export type Side = "buy" | "sell";

export interface Rate {
  readonly rate: number;
}

export interface RateMap {
  [fromCurrencyCode: string]: {
    [toCurrencyCode: string]: Rate;
  }
}

export interface PocketMap {
  [currencyCode: string]: Pocket;
}

export interface Pocket {
  readonly amount: number;
}

export interface BuySellCurrencyCodes {
  readonly sell: string;
  readonly buy: string;
}

export interface BuySellAmounts {
  readonly sell: number;
  readonly buy: number;
}
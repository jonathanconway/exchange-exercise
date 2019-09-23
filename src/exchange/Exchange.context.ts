import React from "react";

import { Notification } from "../App.types";
import { Action } from "./Exchange.redux";
import { PocketMap, RateMap, BuySellCurrencyCodes, Side } from "./Exchange.types";

export interface ExchangeContextProps {
  readonly loadPockets: () => Promise<Action>;
  readonly pockets?: PocketMap;
  readonly isLoadingPockets: boolean;

  readonly loadRates: () => Promise<Action>;
  readonly rates?: RateMap;
  readonly isLoadingRates: boolean;

  readonly currencies: Partial<BuySellCurrencyCodes>;
  readonly setCurrency: (side: Side, currencyCode: string) => void;
    
  readonly amount: { [side: string]: number | undefined };
  readonly setAmount: (side: Side, amount: number) => void;

  readonly transferAmountBetweenPockets: (sellAmount: number, buyAmount: number, currencies: BuySellCurrencyCodes) => void;

  readonly notification?: Notification;
  readonly clearNotification: () => void;
}

export const emptyContext = {
  loadPockets: () => Promise.resolve({} as Action),
  isLoadingPockets: false,
  
  loadRates: () => Promise.resolve({} as Action),
  isLoadingRates: false,

  currencies: {},
  setCurrency: (side: Side, currencyCode: string) => {},

  amount: {},
  setAmount:(side: Side, amount: number) => {},

  transferAmountBetweenPockets: (sellAmount: number, buyAmount: number, currencies: BuySellCurrencyCodes) => {},

  clearNotification: () => {}
};

export const ExchangeContext = React.createContext<ExchangeContextProps>(emptyContext);

import { Dispatch } from "redux";

import { Side, RateMap, PocketMap, BuySellCurrencyCodes } from "./Exchange.types";
import http from "./Exchange.http";
import { Notification } from "../App.types";


export const notificationMessages = {
  transferAmountInsufficientBalance: "Unable to transfer amount - insufficient balance in the selling pocket.",
  transferAmountSucceeded:
    (amount: string, fromCurrencyCode: string, toCurrencyCode: string) =>
      `Exchanged amount of ${amount} from ${fromCurrencyCode} to ${toCurrencyCode} successfully.`,
};


// Action types

export const LOAD_RATES =                              "LOAD_RATES";
export const LOAD_RATES_SUCCESS =                      "LOAD_RATES_SUCCESS";
export const LOAD_RATES_FAILURE =                      "LOAD_RATES_FAILURE";

export const LOAD_POCKETS =                            "LOAD_POCKETS";
export const LOAD_POCKETS_SUCCESS =                    "LOAD_POCKETS_SUCCESS";
export const LOAD_POCKETS_FAILURE =                    "LOAD_POCKETS_FAILURE";

export const SET_CURRENCIES =                          "SET_CURRENCIES";
export const SET_AMOUNT =                              "SET_AMOUNT";

export const TRANSFER_AMOUNT_BETWEEN_POCKETS =         "TRANSFER_AMOUNT_BETWEEN_POCKETS";
export const TRANSFER_AMOUNT_BETWEEN_POCKETS_SUCCESS = "TRANSFER_AMOUNT_BETWEEN_POCKETS_SUCCESS";
export const TRANSFER_AMOUNT_BETWEEN_POCKETS_FAILURE = "TRANSFER_AMOUNT_BETWEEN_POCKETS_FAILURE";

export const CLEAR_NOTIFICATION =                      "CLEAR_NOTIFICATION";


// Actions


export interface LoadRatesAction {
  readonly type: typeof LOAD_RATES;
}

export interface LoadRatesSuccessAction {
  readonly type: typeof LOAD_RATES_SUCCESS;
  readonly rates: RateMap;
}

export interface LoadRatesFailureAction {
  readonly type: typeof LOAD_RATES_FAILURE;
  readonly errorMessage: string;
}


export interface LoadPocketsAction {
  readonly type: typeof LOAD_POCKETS;
}

export interface LoadPocketsSuccessAction {
  readonly type: typeof LOAD_POCKETS_SUCCESS;
  readonly pockets: PocketMap;
}

export interface LoadPocketsFailureAction {
  readonly type: typeof LOAD_POCKETS_FAILURE;
  readonly errorMessage: string;
}


export interface SetCurrenciesAction {
  readonly type: typeof SET_CURRENCIES;
  readonly side: Side;
  readonly currencyCode: string;
}

export interface SetAmountAction {
  readonly type: typeof SET_AMOUNT;
  readonly side: Side;
  readonly amount: number;
}


export interface TransferAmountBetweenPocketsAction {
  readonly type: typeof TRANSFER_AMOUNT_BETWEEN_POCKETS;
  readonly sellAmount: number;
  readonly buyAmount: number;
  readonly currencies: BuySellCurrencyCodes;
}

export interface TransferAmountBetweenPocketsSuccessAction {
  readonly type: typeof TRANSFER_AMOUNT_BETWEEN_POCKETS_SUCCESS;
  readonly pocketsNewAmounts: PocketMap;
  readonly infoMessage: string;
}

export interface TransferAmountBetweenPocketsFailureAction {
  readonly type: typeof TRANSFER_AMOUNT_BETWEEN_POCKETS_FAILURE;
  readonly errorMessage: string;
}


export interface ClearNotificationAction {
  readonly type: typeof CLEAR_NOTIFICATION;
}


// Action type

export type Action
  = LoadRatesAction
  | LoadRatesSuccessAction
  | LoadRatesFailureAction

  | LoadPocketsAction
  | LoadPocketsSuccessAction
  | LoadPocketsFailureAction

  | SetCurrenciesAction
  | SetAmountAction

  | TransferAmountBetweenPocketsAction
  | TransferAmountBetweenPocketsSuccessAction
  | TransferAmountBetweenPocketsFailureAction
  
  | ClearNotificationAction;


// State

export interface State {
  readonly rates?: RateMap;
  readonly isLoadingRates: boolean;

  readonly pockets?: PocketMap;
  readonly isLoadingPockets: boolean;

  readonly currencies: Partial<BuySellCurrencyCodes>;

  readonly amount: number;
  readonly amountSide: Side;

  readonly notification?: Notification;
}


// Default initial state

const initialState: State = {
  isLoadingRates: false,

  isLoadingPockets: false,

  currencies: {},
  amount: 0,

  amountSide: "sell",
};


// Helpers

/**
 * Takes a map between a base currency and other currencies and converts it to a
 * map between all of the currencies.
 * @param rateMap A map from a single base currency to a number of other currencies.
 * @return A map of rates between all the currencies, in at least one direction.
 */
const expandBaseRatesToPeerRates = (baseCurrencyCode: string, rateMap: RateMap): RateMap => {

  const newRateMap: RateMap = {};

  for (const fromCurrencyCode in rateMap[baseCurrencyCode]) {
    for (const toCurrencyCode in rateMap[baseCurrencyCode]) {

      // No need to convert a currency against itself.
      if (fromCurrencyCode === toCurrencyCode) {
        continue;
      }

      // If we've already converted these two currencies in at least one
      // direction, skip.
      if ((newRateMap[fromCurrencyCode] && newRateMap[fromCurrencyCode][toCurrencyCode]) ||
          (newRateMap[toCurrencyCode] && newRateMap[toCurrencyCode][fromCurrencyCode])) {
        continue;
      }

      // If the source rateMap already includes a rate for these two currencies
      // in at least one direction, simply use that rate.
      if (rateMap[fromCurrencyCode] && rateMap[fromCurrencyCode][toCurrencyCode]) {
        newRateMap[fromCurrencyCode] = {
          ...(newRateMap[fromCurrencyCode] || {}),
          [toCurrencyCode]: rateMap[fromCurrencyCode][toCurrencyCode]
        };
        continue;
      }

      if (rateMap[toCurrencyCode] && rateMap[toCurrencyCode][fromCurrencyCode]) {
        newRateMap[toCurrencyCode] = {
          ...(newRateMap[toCurrencyCode] || {}),
          [fromCurrencyCode]: rateMap[toCurrencyCode][fromCurrencyCode]
        };
        continue;
      }

      // Calculate in one direction by multiplying on the base currency.
      const baseToFromCurrencyRate = rateMap[baseCurrencyCode][fromCurrencyCode],
            baseToToCurrencyRate = rateMap[baseCurrencyCode][toCurrencyCode];


      if (!baseToFromCurrencyRate || !baseToToCurrencyRate) {
        // If rate could not be found, then we just skip the conversion.
        continue;
      }
      const rate = baseToFromCurrencyRate.rate / baseToToCurrencyRate.rate;
      newRateMap[fromCurrencyCode] = {
        ...(newRateMap[fromCurrencyCode] || {}),
        [toCurrencyCode]: {
          rate
        }
      };
    }
  }

  return newRateMap;

};


// Action creators

export const loadRates = () =>
  async (dispatch: Dispatch<Action>): Promise<Action> => {
    dispatch({ type: LOAD_RATES });

    try {
      const ratesData = await http.getRates();

      const ratesAsMap = Object
        .entries(ratesData.rates)
        .reduce((map: RateMap, [toCurrencyCode, rate]) => ({
          ...map,
          [ratesData.base]: {
            ...(map[ratesData.base] || {}),
            [toCurrencyCode]: { rate }
          }
        }), {});

      const expandedRates = expandBaseRatesToPeerRates(ratesData.base, ratesAsMap);
  
      return dispatch(loadRatesSuccess(expandedRates) as Action);
    }
    catch (error) {
      return dispatch(loadRatesFailure(error.message) as Action);
    }
  };

export const loadRatesSuccess = (rates: RateMap): LoadRatesSuccessAction =>
  ({ type: LOAD_RATES_SUCCESS, rates });

export const loadRatesFailure = (errorMessage: string): LoadRatesFailureAction =>
  ({ type: LOAD_RATES_FAILURE, errorMessage });


export const loadPockets = () =>
  async (dispatch: Dispatch<Action>): Promise<LoadPocketsSuccessAction | LoadPocketsFailureAction> => {
    dispatch({ type: LOAD_POCKETS });

    try {
      const accountInfo = await http.getPockets();

      return dispatch(loadPocketsSuccess(accountInfo));
    }
    catch (error) {
      return dispatch(loadPocketsFailure(error.message));
    }
  };

export const loadPocketsSuccess = (pockets: PocketMap): LoadPocketsSuccessAction =>
  ({ type: LOAD_POCKETS_SUCCESS, pockets });

export const loadPocketsFailure = (errorMessage: string): LoadPocketsFailureAction =>
  ({ type: LOAD_POCKETS_FAILURE, errorMessage });


export const setCurrency = (side: Side, currencyCode: string): SetCurrenciesAction =>
  ({ type: SET_CURRENCIES, side, currencyCode });

export const setAmount = (side: Side, amount: number): SetAmountAction =>
  ({ type: SET_AMOUNT, side, amount });


export const transferAmountBetweenPockets = (sellAmount: number, buyAmount: number, currencies: BuySellCurrencyCodes, ) =>
  async (dispatch: Dispatch<Action>, getState: () => State):
      Promise<TransferAmountBetweenPocketsAction |
              TransferAmountBetweenPocketsSuccessAction |
              TransferAmountBetweenPocketsFailureAction> => {
    const state = getState();

    dispatch({
      type: TRANSFER_AMOUNT_BETWEEN_POCKETS,
      sellAmount,
      buyAmount,
      currencies
    });

    if (!state.pockets) {
      throw Error("Exception on to transferring amount - can't find any pockets to transfer between.");
    }

    const sellPocketBalance = state.pockets[currencies.sell].amount;
    const buyPocketBalance = state.pockets[currencies.buy].amount;

    // Ensure balance is sufficient.
    if (sellPocketBalance < sellAmount) {
      return dispatch(transferAmountBetweenPocketsFailure(notificationMessages.transferAmountInsufficientBalance));
    }

    return dispatch(transferAmountBetweenPocketsSuccess(
      {
        [currencies.sell]: { amount: sellPocketBalance - sellAmount },
        [currencies.buy]: { amount:  buyPocketBalance + buyAmount },
      },
      notificationMessages
        .transferAmountSucceeded(
          sellAmount.toString(),
          currencies.sell,
          currencies.buy)));
  };

export const transferAmountBetweenPocketsSuccess = (pocketsNewAmounts: PocketMap, infoMessage: string): TransferAmountBetweenPocketsSuccessAction =>
  ({ type: TRANSFER_AMOUNT_BETWEEN_POCKETS_SUCCESS, pocketsNewAmounts, infoMessage });

export const transferAmountBetweenPocketsFailure = (errorMessage: string): TransferAmountBetweenPocketsFailureAction =>
  ({ type: TRANSFER_AMOUNT_BETWEEN_POCKETS_FAILURE, errorMessage });


export const clearNotification = (): ClearNotificationAction =>
  ({ type: CLEAR_NOTIFICATION });


// Reducer

export const reducer = (state: State = initialState, action: Action): State => {

  switch (action.type) {

    case LOAD_RATES:
      return {
        ...state,
        isLoadingRates: true
      };

    case LOAD_RATES_SUCCESS:
      return {
        ...state,
        isLoadingRates: false,
        rates: action.rates
      };
  
    case LOAD_RATES_FAILURE:
      return {
        ...state,
        isLoadingRates: false,
        notification: {
          type: "error",
          message: action.errorMessage
        }
      };


    case LOAD_POCKETS:
      return {
        ...state,
        isLoadingPockets: true
      };

    case LOAD_POCKETS_SUCCESS:
      const pocketKeys = Object.keys(action.pockets);

      return {
        ...state,
        isLoadingPockets: false,
        pockets: action.pockets,
        currencies: {
          sell: pocketKeys.length >= 2 ? pocketKeys[0] : undefined,
          buy: pocketKeys.length >= 2 ? pocketKeys[1] : undefined,
        }
      };
  
    case LOAD_POCKETS_FAILURE:
      return {
        ...state,
        isLoadingPockets: false,
        notification: {
          type: "error",
          message: action.errorMessage
        }
      };
      

    case SET_CURRENCIES:
      return {
        ...state,
        currencies: {
          ...state.currencies,
          [action.side]: action.currencyCode
        }
      };

    case SET_AMOUNT:
      return {
        ...state,
        amount: action.amount,
        amountSide: action.side
      }

    case TRANSFER_AMOUNT_BETWEEN_POCKETS:
      if (!state.pockets) {
        return state;
      }

      return {
        ...state,
        isLoadingPockets: true
      };
    
    case TRANSFER_AMOUNT_BETWEEN_POCKETS_SUCCESS:
      return {
        ...state,
        pockets: {
          ...state.pockets,
          ...action.pocketsNewAmounts
        },
        notification: {
          type: "info",
          message: action.infoMessage
        },
        isLoadingPockets: false,
        amount: 0
      };

    case TRANSFER_AMOUNT_BETWEEN_POCKETS_FAILURE:
      return {
        ...state,
        isLoadingPockets: false,
        notification: {
          type: "error",
          message: action.errorMessage
        }
      };

      
    case CLEAR_NOTIFICATION:
      return {
        ...state,
        notification: undefined
      };
  }

  return state;

};


// Selectors

export const selectRate = (state: State) =>
  (currencies: BuySellCurrencyCodes): number => {

    // No rate lookup is necessary if currencies are equivalent
    if (currencies.sell === currencies.buy) {
      return 1;
    }

    // Try to find a matching rate
    const matchingRate = state.rates && state.rates[currencies.sell] && state.rates[currencies.sell][currencies.buy];
    if (matchingRate) {
      return matchingRate.rate;
    }

    // Try to find a reverse matching rate
    const reverseMatchingRate = state.rates && state.rates[currencies.buy] && state.rates[currencies.buy][currencies.sell];
    if (reverseMatchingRate) {
      return 1 / reverseMatchingRate.rate;
    }

    // Cannot find a rate in either direction
    return 0;

  };

export const selectConvertAmountToCurrency = (state: State) =>
  (amount: number, fromCurrencyCode: string, toCurrencyCode: string): number | undefined => {
    // No conversion is necessary if currencies are equivalent
    if (fromCurrencyCode === toCurrencyCode) {
      return amount;
    }

    // Try to find a matching rate
    const matchingRate = state.rates && state.rates[fromCurrencyCode] && state.rates[fromCurrencyCode][toCurrencyCode];
    if (matchingRate) {
      return amount * matchingRate.rate;
    }

    // Try to find a reverse matching rate
    const reverseMatchingRate = state.rates && state.rates[toCurrencyCode] && state.rates[toCurrencyCode][fromCurrencyCode];
    if (reverseMatchingRate) {
      return amount / reverseMatchingRate.rate;
    }

    // Cannot find a rate in either direction
    return undefined;
  };

export const selectAmount = (state: State) => ({
    sell:
      (state.amountSide === "sell")
        ? state.amount
        : state.currencies.buy && state.currencies.sell && state.amount
          ? selectConvertAmountToCurrency(state)(state.amount, state.currencies.buy, state.currencies.sell)
          : undefined,
    buy:
      (state.amountSide === "buy")
        ? state.amount
        : state.currencies.buy && state.currencies.sell && state.amount
          ? selectConvertAmountToCurrency(state)(state.amount, state.currencies.sell, state.currencies.buy)
          : undefined
  });
import React from "react";
import axios from "axios";
import { mount } from "enzyme";
import { act } from "react-dom/test-utils";

import { Notification as NotificationType } from "../App.types";
import { Side } from "./Exchange.types";
import http from "./Exchange.http";
import { Exchange, RELOAD_RATES_INTERVAL, ExchangeComponent } from "./Exchange";
import { LOAD_RATES, LOAD_RATES_SUCCESS, LOAD_RATES_FAILURE, LOAD_POCKETS, LOAD_POCKETS_SUCCESS, LOAD_POCKETS_FAILURE,
  SET_CURRENCIES, SET_AMOUNT, TRANSFER_AMOUNT_BETWEEN_POCKETS, TRANSFER_AMOUNT_BETWEEN_POCKETS_FAILURE, CLEAR_NOTIFICATION,
  reducer, loadRates, setAmount, setCurrency, transferAmountBetweenPockets, State, notificationMessages,
  selectAmount, selectConvertAmountToCurrency, TRANSFER_AMOUNT_BETWEEN_POCKETS_SUCCESS, Action } from "./Exchange.redux";
import { withMockStore, withTheme } from "../testUtils";
import { Notification } from "../components/notification/Notification";
import { Spinner } from "../components/spinner/Spinner";
import { Header } from "./header/Header";
import { BuySellSide } from "./buy-sell-side/BuySellSide";
import { emptyContext } from "./Exchange.context";

describe("<Exchange />", () => {
  const testData = {
    exchangeInitialProps: {
      ...emptyContext,
      rates: {
        EUR: {
          EUR: { rate: 1 },
          GBP: { rate: 2 },
          USD: { rate: 0.25 }
        },
        GBP: {
          EUR: { rate: 0.5 },
          GBP: { rate: 1 },
          USD: { rate: 0.5 }
        },
        USD: {
          EUR: { rate: 4 },
          GBP: { rate: 2 },
          USD: { rate: 1 }
        }
      }
    }
  };
    
  it("renders as connected component", () => {
    mount(
      withMockStore(
        reducer,
        withTheme(
          <Exchange />)));
  });

  it("renders", () => {
    mount(
      withTheme(
        <ExchangeComponent
          {...testData.exchangeInitialProps}
        />));
  });

  describe("loading", () => {
    describe("rendering", () => {
      it("shows screen-wide spinner only while loading pockets", () => {
        const wrapper =
          mount(
            withTheme(
              <ExchangeComponent
                {...testData.exchangeInitialProps}
                isLoadingPockets={true}
              />));

        expect(wrapper.find(Spinner).exists()).toBeTruthy();
      });
    });

    describe("behaviour", () => {
      const mockHandleLoadRates = jest.fn(),
            mockHandleLoadPockets = jest.fn();

      // Wrap mount call in act so that useEffect will execute.
      act(() => {
        mount(
          withTheme(
            <ExchangeComponent
              {...testData.exchangeInitialProps}
              loadRates={mockHandleLoadRates}
              loadPockets={mockHandleLoadPockets}
            />));
      });
    
      it("loads rates and pockets on first render", () => {
        expect(mockHandleLoadRates).toHaveBeenCalled();
        expect(mockHandleLoadPockets).toHaveBeenCalled();
      });

      it("reloads rates every interval", (done) => {
        jest.setTimeout(RELOAD_RATES_INTERVAL * 1.2);

        mockHandleLoadRates.mockClear();

        setTimeout(() => {
          expect(mockHandleLoadRates).toHaveBeenCalled();
          
          done();
        }, RELOAD_RATES_INTERVAL * 1.1);
      });
    });
  });

  describe("Header", () => {
    const mockTransferAmountBetweenPockets = jest.fn(),
          wrapper =
            mount(
              withTheme(
                <ExchangeComponent
                  {...testData.exchangeInitialProps}
                  transferAmountBetweenPockets={mockTransferAmountBetweenPockets}
                />));

    it("renders", () => {
      expect(wrapper.find(Header).exists()).toBeTruthy();
    });
  });

  describe("sides", () => {
    describe("non-effect code", () => {
      const mockSetCurrency = jest.fn(),
            mockSetAmount = jest.fn(),
            mockTransferAmountBetweenPockets = jest.fn(),

            props = {
              ...testData.exchangeInitialProps,
              pockets: {
                GBP: { amount: 100 },
                EUR: { amount: 200 },
                USD: { amount: 300 }
              },
              currencies: { sell: "GBP", buy: "EUR" },
              amount: { sell: 100, buy: 200 },
              setCurrency: mockSetCurrency,
              setAmount: mockSetAmount,
              transferAmountBetweenPockets: mockTransferAmountBetweenPockets,
            },
            wrapper =
              mount(
                withTheme(
                  <ExchangeComponent
                    {...props}
                  />));
      
      (["buy", "sell"] as Side[]).forEach((side) => {
        const buySellSide = wrapper.find(BuySellSide).filterWhere(x => x.props().side === side);

        it(`renders ${side} side`, () => {
          expect(buySellSide.exists()).toBeTruthy();
        });
      });
    });

    describe("effect code", () => {
      const mockSetCurrency = jest.fn(),
            mockSetAmount = jest.fn(),
            mockTransferAmountBetweenPockets = jest.fn(),

            props = {
              pockets: {
                GBP: { amount: 100 },
                EUR: { amount: 200 },
                USD: { amount: 300 }
              },
              currencies: { sell: "GBP", buy: "GBP" },
              amount: { sell: 100, buy: 200 },

              setCurrency: mockSetCurrency,
              setAmount: mockSetAmount,
              transferAmountBetweenPockets: mockTransferAmountBetweenPockets,
            };

      // Wrap mount call in act so that useEffect will execute.
      act(() => {
        mount(
          withTheme(
            <ExchangeComponent
              {...testData.exchangeInitialProps}
              {...props}
            />));
      });

      it("switches buy currency if both are the same", (done) => {
        setTimeout(() => {
          expect(mockSetCurrency).toHaveBeenCalledWith("buy", "EUR");
          done();
        }, 1000);
      });
    });
  });

  describe("notifications", () => {
    const fakeNotification: NotificationType = { type: "error", message: "Error" };

    describe("rendering", () => {
      it("has notification when notification prop is set", () => {
        const wrapper =
                mount(
                  withTheme(
                    <ExchangeComponent
                      {...testData.exchangeInitialProps}
                      notification={fakeNotification}
                    />));

        const notificationNode = wrapper.find(Notification);
        expect(notificationNode.exists()).toBeTruthy();
        expect(notificationNode.props().notification).toEqual(expect.objectContaining(fakeNotification));
      });

      it("doesn't have notification when notification prop is not set", () => {
        const wrapper =
                mount(
                  withTheme(
                    <ExchangeComponent
                      {...testData.exchangeInitialProps}
                    />));

        const notificationNode = wrapper.find(Notification);
        expect(notificationNode.exists()).toBeFalsy();
      });
    });

    describe("behaviour", () => {
      const mockClearNotification = jest.fn(),
            wrapper =
              mount(
                withTheme(
                  <ExchangeComponent
                    {...testData.exchangeInitialProps}
                    notification={fakeNotification}
                    clearNotification={mockClearNotification}
                  />));

      it("hides notification on click", () => {
        wrapper.find(Notification).props().onClick();
        expect(mockClearNotification).toHaveBeenCalled();
      });

      it("hides notification on timeout", () => {
        mockClearNotification.mockClear();

        wrapper.find(Notification).props().onTimeout();

        expect(mockClearNotification).toHaveBeenCalled();
      });
    });
  });
});


describe("Exchange.http", () => {
  describe("getRates", () => {
    it("returns all rates", async () => {
      jest.spyOn(axios, "get")
          .mockImplementationOnce(async () => ({
            "data": {
              "timestamp": 1568606400,
              "base": "USD",
              "rates": {
                "GBP": 2,
                "USD": 1,
                "EUR": 4,
                "CZK": 23.35359,
                "DJF": 178,
                "DKK": 6.745595,
                "DOP": 51.168724,
                "DZD": 119.920726
              }
            }
          }));
      
      const result = await http.getRates();

      expect(result).toEqual(expect.objectContaining({
        "base": "USD",
        "rates": {
          "GBP": 2,
          "USD": 1,
          "EUR": 4,
          "CZK": 23.35359,
          "DJF": 178,
          "DKK": 6.745595,
          "DOP": 51.168724,
          "DZD": 119.920726
        }
      }));
    });
  });
});


describe("Exchange.redux", () => {
  const testData = {
    initialState: {
      isLoadingRates: false,
      isLoadingPockets: false,
      currencies: {},
      amount: 0,
      amountSide: "sell"
    } as State
  };

  describe("action creators", () => {
    describe("loadRates", () => {
      describe("when request succeeds", () => {
        it("creates LOAD_RATES, then creates LOAD_RATES_SUCCESS with the rates, expanded from the base", async () => {
          jest.spyOn(http, "getRates")
              .mockImplementationOnce(async () => ({
                "timestamp": 1568606400,
                "base": "USD",
                "rates": {
                  "GBP": 2,
                  "USD": 1,
                  "EUR": 4,
                  "CZK": 23.35359,
                  "DJF": 178,
                  "DKK": 6.745595,
                  "DOP": 51.168724,
                  "DZD": 119.920726
                }
              }));

          const mockDispatch = jest.fn();

          await loadRates()(mockDispatch);

          expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
            type: LOAD_RATES
          }));

          expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
            type: LOAD_RATES_SUCCESS,
            rates: {
              "CZK": {
                "CZK": { "rate": 1 },
                "DJF": { "rate": 0.13119994382022473 },
                "DKK": { "rate": 3.462050419570105 },
                "DOP": { "rate": 0.4564036031072419 },
                "DZD": { "rate": 0.19474189974466966 },
                "EUR": { "rate": 5.8383975 },
                "GBP": { "rate": 11.676795 },
                "USD": { "rate": 0.04281996900690643 }
              },
              "DJF": {
                "CZK": { "rate": 7.621954483229344 },
                "DJF": { "rate": 1 },
                "DKK": { "rate": 26.387590716608393 },
                "DOP": { "rate": 3.4786874888652686 },
                "DZD": { "rate": 1.4843138958314845 },
                "EUR": { "rate": 44.5 },
                "GBP": { "rate": 89 },
                "USD": { "rate": 0.0056179775280898875 }
              },
              "DKK": {
                "CZK": { "rate": 0.28884616883314296 },
                "DJF": { "rate": 0.037896601123595504 },
                "DKK": { "rate": 1 },
                "DOP": { "rate": 0.13183043219916918 },
                "DZD": { "rate": 0.05625045165253586 },
                "EUR": { "rate": 1.68639875 },
                "GBP": { "rate": 3.3727975 },
                "USD": { "rate": 0.1482448916663393 }
              },
              "DOP": {
                "CZK": { "rate": 2.191043175802949 },
                "DJF": { "rate": 0.2874647415730337 },
                "DKK": { "rate": 7.585501946084815 },
                "DOP": { "rate": 1 },
                "DZD": { "rate": 0.42668791047846055 },
                "EUR": { "rate": 12.792181 },
                "GBP": { "rate": 25.584362 },
                "USD": { "rate": 0.01954318813969252 }
              },
              "DZD": {
                "CZK": { "rate": 5.135001770605719 },
                "DJF": { "rate": 0.6737119438202247 },
                "DKK": { "rate": 17.777635034418758 },
                "DOP": { "rate": 2.3436333100665165 },
                "DZD": { "rate": 1 },
                "EUR": { "rate": 29.9801815 },
                "GBP": { "rate": 59.960363 },
                "USD": { "rate": 0.008338842111412835 }
              },
              "EUR": {
                "CZK": { "rate": 0.17127987602762573 },
                "DJF": { "rate": 0.02247191011235955 },
                "DKK": { "rate": 0.5929795666653572 },
                "DOP": { "rate": 0.07817275255877008 },
                "DZD": { "rate": 0.03335536844565134 },
                "EUR": { "rate": 1 },
                "GBP": { "rate": 2 },
                "USD": { "rate": 0.25 }
              },
              "GBP": {
                "CZK": { "rate": 0.08563993801381287 },
                "DJF": { "rate": 0.011235955056179775 },
                "DKK": { "rate": 0.2964897833326786 },
                "DOP": { "rate": 0.03908637627938504 },
                "DZD": { "rate": 0.01667768422282567 },
                "EUR": { "rate": 0.5 },
                "GBP": { "rate": 1 },
                "USD": { "rate": 0.5 }
              },
              "USD": {
                "CZK": { "rate": 23.35359 },
                "DJF": { "rate": 178 },
                "DKK": { "rate": 6.745595 },
                "DOP": { "rate": 51.168724 },
                "DZD": { "rate": 119.920726 },
                "EUR": { "rate": 4 },
                "GBP": { "rate": 2 },
                "USD": { "rate": 1 }
              }
            }
          }));
        });
      });

      describe("when request fails", () => {
        it("creates LOAD_RATES, then creates LOAD_RATES_FAILURE with error message", async () => {
          jest.spyOn(http, "getRates")
              .mockImplementationOnce(async () => { throw Error("Message") });

          const mockDispatch = jest.fn();

          await loadRates()(mockDispatch);

          expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
            type: LOAD_RATES
          }));

          expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
            type: LOAD_RATES_FAILURE,
            errorMessage: "Message"
          }));
        });
      });
    });

    describe("setCurrency", () => {
      it(`creates ${SET_CURRENCIES} action`, () => {
        expect(setCurrency("sell", "GBP")).toEqual(expect.objectContaining({
          type: SET_CURRENCIES,
          side: "sell",
          currencyCode: "GBP"
        }));
      });
    });

    describe("setAmount", () => {
      it(`creates ${SET_AMOUNT} action`, () => {
        expect(setAmount("sell", 122)).toEqual(expect.objectContaining({
          type: SET_AMOUNT,
          side: "sell",
          amount: 122
        }));
      });
    });

    describe("transferAmountBetweenPockets", () => {
      describe("when there is a sufficient balance in the sell pocket", () => {
        it(`creates ${TRANSFER_AMOUNT_BETWEEN_POCKETS} then ${TRANSFER_AMOUNT_BETWEEN_POCKETS_SUCCESS} action with balances adjusted appropriately`, async () => {
          const mockDispatcher = jest.fn(),
                mockGetState = () => ({
                  ...testData.initialState,
                  pockets: {
                    GBP: { amount: 100 },
                    EUR: { amount: 100 },
                    USD: { amount: 100 }
                  }
                } as State);

          await transferAmountBetweenPockets(100, 50, { sell: "USD", buy: "GBP" })(mockDispatcher, mockGetState);

          expect(mockDispatcher).toHaveBeenCalledWith(expect.objectContaining({
            type: TRANSFER_AMOUNT_BETWEEN_POCKETS,
            sellAmount: 100,
            buyAmount: 50,
            currencies: {
              sell: "USD",
              buy: "GBP"
            }
          }));

          expect(mockDispatcher).toHaveBeenCalledWith(expect.objectContaining({
            type: TRANSFER_AMOUNT_BETWEEN_POCKETS_SUCCESS,
            pocketsNewAmounts: {
              GBP: { amount: 150 },
              USD: { amount: 0 }
            },
            infoMessage: notificationMessages.transferAmountSucceeded("100", "USD", "GBP")
          }));
        });
      });

      describe("when pockets aren't defined", () => {
        it(`throws an exception, as this situation is unexpected`, async () => {
          const mockDispatcher = jest.fn(),
                mockGetState = () => ({
                  ...testData.initialState
                } as State);

          try {
            await transferAmountBetweenPockets(101, 50, { sell: "USD", buy: "GBP" })(mockDispatcher, mockGetState);
          }
          catch (err) {
            return;
          }

          expect(false).toBeTruthy();
        });
      });

      describe("when there isn't a sufficient balance in the sell pocket", () => {
        it(`creates ${TRANSFER_AMOUNT_BETWEEN_POCKETS_FAILURE} action`, async () => {
          const mockDispatcher = jest.fn(),
                mockGetState = () => ({
                  ...testData.initialState,
                  pockets: {
                    GBP: { amount: 100 },
                    EUR: { amount: 100 },
                    USD: { amount: 100 }
                  }
                } as State);

          await transferAmountBetweenPockets(101, 50, { sell: "USD", buy: "GBP" })(mockDispatcher, mockGetState);

          expect(mockDispatcher).toHaveBeenCalledWith(expect.objectContaining({
            type: TRANSFER_AMOUNT_BETWEEN_POCKETS_FAILURE,
            errorMessage: notificationMessages.transferAmountInsufficientBalance
          }));
        });
      });
    });
  });

  describe("reducer", () => {
    describe(LOAD_RATES, () => {
      it("sets loading to true and clears errors", () => {
        const nextState = reducer({
                ...testData.initialState,
                rates: {}
              }, {
                type: LOAD_RATES
              });

        expect(nextState.isLoadingRates).toEqual(true);
        expect(nextState.notification).toBeUndefined();
      });
    });

    describe(LOAD_RATES_SUCCESS, () => {
      it("sets loading to false and sets rates", () => {
        const rates = {
                "GBP": {
                  "EUR": {
                    rate: 2
                  }
                }
              },
              nextState = reducer({
                ...testData.initialState,
                isLoadingRates: true,
                rates: {}
              }, {
                type: LOAD_RATES_SUCCESS,
                rates
              });

        expect(nextState.isLoadingRates).toEqual(false);
        expect(nextState.rates).toEqual(rates);
      });
    });

    describe(LOAD_RATES_FAILURE, () => {
      it("sets loading to false and sets error message", () => {
        const nextState = reducer({
                isLoadingRates: false,
                isLoadingPockets: false,
                currencies: {},
                amount: 0,
                amountSide: "sell"
              }, {
                type: LOAD_RATES_FAILURE,
                errorMessage: "error"
              });

        expect(nextState.isLoadingRates).toEqual(false);
        expect(nextState.notification).toEqual({
          type: "error",
          message: "error"
        });
      });
    });

    describe(LOAD_POCKETS, () => {
      it("sets loading to true and clears errors", () => {
        describe(LOAD_POCKETS, () => {
          const nextState = reducer({
            isLoadingRates: false,
            isLoadingPockets: false,
            currencies: {},
            amount: 0,
            amountSide: "sell"
          }, {
            type: LOAD_POCKETS
          });

          expect(nextState.isLoadingPockets).toEqual(true);
          expect(nextState.notification).toBeUndefined();
        });
      });
    });

    describe(LOAD_POCKETS_SUCCESS, () => {
      describe("with two pockets", () => {
        it("sets loading to false, sets pockets and defaults buy and sell currencies to 1st and 2nd pockets respectively", () => {
          const pockets = {
                  "GBP": {
                    amount: 1
                  },
                  "EUR": {
                    amount: 1
                  },
                },
                nextState = reducer({
                  isLoadingRates: false,
                  isLoadingPockets: false,
                  currencies: {},
                  amount: 0,
                  amountSide: "sell"        
                }, {
                  type: LOAD_POCKETS_SUCCESS,
                  pockets
                });

          expect(nextState.isLoadingPockets).toEqual(false);
          expect(nextState.pockets).toEqual(pockets);
          expect(nextState.currencies).toEqual({
            sell: "GBP",
            buy: "EUR"
          });
        });
      });

      describe("with less than two pockets", () => {
        it("sets loading to false, sets pockets and clears buy and sell currencies", () => {
          [
            {"GBP": {
              amount: 1
            }},
            {}
          ].forEach((pockets: {}) => {
            const nextState =
              reducer({
                isLoadingRates: false,
                isLoadingPockets: false,
                currencies: {},
                amount: 0,
                amountSide: "sell"      
              }, {
                type: LOAD_POCKETS_SUCCESS,
                pockets
              });

            expect(nextState.isLoadingPockets).toEqual(false);
            expect(nextState.pockets).toEqual(pockets);
            expect(nextState.currencies).toEqual({
              sell: undefined,
              buy: undefined
            });
          });
        });
      });
    });

    describe(LOAD_POCKETS_FAILURE, () => {
      it("sets loading to false and sets error message", () => {
        const nextState = reducer(testData.initialState, { type: LOAD_POCKETS_FAILURE, errorMessage: "error" });

        expect(nextState.isLoadingPockets).toEqual(false);
        expect(nextState.notification).toEqual({
          type: "error",
          message: "error"
        });
      });
    });

    describe(SET_CURRENCIES, () => {
      it("sets the currency for the specified side", () => {
        let nextState = reducer(testData.initialState, { type: SET_CURRENCIES, side: "sell", currencyCode: "AUD" });
        expect(nextState.currencies && nextState.currencies.sell).toEqual("AUD");

        nextState = reducer(testData.initialState, { type: SET_CURRENCIES, side: "buy", currencyCode: "AUD" });
        expect(nextState.currencies && nextState.currencies.buy).toEqual("AUD");
      });
    });

    describe(SET_AMOUNT, () => {
      it("sets the amount for the specified side", () => {
        let nextState = reducer(testData.initialState, { type: SET_AMOUNT, side: "sell", amount: 123 });

        expect(nextState.amountSide).toEqual("sell");
        expect(nextState.amount).toEqual(123);

        nextState = reducer(testData.initialState, { type: SET_AMOUNT, side: "buy", amount: 123 });

        expect(nextState.amountSide).toEqual("buy");
        expect(nextState.amount).toEqual(123);
      });
    });

    describe(TRANSFER_AMOUNT_BETWEEN_POCKETS, () => {
      it("sets isLoadingPockets to true", () => {
        const nextState =
          reducer({
            ...testData.initialState,
            pockets: {
              "GBP": { amount: 100 },
              "EUR": { amount: 100 },
              "USD": { amount: 100 }
            }
          }, {
            type: TRANSFER_AMOUNT_BETWEEN_POCKETS,
            sellAmount: 50,
            buyAmount: 100,
            currencies: {
              sell: "USD",
              buy: "GBP",
            }
          });

        expect(nextState.isLoadingPockets).toBeTruthy();
      });
    });

    describe(TRANSFER_AMOUNT_BETWEEN_POCKETS_SUCCESS, () => {
      it("sets loading to false, updates pocket amounts and sets info message", () => {
        const nextState =
          reducer({
            ...testData.initialState,
            pockets: {
              "GBP": { amount: 100 },
              "EUR": { amount: 100 },
              "USD": { amount: 100 }
            },
            amount: 100
          }, {
            type: TRANSFER_AMOUNT_BETWEEN_POCKETS_SUCCESS,
            pocketsNewAmounts: {
              "GBP": { amount: 150 },
              "USD": { amount: 50 }
            },
            infoMessage: "info"
          });

        expect(nextState.isLoadingPockets).toBeFalsy();
        expect(nextState.pockets).toEqual({
          "GBP": { amount: 150 },
          "EUR": { amount: 100 },
          "USD": { amount: 50 }
        });
        expect(nextState.notification).toEqual({
          type: "info",
          message: "info"
        });
        expect(nextState.amount).toEqual(0);
      });
    });

    describe(TRANSFER_AMOUNT_BETWEEN_POCKETS_FAILURE, () => {
      it("sets loading to false and sets error message", () => {
        const nextState =
          reducer(testData.initialState, {
            type: TRANSFER_AMOUNT_BETWEEN_POCKETS_FAILURE,
            errorMessage: "error"
          });

        expect(nextState.isLoadingPockets).toBeFalsy();
        expect(nextState.notification).toEqual({
          type: "error",
          message: "error"
        });
      });
    });

    describe(CLEAR_NOTIFICATION, () => {
      it("clears the error message", () => {
        const nextState =
          reducer({
            ...testData.initialState,
            notification: {
              type: "error",
              message: "error"
            }
          }, {
            type: CLEAR_NOTIFICATION
          });

        expect(nextState.notification).toBeUndefined();
      });
    });
  });

  describe("selectors", () => {
    describe("selectConvertAmountToCurrency", () => {
      describe("when a directly applicable conversion rate is available", () => {
        it("applies that conversion rate (and only that conversion rate)", () => {
          const result =
            selectConvertAmountToCurrency({
              ...testData.initialState,
              rates: {
                "USD": {
                  "GBP": {
                    rate: 0.83
                  }
                },
                "GBP": {
                  "USD": {
                    rate: 1.2
                  }
                }
              },
            })(1, "GBP", "USD");

          expect(result).toEqual(1.2);
        });
      });

      describe("when only a reverse-applicable conversion rate is available", () => {
        it("applies that conversion rate", () => {
          const result = selectConvertAmountToCurrency({
            ...testData.initialState,
            rates: {
              "USD": {
                "GBP": {
                  rate: 0.8
                }
              }
            },
          })(1, "GBP", "USD");

          expect(result).toEqual(1.25);
        });
      });

      describe("when no matching rate is available", () => {
        it("returns undefined", () => {
          const result = selectConvertAmountToCurrency({
            ...testData.initialState,
            rates: {},
          })(1, "GBP", "USD");

          expect(result).toEqual(undefined);
        });
      });

      describe("when the two currencies provided are the same", () => {
        it("simply returns the same value", () => {
          const result = selectConvertAmountToCurrency({
            ...testData.initialState
          })(1, "USD", "USD");

          expect(result).toEqual(1);
        });
      });
    });

    describe("selectAmount", () => {
      describe("when the user has entered a sell amount", () => {
        it("selects the correct amounts", () => {
          const amount = selectAmount({
            ...testData.initialState,
            amount: 1,
            amountSide: "sell",
            rates: { GBP: { USD: { rate: 1.5 } } },
            currencies: {
              sell: "GBP",
              buy: "USD"
            }
          });

          expect(amount.sell).toEqual(1);
          expect(amount.buy).toEqual(1.5);
        });
      });

      describe("when the user has entered a buy amount", () => {
        it("selects the correct amounts", () => {
          const amount = selectAmount({
            ...testData.initialState,
            amount: 1,
            amountSide: "buy",
            rates: { GBP: { USD: { rate: 1.5 } } },
            currencies: {
              sell: "GBP",
              buy: "USD"
            }
          });

          expect(amount.sell).toEqual(0.6666666666666666);
          expect(amount.buy).toEqual(1);
        });
      });
    });
  });
});

import React from "react";
import { mount } from "enzyme";

import { BuySellSide } from "./BuySellSide";
import { withTheme } from "../../testUtils";
import { BuySellCurrencyCodes, Side, PocketMap } from "../Exchange.types";
import { PocketBalance } from "./pocket-balance/PocketBalance";
import { BuySellAmountInput } from "./buy-sell-amount-input/BuySellAmountInput";
import { ExchangeRate } from "../exchange-rate/ExchangeRate";
import { CurrencyCode } from "./BuySellSide.styles";
import { Swiper } from "../../components/swiper/Swiper";

describe("BuySellSide", () => {
  const mockSetCurrency = jest.fn(),
        mockSetAmount = jest.fn(),
        pockets: PocketMap = {
          GBP: { amount: 100 },
          EUR: { amount: 200 },
          USD: { amount: 300 }
        },
        amount = { sell: 100, buy: 100 },
        currencies = { sell: "GBP", buy: "USD" },
        BuySellSideInitialProps = {
          pockets,
          rate: (currencies: Partial<BuySellCurrencyCodes>) => 2,
          isLoadingRates: false,
        
          currencies,
          setCurrency: mockSetCurrency,
          
          amount,
          setAmount: mockSetAmount
        };

  (["sell", "buy"] as Side[]).forEach((side, sideIndex) => {
    const wrapper =
            mount(
              withTheme(
                <BuySellSide
                  {...BuySellSideInitialProps}
                  side={side}
                />)),
          currencyCode = currencies[side];

    describe("rendering", () => {
      it("has swiper with active currency", () => {
        expect(wrapper.find(Swiper).props().activeIndex).toEqual(Object.keys(pockets).indexOf(currencies[side]));
      });

      it("has currency code", () => {
        expect(wrapper.find(CurrencyCode).first().text().trim()).toEqual(currencyCode);
      });
  
      it("has pocket balance", () => {
        const pocketBalance = wrapper.find(PocketBalance);
        expect(pocketBalance.props().amount).toEqual(pockets[currencyCode].amount);
        expect(pocketBalance.props().currencyCode).toEqual(currencyCode);
      });
  
      it("has money amount input", () => {
        expect(wrapper.find(BuySellAmountInput).first().props().value).toEqual(amount[side]);
      });  

      if (side === "buy") {
        it("has exchange rate", () => {
          expect(wrapper.find(ExchangeRate).first().props()).toEqual(expect.objectContaining({
            currencies: { sell: "USD", buy: "GBP" },
            rate: 2
          }));
        });
      }
    });

    describe("behaviour", () => {
      it("calls setCurrency on switching swiper", () => {
        wrapper.find(Swiper).props().onSwipeTo!(2);
        expect(mockSetCurrency).toHaveBeenCalledWith(side, "USD");
      });

      it("calls setAmount on entering value into money amount input", () => {
        const newAmount = 321;
        wrapper.find(BuySellAmountInput).first().props().onChange(newAmount);
        expect(mockSetAmount).toHaveBeenCalledWith(side, newAmount);
      });
    });
  });
});
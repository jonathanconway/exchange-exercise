import React from "react";
import { mount } from "enzyme";

import { ExchangeRate } from "./ExchangeRate";
import { withTheme } from "../../testUtils";
import { MoneyAmount } from "../../components/money-amount/MoneyAmount";
import { BuySellCurrencyCodes } from "../Exchange.types";

describe("<ExchangeRate />", () => {
  it("can render", () => {
    mount(
        withTheme(
          <ExchangeRate
            currencies={{ sell: "GBP", buy: "USD" }}
            rate={0}
          />));
  });

  describe("rendering", () => {
    describe("value, fromCurrencyCode or toCurrencyCode are not provided", () => {
      it("renders blank", () => {
        ([
          [0, { sell: "GBP", buy: "USD" }],
          [1, undefined]
        ] as [number, BuySellCurrencyCodes?][])
          .forEach(([ amount, currency ]) => {
            const wrapper =
              mount(
                withTheme(
                  <ExchangeRate
                    currencies={currency}
                    rate={amount}
                  />));
        
            expect(wrapper.text()).toEqual("");
          });
      });
    });

    describe("value, fromCurrencyCode and toCurrencyCode are provided", () => {
      it("renders all parts of the rate in the correct place with the appropriate values", () => {
        const wrapper =
          mount(
            withTheme(
              <ExchangeRate
                currencies={{
                  sell: "GBP",
                  buy: "USD"
                }}
                rate={1.5}
              />));

        expect(wrapper.find(MoneyAmount).first().props().amount).toEqual(1);
        expect(wrapper.find(MoneyAmount).first().props().currencyCode).toEqual("GBP");
        expect(wrapper.find(MoneyAmount).at(1).props().amount).toEqual(1.5);
        expect(wrapper.find(MoneyAmount).at(1).props().currencyCode).toEqual("USD");
      });
    });
  });
});
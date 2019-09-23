import React from "react";
import { mount, ReactWrapper } from "enzyme";

import { Action } from "../Exchange.redux";
import { withTheme } from "../../testUtils";
import { Header } from "./Header";
import { HeaderButton } from "./Header.styles";
import { SelectRatesButton } from "./select-rates-button/SelectRatesButton";

const testData = {
  headerInitialProps: {
    isLoadingPockets: false,
    isLoadingRates: false,
    amount: {},
    clearNotification: () => {},
    currencies: {},
    loadPockets: () => Promise.resolve({} as Action),
    loadRates: () => Promise.resolve({} as Action),
    rate: () => 0,
    setAmount: () => {},
    setCurrency: () => {},
    transferAmountBetweenPockets: () => {},
  }
};

describe("<Header />", () => {
  const wrapper =
    mount(
      withTheme(
        <Header
          {...testData.headerInitialProps}
        />));

  it("renders", () => {
    expect(wrapper.find(Header).exists()).toBeTruthy();
  });
  
  describe("rendering", () => {
    it("contains cancel, rates and exchange buttons", () => {
      expect(wrapper.find(HeaderButton).filterWhere(b => b.text().includes("Cancel")).exists()).toBeTruthy();
      expect(wrapper.find(SelectRatesButton).exists()).toBeTruthy();
      expect(wrapper.find(HeaderButton).filterWhere(b => b.text().includes("Exchange")).exists()).toBeTruthy();
    });
  });

  describe("exchange button", () => {
    const exchangeButtonHelpers = (wrapper: ReactWrapper) => ({
      findExchangeButton: () =>
        wrapper.find(HeaderButton).filterWhere(x => x.text().trim() === "Exchange")
    });

    describe("rendering", () => {
      [
        [{ amount: { sell: 100, buy: 200 }, currencies: { sell: "GBP", buy: "USD" } }, false],
        [{ amount: { sell: 100           }, currencies: { sell: "GBP", buy: "USD" } }, true],
        [{ amount: {            buy: 200 }, currencies: { sell: "GBP", buy: "USD" } }, true],
        [{ amount: {                     }, currencies: { sell: "GBP", buy: "USD" } }, true],
        [{ amount: { sell: 100, buy: 200 }, currencies: {              buy: "USD" } }, true],
        [{ amount: { sell: 100, buy: 200 }, currencies: { sell: "GBP"             } }, true],
        [{ amount: { sell: 100, buy: 200 }, currencies: {                         } }, true],
      ].forEach(([props, shouldBeDisabled]) => {
        it(`if props=${JSON.stringify(props)} then disabled should be ${shouldBeDisabled}}`, () => {
          const wrapper =
            mount(
              withTheme(
                <Header
                  {...testData.headerInitialProps}
                  {...props}
                />));
  
          expect(exchangeButtonHelpers(wrapper).findExchangeButton().props().disabled).toEqual(shouldBeDisabled);
        });
      });
    });

    describe("behaviour", () => {
      it("calls transferAmountBetweenPockets with appropriate arguments when clicked", () => {
          const mockTransferAmountBetweenPockets = jest.fn(),
                wrapper =
                  mount(
                    withTheme(
                      <Header
                        {...testData.headerInitialProps}
                        amount={{ sell: 100, buy: 200 }}
                        currencies={{ sell: "GBP", buy: "USD" }}
                        transferAmountBetweenPockets={mockTransferAmountBetweenPockets}
                      />)),
                    helper = exchangeButtonHelpers(wrapper);;

        (helper.findExchangeButton().props().onClick as any)();

        expect(mockTransferAmountBetweenPockets).toHaveBeenCalledWith(100, 200, { sell: "GBP", buy: "USD" });
      });
    });
  });
});

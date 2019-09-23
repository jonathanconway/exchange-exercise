import React from "react";
import { mount, ReactWrapper } from "enzyme";

import { withTheme, withContext } from "../../testUtils";
import { Header } from "./Header";
import { HeaderButton } from "./Header.styles";
import { SelectRatesButton } from "./select-rates-button/SelectRatesButton";
import { ExchangeContextProps, emptyContext } from "../Exchange.context";

describe("<Header />", () => {
  const testContext = {
    ...emptyContext,
    rates: { GBP: { USD: { rate: 2 } }, USD: { GBP: { rate: 2 } } },
  };
  
  const wrapper =
    mount(
      withTheme(
        withContext(
          <Header />,
          testContext)));

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
                withContext(
                  <Header />,
                  {
                    ...testContext,
                    ...props as Partial<ExchangeContextProps>
                  })));
          
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
                      withContext(
                        <Header />,
                        {
                          ...testContext,
                          amount: { sell: 100, buy: 200 },
                          currencies: { sell: "GBP", buy: "USD" },
                          transferAmountBetweenPockets: mockTransferAmountBetweenPockets,
                        } as ExchangeContextProps))),
                helper = exchangeButtonHelpers(wrapper);

        (helper.findExchangeButton().props().onClick as any)();

        expect(mockTransferAmountBetweenPockets).toHaveBeenCalledWith(100, 200, { sell: "GBP", buy: "USD" });
      });
    });
  });
});

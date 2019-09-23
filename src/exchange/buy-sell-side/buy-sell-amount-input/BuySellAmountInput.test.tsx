import React from "react";
import { mount } from "enzyme";

import { withTheme, withContext } from "../../../testUtils";
import { BuySellAmountInput } from "./BuySellAmountInput";
import { NumericInput } from "../../../components/numeric-input/NumericInput";
import { emptyContext } from "../../Exchange.context";

describe("<BuySellAmountInput />", () => {
  const testContext = {
    ...emptyContext,
    currencies: { sell: "GBP", buy: "USD" },
    rates: { GBP: { USD: { rate: 2 } }, USD: { GBP: { rate: .5 } } },
  };

  it("can render", () => {
    mount(
      withTheme(
        withContext(
          <BuySellAmountInput
            value={0}
            onChange={() => {}}
            side="sell"
          />,
          testContext)));
  });

  describe("rendering", () => {
    describe("formatting", () => {
      it("allows no more than 2 decimal places", () => {
        const mockHandleChange = jest.fn();
        
        const wrapper =
          mount(
            withTheme(
              withContext(
                <BuySellAmountInput
                  value={2.001}
                  onChange={mockHandleChange}
                  side="sell"
                />, testContext)));
        
        expect((wrapper.find(NumericInput).getDOMNode() as HTMLInputElement).value).toEqual("-2.00");
      });

      it("allows no more than 5 integer places", () => {
        const mockHandleChange = jest.fn();
        
        const wrapper =
          mount(
            withTheme(
              withContext(
                <BuySellAmountInput
                  value={123456}
                  onChange={mockHandleChange}
                  side="sell"
                />, testContext)));
        
        expect((wrapper.find(NumericInput).getDOMNode() as HTMLInputElement).value).toEqual("-12,345");
      });

      it("allows no more than would produce 9,999 on the other side, after conversion", () => {
        const mockHandleChange = jest.fn();
        
        const wrapper =
          mount(
            withTheme(
              withContext(
                <BuySellAmountInput
                  value={5000}
                  onChange={mockHandleChange}
                  side="sell"
                />, testContext)));

        expect(wrapper.find(NumericInput).props().maxValue).toEqual(4999);
      });

      it("prepends a '-' if negative", () => {
        const mockHandleChange = jest.fn();
        
        const wrapper =
          mount(
            withTheme(
              withContext(
                <BuySellAmountInput
                  value={2}
                  onChange={mockHandleChange}
                  side="sell"
                />, testContext)));
        
        expect((wrapper.find(NumericInput).getDOMNode() as HTMLInputElement).value[0]).toEqual("-")
      });

      it("prepends a '+' if positive", () => {
        const mockHandleChange = jest.fn();
        
        const wrapper =
          mount(
            withTheme(
              withContext(
                <BuySellAmountInput
                  value={2}
                  onChange={mockHandleChange}
                  side="buy"
                />, testContext)));
        
        expect((wrapper.find(NumericInput).getDOMNode() as HTMLInputElement).value[0]).toEqual("+");
      });
    });
  });

  describe("behaviour", () => {
    it("triggers onChange event on user input", () => {
      const mockHandleChange = jest.fn();

      const wrapper =
        mount(
          withTheme(
            withContext(
              <BuySellAmountInput
                value={0}
                onChange={mockHandleChange}
                side="sell"
              />, testContext)));

      wrapper.find("input").simulate("input", { target: { value: "1" } });

      expect(mockHandleChange).toHaveBeenCalledWith(1.00);
    });
  });
});

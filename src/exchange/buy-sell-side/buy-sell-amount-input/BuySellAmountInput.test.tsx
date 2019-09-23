import React from "react";
import { mount } from "enzyme";

import { withTheme } from "../../../testUtils";
import { BuySellAmountInput } from "./BuySellAmountInput";
import { NumericInput } from "../../../components/numeric-input/NumericInput";

describe("<BuySellAmountInput />", () => {
  it("can render", () => {
    mount(
      withTheme(
        <BuySellAmountInput
          value={0}
          onChange={() => {}}
          side="sell"
        />));
  });

  describe("rendering", () => {
    describe("formatting", () => {
      it("allows no more than 2 decimal places", () => {
        const mockHandleChange = jest.fn();
        
        const wrapper =
          mount(
            withTheme(
              <BuySellAmountInput
                value={2.001}
                onChange={mockHandleChange}
                side="sell"
              />));
        
        expect((wrapper.find(NumericInput).getDOMNode() as HTMLInputElement).value).toEqual("-2.00");
      });

      it("allows no more than 6 integers places", () => {
        const mockHandleChange = jest.fn();
        
        const wrapper =
          mount(
            withTheme(
              <BuySellAmountInput
                value={123456}
                onChange={mockHandleChange}
                side="sell"
              />));
        
        expect((wrapper.find(NumericInput).getDOMNode() as HTMLInputElement).value).toEqual("-12,345");
      });

      it("prepends a '-' if negative", () => {
        const mockHandleChange = jest.fn();
        
        const wrapper =
          mount(
            withTheme(
              <BuySellAmountInput
                value={2}
                onChange={mockHandleChange}
                side="sell"
              />));
        
        expect((wrapper.find(NumericInput).getDOMNode() as HTMLInputElement).value[0]).toEqual("-")
      });

      it("prepends a '+' if positive", () => {
        const mockHandleChange = jest.fn();
        
        const wrapper =
          mount(
            withTheme(
              <BuySellAmountInput
                value={2}
                onChange={mockHandleChange}
                side="buy"
              />));
        
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
            <BuySellAmountInput
              value={0}
              onChange={mockHandleChange}
              side="sell"
            />));

      wrapper.find("input").simulate("input", { target: { value: "1" } });

      expect(mockHandleChange).toHaveBeenCalledWith(1.00);
    });
  });
});

import React from "react";
import { mount } from "enzyme";

import { MoneyAmount } from "./MoneyAmount";
import { SymbolPart, NumberLeftPart, NumberRightPart } from "./MoneyAmount.styles"
import { withTheme } from "../../testUtils";

describe("<MoneyAmount />", () => {
  describe("<Exchange />", () => {
    it("can render", () => {
      mount(
        withTheme(
          <MoneyAmount
            amount={0}
            currencyCode="GBP"
          />));
    });
  });

  describe("rendering", () => {
    it("renders blank if value is undefined", () => {
      const wrapper =
        mount(
          withTheme(
            <MoneyAmount
              amount={undefined}
              currencyCode="GBP"
            />));

      expect(wrapper.html()).toBeFalsy();
    });

    it("renders all parts of the amount in the correct place with appropriate formatting", () => {
      const testData: readonly [ number, string, string ][] = [
        [ 0,         "0",       "" ],
        [ 12,        "12",      "" ],
        [ 12.2,      "12.2",    "" ],
        [ 12.24,     "12.24",   "" ],
        [ 12.2456,   "12.24",   "56" ],
        [ 12.245678, "12.24",   "56" ],
        [ 12.245678, "12.24",   "56" ],
        [ 1233,      "1,233",   "" ],
        [ 12334,     "12,334" , "" ],
        [ 123343,    "123,343", "" ],
      ];
      
      testData.forEach(([ amount, expectedLeftPart, expectedRightPart ]) => {
        const wrapper =
          mount(
            withTheme(
              <MoneyAmount
                amount={amount}
                currencyCode="GBP"
              />));

        expect(wrapper.find(SymbolPart).text()).toEqual("£");
        expect(wrapper.find(NumberLeftPart).text()).toEqual(expectedLeftPart);
        expect(wrapper.find(NumberRightPart).text()).toEqual(expectedRightPart);
      });
    });
  });
});
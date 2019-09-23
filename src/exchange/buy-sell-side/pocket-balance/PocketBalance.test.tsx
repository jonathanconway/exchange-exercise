import React from "react";
import { mount } from "enzyme";

import { withTheme } from "../../../testUtils";
import { PocketBalance } from "./PocketBalance";
import { MoneyAmount } from "../../../components/money-amount/MoneyAmount";

describe("<PocketBalance />", () => {
  it("can render", () => {
    mount(
      withTheme(
        <PocketBalance
          amount={0}
          currencyCode="GBP"
        />));
  });

  describe("rendering", () => {
    it("renders balance correctly", () => {
      const wrapper =
        mount(
          withTheme(
            <PocketBalance
              amount={1}
              currencyCode="GBP"
            />));
    
      const moneyAmount = wrapper.find(MoneyAmount).first().props();
      expect(moneyAmount.amount).toEqual(1);
      expect(moneyAmount.currencyCode).toEqual("GBP");
    });
  });
});
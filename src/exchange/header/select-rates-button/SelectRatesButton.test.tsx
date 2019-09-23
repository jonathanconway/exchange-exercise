import React from "react";
import { mount } from "enzyme";

import { withTheme } from "../../../testUtils";
import { SelectRatesButton } from "./SelectRatesButton";
import { ExchangeRate } from "../../exchange-rate/ExchangeRate";
import { DropdownArrow } from "./SelectRatesButton.styles";

describe("<SelectRatesButton />", () => {
  const testData = {
    currencies: { sell: "GBP", buy: "USD" },
    rate: 1.5
  };

  it("can render", () => {
    mount(
      withTheme(
        <SelectRatesButton
          rate={testData.rate}
          currencies={testData.currencies}
        />));
  });

  describe("rendering", () => {
    const wrapper =
      mount(
        withTheme(
          <SelectRatesButton
            rate={testData.rate}
            currencies={testData.currencies}
          />));

    it("renders rates correctly", () => {  
      const exchangeRateProps = wrapper.find(ExchangeRate).first().props();
      expect(exchangeRateProps.currencies).toEqual(testData.currencies);
      expect(exchangeRateProps.rate).toEqual(1.5);
    });

    it("renders down arrow", () => {  
      expect(wrapper.find(DropdownArrow).exists()).toBeTruthy();
    });
  });
});
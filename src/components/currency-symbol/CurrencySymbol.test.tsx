import React from "react";

import { CurrencySymbol } from "./CurrencySymbol";

import { mount } from "enzyme";

describe("<CurrencySymbol />", () => {
  it("can render", () => {
    mount(
      <CurrencySymbol
        currencyCode=""
      />);
  });

  describe("rendering", () => {
    it("renders a matching symbol, given a currencyCode", () => {
      const wrapper =
        mount(
          <CurrencySymbol
            currencyCode="AUD"
          />);

      expect(wrapper.text().trim()).toEqual("$");
    });
  });
});

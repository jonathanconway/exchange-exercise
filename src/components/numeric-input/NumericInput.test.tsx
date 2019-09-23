import React from "react";

import { NumericInput } from "./NumericInput";

import { withTheme } from "../../testUtils";
import { mount, ReactWrapper } from "enzyme";

const numericInputTestUtils = (wrapper: ReactWrapper) => ({
  getInput: () => wrapper.find("input").first()
});

describe("<FormattedInput />", () => {
  it("can render", () => {
    mount(
      withTheme(
        <NumericInput
          value={0}
          onChange={() => {}}
          prefix=""
        />));
  });

  describe("rendering", () => {
    it("renders value into input", () => {
      const wrapper = 
              mount(
                withTheme(
                  <NumericInput
                    value={1}
                    onChange={() => {}}
                    prefix=""
                  />)),
            utils = numericInputTestUtils(wrapper);

      expect((utils.getInput().getDOMNode() as HTMLInputElement).value).toEqual("1");
    });

    it("is configured to render as a numeric keyboard in iOS", () => {
      const wrapper =
              mount(
                withTheme(
                  <NumericInput
                    value={0}
                    onChange={() => {}}
                    prefix="X"
                  />));
      expect(wrapper.find("input").first().getDOMNode().getAttribute("type")).toEqual("tel");
    });

    it("separates number into thousands", () => {
      const wrapper = 
              mount(
                withTheme(
                  <NumericInput
                    value={123123}
                    onChange={() => {}}
                    prefix=""
                  />)),
            utils = numericInputTestUtils(wrapper);

      expect(utils.getInput().prop("value")).toEqual("12,312");
    });

    it("prefixes number, if specified", () => {
      const wrapper = 
              mount(
                withTheme(
                  <NumericInput
                    value={123123}
                    onChange={() => {}}
                    prefix="X"
                  />)),
            utils = numericInputTestUtils(wrapper);

      expect(utils.getInput().prop("value")).toEqual("X12,312");
    });

    it("is blank on initial render if value is 0", () => {
      const wrapper = 
              mount(
                withTheme(
                  <NumericInput
                    value={0}
                    onChange={() => {}}
                    prefix="-"
                  />)),
            utils = numericInputTestUtils(wrapper);

      expect(utils.getInput().prop("value")).toEqual("");
    });
  });

  describe("behaviour", () => {
    it("allows user to enter a dot", () => {
      const wrapper = 
              mount(
                withTheme(
                  <NumericInput
                    value={1}
                    onChange={() => {}}
                    prefix=""
                  />)),
            utils = numericInputTestUtils(wrapper);

      wrapper.find("input").simulate("input", { target: { value: "1." } });
      wrapper.setProps({ value: 1 });

      expect(utils.getInput().prop("value")).toEqual("1.");
    });

    it("keeps window scrolled to top on focus", (done) => {
      const mockWindow = { scrollTo: jest.fn() };

      const wrapper = 
              mount(
                withTheme(
                  <NumericInput
                    value={0}
                    onChange={() => {}}
                    prefix=""
                    window={mockWindow}
                />));

      wrapper.find("input").simulate("focus");

      setTimeout(() => {
        expect(mockWindow.scrollTo).toHaveBeenCalledWith(0, 0);
        done();
      }, 200);
    });
  });
});
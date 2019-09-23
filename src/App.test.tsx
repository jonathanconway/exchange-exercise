import React from "react";
import { mount } from "enzyme";

import { App } from "./App";
import { withMockStore, withTheme } from "./testUtils";
import { reducer } from "./exchange/Exchange.redux";

describe("<App />", () => {
  it("can render", () => {
    mount(
      withMockStore(
        reducer,
        withTheme(
          <App />
        )));
  });
});

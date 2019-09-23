import React from "react";
import { mount } from "enzyme";

import { App } from "./App";
import { withMockStore, withTheme, withContext } from "./testUtils";
import { reducer } from "./exchange/Exchange.redux";
import { emptyContext } from "./exchange/Exchange.context";

describe("<App />", () => {
  it("can render", () => {
    mount(
      withMockStore(
        reducer,
        withTheme(
          withContext(
            <App />,
            emptyContext
          ))));
  });
});

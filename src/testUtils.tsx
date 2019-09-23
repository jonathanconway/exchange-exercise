import React, { ReactChild } from "react";
import { ThemeProvider } from "styled-components";
import Redux from "redux";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";

import { theme } from "./theme";
import { ExchangeContext, ExchangeContextProps } from "./exchange/Exchange.context";

export const withTheme = (node: ReactChild) => (
  <ThemeProvider theme={theme}>
    {node}
  </ThemeProvider>
);

export const createMockStore = <TState extends object = {}, TAction extends Redux.Action<any> = Redux.Action<any>>(
  reducer: (state: TState | undefined, action: TAction) => TState
) =>
  createStore<TState, TAction, {}, {}>(reducer, applyMiddleware(thunkMiddleware));

export const withMockStore = <TState extends object = {}, TAction extends Redux.Action<any> = Redux.Action<any>>(
  reducer: (state: TState | undefined, action: TAction) => TState,
  node: ReactChild,
  store = createMockStore(reducer)
) => {
  return (
    <Provider store={store}>
      {node}
    </Provider>
  );
};

export const withContext = (node: ReactChild, props: ExchangeContextProps) => (
  <ExchangeContext.Provider value={props}>
    {node}
  </ExchangeContext.Provider>
);
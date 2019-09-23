import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { ThemeProvider } from "styled-components";

import { theme } from "./theme";
import { GlobalStyle } from "./App.styles";
import { App } from "./App";
import * as serviceWorker from "./serviceWorker";
import { store } from "./store";

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <>
        <GlobalStyle />
        <App />
      </>
    </ThemeProvider>
  </Provider>,
  document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

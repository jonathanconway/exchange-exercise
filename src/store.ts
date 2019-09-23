import thunkMiddleware from "redux-thunk";
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { reducer as exchangeReducer } from "./exchange/Exchange.redux";

export const store =
  createStore(
    exchangeReducer,
    composeWithDevTools(applyMiddleware(thunkMiddleware)),
  );

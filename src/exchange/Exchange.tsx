import React, { useEffect } from "react";
import { connect } from "react-redux";

import { Container } from "./Exchange.styles";
import { useInterval } from "../hooks/useInterval";
import { loadRates, loadPockets, transferAmountBetweenPockets, setCurrency,
  setAmount, State, selectAmount, clearNotification } from "./Exchange.redux";
import { Spinner } from "../components/spinner/Spinner";
import { Stack } from "../components/stack/Stack";
import { Notification as NotificationComponent } from "../components/notification/Notification";
import { Header } from "./header/Header";
import { BuySellSide } from "./buy-sell-side/BuySellSide";
import { ExchangeContext, ExchangeContextProps } from "./Exchange.context";

type ExchangeProps = ExchangeContextProps;

export const RELOAD_RATES_INTERVAL = 10000;

/**
 * Exchange screen, enabling user to view currency conversions and
 * transfer amounts between pockets.
 */
export const ExchangeComponent = (props: ExchangeProps) => {

  const {
    loadPockets,
    pockets,
    isLoadingPockets,
    loadRates,
    currencies,
    setCurrency,
    notification,
    clearNotification
  } = props;

  // Load data on first render.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadRates(); loadPockets(); }, []);

  // Reload rates at regular intervals.
  useInterval(() => {
    loadRates();
  }, RELOAD_RATES_INTERVAL);

  // Switch one currency if both are the same.
  // (It doesn't make sense to convert a currency to itself.)
  const switchCurrencyTimeoutEffect = () => {
    const timeout =
      setTimeout(() => {
        if (pockets && currencies.sell && (currencies.sell === currencies.buy)) {
          setCurrency("buy", Object.keys(pockets).find(c => c !== currencies.buy)!);
        }
      }, 500);

    return () => clearTimeout(timeout);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(switchCurrencyTimeoutEffect, [currencies]);

  return (
    <ExchangeContext.Provider value={props as ExchangeContextProps}>
      {isLoadingPockets && <Spinner />}

      {notification &&
        <NotificationComponent
          notification={notification}
          onClick={clearNotification}
          onTimeout={clearNotification}
        />}

      <Container>
        {currencies && <Header />}

        {(pockets && currencies.sell && currencies.buy) &&
          <Stack>
            <BuySellSide side="sell" />
            <BuySellSide side="buy" />
          </Stack>
        }

      </Container>
    </ExchangeContext.Provider>
  );

};

const makeMapStateToProps = () => {
  const mapStateToProps = (state: State) => ({
    pockets: state.pockets,
    isLoadingPockets: state.isLoadingPockets,

    rates: state.rates,
    isLoadingRates: state.isLoadingRates,

    currencies: state.currencies,
    amount: selectAmount(state),

    notification: state.notification
  });
  return mapStateToProps;
};

const mapDispatchToProps = {
  loadRates,
  loadPockets,

  setCurrency,
  setAmount,

  transferAmountBetweenPockets,

  clearNotification
};

export const Exchange = connect(makeMapStateToProps, mapDispatchToProps)(ExchangeComponent);

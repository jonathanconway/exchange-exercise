import React, { useEffect } from "react";
import { connect } from "react-redux";

import { Container } from "./Exchange.styles";
import { loadRates, loadPockets, transferAmountBetweenPockets, setCurrency, setAmount, State, Action, selectRate, selectAmount, clearNotification } from "./Exchange.redux";
import { PocketMap, Side, BuySellCurrencyCodes } from "./Exchange.types";
import { Notification } from "../App.types";
import { Spinner } from "../components/spinner/Spinner";
import { Stack } from "../components/stack/Stack";
import { Notification as NotificationComponent } from "../components/notification/Notification";
import { useInterval } from "../hooks/useInterval";
import { Header } from "./header/Header";
import { BuySellSide } from "./buy-sell-side/BuySellSide";

interface ExchangeProps {
  readonly loadPockets: () => Promise<Action>;
  readonly pockets?: PocketMap;
  readonly isLoadingPockets: boolean;
  
  readonly loadRates: () => Promise<Action>;
  readonly rate: (currencies: BuySellCurrencyCodes) => number;
  readonly isLoadingRates: boolean;

  readonly currencies: Partial<BuySellCurrencyCodes>;
  readonly setCurrency: (side: Side, currencyCode: string) => void;
    
  readonly amount: { [side: string]: number | undefined };
  readonly setAmount: (side: Side, amount: number) => void;

  readonly transferAmountBetweenPockets: (
    sellAmount: number,
    buyAmount: number,
    currencies: BuySellCurrencyCodes) => void;

  readonly notification?: Notification;
  readonly clearNotification: () => void;
}

export const RELOAD_RATES_INTERVAL = 10000;

/**
 * Exchange screen, enabling user to view currency conversions and
 * transfer amounts between pockets.
 */
export const ExchangeComponent = (props: ExchangeProps) => {

  // Load data on first render.
  // eslint-disable-next-line
  useEffect(() => {
    props.loadRates();
    props.loadPockets();
  }, []);

  // Reload rates at regular intervals.
  useInterval(() => {
    props.loadRates();
  }, RELOAD_RATES_INTERVAL);

  // Switch one currency if both are the same.
  // (It doesn't make sense to convert a currency to itself.)
  useEffect(() => {
    setTimeout(() => {
      if (props.pockets && props.currencies.sell && (props.currencies.sell === props.currencies.buy)) {
        props.setCurrency("buy", Object.keys(props.pockets).find(c => c !== props.currencies.buy)!);
      }
    }, 500);
  }, [props.currencies]);

  return (
    <>
      {props.isLoadingPockets && <Spinner />}

      {props.notification &&
        <NotificationComponent
          notification={props.notification}
          onClick={props.clearNotification}
          onTimeout={props.clearNotification}
        />}

      <Container>
        <Header
          isLoadingRates={props.isLoadingRates}
          rate={props.rate}

          currencies={props.currencies}

          amount={props.amount}

          transferAmountBetweenPockets={props.transferAmountBetweenPockets}
        />

        {(props.pockets && props.currencies.sell && props.currencies.buy) &&
          <Stack>
            <BuySellSide
              side="sell"

              pockets={props.pockets}

              isLoadingRates={props.isLoadingRates}
              rate={props.rate}

              currencies={props.currencies}
              setCurrency={props.setCurrency}

              amount={props.amount}
              setAmount={props.setAmount}
            />
            <BuySellSide
              side="buy"

              pockets={props.pockets}

              isLoadingRates={props.isLoadingRates}
              rate={props.rate}

              currencies={props.currencies}
              setCurrency={props.setCurrency}

              amount={props.amount}
              setAmount={props.setAmount}
            />
          </Stack>
        }

      </Container>
    </>
  );

};

const makeMapStateToProps = () => {
  const mapStateToProps = (state: State) => ({
    pockets: state.pockets,
    isLoadingPockets: state.isLoadingPockets,

    rate: selectRate(state),
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

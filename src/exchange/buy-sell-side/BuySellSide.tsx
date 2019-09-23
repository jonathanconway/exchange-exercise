import React from "react";

import { SwiperCard, SwiperCardLeft, SwiperCardText, SwiperCardRight, CurrencyCode } from "./BuySellSide.styles";
import { PocketMap, BuySellCurrencyCodes, Side } from "../Exchange.types";
import { Swiper } from "../../components/swiper/Swiper";
import { PocketBalance } from "./pocket-balance/PocketBalance";
import { BuySellAmountInput } from "./buy-sell-amount-input/BuySellAmountInput";
import { SpinnerContainer } from "../../components/spinner/Spinner.styles";
import { ExchangeRate } from "../exchange-rate/ExchangeRate";
import { Spinner } from "../../components/spinner/Spinner";

interface BuySellSideProps {
  readonly side: Side;

  readonly pockets: PocketMap;
  
  readonly rate: (currencies: BuySellCurrencyCodes) => number;
  readonly isLoadingRates: boolean;

  readonly currencies: Partial<BuySellCurrencyCodes>;
  readonly setCurrency: (side: Side, currencyCode: string) => void;
    
  readonly amount: { [side: string]: number | undefined };
  readonly setAmount: (side: Side, amount: number) => void;
}

/**
 * Allows the user to select a buy or sell currency and enter an amount to buy or sell.
 */
export const BuySellSide = (props: BuySellSideProps) => {
  const selectedCurrencyCodeIndex = Object.keys(props.pockets!).indexOf(props.currencies[props.side]!);

  return (
    <Swiper
      key={`exchange-${props.side}-swiper`}
      activeIndex={selectedCurrencyCodeIndex}
      onSwipeTo={(index: number) => props.setCurrency(props.side, Object.keys(props.pockets)[index])}>

      {Object.entries(props.pockets!).map(([currencyCode, pocket]) => (
        <SwiperCard key={`exchange-${props.side}-swiper-${currencyCode}`}>
          <SwiperCardLeft>
            <CurrencyCode>{currencyCode}</CurrencyCode>
            <SwiperCardText>
              <PocketBalance
                amount={pocket.amount}
                currencyCode={currencyCode}
              />
            </SwiperCardText>
          </SwiperCardLeft>
          <SwiperCardRight>
            <BuySellAmountInput
              side={props.side}
              value={props.amount[props.side]}
              onChange={(value) => props.setAmount(props.side, Math.abs(value))}
            />
            <SwiperCardText>
              {props.side === "buy"
                ? <SpinnerContainer>
                    <ExchangeRate
                      currencies={{
                        sell: props.currencies.buy,
                        buy: props.currencies.sell
                      }}
                      rate={
                        (props.currencies.sell && props.currencies.buy)
                          ? props.rate({
                              sell: props.currencies.buy,
                              buy: props.currencies.sell
                            })
                          : undefined}
                    />
                    {props.isLoadingRates && <Spinner size="small" />}
                  </SpinnerContainer>
                : undefined}
            </SwiperCardText>
          </SwiperCardRight>
        </SwiperCard>
      ))}
    </Swiper>
  );
};

import React, { useContext } from "react";

import { SwiperCard, SwiperCardLeft, SwiperCardText, SwiperCardRight, CurrencyCode } from "./BuySellSide.styles";
import { Side } from "../Exchange.types";
import { Swiper } from "../../components/swiper/Swiper";
import { PocketBalance } from "./pocket-balance/PocketBalance";
import { BuySellAmountInput } from "./buy-sell-amount-input/BuySellAmountInput";
import { SpinnerContainer } from "../../components/spinner/Spinner.styles";
import { ExchangeRate } from "../exchange-rate/ExchangeRate";
import { Spinner } from "../../components/spinner/Spinner";
import { ExchangeContext } from "../Exchange.context";

interface BuySellSideProps {
  readonly side: Side;
}

/**
 * Allows the user to select a buy or sell currency and enter an amount to buy or sell.
 */
export const BuySellSide = ({
  side
}: BuySellSideProps) => {

  const {
    pockets,
    rates,
    isLoadingRates,
    currencies,
    setCurrency,
    amount,
    setAmount
  } = useContext(ExchangeContext);

  if (!pockets) {
    return null;
  }

  const selectedCurrencyCodeIndex = Object.keys(pockets).indexOf(currencies[side]!);

  return (
    <Swiper
      key={`exchange-${side}-swiper`}
      activeIndex={selectedCurrencyCodeIndex}
      onSwipeTo={(index: number) => setCurrency(side, Object.keys(pockets)[index])}>

      {Object.entries(pockets).map(([currencyCode, pocket]) => (
        <SwiperCard key={`exchange-${side}-swiper-${currencyCode}`}>
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
              side={side}
              value={amount[side]}
              onChange={(value) => setAmount(side, Math.abs(value))}
            />
            <SwiperCardText>
              {side === "buy"
                ? <SpinnerContainer>
                    <ExchangeRate
                      currencies={{
                        sell: currencies.buy,
                        buy: currencies.sell
                      }}
                      rate={
                        (currencies.sell && currencies.buy && rates)
                          ? rates[currencies.buy][currencies.sell].rate
                          : undefined}
                    />
                    {isLoadingRates && <Spinner size="small" />}
                  </SpinnerContainer>
                : undefined}
            </SwiperCardText>
          </SwiperCardRight>
        </SwiperCard>
      ))}
    </Swiper>
  );
};

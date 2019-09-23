import React from "react";

import { Container } from "./PocketBalance.styles";
import { MoneyAmount } from "../../../components/money-amount/MoneyAmount";

interface PocketBalanceProps {
  readonly amount: number;
  readonly currencyCode: string;
}

/**
 * Displays the balance the user has in a pocket.
 */
export const PocketBalance = ({
  amount,
  currencyCode
}: PocketBalanceProps) => (
  <Container>
    <>You have </>
    <MoneyAmount
      amount={amount}
      currencyCode={currencyCode}
    />
  </Container>
);
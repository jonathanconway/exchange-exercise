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
export const PocketBalance = (props: PocketBalanceProps) => (
  <Container>
    <>You have </>
    <MoneyAmount
      amount={props.amount}
      currencyCode={props.currencyCode}
    />
  </Container>
);
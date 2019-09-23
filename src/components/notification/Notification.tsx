import React, { useEffect } from "react";

import { Container, Title, Body } from "./Notification.styles";
import { Notification as INotification } from "../../App.types";

interface NotificationProps {
  readonly notification: INotification;
  readonly onClick: () => void;
  readonly onTimeout: () => void;
}

const typeToTitle = {
  "error": "Error",
  "info": "Info",
};

export const TIMEOUT_MS = 5000;

/**
 * Displays important status or error messages on top of other components.
 */
export const Notification = (props: NotificationProps) => {
  useEffect(() => {
    setTimeout(() => {
      props.onTimeout();
    }, TIMEOUT_MS);
  }, []);

  return (
    <Container type={props.notification.type} onClick={props.onClick}>
      <Title type={props.notification.type}>{typeToTitle[props.notification.type]}</Title>
      <Body>{props.notification.message}</Body>
    </Container>
  );
};
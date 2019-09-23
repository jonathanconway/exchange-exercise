import React from "react";

import { Container, Title, Body } from "./Notification.styles";
import { Notification as INotification } from "../../App.types";
import { useTimeout } from "../../hooks/useTimeout";

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
export const Notification = ({ notification, onClick, onTimeout }: NotificationProps) => {
  useTimeout(onTimeout, TIMEOUT_MS);

  return (
    <Container type={notification.type} onClick={onClick}>
      <Title type={notification.type}>{typeToTitle[notification.type]}</Title>
      <Body>{notification.message}</Body>
    </Container>
  );
};
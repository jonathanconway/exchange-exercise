import React from "react";

import { Container, StackContent, MobileKeyboardSpacer } from "./Stack.styles";

interface StackProps {
  readonly children: readonly JSX.Element[];
}

/**
 * Vertical 'stack' of panels.
 */
export const Stack = ({ children }: StackProps) => (
  <Container>
    <StackContent childrenLength={children.length}>{children}</StackContent>
    <MobileKeyboardSpacer />
  </Container>
);
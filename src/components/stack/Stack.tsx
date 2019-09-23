import React from "react";

import { Container, StackContent, MobileKeyboardSpacer } from "./Stack.styles";

interface StackProps {
  readonly children: readonly JSX.Element[];
}

/**
 * Vertical 'stack' of panels.
 */
export const Stack = (props: StackProps) => (
  <Container>
    <StackContent childrenLength={props.children.length}>{props.children}</StackContent>
    <MobileKeyboardSpacer />
  </Container>
);
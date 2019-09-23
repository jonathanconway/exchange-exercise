import React from "react";

import { SpinnerIcon } from "./Spinner.styles";

interface SpinnerProps {
  readonly size?: "small" | "large";
}

/**
 * Animated spinner, shown when loading.
 */
export const Spinner = (props: SpinnerProps = { size: "large" }) => (
  <SpinnerIcon size={props.size || "large"} />
);
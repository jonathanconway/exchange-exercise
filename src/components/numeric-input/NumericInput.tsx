import React, { ChangeEvent, useState, useEffect } from "react";

import { StyledCleave } from "./NumericInput.styles";

interface NumericInputProps {
  readonly value: number;
  readonly prefix: string;
  readonly enforceDecimalPlaces?: number;
  readonly autoFocus?: boolean;

  readonly window?: { scrollTo: (x: number, y: number) => void };

  readonly onChange: (value: number) => void;
}

/**
 * An input into which the user is constrained to enter only numeric values
 * with a fixed number of decimal places.
 */
export const NumericInput = (props: NumericInputProps) => {
  // Keep track of the input's value internally, so we don't lose transitional
  // values, such as the user entering a '.' at the end of a number just before
  // entering the fractional part.
  const [innerValue, setInnerValue] = useState("");

  // Only initialise innerValue on first render.
  // eslint-disable-next-line
  useEffect(() => { props.value !== 0 && setInnerValue(props.value.toString()); }, []);

  // On setting `value` prop, update input's value.
  useEffect(() => {
    //  todo unit test
    if (props.value !== 0) {
      setInnerValue(props.value.toString());
    } else {
      setInnerValue("");
    }
  }, [props.value]);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    value = value.replace(/,/g, ""); // Remove commas

    setInnerValue(value.replace(props.prefix, ""));

    props.onChange(Number(value));
  };

  const handleFocus = () => {
    // Keep window scrolled to top, so that the input isn't obscured by the
    // pop-up keyboard on mobile devices.
    setTimeout(() => {
      (props.window || window).scrollTo(0, 0);
    }, 100);
  };

  return (
    <StyledCleave
      options={{
        numeral: true,
        numeralIntegerScale: 5,
        numeralThousandsGroupStyle: "thousand",
        prefix: props.prefix,
        noImmediatePrefix: true
      }}
      type="tel"
      value={innerValue}
      onInput={handleInput}
      onFocus={handleFocus}
      autoFocus={props.autoFocus}
    />
  );
};
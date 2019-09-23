import React, { ChangeEvent, useState, useEffect } from "react";

import { StyledCleave } from "./NumericInput.styles";

interface NumericInputProps {
  readonly value: number;
  readonly prefix: string;
  readonly maxValue: number;

  readonly window?: Pick<Window, "scrollTo">;

  readonly onChange: (value: number) => void;
}

const scrollWindowToTop = (window: Pick<Window, "scrollTo">) => {
  setTimeout(() => window.scrollTo(0, 0), 100);
};

/**
 * An input into which the user is constrained to enter only numeric values
 * with a fixed number of decimal places.
 */
export const NumericInput = ({
  value,
  prefix,
  onChange,
  ...props
}: NumericInputProps) => {
  // Keep track of the input's value internally, so we don't lose transitional
  // values, such as the user entering a '.' at the end of a number just before
  // entering the fractional part.
  const [innerValue, setInnerValue] = useState("");

  // Only initialise innerValue on first render.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { value !== 0 && setInnerValue(value.toString()); }, []);

  // On setting `value` prop, update input's value.
  useEffect(() => {
    //  todo unit test
    if (value !== 0) {
      setInnerValue(value.toString());
    } else {
      setInnerValue("");
    }
  }, [value]);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    value = value.replace(/,/g, ""); // Remove commas

    value = value.replace(prefix, ""); // Remove prefix
    
    let valueAsNumber = Number(value);

    if (valueAsNumber > props.maxValue) {
      valueAsNumber = props.maxValue;
      setInnerValue(valueAsNumber.toString());
    }
    else {
      setInnerValue(value);
    }

    onChange(valueAsNumber);
  };

  const handleFocus = () => {
    // So that the input isn't obscured by the pop-up keyboard on mobile devices.
    scrollWindowToTop(props.window || window);
  };

  return (
    <StyledCleave
      options={{
        numeral: true,
        numeralIntegerScale: 5,
        numeralThousandsGroupStyle: "thousand",
        prefix: prefix,
        noImmediatePrefix: true
      }}
      type="tel"
      value={innerValue}
      onInput={handleInput}
      onFocus={handleFocus}
    />
  );
};
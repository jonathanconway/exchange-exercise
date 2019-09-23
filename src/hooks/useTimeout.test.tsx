import React from "react";
import { useTimeout } from "./useTimeout";
import { act } from "react-dom/test-utils";
import { mount } from "enzyme";

describe("useTimeout", () => {
  it("calls the callback once after a period of time has elapsed", (done) => {
    const mockCallback = jest.fn(),
          MockComponent = () => {
            useTimeout(mockCallback, 500);
            
            return <></>;
          };
    // Wrap mount call in act so that useEffect will execute.
    act(() => {
      mount(
        <MockComponent />
      );
    });

    // 100 ms: Interval hasn't been reached
    // 600 ms: Interval reached
    // 1200 ms: No more calls
    setTimeout(() => { expect(mockCallback).not.toBeCalledWith(); }, 100);
    setTimeout(() => { expect(mockCallback).toBeCalledWith(); mockCallback.mockClear(); }, 600);
    setTimeout(() => { expect(mockCallback).not.toBeCalledWith(); done(); }, 1200);
  });
});
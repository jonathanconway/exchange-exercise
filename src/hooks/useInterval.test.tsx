import React from "react";
import { useInterval } from "./useInterval";
import { act } from "react-dom/test-utils";
import { mount } from "enzyme";

describe("useInterval", () => {
  it("calls the callback every interval", (done) => {
    const mockCallback = jest.fn(),
          MockComponent = () => {
            useInterval(mockCallback, 500);
            
            return <></>;
          };

    let wrapper;
    act(() => {
      wrapper =
        mount(
          <MockComponent />
        )
    });

    // 100 ms: 1st interval hasn't been reached
    // 600 ms: 1st interval reached
    // 700 ms: 2nd interval hasn't been reached
    // 1200 ms: 2nd interval reached
    setTimeout(() => { expect(mockCallback).not.toBeCalledWith(); }, 100);
    setTimeout(() => { expect(mockCallback).toBeCalledWith(); mockCallback.mockClear(); }, 600);
    setTimeout(() => { expect(mockCallback).not.toBeCalledWith(); }, 700);
    setTimeout(() => { expect(mockCallback).toBeCalledWith(); done(); }, 1200);
  });
});
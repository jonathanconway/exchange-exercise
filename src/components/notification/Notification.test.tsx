import React from "react";
import { mount } from "enzyme";

import { Notification, TIMEOUT_MS } from "./Notification";
import { Container } from "./Notification.styles";
import { withTheme } from "../../testUtils";
import { act } from "react-dom/test-utils";

describe("<Notification />", () => {
  it("can render", () => {
    mount(
      withTheme(
        <Notification
          notification={{
            message: "",
            type: "info"
          }}
          onClick={() => {}}
          onTimeout={() => {}}
        />));
  });

  describe("rendering", () => {
    it("renders notification correctly", () => {
      const wrapper =
              mount(
                withTheme(
                  <Notification
                    notification={{
                      message: "Hello",
                      type: "info"
                    }}
                    onClick={() => {}}
                    onTimeout={() => {}}
                  />));

      expect(wrapper.findWhere(x => x.text().includes("Info")).exists()).toBeTruthy();
      expect(wrapper.findWhere(x => x.text().includes("Hello")).exists()).toBeTruthy();
    });
  });

  describe("behaviour", () => {
    describe("on click", () => {
      it("triggers onClick handler", () => {
        const mockHandleClick = jest.fn(),
              wrapper =
                mount(
                  withTheme(
                    <Notification
                      notification={{
                        message: "Hello",
                        type: "info"
                      }}
                      onClick={mockHandleClick}
                      onTimeout={() => {}}
                    />));
      
        wrapper.find(Container).simulate("click");

        expect(mockHandleClick).toHaveBeenCalled();
      });
    });

    describe("on timeout", () => {
      it("triggers onTimeout handler", (done) => {
        jest.setTimeout(TIMEOUT_MS + 1500);

        const mockHandleTimeout = jest.fn();
      
        // Wrap mount call in act so that useEffect will execute.
        act(() => {
          mount(
            withTheme(
              <Notification
                notification={{
                  message: "Hello",
                  type: "info"
                }}
                onClick={() => {}}
                onTimeout={mockHandleTimeout}
              />))
        });
      
        expect(mockHandleTimeout).not.toHaveBeenCalled();

        setTimeout(() => {
          expect(mockHandleTimeout).toHaveBeenCalled();
          done();
        }, TIMEOUT_MS + 1000);
      });
    });
  });
});
import React from "react";
import { mount } from "enzyme";

import { Swiper } from "./Swiper";
import SwipeableViews from "react-swipeable-views";
import { IndicatorNotch } from "./Swiper.styles";
import { withTheme } from "../../testUtils";


describe("<Swiper />", () => {
  it("can render", () => {
    mount(
      withTheme(
        <Swiper activeIndex={0}>
          <span></span>
          <span></span>
        </Swiper>));
  });

  describe("rendering", () => {
    const children = [
      <span key="child-1">1</span>,
      <span key="child-2">2</span>,
      <span key="child-3">3</span>
    ];

    it("passes children to swiper", () => {
      const wrapper =
        mount(
          withTheme(
            <Swiper activeIndex={0}>
              {children}
            </Swiper>));


      expect(wrapper.find(SwipeableViews).first().props().children).toEqual(children);
    });

    describe("activeIndex", () => {
      it("on setting, switches panel and indicates the active panel", () => {
        const wrapper =
          mount(
            withTheme(
              <Swiper activeIndex={1}>
                {children}
              </Swiper>));
        
        expect(wrapper.find(SwipeableViews).children().filterWhere(c => c.text() === "2").exists()).toBeTruthy();
        expect(wrapper.find(SwipeableViews).props().index).toEqual(1);
        expect(wrapper.find(IndicatorNotch).at(1).props().isActive).toBeTruthy();
      });
    });
  });

  describe("behaviour", () => {
    describe("onSwipeTo", () => {
      it("is triggered when user slides to a different panel", () => {
        const mockHandleSwipeTo = jest.fn();

        const wrapper =
          mount(
            withTheme(
              <Swiper activeIndex={1} onSwipeTo={mockHandleSwipeTo}>
                <span>1</span>
                <span>2</span>
                <span>3</span>
              </Swiper>));
        
        wrapper.find(SwipeableViews).props().onChangeIndex!(2, 0);

        expect(mockHandleSwipeTo).toHaveBeenCalledWith(2);
      });
    });
  });
});

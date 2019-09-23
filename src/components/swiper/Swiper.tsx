import React, { ReactNode } from "react";
import SwipeableViews from "react-swipeable-views";

import { Container, Indicator, IndicatorNotch } from "./Swiper.styles";

interface SwiperProps {
  readonly children: readonly ReactNode[];
  readonly activeIndex: number;

  readonly onSwipeTo?: (index: number) => void;
}

/**
 * Sliding carousel that the user can drag-drop to view different 'cards' within.
 */
export const Swiper = ({ children, activeIndex, onSwipeTo }: SwiperProps) => {
  const handleSwipeableViewsChangeIndex = (newIndex: number) => {
    if (onSwipeTo) {
      onSwipeTo(newIndex);
    }
  };

  return (
    <Container>
      <SwipeableViews
        enableMouseEvents
        onChangeIndex={handleSwipeableViewsChangeIndex}
        index={activeIndex}>
        {children}
      </SwipeableViews>

      <Indicator>
        {children.map((child, childIndex) =>
          <IndicatorNotch
            isActive={activeIndex === childIndex}
            key={`active-panel-indicator-notch-${childIndex}`}>
          </IndicatorNotch>
        )}
      </Indicator>
    </Container>
  );
};
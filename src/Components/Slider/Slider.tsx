import React, { ReactNode, useMemo } from 'react';
import ReactSlider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import ArrowButton from './components/Arrow';

interface SliderProps {
  children: ReactNode;
  hideArrows?: boolean;
}

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

const arrowsSettings = {
  nextArrow: <ArrowButton orientation="right" />,
  prevArrow: <ArrowButton orientation="left" />,
};

const Slider = ({ children, hideArrows = false }: SliderProps) => {
  const sliderSettings = useMemo(
    () => (hideArrows ? settings : { ...settings, ...arrowsSettings }),
    [hideArrows],
  );
  return (
    <div className="slider">
      <ReactSlider {...sliderSettings}>{children}</ReactSlider>
    </div>
  );
};

export default Slider;

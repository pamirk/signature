import React, { useMemo } from 'react';

export enum TestimonialsViewMode {
  BUYNOW = 'buynow',
  SIGNUP = 'signup',
}
export interface TestimonialItemProps {
  icon: string;
  name: string;
  description?: string;
  text?: string;
  viewMode?: TestimonialsViewMode;
}

const BuyNowView = ({ icon, name, description, text }: TestimonialItemProps) => (
  <div className="slider__item">
    <div className="slider__avatar-wrapper slider__avatar-wrapper-buynow">
      <img src={icon} className="slider__avatar slider__avatar-buynow" alt="" />
      <div className="slider__info slider__info-buynow">
        <div className="slider__name slider__name-buynow">{name}</div>
        <div className="slider__description slider__description-buynow">
          {description}
        </div>
      </div>
    </div>
    <div className="slider__text slider__text-buynow">&quot;{text}&quot;</div>
  </div>
);

const SignUpView = ({ icon, name, description, text }: TestimonialItemProps) => (
  <div className="slider__item">
    <div className="slider__avatar-wrapper">
      <img src={icon} className="slider__avatar" alt="" />
    </div>
    <div className="slider__name">{name}</div>
    <div className="slider__description">{description}</div>
    <div className="slider__text">{text}</div>
  </div>
);

const TestimonialItem = ({
  viewMode = TestimonialsViewMode.SIGNUP,
  ...restProps
}: TestimonialItemProps) => {
  const views = useMemo(
    () => ({
      buynow: BuyNowView,
      signup: SignUpView,
    }),
    [],
  );

  return views[viewMode](restProps);
};

export default TestimonialItem;

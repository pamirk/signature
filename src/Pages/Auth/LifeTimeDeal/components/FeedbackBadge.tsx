import React from 'react';
import { ReactSVG } from 'react-svg';
import PrimeClubIcon from 'Assets/images/icons/prime-club.svg';
import classNames from 'classnames';
import useIsMobile from 'Hooks/Common/useIsMobile';
import Slider from 'Components/Slider';
import { testimonials } from 'Pages/Auth/SignUp/SignUpFirstStep';
import TestimonialItem, {
  TestimonialsViewMode,
} from 'Pages/Auth/SignUp/components/TestimonialItem';

const FeedbackBadge = () => {
  const isMobile = useIsMobile();
  return (
    <>
      <div className="lifeTimeDeal__primeclub-badge-container">
        <ReactSVG src={PrimeClubIcon} className="lifeTimeDeal__primeclub-badge-icon" />
        <span>
          Brought to you by the{' '}
          <a
            href="https://www.facebook.com/groups/primelifetimedeals"
            rel="noopener noreferrer"
            target="_blank"
          >
            Prime Club
          </a>
        </span>
      </div>
      <div className={classNames('lifeTimeDeal__slider', { mobile: isMobile })}>
        <Slider hideArrows>
          {testimonials.map(testimonial => (
            <TestimonialItem
              key={testimonial.name}
              {...testimonial}
              viewMode={TestimonialsViewMode.BUYNOW}
            />
          ))}
        </Slider>
      </div>
    </>
  );
};

export default FeedbackBadge;

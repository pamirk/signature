import React, { useCallback, useMemo } from 'react';
import { Link, RouteChildrenProps } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Toast from 'Services/Toast';
import History from 'Services/History';
import { DataLayerAnalytics, FacebookPixel } from 'Services/Integrations';
import { useSignUp, useSignUpConversionSet } from 'Hooks/Auth';
import { isNotEmpty } from 'Utils/functions';
import {
  isEmailConfirmationData,
  isTwoFactorResponseData,
  isUserResponseData,
} from 'Utils/typeGuards';

import SignUpForm from 'Components/AuthForm/SignUpForm';
import Slider from 'Components/Slider';
import TestimonialItem, { TestimonialItemProps } from './components/TestimonialItem';

import Logo from 'Assets/images/logo.svg';
import LeeIcon from 'Assets/images/users/lee.jpg';
import MahaIcon from 'Assets/images/users/maha.jpg';
import QuinnIcon from 'Assets/images/users/quinn.jpg';
import LulianIcon from 'Assets/images/users/lulian.jpg';
import { useBeaconRemove } from 'Hooks/Common';
import Bing from 'Services/Integrations/Analytics/Bing';
import { UnauthorizedRoutePaths } from 'Interfaces/RoutePaths';
import { Tabs } from './components/Tabs';
import { CURRENT_YEAR } from 'Utils/constants';

export const testimonials = [
  {
    icon: LeeIcon,
    name: 'Lee Gladish',
    description: 'Co-Founder, AirborneApp',
    text: `
      Signaturely is hands down the easiest
      e-signature software to use. I like the
      ability to import files from various
      integration partners and adding my team
      members is a great feature for a product
      at this price point.
    `,
  },
  {
    icon: MahaIcon,
    name: 'Maha Bohdi',
    description: 'Founder, YogiMaha LLC',
    text: `
      Signaturely is absolutely fantastic!!
      The part that I really found incredibly
      valuable as a business owner was the
      contract templates!
    `,
  },
  {
    icon: QuinnIcon,
    name: 'Quinn Zeda',
    description: 'Founder, Conversion Crimes',
    text: `
      Overall, the platform is easy to use and
      figure out for a first time user. My
      signer said that the platform was good,
      easy to use, and understand.
    `,
  },
  {
    icon: LulianIcon,
    name: 'Iulian Margeloiu',
    description: 'Product Manager, Visco',
    text: `
      It had to be the smoothest digital
      signature app I've used. UI is very clean.
    `,
  },
] as TestimonialItemProps[];

interface SignUpFirstStep extends RouteChildrenProps {
  isFreeSignUp?: boolean;
}

const SignUpFirstStep = ({ location, isFreeSignUp }: SignUpFirstStep) => {
  useBeaconRemove();

  const [callSignUp, isLoading] = useSignUp();
  const signUpConversionSet = useSignUpConversionSet();

  const initialValues = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    return {
      email: searchParams.get('email') || undefined,
      name: searchParams.get('name') || undefined,
    };
  }, [location.search]);

  const signUp = useCallback(
    async values => {
      try {
        const response = await callSignUp({ ...values, free: isFreeSignUp });

        FacebookPixel.fireRegistrationEvent();
        Bing.fireRegistrationEvent();

        if (!isNotEmpty(response)) {
          return;
        }
        if (isTwoFactorResponseData(response)) {
          History.push(UnauthorizedRoutePaths.TWO_FACTOR);
        }

        if (isEmailConfirmationData(response)) {
          // DataLayerAnalytics.fireUnconfirmedRegistrationEvent(response.userId);
          // signUpConversionSet();
          History.push(UnauthorizedRoutePaths.CONFIRM_ACCOUNT, {
            confirmationRequired: true,
          });
        }

        if (isUserResponseData(response) && response.isNewUser) {
          DataLayerAnalytics.fireGoogleRegistrationEvent();
          Toast.success('Your account has been created.');
        }
      } catch (error) {
        Toast.handleErrors(error);
      }
    },
    [callSignUp, signUpConversionSet, isFreeSignUp],
  );

  return (
    <div className="sign-up">
      <Helmet>
        <meta
          name="description"
          content="Sign up for a free Signaturely account today and get your documents signed."
        />
        <title>Sign Up | Signaturely</title>
      </Helmet>

      <div className="sign-up__left-side">
        <div className="sign-up__header">
          <Link to={UnauthorizedRoutePaths.BASE_PATH}>
            <img src={Logo} alt="Signaturely" />
          </Link>
        </div>
        {!isFreeSignUp && (
          <div className="sign-up__tabs-wrapper">
            <Tabs activeTab={1} />
          </div>
        )}
        <div className="sign-up__content">
          <div className="auth">
            <h1 className="auth__title auth__title--bold">Create free account</h1>
            <SignUpForm
              initialValues={initialValues}
              isLoading={isLoading}
              onSubmit={signUp}
            />
          </div>
        </div>
        <div className="sign-up__footer">
          © {CURRENT_YEAR} Signaturely |&nbsp;
          <a
            className="sign-up__link"
            href="https://signaturely.com/terms/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms and Conditions
          </a>
        </div>
      </div>
      <div className="sign-up__right-side">
        <div className="sign-up--top-layer">
          <div className="sign-up__title">What People Are Saying</div>
          <Slider>
            {testimonials.map(testimonial => (
              <TestimonialItem key={testimonial.name} {...testimonial} />
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default SignUpFirstStep;

import React from 'react';
import { Router, Switch } from 'react-router-dom';
import History from 'Services/History';

import SimplifiedWrapper from 'Layouts/SimplifiedWrapper';
import { GuestWrapper } from 'Layouts/GuestWrapper';
import { SignUp, Login, ChangePassword } from 'Pages/Auth';
import { TwoFactor } from 'Pages/Auth/TwoFactor';
import { AboutSignaturely } from 'Pages/AboutSignaturely';
import Route from './Route';
import ScrollToTop from 'Components/ScrollToPop';
import SignUpConfirm from 'Pages/Auth/SignUp/ConfirmPage';
import PageTracker from 'Components/PageTracker';
import BuyNow from 'Pages/Auth/BuyNow';
import { PlanTypes } from 'Interfaces/Billing';
import CustomRedirect from './CustomRedirect';
import { UnauthorizedRoutePaths } from 'Interfaces/RoutePaths';
import { BaseRoutes } from '.';
import {
  LifeTimeDeal,
  LifeTimeDealSelect,
  LifeTimeDealSignUp,
} from 'Pages/Auth/LifeTimeDeal';
import LifeTimeDealWrapper from 'Layouts/LifeTimeDealWrapper';
import { LifeTimeDealSuccessPaymentPage } from 'Pages/LifeTimeDeal';

const UnauthorizedRoutes = () => {
  return (
    <Router history={History}>
      <PageTracker />
      <ScrollToTop />
      <Switch>
        {BaseRoutes()}
        <Route exact path={UnauthorizedRoutePaths.SIGN_UP} component={SignUp} />
        <Route
          exact
          path={UnauthorizedRoutePaths.SIGN_UP_FREE}
          component={({ history, location, match }): JSX.Element => (
            <SignUp
              isFreeSignUp={true}
              history={history}
              location={location}
              match={match}
            />
          )}
        />
        <Route
          exact
          path={UnauthorizedRoutePaths.SIGN_UP_LTD}
          layout={LifeTimeDealWrapper}
          component={LifeTimeDealSignUp}
        />
        <Route
          path={UnauthorizedRoutePaths.CONFIRM_ACCOUNT}
          layout={SimplifiedWrapper}
          component={SignUpConfirm}
        />
        <Route
          path={UnauthorizedRoutePaths.CHANGE_PASSWORD}
          layout={SimplifiedWrapper}
          component={ChangePassword}
        />
        <Route
          path={UnauthorizedRoutePaths.LOGIN}
          layout={SimplifiedWrapper}
          component={Login}
        />
        <Route
          path={UnauthorizedRoutePaths.SIGN_UP_BUSINESS}
          layout={SimplifiedWrapper}
          component={() => <BuyNow currentPlan={PlanTypes.BUSINESS} />}
        />
        <Route
          path={UnauthorizedRoutePaths.SIGN_UP_PERSONAL}
          layout={SimplifiedWrapper}
          component={() => <BuyNow currentPlan={PlanTypes.PERSONAL} />}
        />
        <Route
          exact
          path={UnauthorizedRoutePaths.LIFE_TIME_DEAL}
          layout={SimplifiedWrapper}
          component={LifeTimeDealSelect}
        />
        <Route
          path={UnauthorizedRoutePaths.LIFE_TIME_DEAL_TIER}
          layout={SimplifiedWrapper}
          component={LifeTimeDeal}
        />
        <Route
          path={UnauthorizedRoutePaths.LTD_PAYMENT_SUCCESS}
          component={LifeTimeDealSuccessPaymentPage}
          layout={SimplifiedWrapper}
        />
        <Route
          path={UnauthorizedRoutePaths.TWO_FACTOR}
          layout={SimplifiedWrapper}
          component={TwoFactor}
        />
        <Route
          path={UnauthorizedRoutePaths.ABOUT}
          layoutProps={{ isShowFooter: true, isShowHeaderBorder: true }}
          layout={GuestWrapper}
          component={AboutSignaturely}
        />
        <Route
          path={UnauthorizedRoutePaths.BASE_PATH}
          component={() => <CustomRedirect to={UnauthorizedRoutePaths.LOGIN} />}
        />
      </Switch>
    </Router>
  );
};

export default UnauthorizedRoutes;

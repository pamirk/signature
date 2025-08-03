import React from 'react';
import Route from './Route';
import SignUpSecondStep from 'Pages/Auth/SignUp/SignUpSecondStep';
import { AuthorizedRoutePaths } from 'Interfaces/RoutePaths';
import { Router, Switch } from 'react-router-dom';
import ScrollToTop from 'Components/ScrollToPop';
import PageTracker from 'Components/PageTracker';
import CustomRedirect from './CustomRedirect';
import History from 'Services/History';
import { BaseRoutes } from '.';

const ActivateTrialRoutes = () => {
  return (
    <Router history={History}>
      <PageTracker />
      <ScrollToTop />
      <Switch>
        {BaseRoutes()}
        <Route path={AuthorizedRoutePaths.ACTIVATE_TRIAL} component={SignUpSecondStep} />
        <CustomRedirect to={AuthorizedRoutePaths.ACTIVATE_TRIAL} isAuth />
      </Switch>
    </Router>
  );
};

export default ActivateTrialRoutes;

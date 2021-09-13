import React from 'react';
import {Router, Switch, Redirect} from 'react-router-dom';
import History from 'Services/History';

import SimplifiedWrapper from 'Layouts/SimplifiedWrapper';
import {GuestWrapper} from 'Layouts/GuestWrapper';
import {SignUp, ForgotPassword, Login, ChangePassword} from 'Pages/Auth';
import TwoFactor from 'Pages/Auth/TwoFactor/TwoFactor';
import DocumentSign from 'Pages/DocumentSign/DocumentSign';
import {DocumentDownload} from 'Pages/DocumentDownload/DocumentDownload';
import InviteAcceptPage from 'Pages/Team/InviteAcceptPage';
import AboutSignaturely from 'Pages/AboutSignaturely/AboutSignaturely';
import Route from './Route';
import ConfirmEmail from 'Pages/Auth/ConfirmEmail/ConfirmEmail';
import LoadingUserScreen from 'Pages/AppSumo/LoadingUserScreen';
import ScrollToTop from 'Components/ScrollToPop/ScrollToTop';
import SignUpConfirm from 'Pages/Auth/SignUp/ConfirmPage';
import PageTracker from 'Components/PageTracker/PageTracker';
import BuyNow from 'Pages/Auth/BuyNow/BuyNow';
import {PlanTypes} from 'Interfaces/Billing';
import FormRequestShow from 'Pages/FormRequests/FormRequestShow/FormRequestShow';

const UnauthorizedRoutes = () => {
    return (
        <Router history={History}>
            <PageTracker/>
            <ScrollToTop/>
            <Switch>
                <Route exact path="/signup" component={SignUp}/>
                <Route
                    path="/confirm-account"
                    layout={SimplifiedWrapper}
                    component={SignUpConfirm}
                />
                <Route path="/appsumo_thanks" component={LoadingUserScreen}/>
                <Route
                    path="/confirm_email"
                    component={ConfirmEmail}
                    layout={SimplifiedWrapper}
                />
                <Route path="/reset" layout={SimplifiedWrapper} component={ForgotPassword}/>
                <Route
                    path="/change_password"
                    layout={SimplifiedWrapper}
                    component={ChangePassword}
                />
                <Route path="/login" layout={SimplifiedWrapper} component={Login}/>
                <Route
                    path="/signup/business"
                    layout={SimplifiedWrapper}
                    component={() => <BuyNow currentPlan={PlanTypes.BUSINESS}/>}
                />
                <Route
                    path="/signup/personal"
                    layout={SimplifiedWrapper}
                    component={() => <BuyNow currentPlan={PlanTypes.PERSONAL}/>}
                />
                <Route path="/two-factor" layout={SimplifiedWrapper} component={TwoFactor}/>
                <Route
                    exact
                    path="/teams/:teamId/accept_invite"
                    layout={SimplifiedWrapper}
                    component={InviteAcceptPage}
                />
                <Route
                    path="/documents/:documentId/sign"
                    layout={GuestWrapper}
                    component={DocumentSign}
                />
                <Route path="/documents/:documentId/download" component={DocumentDownload}/>
                <Route
                    path="/documents/:documentId/:signerId/download"
                    component={DocumentDownload}
                />
                <Route
                    path="/about"
                    layoutProps={{isShowFooter: true, isShowHeaderBorder: true}}
                    layout={GuestWrapper}
                    component={AboutSignaturely}
                />
                <Route
                    path="/form-requests/:formRequestId/send"
                    layout={GuestWrapper}
                    layoutProps={{isShowFooter: false, isShowHeaderBorder: true}}
                    component={FormRequestShow}
                />
                <Route path="/" component={() => <Redirect to="/login"/>}/>
            </Switch>
        </Router>
    );
};

export default UnauthorizedRoutes;

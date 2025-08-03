import React from 'react';
import Route from './Route';
import { DocumentActivitiesDownload } from 'Pages/DocumentActivitiesDownload';
import { EmbedInteractModal } from 'Components/Interact/EmbedInteractModal';
import FormRequestShow from 'Pages/FormRequests/FormRequestShow';
import { DocumentDownload } from 'Pages/DocumentDownload';
import SimplifiedWrapper from 'Layouts/SimplifiedWrapper';
import { InvoiceDownload } from 'Pages/InvoiceDownload';
import { UnlinkRemindersPage } from 'Pages/Documents';
import { GuestWrapper } from 'Layouts/GuestWrapper';
import ConfirmEmail from 'Pages/Auth/ConfirmEmail';
import { RoutePaths } from 'Interfaces/RoutePaths';
import { DocumentSign } from 'Pages/DocumentSign';
import { LoadingUserScreen } from 'Pages/AppSumo';
import { ForgotPassword, LandingSignUpConfirm, LandingSignUpWrapper } from 'Pages/Auth';
import * as TeamPages from 'Pages/Team';
import { LandingSignUpThanks } from 'Pages/Auth/LandingSignUp/components';

const BaseRoutes = () => [
  <Route
    key={RoutePaths.APPSUMO_THANKS}
    path={RoutePaths.APPSUMO_THANKS}
    component={LoadingUserScreen}
  />,
  <Route
    key={RoutePaths.RESET}
    path={RoutePaths.RESET}
    component={ForgotPassword}
    layout={SimplifiedWrapper}
  />,
  <Route
    key={RoutePaths.CONFIRM_EMAIL}
    path={RoutePaths.CONFIRM_EMAIL}
    component={ConfirmEmail}
    layout={SimplifiedWrapper}
  />,
  <Route
    key={RoutePaths.ACCEPT_INVITE}
    path={RoutePaths.ACCEPT_INVITE}
    component={TeamPages.InviteAcceptPage}
    layout={SimplifiedWrapper}
    exact
  />,
  <Route
    key={RoutePaths.REMINDERS_UNLINK}
    path={RoutePaths.REMINDERS_UNLINK}
    component={UnlinkRemindersPage}
    layout={SimplifiedWrapper}
    exact
  />,
  <Route
    key={RoutePaths.DOCUMENT_SIGN}
    path={RoutePaths.DOCUMENT_SIGN}
    component={DocumentSign}
    layout={GuestWrapper}
  />,
  <Route
    key={RoutePaths.EMBED_DOCUMENT}
    path={RoutePaths.EMBED_DOCUMENT}
    component={EmbedInteractModal}
    layout={GuestWrapper}
  />,
  <Route
    key={RoutePaths.DOCUMENT_DOWNLOAD}
    path={RoutePaths.DOCUMENT_DOWNLOAD}
    component={DocumentDownload}
  />,
  <Route
    key={RoutePaths.ORIGINAL_DOCUMENT_DOWNLOAD}
    path={RoutePaths.ORIGINAL_DOCUMENT_DOWNLOAD}
    component={DocumentDownload}
  />,
  <Route
    key={RoutePaths.SEPARATED_DOCUMENT_DOWNLOAD}
    path={RoutePaths.SEPARATED_DOCUMENT_DOWNLOAD}
    component={DocumentDownload}
  />,
  <Route
    key={RoutePaths.DOCUMENT_ACTIVITIES_DOWNLOAD}
    path={RoutePaths.DOCUMENT_ACTIVITIES_DOWNLOAD}
    component={DocumentActivitiesDownload}
  />,
  <Route
    key={RoutePaths.SIGNER_DOCUMENT_DOWNLOAD}
    path={RoutePaths.SIGNER_DOCUMENT_DOWNLOAD}
    component={DocumentDownload}
  />,
  <Route
    key={RoutePaths.INVOICE_DOWNLOAD}
    path={RoutePaths.INVOICE_DOWNLOAD}
    component={InvoiceDownload}
  />,
  <Route
    key={RoutePaths.FORM_REQUESTS_SEND}
    path={RoutePaths.FORM_REQUESTS_SEND}
    component={FormRequestShow}
    layout={GuestWrapper}
    layoutProps={{ isShowFooter: false, isShowHeaderBorder: true }}
    exact
  />,
  <Route
    key={RoutePaths.LANDING_SIGNUP}
    path={RoutePaths.LANDING_SIGNUP}
    component={LandingSignUpWrapper}
  />,
  <Route
    key={RoutePaths.LANDING_SIGNUP_CONFIRM}
    path={RoutePaths.LANDING_SIGNUP_CONFIRM}
    component={LandingSignUpConfirm}
  />,
  <Route
    key={RoutePaths.LANDING_SIGNUP_THANKS}
    path={RoutePaths.LANDING_SIGNUP_THANKS}
    component={LandingSignUpThanks}
  />,
];

export default BaseRoutes;

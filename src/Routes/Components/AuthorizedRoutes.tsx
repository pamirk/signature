import React, { useMemo } from 'react';
import { Switch, Router, Redirect } from 'react-router-dom';
import History from 'Services/History';

import AuthenticatedWrapper from 'Layouts/AuthenticatedWrapper';
import SimplifiedWrapper from 'Layouts/SimplifiedWrapper';
import SettingsWrapper from 'Layouts/SettingsWrapper';
import { GuestWrapper } from 'Layouts/GuestWrapper';
import * as Sign from 'Pages/Sign';
import Documents from 'Pages/Documents';
import * as Templates from 'Pages/Templates';
import * as Settings from 'Pages/Settings';
import * as Integrations from 'Pages/Integrations';
import * as DocumentPreview from 'Pages/DocumentPreview';
import DocumentEditScreen from 'Pages/DocumentEdit';
import * as TeamPages from 'Pages/Team';
import { ForgotPassword } from 'Pages/Auth';
import { DocumentSign } from 'Pages/DocumentSign';
import { DocumentDownload } from 'Pages/DocumentDownload';
import Route from './Route';
import { User, UserRoles } from 'Interfaces/User';
import ForbiddenAccessTable from 'Components/ForbiddenAccessTable';
import { useSelector } from 'react-redux';
import { selectUser } from 'Utils/selectors';
import SidebarSubLayout from 'Layouts/sublayouts/SidebarSubLayout';
import { DocumentPreviewSubLayout } from 'Layouts/sublayouts/DocumentPreviewSubLayout';
import { LoadingUserScreen } from 'Pages/AppSumo';
import ScrollToTop from 'Components/ScrollToPop';
import useUpvotySurvey from 'Hooks/Common/useUpvotySurvey';
import PageTracker from 'Components/PageTracker';
import FormRequestsScreen from 'Pages/FormRequests/FormRequestsScreen';
import FormRequestCreate from 'Pages/FormRequests/FormRequestCreate';
import FormRequestEdit from 'Pages/FormRequests/FormRequestEdit';
import FormRequestShow from 'Pages/FormRequests/FormRequestShow';
import ConfirmEmail from 'Pages/Auth/ConfirmEmail';

const AuthorizedRoutes = () => {
  const { role, email, name, id }: User = useSelector(selectUser);
  const isOwner = useMemo(() => role === UserRoles.OWNER, [role]);

  useUpvotySurvey(email as string, name as string, id);

  return (
    <Router history={History}>
      <PageTracker />
      <ScrollToTop />
      <Switch>
        <Route path="/appsumo_thanks" component={LoadingUserScreen} />
        <Route path="/reset" layout={SimplifiedWrapper} component={ForgotPassword} />
        <Route
          path="/confirm_email"
          component={ConfirmEmail}
          layout={SimplifiedWrapper}
        />
        <Route
          path="/documents/:documentId/preview"
          layout={AuthenticatedWrapper}
          subLayout={DocumentPreviewSubLayout}
          component={DocumentPreview.DocumentPreview}
        />
        <Route
          path="/documents/:documentId/sign"
          layout={GuestWrapper}
          component={DocumentSign}
        />
        <Route
          exact
          path="/teams/:teamId/accept_invite"
          layout={SimplifiedWrapper}
          component={TeamPages.InviteAcceptPage}
        />
        <Route
          path="/documents/:documentId/:signerId/download"
          component={DocumentDownload}
        />
        <Route path="/documents/:documentId/download" component={DocumentDownload} />
        <Route path="/" layout={AuthenticatedWrapper} subLayout={SidebarSubLayout}>
          <Route path="/sign" component={Sign.Dashboard} />
          <Route path="/only-me" component={Sign.OnlyMe} />
          <Route path="/bulk-send" component={Sign.BulkSend} />
          <Route path="/me-and-others" component={Sign.MeAndOthers} />
          <Route path="/only-others" component={Sign.OnlyOthers} />
          <Route exact path="/documents/:status?" component={Documents} />
          <Route
            exact
            path="/documents/:documentId/edit"
            component={DocumentEditScreen}
          />
          <Route exact path="/templates" component={Templates.TemplatesScreen} />
          <Route exact path="/templates/create" component={Templates.TemplateCreate} />
          <Route exact path="/templates/:status?" component={Templates.TemplatesScreen} />
          <Route
            exact
            path="/templates/:templateId/edit"
            component={Templates.TemplateEdit}
          />
          <Route
            exact
            path="/form-requests/:formRequestId/send"
            component={FormRequestShow}
          />
          <Route exact path="/form-requests" component={FormRequestsScreen} />
          <Route exact path="/form-requests/create" component={FormRequestCreate} />
          <Route exact path="/form-requests/:status?" component={FormRequestsScreen} />
          <Route
            exact
            path="/form-requests/:formRequestId/edit"
            component={FormRequestEdit}
          />

          <Route path="/integrations" component={Integrations.Integrations} />
          <Route path="/team" component={TeamPages.TeamScreen} />
          <Route path="/settings" layout={SettingsWrapper}>
            <Route
              path="/settings/company"
              isForbidden={!isOwner}
              forbiddenComponent={ForbiddenAccessTable}
              component={Settings.Company}
            />
            <Route path="/settings/profile" component={Settings.Profile} />
            {/*             <Route
              path="/settings/apiSubscription"
              isForbidden={!isOwner}
              forbiddenComponent={ForbiddenAccessTable}
              component={Settings.ApiSubscription}
            /> */}
            <Route
              path="/settings/api/:apiKeyId/request_history"
              isForbidden={!isOwner}
              forbiddenComponent={ForbiddenAccessTable}
              component={Settings.RequestHistory}
            />
            <Route
              path="/settings/api"
              isForbidden={!isOwner}
              forbiddenComponent={ForbiddenAccessTable}
              component={Settings.Api}
            />
            <Route path="/settings/edit-signature" component={Settings.SignaturePage} />
            <Route
              exact
              path="/settings/billing"
              component={Settings.BillingMainScreen}
              isForbidden={!isOwner}
              forbiddenComponent={ForbiddenAccessTable}
            />
            <Route
              path="/settings/billing/plan"
              component={Settings.BillingPlan}
              isForbidden={!isOwner}
              forbiddenComponent={ForbiddenAccessTable}
            />
            <Redirect to="/settings/company" />
          </Route>
          <Redirect to="/sign" />
        </Route>
      </Switch>
    </Router>
  );
};

export default AuthorizedRoutes;

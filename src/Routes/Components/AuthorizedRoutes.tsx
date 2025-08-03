import React, { useEffect, useMemo } from 'react';
import { Switch, Router, Redirect } from 'react-router-dom';
import History from 'Services/History';

import AuthenticatedWrapper from 'Layouts/AuthenticatedWrapper';
import SimplifiedWrapper from 'Layouts/SimplifiedWrapper';
import SettingsWrapper from 'Layouts/SettingsWrapper';
import * as Sign from 'Pages/Sign';
import Documents from 'Pages/Documents';
import * as SignatureRequests from 'Pages/SignatureRequests';
import * as Templates from 'Pages/Templates';
import * as Settings from 'Pages/Settings';
import * as Integrations from 'Pages/Integrations';
import * as DocumentPreview from 'Pages/DocumentPreview';
import * as TeamPages from 'Pages/Team';
import Route from './Route';
import { User, UserRoles } from 'Interfaces/User';
import ForbiddenAccessTable from 'Components/ForbiddenAccessTable';
import { useSelector } from 'react-redux';
import { selectUser } from 'Utils/selectors';
import SidebarSubLayout from 'Layouts/sublayouts/SidebarSubLayout';
import { DocumentPreviewSubLayout } from 'Layouts/sublayouts/DocumentPreviewSubLayout';
import ScrollToTop from 'Components/ScrollToPop';
import useUpvotySurvey from 'Hooks/Common/useUpvotySurvey';
import PageTracker from 'Components/PageTracker';
import FormRequestsScreen from 'Pages/FormRequests/FormRequestsScreen';
import FormRequestCreate from 'Pages/FormRequests/FormRequestCreate';
import FormRequestEdit from 'Pages/FormRequests/FormRequestEdit';
import { useGoogleClientIdUpdate } from 'Hooks/User';
import { Upsell } from 'Pages/Upsell';
import CustomRedirect from './CustomRedirect';
import { AuthorizedRoutePaths } from 'Interfaces/RoutePaths';
import * as Trash from 'Pages/Trash';
import TrialGetPage from 'Pages/Auth/SignUp/TrialGetPage';
import { BaseRoutes } from '.';
import { LifeTimeDealActivateCode, LifeTimeDealUpgrade } from 'Pages/LifeTimeDeal';
import LifeTimeDealWrapper from 'Layouts/LifeTimeDealWrapper';
import LifeTimeDealSuccessUpgradePage from 'Pages/LifeTimeDeal/LifeTimeDealSuccessUpgradePage';
import { TrialSuccess } from 'Pages/Auth/TrialSuccess';

const AuthorizedRoutes = () => {
  const { role, email, name, id, clientId }: User = useSelector(selectUser);
  const isOwner = useMemo(() => role === UserRoles.OWNER, [role]);
  const isAdmin = useMemo(() => role === UserRoles.ADMIN, [role]);
  const [updateGoogleClientId] = useGoogleClientIdUpdate();

  useEffect(() => {
    if (!clientId) {
      updateGoogleClientId(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useUpvotySurvey(email as string, name as string, id);

  return (
    <Router history={History}>
      <PageTracker />
      <ScrollToTop />
      <Switch>
        {BaseRoutes()}
        <Route
          path={AuthorizedRoutePaths.LTD_UPGRADE}
          component={LifeTimeDealUpgrade}
          layout={LifeTimeDealWrapper}
        />
        <Route
          path={AuthorizedRoutePaths.REDEEM_LTD_CODE}
          component={LifeTimeDealActivateCode}
          layout={LifeTimeDealWrapper}
        />
        <Route
          path={AuthorizedRoutePaths.LTD_UPGRADE_SUCCESS}
          component={LifeTimeDealSuccessUpgradePage}
          layout={SimplifiedWrapper}
        />
        <Route
          path={AuthorizedRoutePaths.UPSELL}
          component={Upsell}
          layout={SimplifiedWrapper}
        />
        <Route
          path={AuthorizedRoutePaths.DOCUMENT_PREVIEW}
          layout={AuthenticatedWrapper}
          subLayout={DocumentPreviewSubLayout}
          component={DocumentPreview.DocumentPreview}
        />
        <Route
          exact
          path={AuthorizedRoutePaths.TRY_TRIAL}
          layout={AuthenticatedWrapper}
          component={TrialGetPage}
        />
        <Route
          exact
          path={AuthorizedRoutePaths.TRIAL_SUCCESS}
          layout={AuthenticatedWrapper}
          component={TrialSuccess}
        />
        <Route
          path={AuthorizedRoutePaths.BASE_PATH}
          layout={AuthenticatedWrapper}
          subLayout={SidebarSubLayout}
        >
          <Route path={AuthorizedRoutePaths.SIGN} component={Sign.Dashboard} />
          <Route exact path={AuthorizedRoutePaths.TRASH} component={Trash.TrashScreen} />
          <Route
            exact
            path={AuthorizedRoutePaths.RECEIVED_DOCUMENTS}
            component={SignatureRequests.SignatureRequestsScreen}
          />
          <Route
            exact
            path={AuthorizedRoutePaths.DOCUMENTS_STATUS}
            component={Documents}
          />
          <Route
            exact
            path={AuthorizedRoutePaths.DOCUMENTS_EDIT}
            component={Sign.Dashboard}
          />
          <Route
            exact
            path={AuthorizedRoutePaths.TEMPLATES}
            component={() => <Redirect to={AuthorizedRoutePaths.TEMPLATES_ACTIVE} />}
          />
          <Route
            exact
            path={AuthorizedRoutePaths.TEMPLATES_CREATE}
            component={Templates.TemplateCreate}
          />
          <Route
            exact
            path={AuthorizedRoutePaths.TEMPLATES_EDIT}
            component={Templates.TemplateEdit}
          />
          <Route
            exact
            path={AuthorizedRoutePaths.TEMPLATES_STATUS}
            component={Templates.TemplatesScreen}
          />
          <Route
            exact
            path={AuthorizedRoutePaths.FORM_REQUESTS}
            component={FormRequestsScreen}
          />
          <Route
            exact
            path={AuthorizedRoutePaths.FORM_REQUESTS_CREATE}
            component={FormRequestCreate}
          />
          <Route
            exact
            path={AuthorizedRoutePaths.FORM_REQUESTS_STATUS}
            component={FormRequestsScreen}
          />
          <Route
            exact
            path={AuthorizedRoutePaths.FORM_REQUESTS_EDIT}
            component={FormRequestEdit}
          />

          <Route
            path={AuthorizedRoutePaths.INTEGRATIONS}
            component={Integrations.Integrations}
          />
          <Route path={AuthorizedRoutePaths.TEAM} component={TeamPages.TeamScreen} />
          <Route path={AuthorizedRoutePaths.SETTINGS} layout={SettingsWrapper}>
            <Route
              path={AuthorizedRoutePaths.SETTINGS_COMPANY}
              isForbidden={!(isOwner || isAdmin)}
              forbiddenComponent={ForbiddenAccessTable}
              component={Settings.Company}
            />
            <Route
              path={AuthorizedRoutePaths.SETTINGS_PROFILE}
              component={Settings.Profile}
            />
            <Route
              path={AuthorizedRoutePaths.SETTINGS_REQUEST_HISTORY}
              isForbidden={!isOwner}
              forbiddenComponent={ForbiddenAccessTable}
              component={Settings.RequestHistory}
            />
            <Route
              path={AuthorizedRoutePaths.SETTINGS_API}
              isForbidden={!isOwner}
              forbiddenComponent={ForbiddenAccessTable}
              component={Settings.Api}
            />
            <Route
              path={AuthorizedRoutePaths.SETTINGS_EDIT_SIGNATURE}
              component={Settings.SignaturePage}
            />
            <Route
              exact
              path={AuthorizedRoutePaths.SETTINGS_BILLING}
              component={Settings.BillingMainScreen}
              isForbidden={!isOwner}
              forbiddenComponent={ForbiddenAccessTable}
            />
            <Route
              path={AuthorizedRoutePaths.SETTINGS_BILLING_PLAN}
              component={Settings.BillingPlan}
              isForbidden={!isOwner}
              forbiddenComponent={ForbiddenAccessTable}
            />
            <Redirect to={AuthorizedRoutePaths.SETTINGS_COMPANY} />
          </Route>
          <CustomRedirect to={AuthorizedRoutePaths.SIGN} isAuth />
        </Route>
      </Switch>
    </Router>
  );
};

export default AuthorizedRoutes;

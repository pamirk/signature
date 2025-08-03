import UIButton from 'Components/UIComponents/UIButton';
import { useInviteAccepting, useTeamJoin } from 'Hooks/Team';
import { AuthorizedRoutePaths } from 'Interfaces/RoutePaths';
import History from 'Services/History';
import { DataLayerAnalytics } from 'Services/Integrations';
import Toast from 'Services/Toast';
import jwt_decode from 'jwt-decode';
import React, { useCallback, useEffect, useMemo } from 'react';
import { RouteChildrenProps } from 'react-router-dom';

interface PageParams {
  teamId: string;
}

const InviteAcceptPage = ({ location, match }: RouteChildrenProps<PageParams>) => {
  const [initInviteAccepting, finishInviteAccepting] = useInviteAccepting();
  const [acceptInvite, isLoading] = useTeamJoin();

  const { signToken, teamId } = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    const teamId = match?.params.teamId;

    return {
      signToken: searchParams.get('invitationToken'),
      teamId,
    };
  }, [location.search, match]);

  const navigateToRoot = useCallback(() => {
    History.replace(AuthorizedRoutePaths.BASE_PATH);
  }, []);

  const handleInviteAccept = useCallback(
    async (teamId: string, userId: string) => {
      try {
        await acceptInvite({ teamId });
        DataLayerAnalytics.fireConfirmedRegistrationEvent(userId);
        Toast.success('Invite accepted.');
      } catch (error) {
        Toast.error(
          error.message ??
            'Unable to upgrade subscription. Please contact the team owner.',
        );
        navigateToRoot();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    if (!signToken || !teamId) {
      return navigateToRoot();
    }

    const parsedToken: any = jwt_decode(signToken);

    initInviteAccepting({ token: signToken });
    handleInviteAccept(teamId, parsedToken.sub);

    return () => finishInviteAccepting();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finishInviteAccepting, initInviteAccepting, navigateToRoot, signToken]);

  return (
    <div className="team__accept-wrapper">
      <div className="team__accept">
        <h1 className="team__accept-title">You have been joined to team</h1>
        <div className="team__accept-button">
          <UIButton
            priority="primary"
            title="Back to main page"
            handleClick={navigateToRoot}
            isLoading={isLoading}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default InviteAcceptPage;

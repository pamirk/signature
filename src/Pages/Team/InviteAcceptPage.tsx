import React, { useMemo, useEffect, useCallback } from 'react';
import UIButton from 'Components/UIComponents/UIButton';
import { useInviteAccepting, useTeamJoin } from 'Hooks/Team';
import { RouteChildrenProps } from 'react-router-dom';
import History from 'Services/History';
import { DataLayerAnalytics } from 'Services/Integrations';
import Toast from 'Services/Toast';

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
    History.replace('/');
  }, []);

  const handleInviteAccept = useCallback(
    async (teamId: string) => {
      try {
        await acceptInvite({ teamId });
        DataLayerAnalytics.fireConfirmedRegistrationEvent();
        Toast.success('Invite accepted.');
      } catch (error) {
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

    initInviteAccepting({ token: signToken });
    handleInviteAccept(teamId);

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

import React, { useMemo, useCallback, useEffect } from 'react';
import UIButton from 'Components/UIComponents/UIButton';
import { RouteChildrenProps } from 'react-router-dom';
import History from 'Services/History';
import { useAccessTokenInit } from 'Hooks/Auth';
import { useSigningRemindersUnlink } from 'Hooks/DocumentSign';
import Toast from 'Services/Toast';
import { UnauthorizedRoutePaths } from 'Interfaces/RoutePaths';

interface PageParams {
  signerId: string;
}

const UnlinkRemindersPage = ({ location, match }: RouteChildrenProps<PageParams>) => {
  const [initAccessToken, finishInitAccessToken] = useAccessTokenInit();
  const [unlinkReminders, isLoading] = useSigningRemindersUnlink();

  const { signToken, signerId } = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    const signerId = match?.params.signerId;

    return {
      signToken: searchParams.get('accessToken'),
      signerId,
    };
  }, [location.search, match]);

  const navigateToRoot = useCallback(() => {
    History.replace(UnauthorizedRoutePaths.BASE_PATH);
  }, []);

  const handleUnlinkReminders = useCallback(
    async (signerId: string) => {
      try {
        await unlinkReminders({ signerId });
        Toast.success('Reminders stopped.');
      } catch (error) {
        navigateToRoot();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    if (!signToken || !signerId) {
      return navigateToRoot();
    }

    initAccessToken({ token: signToken });
    handleUnlinkReminders(signerId);

    return () => finishInitAccessToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleUnlinkReminders, navigateToRoot, signToken]);

  return (
    <div className="team__accept-wrapper">
      <div className="team__accept">
        <h1 className="team__accept-title">
          You have been unlinked from reminders for the document
        </h1>
        <div className="team__accept-button">
          <UIButton
            priority="primary"
            title="Back to main page"
            handleClick={navigateToRoot}
            disabled={isLoading}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default UnlinkRemindersPage;

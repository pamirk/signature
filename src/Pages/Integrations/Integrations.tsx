import React, { useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { RouteChildrenProps } from 'react-router-dom';
import Toast from 'Services/Toast';
import { IntegrationTypes, Integration } from 'Interfaces/Integration';
import { selectUserIntegrations } from 'Utils/selectors';

import { IntegrationItemProps, IntegrationItem } from './IntegrationItem';

import GoogleDriveIcon from 'Assets/images/integtationsExampleIcons/google-drive-icon.svg';
import DropBoxIcon from 'Assets/images/integtationsExampleIcons/drop-box-icon.svg';
import OneDriveIcon from 'Assets/images/integtationsExampleIcons/one-drive-icon.svg';
import BoxIcon from 'Assets/images/integtationsExampleIcons/box-icon.svg';
import useIsMobile from 'Hooks/Common/useIsMobile';
import classNames from 'classnames';

enum IntegrationActivationStatuses {
  SUCCESS = 'success',
  ERROR = 'error',
}

export const integrationsList: Omit<IntegrationItemProps, 'isActivate'>[] = [
  {
    type: IntegrationTypes.GOOGLE_DRIVE,
    title: 'Google Drive',
    icon: GoogleDriveIcon,
    description: 'Easily import documents and files from Google Drive.',
  },
  {
    type: IntegrationTypes.DROPBOX,
    title: 'Dropbox',
    icon: DropBoxIcon,
    description: 'Easily import documents and files from Dropbox.',
  },
  {
    type: IntegrationTypes.ONE_DRIVE,
    title: 'One Drive',
    icon: OneDriveIcon,
    description: 'Easily import documents and files from One Drive.',
  },
  {
    type: IntegrationTypes.BOX,
    title: 'Box',
    icon: BoxIcon,
    description: 'Easily import documents and files from Box.',
  },
];

const Integrations = ({ location }: RouteChildrenProps<any>) => {
  const userIntegrations: Integration[] = useSelector(selectUserIntegrations);
  const isMobile = useIsMobile();

  useLayoutEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const status = searchParams.get('status');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    const type = searchParams.get('type') as IntegrationTypes | null;

    window.history.replaceState({}, '', window.location.pathname);

    if (status === IntegrationActivationStatuses.ERROR && errorDescription) {
      const errorMessage =
        error === 'access_denied'
          ? 'You have denied access for Signaturely'
          : errorDescription;

      if (window && window.opener) {
        window.opener.postMessage(
          { integrationStatus: { type, status, error: errorMessage } },
          '*',
        );
        window.close();
      }

      Toast.error(errorMessage);
    } else if (status === IntegrationActivationStatuses.SUCCESS && type) {
      const integrationTitle = integrationsList.find(
        integration => integration.type === type,
      )?.title;

      if (window && window.opener) {
        window.opener.postMessage({ integrationStatus: { type, status } }, '*');
        window.close();
      }

      Toast.success(`${integrationTitle} successfully integrated!`);
    }
  }, [location.search]);

  return (
    <div className="integrations__wrapper">
      <p className="integrations__title">Integrations</p>
      <p className="integrations__subTitle">
        Connect Signaturely with the tools you already know and love.
      </p>
      <ul className={classNames('integrations__list', { mobile: isMobile })}>
        {integrationsList.map(integration => (
          <IntegrationItem
            key={integration.type}
            {...integration}
            isActivate={
              !!userIntegrations.find(
                userIntegration => userIntegration.type === integration.type,
              )
            }
          />
        ))}
      </ul>
    </div>
  );
};

export default Integrations;

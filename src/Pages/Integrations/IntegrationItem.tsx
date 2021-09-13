import React, { useCallback } from 'react';
import { IntegrationTypes, IntegrationUrlPayload } from 'Interfaces/Integration';
import UIButton from 'Components/UIComponents/UIButton';
import { useAuthUrlGet, useIntegrationDeactivate } from 'Hooks/Integration';
import Toast from 'Services/Toast';
import useIsMobile from 'Hooks/Common/useIsMobile';
import classNames from 'classnames';

export interface IntegrationItemProps {
  type: IntegrationTypes;
  title: string;
  icon: string;
  description: string;
  isActivate?: boolean;
}

export const IntegrationItem = ({
  type,
  description,
  icon,
  title,
  isActivate = false,
}: IntegrationItemProps) => {
  const [getAuthUrl, isGettingAuthUrl] = useAuthUrlGet();
  const [deactivateIntegration, isDeactivatingIntegration] = useIntegrationDeactivate();
  const isMobile = useIsMobile();

  const handleAuthUrlGet = useCallback(async () => {
    try {
      const { url } = (await getAuthUrl({ type })) as IntegrationUrlPayload;

      window.location.replace(url);
    } catch (err) {
      Toast.handleErrors(err);
    }
  }, [getAuthUrl, type]);

  const handleIntegrationDeactivate = useCallback(async () => {
    try {
      const { url } = (await deactivateIntegration({ type })) as IntegrationUrlPayload;

      if (type === IntegrationTypes.ONE_DRIVE) {
        window.location.replace(url);
      }

      Toast.success(`${title} integration successfully deactivated`);
    } catch (err) {
      Toast.handleErrors(err);
    }
  }, [deactivateIntegration, type, title]);

  return (
    <li key={type} className={classNames('integrations__item', { mobile: isMobile })}>
      <div className="integrations__item-icon-wrapper">
        <img
          src={icon}
          className={classNames('integrations__item-icon', { mobile: isMobile })}
          alt="title"
        />
      </div>
      <p className={classNames('integrations__item-title', { mobile: isMobile })}>
        {title}
      </p>
      <p className={classNames('integrations__item-desc', { mobile: isMobile })}>
        {description}
      </p>
      {type !== IntegrationTypes.DROPBOX ? (
        <div className="integrations__item-button">
          <UIButton
            priority={isActivate ? 'secondary' : 'primary'}
            title={isActivate ? 'Deactivate' : 'Activate'}
            isLoading={isGettingAuthUrl || isDeactivatingIntegration}
            disabled={isGettingAuthUrl || isDeactivatingIntegration}
            handleClick={isActivate ? handleIntegrationDeactivate : handleAuthUrlGet}
          />
        </div>
      ) : (
        <div className="integrations__item-button">
          <UIButton priority={'secondary'} title={'Available by default'} disabled />
        </div>
      )}
    </li>
  );
};

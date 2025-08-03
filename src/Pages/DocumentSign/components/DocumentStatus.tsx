import React, { useCallback, PropsWithChildren } from 'react';
import { ReactSVG } from 'react-svg';
import UIButton from 'Components/UIComponents/UIButton';
import { DocumentStatusOption } from 'Interfaces/Document';
import { UnauthorizedRoutePaths } from 'Interfaces/RoutePaths';
import History from 'Services/History';
import { BASE_ASSETS_URL } from 'Utils/constants';
import { documentStatusOptions } from '../common/documentStatusOptions';
import { renderByAuth } from '../common/renderByAuth';

interface DocumentStatusCardProps {
  status: DocumentStatusOption;
  authorized?: boolean;
  companyLogoKey?: string | null;
}

const navigateToHelpCenter = () => {
  window.location.href = 'https://help.signaturely.com/';
};

const DocumentStatus = (props: PropsWithChildren<DocumentStatusCardProps>) => {
  const { authorized, companyLogoKey, status } = props;

  const documentStatusOption = documentStatusOptions[status];

  const handleActionButtonClick = useCallback(
    () =>
      History.push(
        authorized ? UnauthorizedRoutePaths.BASE_PATH : UnauthorizedRoutePaths.SIGN_UP,
      ),
    [authorized],
  );

  return (
    <div className="document-status">
      {!!companyLogoKey && (
        <img
          src={`${BASE_ASSETS_URL}${companyLogoKey}`}
          alt="Company logo"
          className="document-status__subtitle"
        />
      )}

      <div className="document-status__card document-status__card--border document-status__card--margin">
        <ReactSVG src={documentStatusOption.icon} />

        <h1 className="document-status__title">{documentStatusOption.title}</h1>
        <p className="document-status__text">
          {renderByAuth(documentStatusOption.message, authorized)}
        </p>

        <div className="document-status__actions">
          <UIButton
            priority="primary"
            title={renderByAuth(documentStatusOption.actionButtonText, authorized)}
            handleClick={handleActionButtonClick}
          />
          <UIButton
            priority="white"
            title="Go to the Help Center"
            handleClick={() => navigateToHelpCenter()}
          />
        </div>
      </div>
    </div>
  );
};

export default DocumentStatus;

import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { ReactSVG } from 'react-svg';
import classNames from 'classnames';
import { keys, values, uniq } from 'lodash';
import { GoogleApi, DropboxApi, OneDriveApi } from 'Services/Integrations';
import Toast from 'Services/Toast';
import { useModal } from 'Hooks/Common';
import { useAuthTokenGet, useIntegrationConnect } from 'Hooks/Integration';
import { isNotEmpty } from 'Utils/functions';
import { GOOGLE_MIME_TYPES, MIME_TYPES } from 'Utils/constants';
import { IntegrationTypes } from 'Interfaces/Integration';

import { BoxPicker } from 'Components/BoxPicker/BoxPicker';
import { TooltipBlock } from 'Components/Tooltip';

import Dropbox from 'Assets/images/icons/dropbox.svg';
import GoogleDrive from 'Assets/images/icons/google-drive.svg';
import OneDrive from 'Assets/images/icons/one-drive.svg';
import Box from 'Assets/images/icons/box.svg';
import useIsMobile from 'Hooks/Common/useIsMobile';
import { clearIntegrationData } from 'Store/ducks/user/actionCreators';
import { useDispatch } from 'react-redux';

const serviceDataByType = {
  [IntegrationTypes.GOOGLE_DRIVE]: { title: 'Google Drive', src: GoogleDrive },
  [IntegrationTypes.ONE_DRIVE]: { title: 'One Drive', src: OneDrive },
  [IntegrationTypes.DROPBOX]: { title: 'Dropbox', src: Dropbox },
  [IntegrationTypes.BOX]: { title: 'Box', src: Box },
};

interface UIImportButtonProps {
  type: IntegrationTypes;
  onPick?: (file: File) => void;
  disabled?: boolean;
  integrated?: boolean;
}

const UIImportButton = ({ type, onPick, disabled, integrated }: UIImportButtonProps) => {
  const [boxToken, setBoxToken] = useState<undefined | string>(undefined);
  const [getAuthToken, isGettingAuthToken] = useAuthTokenGet();
  const isMobile = useIsMobile();
  const dispatch = useDispatch();

  const { src, title } = useMemo(() => serviceDataByType[type], [type]);

  const [openPopup] = useIntegrationConnect({
    type,
    title: type,
  });

  const [openBoxPicker, closeBoxPicker] = useModal(
    () => (
      <BoxPicker
        onPick={onPick}
        onClose={() => {
          closeBoxPicker();
          setBoxToken(undefined);
        }}
        accessToken={boxToken}
      />
    ),
    [boxToken],
  );

  useEffect(() => {
    if (boxToken) {
      openBoxPicker();
    }
  }, [boxToken, openBoxPicker]);

  const handleIntegrationConnect = useCallback(() => {
    openPopup();
  }, [openPopup]);

  const handleClick = useCallback(async () => {
    try {
      if (type === IntegrationTypes.DROPBOX) {
        await DropboxApi.openPicker({
          onPick,
          onError: Toast.error,
          extensions: Object.keys(MIME_TYPES),
        });

        return;
      }

      const tokenPayload = await getAuthToken({ type });

      if (!isNotEmpty(tokenPayload)) {
        return;
      }

      switch (type) {
        case IntegrationTypes.GOOGLE_DRIVE: {
          await GoogleApi.initGoogleDrivePicker({
            accessToken: tokenPayload.token,
            acceptableFormats: uniq([
              ...values(MIME_TYPES),
              ...keys(GOOGLE_MIME_TYPES),
            ]).join(','),
            onPick,
            onError: Toast.error,
          });

          break;
        }
        case IntegrationTypes.BOX: {
          setBoxToken(tokenPayload.token);

          break;
        }
        case IntegrationTypes.ONE_DRIVE: {
          await OneDriveApi.launchOneDrivePicker({
            accessToken: tokenPayload.token,
            onPick,
            extentions: keys(MIME_TYPES),
          });

          break;
        }
        default: {
          return null;
        }
      }
    } catch (error) {
      dispatch(clearIntegrationData({ type }));
      Toast.handleErrors(error);
      handleIntegrationConnect();
    }
  }, [type, getAuthToken, onPick, dispatch, handleIntegrationConnect]);

  return (
    <button
      type="button"
      className={classNames('upload__block-item', {
        'upload--disabled': disabled,
        mobile: isMobile,
      })}
      onClick={integrated ? handleClick : handleIntegrationConnect}
      disabled={disabled || isGettingAuthToken}
    >
      <ReactSVG src={src} />
      <div className="upload__title upload__title--small">{title}</div>
      {disabled && (
        <TooltipBlock>
          Please enable this integration in
          <br />
          order to be able to import files
          <br />
          from {title}
        </TooltipBlock>
      )}
    </button>
  );
};

export default UIImportButton;

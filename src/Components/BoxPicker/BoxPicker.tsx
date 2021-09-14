import React, { useLayoutEffect } from 'react';
import ReactModal from 'react-modal';
import { BoxContentPickerApi } from 'Services/Integrations';
import Toast from 'Services/Toast';
import { MIME_TYPES } from 'Utils/constants';

interface BoxPickerProps {
  onPick?: (file: File) => void;
  onClose?: () => void;
  accessToken?: string;
}

export const BoxPicker = ({ onPick, onClose, accessToken }: BoxPickerProps) => {
  useLayoutEffect(() => {
    if (accessToken) {
      const filePicker = BoxContentPickerApi.show({
        accessToken: accessToken,
        onCancel: onClose,
        onPick: file => {
          onPick && onPick(file);

          onClose && onClose();
        },
        extentions: Object.keys(MIME_TYPES).map(key => key.replace('.', '')),
        onError: message => Toast.error(message),
      });

      return () => {
        filePicker.then(picker => picker.hide());
      };
    } else {
      onClose && onClose();
    }
  }, [accessToken, onClose, onPick]);

  return (
    <ReactModal className="boxPickerModal" overlayClassName="modal" isOpen>
      <div className="boxPickerModal__picker" />
    </ReactModal>
  );
};

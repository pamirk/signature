import React, { useEffect, useState, useCallback } from 'react';
import classNames from 'classnames';
import Toast from 'Services/Toast';
import { useSignedGetUrl } from 'Hooks/User';
import { SignedUrlResponse } from 'Interfaces/Common';
import { Requisite } from 'Interfaces/Requisite';

import OverlaySpinner from 'Components/OverlaySpinner/OverlaySpinner';
import { UISpinnerProps } from 'Components/UIComponents/UISpinner';

interface RequisiteItemProps {
  requisiteItem: Requisite;
  className?: string;
  spinnerProps?: UISpinnerProps;
}

const RequisiteItem = ({
  className,
  requisiteItem,
  spinnerProps,
}: RequisiteItemProps) => {
  const [src, setSrc] = useState<string>();
  const [isLoadingImg, setIsLoadingImg] = useState(true);
  const [getSignedUrl] = useSignedGetUrl();

  const handleSignedUrlGet = useCallback(async (key: string) => {
    try {
      const data = (await getSignedUrl({ key })) as SignedUrlResponse;

      setSrc(data.result);
    } catch (error) {
      Toast.handleErrors(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleSignedUrlGet(requisiteItem.fileKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requisiteItem]);

  return (
    <div
      className={classNames('settingsSignature__item-inner', {
        'settingsSignature__item--loading': isLoadingImg,
      })}
    >
      {isLoadingImg && <OverlaySpinner spinnerProps={spinnerProps} />}
      <img
        src={src}
        onLoad={() => setIsLoadingImg(false)}
        className={classNames('settingsSignature__item-img', className)}
        alt="signature"
      />
    </div>
  );
};

export default RequisiteItem;

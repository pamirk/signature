import React, { useState } from 'react';
import classNames from 'classnames';
import { Requisite } from 'Interfaces/Requisite';

import OverlaySpinner from 'Components/OverlaySpinner';
import { UISpinnerProps } from 'Components/UIComponents/UISpinner';

interface RequisiteItemProps {
  requisiteItem: Requisite;
  className?: string;
  spinnerProps?: UISpinnerProps;
  imgRef?: React.Ref<HTMLImageElement>;
}

const RequisiteItem = ({
  className,
  requisiteItem,
  spinnerProps,
  imgRef,
}: RequisiteItemProps) => {
  const [isLoadingImg, setIsLoadingImg] = useState(true);

  return (
    <div
      className={classNames('settingsSignature__item-inner', {
        'settingsSignature__item--loading': isLoadingImg,
      })}
    >
      {isLoadingImg && <OverlaySpinner spinnerProps={spinnerProps} />}
      <img
        ref={imgRef}
        src={requisiteItem.url}
        onLoad={() => setIsLoadingImg(false)}
        className={classNames('settingsSignature__item-img', className)}
        alt="signature"
      />
    </div>
  );
};

export default RequisiteItem;

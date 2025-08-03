import React from 'react';
import { ReactSVG } from 'react-svg';

import UIButton from 'Components/UIComponents/UIButton';
import UISpinner from 'Components/UIComponents/UISpinner';

import DownloadIcon from 'Assets/images/icons/doc-download-icon.svg';
import PrintIcon from 'Assets/images/icons/print-icon.svg';
import CircleSuccessIcon from 'Assets/images/icons/circle-success.svg';

interface PreviewDocumentSideParams {
  isWatcherExecuting: boolean;
  onClickDownload: () => void;
  onClickPrint: () => void;
  isDownloading: boolean;
  isPdfLoading: boolean;
}

const PreviewDocumentSide = ({
  isWatcherExecuting,
  onClickDownload,
  onClickPrint,
  isDownloading,
  isPdfLoading,
}: PreviewDocumentSideParams) => {
  return (
    <div className="successSignUpModal__left-side-wrapper">
      <div className="successSignUpModal__left-side">
        {isWatcherExecuting ? (
          <div className="successSignUpModal__documents">
            <div className="successSignUpModal__side-text-wrapper">
              <p className="successSignUpModal__side-title">
                The document is being processed
              </p>
              <p className="successSignUpModal__side-text">
                You&apos;ll receive a copy in your inbox shortly.
              </p>
            </div>
            <UISpinner
              width={40}
              height={40}
              wrapperClassName="successSignUpModal__spinner-wrapper"
            />
          </div>
        ) : (
          <div>
            <div className="successSignUpModal__documents">
              <ReactSVG
                src={CircleSuccessIcon}
                className="successSignUpModal__main-icon"
              />
              <div className="successSignUpModal__side-text-wrapper">
                <p className="successSignUpModal__side-title">
                  Thanks for Submitting your Document
                </p>
                <p className="successSignUpModal__side-text">
                  You&apos;ll receive a copy in your inbox shortly.
                </p>
              </div>
            </div>
            <div className="successSignUpModal__buttons">
              <UIButton
                leftIcon={DownloadIcon}
                priority="secondary"
                title="Download"
                handleClick={onClickDownload}
                isLoading={isDownloading}
                disabled={isDownloading}
              />
              <UIButton
                leftIcon={PrintIcon}
                priority="secondary"
                title="Print"
                className="successSignUpModal__button--secondary"
                handleClick={onClickPrint}
                isLoading={isPdfLoading}
                disabled={isPdfLoading}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewDocumentSide;

import React, { useCallback, useEffect, useMemo } from 'react';
import { Document } from 'Interfaces/Document';
import classNames from 'classnames';
import { discountPlanPrices, PlanDurations, PlanTypes } from 'Interfaces/Billing';
import { formatDateToStringForTrialInfo } from 'Utils/formatters';
import dayjs from 'dayjs';
import Toast from 'Services/Toast';
import UIButton from 'Components/UIComponents/UIButton';
import { useDocumentConvertionStatusWatcher } from 'Hooks/DocumentSign';
import { DownloadOption } from 'Interfaces/Auth';

interface LandingConfirmPageProps {
  document?: Document;
  onFinish: (option: DownloadOption) => void;
}

export const LandingConfirmPage = ({ document, onFinish }: LandingConfirmPageProps) => {
  const [
    watchDocumentConvertionStatus,
    watchDocumentConvertionStatusCancel,
    isWatcherExecuting,
  ] = useDocumentConvertionStatusWatcher();

  const price = discountPlanPrices[PlanTypes.BUSINESS][PlanDurations.MONTHLY];
  const nextBillingDate = dayjs(new Date())
    .add(7, 'day')
    .format('MMMM D, YYYY');

  const preparer = useMemo(() => document?.signers.find(s => s.isPreparer), [document]);

  const handleDownloadNow = useCallback(async () => {
    try {
      if (document) {
        onFinish(DownloadOption.NOW);
      }
    } catch (error) {
      Toast.handleErrors(error, { toastId: 'download_error_ls' });
    }
  }, [document, onFinish]);

  const handleDownloadLater = useCallback(async () => {
    onFinish(DownloadOption.LATER);
  }, [onFinish]);

  const handleWatchDocumentConvertionStatus = useCallback(async () => {
    if (preparer)
      await watchDocumentConvertionStatus({
        signerId: preparer.id,
      });
  }, [preparer, watchDocumentConvertionStatus]);

  useEffect(() => {
    handleWatchDocumentConvertionStatus();
    return () => watchDocumentConvertionStatusCancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchDocumentConvertionStatusCancel]);

  return (
    <div className={classNames('sign-up-landing__confirm-form')}>
      <div className={classNames('sign-up-landing__confirm-wrapper')}>
        <p className="sign-up-landing__confirm-header">
          Your Document is Signed and Ready!
        </p>
        <p className="sign-up-landing__confirm-text">
          Great news! Your PDF has been successfully signed and is ready for download.
        </p>
        <p className="sign-up-landing__confirm-text">
          We&apos;re excited to have you on board. As a reminder, your trial will
          automatically transition to a full subscription for <b>${price}/month</b> on{' '}
          <b>{formatDateToStringForTrialInfo(nextBillingDate)}</b>.
        </p>
        <p className="sign-up-landing__confirm-text">
          If you&apos;d like to continue enjoying our service without interruption, no
          action is needed. If you have any questions or would like to learn more about
          your subscription, we&apos;re here to help.
        </p>
        <UIButton
          priority="primary"
          title={'Download'}
          handleClick={handleDownloadNow}
          className="sign-up-landing__confirm-button--download"
          disabled={isWatcherExecuting}
          isLoading={isWatcherExecuting}
        />
        <div
          className="sign-up-landing__confirm-button--cancel"
          onClick={handleDownloadLater}
        >
          Download later
        </div>
      </div>
    </div>
  );
};

export default LandingConfirmPage;

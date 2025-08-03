import React, { useCallback } from 'react';
import Billet from './Billet';
import UIButton from 'Components/UIComponents/UIButton';
import { useSelector } from 'react-redux';
import { selectUser, selectUserPlan } from 'Utils/selectors';
import { PlanTypes } from 'Interfaces/Billing';
import { useModal } from 'react-modal-hook';
import ReportPeriodModal from './modals/ReportPeriodModal';
import useReportByEmailGet from 'Hooks/Document/useReportByEmailGet';
import { GetReportByEmailPayload } from 'Interfaces/Document';
import ConfirmModal from 'Components/ConfirmModal';
import useIsMobile from 'Hooks/Common/useIsMobile';
import classNames from 'classnames';
import { UserRoles, User } from 'Interfaces/User';

type onPlanTypeCheckSuccess = (...args: any) => void;

interface ReportFieldsProps {
  disabled?: boolean;
  openUpgradeModal: () => void;
}

const ReportFields = ({ disabled = false, openUpgradeModal }: ReportFieldsProps) => {
  const isMobile = useIsMobile();
  const userPlan = useSelector(selectUserPlan);
  const user: User = useSelector(selectUser);
  const [getReportByEmail] = useReportByEmailGet();

  const [openSuccessModal, closeSuccessModal] = useModal(
    () => (
      <ConfirmModal
        onClose={closeSuccessModal}
        onConfirm={closeSuccessModal}
        confirmText="Proceed"
        className={classNames('documentReportModal__successModal', { mobile: isMobile })}
        isCancellable={false}
        confirmButtonProps={{ className: 'documentReportModal__successModal-button' }}
      >
        <div className="modal__header">
          <h4 className="modal__title">Report is on the way!</h4>
        </div>
        <p className="modal__subTitle documentReportModal__header-subTitle">
          Thank you for requesting a report of your signed documents. The report, based on
          the selected period, is currently being generated and will be sent to your
          registered email address shortly. Please check your inbox (and spam folder, just
          in case) in a few minutes.
        </p>
      </ConfirmModal>
    ),
    [],
  );

  const handleGetReportByEmail = useCallback(
    async (payload: GetReportByEmailPayload) => {
      await getReportByEmail(payload);
      openSuccessModal();
    },
    [getReportByEmail, openSuccessModal],
  );

  const [openReportPeriodModal, closeReportPeriodModal] = useModal(
    () => (
      <ReportPeriodModal
        onConfirm={handleGetReportByEmail}
        onClose={closeReportPeriodModal}
      />
    ),
    [],
  );

  const handleBusinessPlanCheck = useCallback(
    (onSuccess: onPlanTypeCheckSuccess) => (...args) => {
      if (userPlan.type !== PlanTypes.BUSINESS && !user.teamId) {
        return openUpgradeModal();
      }

      onSuccess && onSuccess(...args);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [openUpgradeModal, userPlan.type],
  );

  return (
    <div>
      <div className="company__upgrade-wrapper">
        <div className="company__billet-container">
          <p className="settings__title company__header-billet">Report</p>
          {disabled && <Billet title="Business Feature" />}
        </div>
      </div>
      <UIButton
        title="Download Report"
        priority="secondary"
        handleClick={handleBusinessPlanCheck(() => openReportPeriodModal())}
        disabled={user.role !== UserRoles.OWNER}
      />
    </div>
  );
};

export default ReportFields;

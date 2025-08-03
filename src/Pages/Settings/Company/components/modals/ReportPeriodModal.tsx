import React, { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';
import UIModal from 'Components/UIComponents/UIModal';
import UIButton from 'Components/UIComponents/UIButton';
import useIsMobile from 'Hooks/Common/useIsMobile';
import UISelect from 'Components/UIComponents/UISelect';
import { GetReportByEmailPayload } from 'Interfaces/Document';
import Toast from 'Services/Toast';
import { START_YEAR } from 'Utils/constants';

export interface ReportPeriodModalProps {
  onConfirm: (payload: GetReportByEmailPayload) => Promise<void>;
  onClose: () => void;
}

function ReportPeriodModal({ onConfirm, onClose }: ReportPeriodModalProps) {
  const isMobile = useIsMobile();
  const [year, setYear] = useState<number>();

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const array: { value: number; label: string }[] = [];

    for (let index = START_YEAR; index <= currentYear; index++) {
      array.push({ value: index, label: `${index}` });
    }

    return array;
  }, []);

  const handleConfirmSelectedYear = useCallback(async () => {
    if (year) {
      try {
        await onConfirm({ year });
        onClose();
      } catch (err) {
        Toast.error(err.message);
      }
    }
  }, [onClose, onConfirm, year]);

  return (
    <UIModal onClose={onClose}>
      <div className="documentReportModal">
        <div className={classNames('documentReportModal__content', { mobile: isMobile })}>
          <div className="documentReportModal__header">
            <h5 className="modal__title documentReportModal__header-title">
              Access Your Document Report
            </h5>
            <div className="modal__subTitle documentReportModal__header-subTitle">
              Please specify the timeframe you want the report to cover.
            </div>
          </div>
        </div>
        <UISelect
          value={year}
          handleSelect={value => setYear(value)}
          options={years}
          placeholder="Select Reporting Period"
          className="documentReportModal__selectYear"
          contentWrapperClassName="documentReportModal__selectYear-contentWrapper"
        />
        <div className={classNames('documentReportModal__buttons')}>
          <div className="documentReportModal__button">
            <UIButton
              priority="primary"
              title={'Generate Report'}
              handleClick={handleConfirmSelectedYear}
            />
          </div>
        </div>
      </div>
    </UIModal>
  );
}

export default ReportPeriodModal;

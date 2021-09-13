import React from 'react';
import { Field } from 'react-final-form';
import { FieldCheckbox } from 'Components/FormFields';
import useIsMobile from 'Hooks/Common/useIsMobile';
import classNames from 'classnames';

const NotificationsFields = () => {
  const isMobile = useIsMobile();
  return (
    <div className="settings__block">
      <h1 className="settings__title">Notifications</h1>
      <div className="settings__field settings__field--gap settings__field--small">
        <h2 className="settings__subtitle settings__subtitle--small">
          Signaturely Notifications
        </h2>
        <Field
          name="isReceivingReminders"
          label="Receive signing reminders"
          className="settings__form-checkbox"
          component={FieldCheckbox}
        />
      </div>
      <div
        className={classNames(
          'settings__field settings__field--gap settings__field--middle',
          {
            mobile: isMobile,
          },
        )}
      >
        <h2 className="settings__subtitle settings__subtitle--small">
          Send me an email notification...
        </h2>
        <Field
          name="isReceivingSigned"
          label="After signing and sending a document"
          className="settings__form-checkbox"
          component={FieldCheckbox}
        />
        <Field
          name="isReceivingSignerSigned"
          label="Once a document I sent gets signed"
          className="settings__form-checkbox"
          component={FieldCheckbox}
        />
        <Field
          name="isReceivingOpenedSigning"
          label="When a document I sent is opened"
          className="settings__form-checkbox"
          component={FieldCheckbox}
        />
        {/* <Field
        name="notifications.me_sign"
        label="When I sign a document from another Signaturely account"
        className="settings__form-checkbox"
        component={FieldCheckbox}
      /> */}
        <Field
          name="isReceivingSignatureRequestsDailyReport"
          label="Everyday with the outstanding number of signature requests"
          className="settings__form-checkbox"
          component={FieldCheckbox}
        />
        <Field
          name="isSendingToAllPartiesInOrderedDocument"
          label="Send an email to all parties in an ordered signature request when the request has started "
          className="settings__form-checkbox"
          component={FieldCheckbox}
        />
      </div>
      <div
        className={classNames(
          'settings__field settings__field--pdf-checkboxes settings__field--gap',
          {
            mobile: isMobile,
          },
        )}
      >
        <h2 className="settings__subtitle settings__subtitle--small">
          Send a document PDF copy...
        </h2>
        <Field
          name="isReceivingCompletedDocument"
          label="When document is completed - Email me a copy"
          className="settings__form-checkbox"
          component={FieldCheckbox}
        />
        <Field
          name="isSendingCompletedDocument"
          label="When document is completed - Email them a copy"
          className="settings__form-checkbox"
          component={FieldCheckbox}
        />
      </div>
    </div>
  );
};

export default NotificationsFields;

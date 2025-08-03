import classNames from 'classnames';
import { ActionStepBar, ActionStepBarMobile } from 'Components/ActionStepBar';
import { FieldTextArea, FieldTextInput } from 'Components/FormFields';
import FieldDatePicker from 'Components/FormFields/FieldDatePicker';
import UIButton from 'Components/UIComponents/UIButton';
import useIsMobile from 'Hooks/Common/useIsMobile';
import { PlanTypes } from 'Interfaces/Billing';
import { Document, DocumentTypes, SignActionLabel } from 'Interfaces/Document';
import { User } from 'Interfaces/User';
import { Billet } from 'Pages/Settings/Company/components';
import React, { useCallback, useMemo } from 'react';
import { Field } from 'react-final-form';
import { useSelector } from 'react-redux';
import { composeValidators } from 'Utils/functions';
import { selectUser, selectUserPlan } from 'Utils/selectors';
import {
  maxLength100,
  notOnlySpaces,
  titleNotUrlProtocol,
  required,
  messageNotUrlProtocol,
} from 'Utils/validation';

interface FinishStepProps {
  buttonTitle?: string;
  isLoading?: boolean;
  isBaseOnTemplate?: boolean;
  onChooseAction: (step: number) => void;
  document?: Document;
  onUpdateFinishFields: ({ title, message, expirationDate }) => void;
  title: string | undefined;
  setTitle: React.Dispatch<React.SetStateAction<string | undefined>>;
  message: string | undefined | null;
  setMessage: React.Dispatch<React.SetStateAction<string | undefined | null>>;
  expirationDate: Date | undefined;
  setExpirationDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  isBreadcrumbsBan: boolean;
}

function getActionType(type?: DocumentTypes) {
  switch (type) {
    case DocumentTypes.ME_AND_OTHER:
      return SignActionLabel.SIGN_AND_SEND;
    case DocumentTypes.OTHERS:
      return SignActionLabel.SEND;
    default:
      return SignActionLabel.SIGN_DOCUMENT;
  }
}

const FinishStep = ({
  buttonTitle = 'Finish',
  isLoading,
  isBaseOnTemplate,
  onChooseAction,
  document,
  onUpdateFinishFields,
  title,
  setTitle,
  message,
  setMessage,
  expirationDate,
  setExpirationDate,
  isBreadcrumbsBan,
}: FinishStepProps) => {
  const user: User = useSelector(selectUser);
  const userPlan = useSelector(selectUserPlan);
  const isMobile = useIsMobile();

  const handleChangeAction = useCallback(
    step => {
      if (
        document?.title !== title ||
        document?.message !== message ||
        document?.expirationDate !== expirationDate
      ) {
        onUpdateFinishFields({ title, message, expirationDate });
      }
      onChooseAction(step);
    },
    [document, expirationDate, message, onChooseAction, onUpdateFinishFields, title],
  );

  const handleChangeTitleOrMessage = (value, name) => {
    switch (name) {
      case 'title':
        setTitle(value);
        break;
      case 'message':
        value = value || null;
        setMessage(value);
        break;
    }
    return value;
  };

  const handleChangeDateFilter = useCallback(
    (date: Date) => {
      if (date) {
        setExpirationDate(date);
      } else {
        setExpirationDate(undefined);
      }
    },
    [setExpirationDate],
  );

  const handleCancelDateFilter = useCallback(() => {
    setExpirationDate(undefined);
  }, [setExpirationDate]);

  const [isOnlyMeType, isDisableExpirationDatePicker] = useMemo(() => {
    return [
      document?.type === DocumentTypes.ME,
      user.plan.type !== PlanTypes.BUSINESS && !user.teamId,
    ];
  }, [document, user.plan.type, user.teamId]);

  const disabledExpirationDates = [{ from: new Date(0), to: new Date() }];

  return (
    <div className="wizardSignForm__finishContainer">
      {!isBreadcrumbsBan &&
        (isMobile ? (
          <ActionStepBarMobile
            onChoose={handleChangeAction}
            actionType={getActionType(document?.type)}
          />
        ) : (
          <ActionStepBar
            onChoose={handleChangeAction}
            actionType={getActionType(document?.type)}
          />
        ))}
      <div className="wizardSignForm__finishContainer--inner">
        <div className="wizardSignForm__finishTitle">Final Step</div>
        <Field
          name="title"
          label="Document title"
          component={FieldTextInput}
          placeholder="Enter the title"
          parse={handleChangeTitleOrMessage}
          validate={composeValidators<string>(
            required,
            notOnlySpaces,
            maxLength100,
            titleNotUrlProtocol,
          )}
        />
        <Field
          name="message"
          label={<p>Optional Message</p>}
          component={FieldTextArea}
          parse={handleChangeTitleOrMessage}
          placeholder="Add an optional message for the document signers."
          validate={
            userPlan.type === PlanTypes.FREE && !user.teamId
              ? composeValidators<string>(messageNotUrlProtocol)
              : undefined
          }
        />
        {!isOnlyMeType && !isDisableExpirationDatePicker && (
          <Field
            name="expirationDate"
            component={FieldDatePicker}
            label={<p>Expiration Date</p>}
            position="right"
            onDateSelect={handleChangeDateFilter}
            onCancel={handleCancelDateFilter}
            disabledDays={disabledExpirationDates}
            fromMonth={new Date()}
          />
        )}
      </div>
      <div className="wizardSignForm__finishContainer--buttonWrap">
        <UIButton
          priority="primary"
          title={buttonTitle}
          type="submit"
          isLoading={isLoading}
          disabled={isLoading}
        />
      </div>
      {!isOnlyMeType && isDisableExpirationDatePicker && (
        <div
          className={classNames('wizardSignForm__finishContainer--inner blockSeparator')}
        >
          <div className="company__billet-container">
            <Billet title="Business Feature" />
          </div>
          <Field
            name="expirationDate"
            component={FieldDatePicker}
            label={<p>Expiration Date</p>}
            className={'wizardSignForm__datePicker--disabled'}
            disabled={isDisableExpirationDatePicker}
          />
        </div>
      )}
    </div>
  );
};

export default FinishStep;

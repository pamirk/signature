import React, { useCallback, useEffect } from 'react';
import { FieldArrayRenderProps } from 'react-final-form-arrays';
import { Field } from 'react-final-form';
import classNames from 'classnames';
import { EmailRecipient, InteractExtraValues } from 'Interfaces/Document';
import { required, email, checkViewersLimit } from 'Utils/validation';
import { composeValidators } from 'Utils/functions';

import { RecipientEmail } from './RecipientFields';
import { UIAddButton } from 'Components/UIComponents/UIAddButton';
import { removeEmptyCharacters } from 'Utils/formatters';
import Toast from 'Services/Toast';
import { useSelector } from 'react-redux';
import { selectUser } from 'Utils/selectors';
import { User } from 'Interfaces/User';
import { PlanTypes } from 'Interfaces/Billing';

interface IsDepetablePredicateArgument {
  itemIndex: number;
  fields: FieldArrayRenderProps<Partial<EmailRecipient>, HTMLElement>['fields'];
}

export interface EmailRecipientsArrayProps
  extends FieldArrayRenderProps<Partial<EmailRecipient>, HTMLElement> {
  label?: string;
  labelClassName?: string;
  addLabel?: string;
  isAddable?: boolean;
  isItemsDeletable?: boolean;
  isItemDeletablePredicate?: (arg: IsDepetablePredicateArgument) => boolean;
  handleSetRecipientsValues?: (values: InteractExtraValues) => void;
}

function EmailRecipientsArray({
  fields,
  label = 'Email',
  labelClassName,
  addLabel = 'Recipients',
  isAddable = true,
  isItemsDeletable,
  isItemDeletablePredicate,
  handleSetRecipientsValues,
}: EmailRecipientsArrayProps) {
  const user = useSelector(selectUser) as User;

  useEffect(() => {
    if (handleSetRecipientsValues && fields.value)
      handleSetRecipientsValues({ recipients: fields.value as EmailRecipient[] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields.value]);

  const handleRecipientsAdd = useCallback(() => {
    const checkLimit = checkViewersLimit(fields.value.length);
    if ((user.isTrialSubscription || user.plan.type === PlanTypes.FREE) && checkLimit) {
      return Toast.error(checkLimit);
    }
    fields.push({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields.value]);

  return (
    <>
      {label && (
        <p className={classNames('emailRecipients__label', labelClassName)}>{label}</p>
      )}
      <ul className="emailRecipients__list">
        {fields.map((name, index) => (
          <Field
            key={name}
            name={`${name}email`}
            component={RecipientEmail}
            isDeletable={
              isItemDeletablePredicate
                ? isItemDeletablePredicate({ itemIndex: index, fields })
                : !!isItemsDeletable
            }
            onDelete={() => fields.remove(index)}
            parse={removeEmptyCharacters}
            validate={composeValidators<string>(required, email)}
          />
        ))}
        {isAddable && (
          <UIAddButton
            label={addLabel}
            onClick={handleRecipientsAdd}
            wrapperClassName="emailRecipients__add-wrapper"
            iconClassName="emailRecipients__add-icon"
            labelClassName="emailRecipients__add-label"
          />
        )}
      </ul>
    </>
  );
}

export default EmailRecipientsArray;

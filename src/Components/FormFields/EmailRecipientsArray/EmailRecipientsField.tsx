import React from 'react';
import { FieldArrayRenderProps } from 'react-final-form-arrays';
import { Field } from 'react-final-form';
import classNames from 'classnames';
import { EmailRecipient } from 'Interfaces/Document';
import { required, email } from 'Utils/validation';
import { composeValidators } from 'Utils/functions';

import RecipientEmail from './RecipientFields/RecipientEmail';
import { UIAddButton } from 'Components/UIComponents/UIAddButton';

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
}

function EmailRecipientsArray({
  fields,
  label = 'Email',
  labelClassName,
  addLabel = 'Recipients',
  isAddable = true,
  isItemsDeletable,
  isItemDeletablePredicate,
}: EmailRecipientsArrayProps) {
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
            validate={composeValidators<string>(required, email)}
          />
        ))}
        {isAddable && (
          <UIAddButton
            label={addLabel}
            onClick={() => fields.push({})}
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

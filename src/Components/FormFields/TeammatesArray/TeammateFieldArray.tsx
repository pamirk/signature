import { composeValidators } from 'Utils/functions';
import { email, name as nameValidator, required } from 'Utils/validation';
import classNames from 'classnames';
import React, { useCallback } from 'react';
import { Field } from 'react-final-form';
import { FieldArrayRenderProps } from 'react-final-form-arrays';

import { UIAddButton } from 'Components/UIComponents/UIAddButton';
import UISelect from 'Components/UIComponents/UISelect';
import useIsMobile from 'Hooks/Common/useIsMobile';
import { TeammateField } from 'Interfaces/Document';
import { TeammateRoles, UserRoles } from 'Interfaces/User';
import { removeEmptyCharacters } from 'Utils/formatters';
import { TeammateEmail } from './TeammateEmail';
import { TeammateName } from './TeammateName';

interface IsDepetablePredicateArgument {
  itemIndex: number;
  fields: FieldArrayRenderProps<Partial<TeammateField>, HTMLElement>['fields'];
}

export interface TeammateFieldsArrayProps
  extends FieldArrayRenderProps<Partial<TeammateField>, HTMLElement> {
  label?: string;
  labelClassName?: string;
  addLabel?: string;
  isAddable?: boolean;
  isItemsDeletable?: boolean;
  isRoleSelectable?: boolean;
  isItemDeletablePredicate?: (arg: IsDepetablePredicateArgument) => boolean;
  teamSizeLimit?: number;
  teamSize?: number;
}

function TeammateFieldArray({
  fields,
  label = 'Teammate',
  labelClassName,
  addLabel = 'Recipients',
  isAddable = true,
  isItemsDeletable,
  isRoleSelectable,
  isItemDeletablePredicate,
}: TeammateFieldsArrayProps) {
  const isMobile = useIsMobile();

  const handleAddTeammate = useCallback(() => {
    fields.push({ role: UserRoles.USER });
  }, [fields]);

  return (
    <>
      {label && <p className={classNames('teammates__label', labelClassName)}>{label}</p>}
      <ul className="teammates__list">
        {fields.map((name, index) => (
          <li className="teammates__list-item" key={name}>
            <Field
              key={name}
              name={`${name}email`}
              component={TeammateEmail}
              isDeletable={
                isItemDeletablePredicate
                  ? isItemDeletablePredicate({ itemIndex: index, fields })
                  : !!isItemsDeletable
              }
              onDelete={() => fields.remove(index)}
              parse={removeEmptyCharacters}
              validate={composeValidators<string>(required, email)}
            />
            <div
              className={classNames('teammates__credentials-wrapper', {
                mobile: isMobile,
              })}
            >
              <div className={classNames('teammates__credentials', { mobile: isMobile })}>
                <Field
                  key={`${name}name`}
                  name={`${name}name`}
                  component={TeammateName}
                  parse={removeEmptyCharacters}
                  validate={composeValidators<string>(required, nameValidator)}
                />
                <Field
                  key={`${name}role`}
                  name={`${name}role`}
                  render={({ input }) => (
                    <UISelect
                      options={TeammateRoles}
                      className="teammates__role-wrapper"
                      placeholder="Role"
                      handleSelect={value => {
                        fields.update(index, { ...fields.value[index], role: value });
                      }}
                      value={input.value}
                      disabled={!isRoleSelectable}
                    />
                  )}
                  validate={required}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
      {isAddable && (
        <UIAddButton
          label={addLabel}
          onClick={handleAddTeammate}
          wrapperClassName="teammates__add-wrapper"
          iconClassName="teammates__add-icon"
          labelClassName="teammates__add-label"
        />
      )}
    </>
  );
}

export default TeammateFieldArray;

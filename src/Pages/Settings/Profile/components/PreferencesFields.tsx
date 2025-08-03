import React from 'react';
import { Field } from 'react-final-form';
import { FieldSelect } from 'Components/FormFields';
import { SelectableOption } from 'Interfaces/Common';
import { DateFormats } from 'Interfaces/User';
import { timezones } from 'Utils/timezones';
import useIsMobile from 'Hooks/Common/useIsMobile';
import classNames from 'classnames';

const dateFormatOptions: SelectableOption<DateFormats>[] = [
  { label: 'DD / MM / YYYY', value: DateFormats.DD_MM_YYYY },
  { label: 'MM / DD / YYYY', value: DateFormats.MM_DD_YYYY },
  { label: 'YYYY / MM / DD', value: DateFormats.YYYY_MM_DD },
  { label: 'MM / DD / YY', value: DateFormats.MM_DD_YY },
  { label: 'DD / MM / YY', value: DateFormats.DD_MM_YY },
];

const PreferencesFields = () => {
  const isMobile = useIsMobile();
  return (
    <div className="settings__block">
      <h1 className="settings__title">Preferences</h1>
      <div className={classNames('settings__two-fields-wrapper', { mobile: isMobile })}>
        <Field
          name="dateFormat"
          options={dateFormatOptions}
          label="Date Format"
          placeholder="Select date format"
          component={FieldSelect}
          className={classNames('settings__field', {
            mobile: isMobile,
          })}
        />
        <Field
          name="timezone"
          options={timezones}
          label="Time zone"
          placeholder="Select time zone"
          component={FieldSelect}
          className={classNames('settings__field', {
            mobile: isMobile,
          })}
        />
      </div>
      {/* TODO: Implement later */}
      {/* <div className="settings__field settings__field--gap">
        <h2 className="settings__subtitle settings__subtitle--small">Import Contacts</h2>
        <div className="profile__button profile__button--import">
          <UIButton
            title="Import More Contacts"
            handleClick={console.log}
            priority="secondary"
          />
        </div>
        <p className="settings__text settings__text--grey">
          You have&nbsp;
          <span className="settings__text settings__text--medium">{contractsCount}</span>
          &nbsp;contacts.
        </p>
      </div> */}
      {/* <div className="settings__field-wrapper settings__field--small">
        <h2 className="settings__subtitle settings__subtitle--small">
          Document Preferences
        </h2>
        <Field
          name="autocomplete"
          label="Enable autocorrector &amp; autocomplete"
          className="settings__form-checkbox"
          component={FieldCheckbox}
        />
      </div>
      <div className="settings__field-wrapper settings__field--small">
        <h2 className="settings__subtitle settings__subtitle--small">
          Document Security
        </h2>
        <Field
          name="proof_seal"
          label="Apply a Tamper Proof Seal to documents once signatures are completed"
          className="settings__form-checkbox"
          component={FieldCheckbox}
        />
      </div> */}
    </div>
  );
};

export default PreferencesFields;

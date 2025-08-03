import React, { useState, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { FormRenderProps, Field } from 'react-final-form';
import { Document, DocumentBulkSendValues } from 'Interfaces/Document';
import { selectOneRoleTemplates, selectUserPlan } from 'Utils/selectors';
import { composeValidators } from 'Utils/functions';
import {
  required,
  maxLength100,
  notOnlySpaces,
  titleNotUrlProtocol,
  messageNotUrlProtocol,
} from 'Utils/validation';
import UISelect from 'Components/UIComponents/UISelect';
import { FieldTextInput, FieldTextArea } from 'Components/FormFields';
import UIButton from 'Components/UIComponents/UIButton';
import Arrow from 'Assets/images/icons/angle-arrow.svg';
import { useModal, useCsvParse } from 'Hooks/Common';
import HeadersSelectModal from './HeadersSelectModal';
import { ParsedCsvData } from 'Interfaces/Common';
import { UIUploader } from 'Components/UIComponents/UIUploader';
import { PlanTypes } from 'Interfaces/Billing';

interface BulkSendFieldsProps extends FormRenderProps<DocumentBulkSendValues> {
  onTemplateSelect?: (templateId: Document['id'] | undefined) => void;
  rowParsingLimit?: number;
  columnParsingLimit?: number;
}

const BulkSendFields = ({
  handleSubmit,
  form,
  hasValidationErrors,
  submitting,
  onTemplateSelect,
  rowParsingLimit,
  columnParsingLimit,
}: BulkSendFieldsProps) => {
  const templates = useSelector(selectOneRoleTemplates);
  const userPlan = useSelector(selectUserPlan);
  const [parsedFileData, setParsedFileData] = useState<ParsedCsvData>();
  const [uploadError, setUploadError] = useState<string | null>(null);
  const parseFile = useCsvParse();
  const selectableOptions = useMemo(
    () =>
      templates
        ? templates.map(template => ({
            value: template.id,
            label: template.title,
          }))
        : [],
    [templates],
  );

  const handleTemplateSelect = useCallback(
    (value?: string | number) => {
      onTemplateSelect && onTemplateSelect(value as string);
    },
    [onTemplateSelect],
  );

  const handleSignersChange = useCallback(
    signers => {
      form.change('signers', signers);
    },
    [form],
  );

  const handleFileUpload = useCallback(
    async file => {
      try {
        setUploadError(null);
        const parsedFileData = await parseFile(file, rowParsingLimit, columnParsingLimit);
        setParsedFileData(parsedFileData);
      } catch (error) {
        setUploadError(error.message || 'Failed to upload');
        handleSignersChange(undefined);
        setParsedFileData(undefined);
      }
    },
    [columnParsingLimit, handleSignersChange, parseFile, rowParsingLimit],
  );

  const handleUploadCancel = useCallback(() => {
    setParsedFileData(undefined);
    setUploadError(null);
    handleSignersChange(undefined);
  }, [handleSignersChange]);

  const [showHeadersSelectModal, closeHeadersSelectModal] = useModal(
    () => (
      <HeadersSelectModal
        onClose={() => {
          closeHeadersSelectModal();
        }}
        headers={parsedFileData?.headers as string[]}
        signerRows={parsedFileData?.rows as string[][]}
        onConfirm={async () => {
          await handleSubmit();
          closeHeadersSelectModal();
        }}
        buttonDisabled={submitting || hasValidationErrors}
        onSignersChange={handleSignersChange}
      />
    ),
    [parsedFileData, hasValidationErrors, submitting, handleSignersChange],
  );

  return (
    <form className="signTemplate__form">
      <div className="signTemplate__block">
        <p className="signTemplate__templateField-select-title signTemplate__templateField--bulk">
          Choose the template you would like to sign.
        </p>
        <div className="signTemplate__templateField-select-subtitle">
          Template must have only one signer with preparer.
        </div>
        <Field
          name="templateId"
          render={({ input }) => (
            <UISelect
              options={selectableOptions}
              placeholder="Choose a Template"
              handleSelect={handleTemplateSelect}
              isClearable={!!input.value}
              emptyText="You don't have any templates available yet."
              value={input.value}
            />
          )}
          validate={required}
        />
      </div>
      <div className="signTemplate__block">
        <p className="signTemplate__templateField-select-title">Upload CSV</p>
        <div className="signTemplate__upload-description">
          Send a signature request to a group of people all at once. Just upload a CSV
          file with names and email addresses.
        </div>
        <UIUploader
          onUpload={handleFileUpload}
          onCancel={handleUploadCancel}
          isError={!!uploadError}
          error={uploadError}
          uploadTitle="Drop CSV here"
          acceptableFormats={'text/csv, .csv'}
          buttonText="Upload CSV"
          isFinished={!!parsedFileData}
        />
      </div>
      <div className="signTemplate__form-mainGroupField">
        <Field
          name="title"
          label="Title"
          component={FieldTextInput}
          onKeyDown={event => {
            if (event.key === 'Enter') event.preventDefault();
          }}
          placeholder="Document Title"
          validate={composeValidators<string>(
            required,
            notOnlySpaces,
            maxLength100,
            titleNotUrlProtocol,
          )}
        />
        <Field
          name="message"
          label={
            <p>
              Message for Signers <span>(Optional)</span>
            </p>
          }
          component={FieldTextArea}
          placeholder="Add an optional message for signers. "
          validate={
            userPlan.type === PlanTypes.FREE
              ? composeValidators<string>(messageNotUrlProtocol)
              : undefined
          }
        />
      </div>

      <div className="signTemplate__form-submitButton">
        <UIButton
          priority="primary"
          title="Select Columns"
          handleClick={showHeadersSelectModal}
          type="button"
          disabled={
            !parsedFileData?.headers || !parsedFileData?.rows || hasValidationErrors
          }
          rightIcon={Arrow}
          isLoading={submitting}
        />
      </div>
    </form>
  );
};

export default BulkSendFields;

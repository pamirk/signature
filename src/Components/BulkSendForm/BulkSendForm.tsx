import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Form, FormRenderProps } from 'react-final-form';
import Toast from 'Services/Toast';
import { Document, DocumentBulkSendValues, CsvEmailError } from 'Interfaces/Document';
import {useAllDocumentsGet, useDocumentBulkSend, DocumentValidators,} from 'Hooks/Document';
import { selectDocument } from 'Utils/selectors';
import BulkSendFields from './BulkSendFields';
import { useModal } from 'Hooks/Common';
import ValidationBulkSendModal from './ValidationBulkSendModal';
import History from 'Services/History';
import { handleCsvFileCrlf, processSubmissionErrors } from 'Utils/functions';

const rowLimit = 101;
const columnLimit = 100;

const BulkSendForm = () => {
  const [getAllDocuments] = useAllDocumentsGet();
  const [validationErrors, setValidationErrors] = useState<CsvEmailError[]>([]);
  const [sendDocumentBulk] = useDocumentBulkSend();
  const validateBulkSendValues = DocumentValidators.useBulkSendValidation();
  const [selectedTemplateId, setSelectedTemplateId] = useState<
    Document['id'] | undefined | null
  >();

  const selectedTemplate = useSelector(state =>
    selectDocument(state, { documentId: selectedTemplateId }),
  );
  const [openValidationModal, closeValidationModal] = useModal(
    () => (
      <ValidationBulkSendModal
        onClose={closeValidationModal}
        validationErrors={validationErrors}
      />
    ),
    [validationErrors],
  );
  const handleSubmit = useCallback(
    async (values: DocumentBulkSendValues) => {
      try {
        const bulkSendValues = handleCsvFileCrlf(values);
        const validationErrors = validateBulkSendValues(bulkSendValues);

        if (validationErrors.errors.length === 0) {
          await sendDocumentBulk(bulkSendValues);
          Toast.success('Documents successfully created');
          History.push('/documents');
        } else {
          openValidationModal();
          setValidationErrors(validationErrors.errors);
        }
      } catch (error) {
        Toast.handleErrors(error);
        processSubmissionErrors(error);
      }
    },
    [openValidationModal, sendDocumentBulk, validateBulkSendValues],
  );

  const handleGetAllDocuments = useCallback(async () => {
    try {
      await getAllDocuments({
        withTeammateTemplates: true,
      });
    } catch (error) {
      Toast.handleErrors(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleGetAllDocuments();
  }, [handleGetAllDocuments]);

  const initialValues = useMemo(() => {
    return {
      title: selectedTemplate?.title,
      message: selectedTemplate?.message,
      templateId: selectedTemplate?.id,
    } as DocumentBulkSendValues;
  }, [selectedTemplate]);

  return (
    <div className="signTemplate__wrapper">
      <h1 className="signTemplate__title signTemplate__title--bulk">
        Get Your Template Signed by Many
      </h1>
      <Form
        initialValues={initialValues}
        onSubmit={handleSubmit}
        render={(renderProps: FormRenderProps<DocumentBulkSendValues>) => (
          <BulkSendFields
            {...renderProps}
            onTemplateSelect={setSelectedTemplateId}
            rowParsingLimit={rowLimit}
            columnParsingLimit={columnLimit}
          />
        )}
      />
    </div>
  );
};

export default BulkSendForm;

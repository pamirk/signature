import classNames from 'classnames';
import { FieldTextInput } from 'Components/FormFields';
import SignersArray from 'Components/FormFields/SignersArray';
import UIButton from 'Components/UIComponents/UIButton';
import { ExecuteAction } from 'Hooks/Common/useAsyncAction';
import useIsMobile from 'Hooks/Common/useIsMobile';
import {
  useDocumentCreateByExistTemplate,
  useDocumentUpdateByExistTemplate,
} from 'Hooks/Document';
import {
  Document,
  DocumentTypes,
  DocumentUpdatePayload,
  DocumentValues,
} from 'Interfaces/Document';
import React, { useCallback, useEffect, useState } from 'react';
import { Field, FormRenderProps } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { useSelector } from 'react-redux';
import Toast from 'Services/Toast';
import { callActionAsync, composeValidators } from 'Utils/functions';
import { selectActiveTemplates } from 'Utils/selectors';
import { email, notOnlySpaces, required } from 'Utils/validation';
import FinishStep from './FinishStep';
import { TabTypes } from './TabItems';
import { UploadFileStep } from './UploadFileStep';

interface WizardSignFormValuesProps {
  currentStep: number;
  isBreadcrumbsBan: boolean;
  renderProps: FormRenderProps<DocumentValues>;
  document?: Document;
  setDocumentId: React.Dispatch<React.SetStateAction<string | undefined>>;
  isTemplatesLoading: boolean;
  setSelectedTemplateId: React.Dispatch<React.SetStateAction<string | null | undefined>>;
  updateDocument: ExecuteAction<DocumentUpdatePayload, Promise<{} | Document>>;
  isUpdatingDocument: boolean;
  tabType: TabTypes;
  handleSetTabType: (tabType: TabTypes) => void;
  isEditMode: boolean;
  selectedTemplate: Document | undefined;
  handleSubmitForm: () => void;
  isUploadedFile: boolean | 0 | undefined;
  getFinalStepButtonTitle(documentType: DocumentTypes): any;
  formattedInitialValues: DocumentValues;
  isSendingDocument: boolean;
  handleChooseActionStep: (step: number) => void;
  handleUpdateDocument: (values: any) => Promise<void>;
  documentId: string | undefined;
  showInteractModal: () => void;
  setFirstCurrentStep: () => void;
}

const WizardSignFormValues = ({
  currentStep,
  isBreadcrumbsBan,
  renderProps,
  document,
  setDocumentId,
  isTemplatesLoading,
  setSelectedTemplateId,
  updateDocument,
  isUpdatingDocument,
  tabType,
  handleSetTabType,
  isEditMode,
  selectedTemplate,
  handleSubmitForm,
  isUploadedFile,
  getFinalStepButtonTitle,
  formattedInitialValues,
  isSendingDocument,
  handleChooseActionStep,
  handleUpdateDocument,
  documentId,
  showInteractModal,
  setFirstCurrentStep,
}: WizardSignFormValuesProps) => {
  const [fileSubmitting, setFileSubmitting] = useState(false);

  const [title, setTitle] = useState<string | undefined>(document?.title);
  const [message, setMessage] = useState<string | undefined | null>(document?.message);
  const [expirationDate, setExpirationDate] = useState<Date | undefined>(
    document?.expirationDate,
  );

  const templates = useSelector(selectActiveTemplates);

  const isMobile = useIsMobile();

  const { values, form } = renderProps;

  const [isFileProcessed, setIsFileProcessed] = useState(
    document?.parts?.length && !!document?.parts.every(part => part.filesUploaded),
  );

  useEffect(() => {
    if (!values.templateId) return;
    formattedInitialValues.title =
      title || templates.find(template => template.id === values.templateId)?.title;
    formattedInitialValues.message =
      message || templates.find(template => template.id === values.templateId)?.message;
    formattedInitialValues.expirationDate = expirationDate;
  }, [
    expirationDate,
    formattedInitialValues.expirationDate,
    formattedInitialValues.message,
    formattedInitialValues.title,
    message,
    templates,
    title,
    values.templateId,
  ]);

  const [createDocumentByExistTemplate] = useDocumentCreateByExistTemplate();
  const [updateDocumentByExistTemplate] = useDocumentUpdateByExistTemplate();

  const handleTemplateEditPrepare = useCallback(
    async (values: DocumentValues) => {
      if (form.getState().hasValidationErrors || form.getState().hasSubmitErrors) {
        return form.submit();
      }

      if (!documentId) {
        const document = (await createDocumentByExistTemplate({
          ...values,
        })) as Document;
        form.change('signers', document.signers);
        form.change('fields', document.fields);
        setDocumentId(document.id);
      } else {
        const updatedDocument = (await updateDocumentByExistTemplate({
          ...values,
          id: documentId as string,
        })) as Document;

        form.change('signers', updatedDocument.signers);
        form.change('fields', updatedDocument.fields);
        setDocumentId(updatedDocument.id);
      }

      return showInteractModal();
    },
    [
      createDocumentByExistTemplate,
      documentId,
      form,
      setDocumentId,
      showInteractModal,
      updateDocumentByExistTemplate,
    ],
  );

  const handleTemplateEdit = useCallback(async () => {
    try {
      await callActionAsync(handleTemplateEditPrepare, values, setFileSubmitting);
      setFirstCurrentStep();
    } catch (error) {
      Toast.handleErrors(error);
    }
  }, [handleTemplateEditPrepare, setFirstCurrentStep, values]);

  const handleSetSelectedTemplate = useCallback(
    (templateId: Document['id'] | undefined) => {
      setSelectedTemplateId(templateId);

      if (templateId) {
        const currentTemplate =
          templates && templates.find(template => template.id === templateId);

        setTitle(currentTemplate?.title);
        setMessage(currentTemplate?.message);
      }
    },
    [setSelectedTemplateId, templates],
  );

  return (
    <form
      className={classNames('wizardSignForm__mainForm', {
        fullscreen: currentStep === 3,
      })}
      onSubmit={renderProps.handleSubmit}
    >
      {currentStep < 3 && (
        <div>
          <UploadFileStep
            {...renderProps}
            document={document}
            onDocumentCreate={setDocumentId}
            templates={templates}
            isLoading={isTemplatesLoading}
            onTemplateSelect={handleSetSelectedTemplate}
            updateDocument={updateDocument}
            isDocumentUpdating={isUpdatingDocument}
            tabType={tabType}
            setTabType={handleSetTabType}
            isEditMode={isEditMode}
            isFileProcessed={isFileProcessed}
            setIsFileProcessed={setIsFileProcessed}
          />
          {selectedTemplate && (
            <>
              <FieldArray
                name="signers"
                render={props => (
                  <SignersArray
                    {...props}
                    withRoles={!!selectedTemplate}
                    isAdditionDisabled={!!selectedTemplate}
                    isRemoveDisabled={!!selectedTemplate}
                    skipPreparer
                    isItemDeletablePredicate={({ fields }) =>
                      !!fields.length && fields.length > 2 && !selectedTemplate
                    }
                    renderFields={name => (
                      <>
                        <Field
                          name={`${name}.name`}
                          placeholder="Name"
                          component={FieldTextInput}
                          validate={composeValidators<string>(required, notOnlySpaces)}
                        />
                        <Field
                          name={`${name}.email`}
                          placeholder="Email"
                          component={FieldTextInput}
                          validate={composeValidators<string>(required, email)}
                        />
                      </>
                    )}
                  />
                )}
              />
            </>
          )}
          {tabType === TabTypes.UPLOAD_FILE && (
            <div
              className={classNames('wizardSignForm-createButton', {
                mobile: isMobile,
              })}
            >
              <UIButton
                className={classNames({
                  'wizardSignForm__finishContainer--buttonWrap': isMobile,
                })}
                title={selectedTemplate ? 'Send the Document' : 'Prepare Document'}
                priority="primary"
                handleClick={handleSubmitForm}
                disabled={
                  (!isFileProcessed && !selectedTemplate) ||
                  (!isUploadedFile && !selectedTemplate) ||
                  isUpdatingDocument ||
                  renderProps.form.getState().hasValidationErrors
                }
              />
              {selectedTemplate && (
                <UIButton
                  className={classNames({
                    'wizardSignForm__finishContainer--buttonWrap': isMobile,
                  })}
                  title={'Edit template'}
                  priority="primary"
                  handleClick={handleTemplateEdit}
                  disabled={
                    !selectedTemplate || renderProps.form.getState().hasValidationErrors
                  }
                  isLoading={fileSubmitting}
                />
              )}
            </div>
          )}
        </div>
      )}
      {currentStep === 3 && (
        <FinishStep
          buttonTitle={
            document?.type
              ? getFinalStepButtonTitle(document.type)
              : formattedInitialValues?.type
              ? getFinalStepButtonTitle(formattedInitialValues.type)
              : 'Finish'
          }
          isLoading={isUpdatingDocument || isSendingDocument}
          onChooseAction={handleChooseActionStep}
          isBaseOnTemplate={!!selectedTemplate}
          document={document}
          onUpdateFinishFields={handleUpdateDocument}
          title={title}
          setTitle={setTitle}
          message={message}
          setMessage={setMessage}
          expirationDate={expirationDate}
          setExpirationDate={setExpirationDate}
          isBreadcrumbsBan={isBreadcrumbsBan}
        />
      )}
    </form>
  );
};

export default WizardSignFormValues;

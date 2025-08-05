import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Field, FormRenderProps } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { isEqual, orderBy } from 'lodash';

import { getDocumentValidationMeta } from 'Hooks/Document/useDocumentValidation';
import { callActionAsync, composeValidators, isNotEmpty } from 'Utils/functions';
import {
  email,
  maxLength100,
  maxLength50,
  messageNotUrlProtocol,
  multipleAttachingMailFilesConstaint,
  multipleAttachingMailFilesConstaintOnCancel,
  multipleFilesConstaint,
  notOnlySpaces,
  required,
  titleNotUrlProtocol,
} from 'Utils/validation';

import FieldTextInput from 'Components/FormFields/FieldTextInput';
import FieldTextArea from 'Components/FormFields/FieldTextArea';
import EmailRecipientsArray from 'Components/FormFields/EmailRecipientsArray';
import SignersArray from 'Components/FormFields/SignersArray';
import { FieldCheckbox } from 'Components/FormFields';
import FileField from './FileField';

import {
  Document,
  DocumentActions,
  DocumentFileUploadResponse,
  DocumentStatuses,
  DocumentTypes,
  DocumentValues,
} from 'Interfaces/Document';
import UISelect from 'Components/UIComponents/UISelect';
import Toast from 'Services/Toast';
import {
  useDocumentConvertionProgressWatcher,
  useDocumentCreate,
  useDocumentCreateByExistTemplate,
  useDocumentFileDataClean,
  useDocumentUpdate,
  useDocumentUpload,
} from 'Hooks/Document';
import { useModal } from 'Hooks/Common';
import { useSelector } from 'react-redux';
import { selectActiveTemplates, selectUser, selectUserPlan } from 'Utils/selectors';
import { DocumentItem, FileItem } from 'Interfaces/Common';
import uuid from 'uuid/v4';
import { PlanTypes } from 'Interfaces/Billing';
import { User } from 'Interfaces/User';
import InteractModalOld from 'Components/Interact/InteractModalOld';
import History from 'Services/History';
import { removeEmptyCharacters } from 'Utils/formatters';

interface DocumentFormProps extends FormRenderProps<DocumentValues> {
  initialValues: DocumentValues;
  onDocumentCreate: (id: string) => void;
  onTemplateSelect?: (templateId: Document['id'] | undefined) => void;
  onTemplateEdit?: (values: DocumentValues) => void;
  document?: Document;
  submitButtonTitle?: string;
  isDocumentsLoading?: boolean;
}

const DocumentForm = ({
  values,
  form,
  errors,
  handleSubmit,
  submitting,
  initialValues,
  onDocumentCreate,
  onTemplateSelect,
  document,
  isDocumentsLoading,
}: DocumentFormProps) => {
  const [createDocument] = useDocumentCreate();
  const [fileSubmitting, setFileSubmitting] = useState(false);
  const [updateDocument, isDocumentUpdating] = useDocumentUpdate();
  const [isFileProcessed, setIsFileProcessed] = useState(
    document?.parts?.length && !!document?.parts.every(part => part.filesUploaded),
  );
  const [createDocumentByExistTemplate] = useDocumentCreateByExistTemplate();
  const [isConverting, setIsConverting] = useState(false);
  const [
    startWatchDocumentConvertionProgress,
    stopWatchDocumentConvertionProgress,
  ] = useDocumentConvertionProgressWatcher();
  const [cleanFileData, isCleanFileData] = useDocumentFileDataClean();

  const templates = useSelector(selectActiveTemplates);
  const documentId = useMemo(() => document?.id, [document]);
  const initialDocumentFiles = useMemo(() => {
    if (document) {
      const fileItems = document.parts.map(part => ({
        id: part.id,
        token: uuid(),
        filename: part.originalFileName,
        isUploaded: false,
        isFinished: part.filesUploaded,
        order: part.order,
        errorText: part.errorText,
      }));

      return orderBy(fileItems, 'order');
    }

    return [];
  }, [document]);
  const [files, setFiles] = useState<DocumentItem[]>(initialDocumentFiles);
  const [tokenInUploading, setTokenInUploading] = useState<string | null>(null);
  const [isShowWarning, setShowWarning] = useState<boolean>(false);

  const [uploadDocument, cancelUpload, isUploading] = useDocumentUpload();
  const userPlan = useSelector(selectUserPlan);
  const user: User = useSelector(selectUser);

  const isDocumentContainRestrictedUrl = useMemo(
    () =>
      errors.title === 'Title should not contain url' ||
      errors.message === 'Message should not contain url',
    [errors.title, errors.message],
  );

  const {
    isBasedOnTemplate,
    isTemplate,
    isEdit,
    isWithOthers,
    isMeAndOthersType,
    isSignersVisible,
    isOnlyMeType,
  } = useMemo(
    () => ({
      isBasedOnTemplate: !!values.templateId,
      isTemplate:
        initialValues.type === DocumentTypes.TEMPLATE ||
        initialValues.type === DocumentTypes.FORM_REQUEST,
      isEdit: History.location.pathname.indexOf('edit') !== -1,
      isWithOthers:
        initialValues.type === DocumentTypes.ME_AND_OTHER ||
        initialValues.type === DocumentTypes.OTHERS,

      isSignersVisible: [
        DocumentTypes.ME_AND_OTHER,
        DocumentTypes.OTHERS,
        DocumentTypes.TEMPLATE,
        DocumentTypes.FORM_REQUEST,
      ].includes(initialValues.type),
      isMeAndOthersType: initialValues.type === DocumentTypes.ME_AND_OTHER,
      isOnlyMeType: initialValues.type === DocumentTypes.ME,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [values],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialType = useMemo(() => initialValues.type, []);

  const [showInteractModal, closeInteractModal] = useModal(() => {
    if (documentId) {
      return (
        <InteractModalOld
          onClose={closeInteractModal}
          documentId={documentId}
          handleSubmit={handleSubmit}
          submitting={submitting}
          buttonSendTitle={
            isTemplate && isEdit
              ? DocumentActions.SAVE
              : isTemplate
              ? DocumentActions.CREATE
              : DocumentActions.SEND
          }
        />
      );
    }

    return null;
  }, [documentId, submitting]);

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

  const filterFormEmptyLists = useCallback(
    (values: DocumentValues): DocumentValues => ({
      ...values,
      signers: values.signers?.filter((signer, index) => {
        const { role } = signer || {};

        return isTemplate
          ? role?.trim()
          : signer?.isPreparer ||
              (form.getFieldState(`signers[${index}].email` as any)?.valid &&
                form.getFieldState(`signers[${index}].name` as any)?.valid);
      }),
      recipients: values.recipients?.filter(
        (recipient, index) => form.getFieldState(`recipients[${index}]email` as any)?.valid,
      ),
    }),
    [isTemplate, form],
  );

  useEffect(() => {
    if (isConverting && document) {
      setFiles(prev =>
        prev.map(fileItem => {
          const documentPart = document.parts.find(part => part.id === fileItem.id);
          if (documentPart?.errorText && !documentPart.pdfMetadata) {
            return {
              ...fileItem,
              errorText: documentPart.errorText,
            };
          }
          if (documentPart && documentPart.files && documentPart.pdfMetadata) {
            const nextProgress =
              (documentPart.files?.length / documentPart.pdfMetadata.pages) * 50 + 50;

            return {
              ...fileItem,
              progress: nextProgress,
              isFinished: documentPart.filesUploaded ?? nextProgress === 100,
              errorText: documentPart.errorText,
            };
          }

          return fileItem;
        }),
      );
    }
  }, [document, isConverting]);

  useEffect(() => {
    return () => stopWatchDocumentConvertionProgress();
  }, [stopWatchDocumentConvertionProgress]);

  useEffect(() => {
    if (document) {
      const isFilesProcessed =
        document.parts.length &&
        document.parts.every(part => part.filesUploaded) &&
        files.every(file => file.isFinished);

      setIsFileProcessed(isFilesProcessed);
    }
  }, [document, files]);

  useEffect(() => {
    const isFilesComplete =
      document?.parts.length &&
      document?.parts.every(part => part.filesUploaded) &&
      files.every(file => file.isFinished);

    if (isFilesComplete) {
      setIsConverting(false);
      stopWatchDocumentConvertionProgress();
    }
  }, [
    document,
    files,
    isFileProcessed,
    setIsFileProcessed,
    stopWatchDocumentConvertionProgress,
  ]);

  const handleUploadCancelAll = useCallback(async () => {
    try {
      if (document) {
        cancelUpload();
        setIsConverting(false);
        setIsFileProcessed(false);
        stopWatchDocumentConvertionProgress();

        setFiles([]);

        await cleanFileData({
          documentId: document.id,
        });
      }
    } catch (err) {
      Toast.error('Failed to remove files');
    }
  }, [cancelUpload, cleanFileData, document, stopWatchDocumentConvertionProgress]);

  const handleUploadError = useCallback(async () => {
    setIsConverting(false);
    setIsFileProcessed(false);
    stopWatchDocumentConvertionProgress();
    setFiles([]);
  }, [setIsFileProcessed, stopWatchDocumentConvertionProgress]);

  const handleTemplateSelect = useCallback(
    async (value?: string | number) => {
      onTemplateSelect && onTemplateSelect(value as string | undefined);

      if (value) {
        const currentTemplate = templates.find(template => template.id === value);

        if (!values.title) {
          form.change('title', currentTemplate?.title);
        }
        if (!values.message) {
          form.change('message', currentTemplate?.message);
        }

        const storeSigners = orderBy(
          form.getFieldState('signers')?.value,
          'order',
          'asc',
        );
        const templateSigners = orderBy(currentTemplate?.signers, 'order', 'asc');

        const mergedSigners = templateSigners?.map((signer, i) => ({
          ...storeSigners[i],
          role: signer.role,
          order: signer.order,
        }));

        form.change('signers', mergedSigners);

        await handleUploadCancelAll();
      } else if (!isTemplate) {
        const storedSigners = form.getFieldState('signers')?.value;

        if (!storedSigners) return;

        const signersWithoutRole = storedSigners
          ?.map(signer => ({
            ...signer,
            role: undefined,
          }))
          .filter(signer => signer.email || signer.name || signer.order < 2);

        const requiredSignersCount = initialType === DocumentTypes.OTHERS ? 2 : 3;
        if (signersWithoutRole.length < requiredSignersCount) {
          signersWithoutRole.push({
            order: 2,
            role: undefined,
          });
        }

        form.change('signers', orderBy(signersWithoutRole, 'order', 'asc'));
      }
    },
    [
      initialType,
      form,
      handleUploadCancelAll,
      isTemplate,
      onTemplateSelect,
      templates,
      values.message,
      values.title,
    ],
  );

  const uploadDocumentPart = useCallback(
    async (fileItem: DocumentItem) => {
      try {
        if (isUploading || !fileItem.file) {
          return;
        }
        let doc = document;

        if (!doc) {
          doc = (await createDocument(filterFormEmptyLists(values))) as Document;
          onDocumentCreate(doc.id);
        }
        const uploadResponse = await uploadDocument({
          documentId: doc.id,
          file: fileItem.file,
        });

        if (isNotEmpty(uploadResponse) && !isConverting) {
          startWatchDocumentConvertionProgress({ documentId: doc.id });
          setIsConverting(true);
        }

        setFiles(prev =>
          prev.map(item => {
            if (item.token !== fileItem.token) {
              return item;
            }

            const { documentPart } = uploadResponse as DocumentFileUploadResponse;

            return {
              ...item,
              isUploaded: true,
              progress: 50,
              id: documentPart?.id,
              order: documentPart?.order,
            };
          }),
        );

        setTokenInUploading(null);
      } catch (err) {
        await handleUploadError();
        Toast.handleErrors(err);
      }
    },
    [
      createDocument,
      document,
      filterFormEmptyLists,
      handleUploadError,
      isConverting,
      isUploading,
      onDocumentCreate,
      startWatchDocumentConvertionProgress,
      uploadDocument,
      values,
    ],
  );

  const handleFileUpload = useCallback(
    async (file: File) => {
      const documentFiles = files.map(item => item.file);
      const error = multipleFilesConstaint([...documentFiles, file]);
      const isLimitAttachedMailFiles = multipleAttachingMailFilesConstaint(files, file);

      if (!error) {
        const newFileItem = {
          filename: file.name,
          token: uuid(),
          progress: 10,
          isUploaded: false,
          isFinished: false,
          file,
        };
        setFiles(prev => prev.concat([newFileItem]));
        await handleTemplateSelect(undefined);
      } else {
        Toast.error(error);
      }

      if (isLimitAttachedMailFiles) {
        setShowWarning(isLimitAttachedMailFiles);
      }
    },
    [files, handleTemplateSelect],
  );

  const handleFileUploadFailure = useCallback(error => {
    // setProgress(0);
    // Toast.handleErrors(error);
  }, []);

  const handleFilesReorder = useCallback(
    async (newOrdered: FileItem[]) => {
      try {
        if (document) {
          setFiles(orderBy(newOrdered, 'order'));

          const reorderedDocumentParts = document?.parts
            .filter(part =>
              newOrdered.find(newOrderedItem => newOrderedItem.id === part.id),
            )
            .map(part => {
              const orderItem = newOrdered.find(order => order.id === part.id);
              return orderItem ? { id: part.id, order: orderItem.order } : part;
            });

          await updateDocument({
            values: {
              parts: reorderedDocumentParts,
              documentId: document.id,
              type: document.type,
            },
          });
        }
      } catch (err) {
        Toast.handleErrors(err);
      }
    },
    [document, updateDocument],
  );

  const handleUploadCancel = useCallback(
    async (fileItem: FileItem) => {
      try {
        if (document?.parts?.findIndex(part => part.id === fileItem.id) === -1) {
          return;
        }

        let updatedDocument = document;

        if (fileItem.id && document) {
          updatedDocument = (await cleanFileData({
            documentId: document.id,
            documentPartId: fileItem.id,
          })) as Document;

          form.change('parts', updatedDocument.parts);
        }

        const isEmpty = !files.filter(file => file.token !== fileItem.token).length;

        const isLimitAttachedMailFiles = multipleAttachingMailFilesConstaintOnCancel(
          files,
          fileItem.file?.size,
        );

        if (isEmpty) {
          setIsConverting(false);
          setIsFileProcessed(false);
          stopWatchDocumentConvertionProgress();
        }

        if (!isLimitAttachedMailFiles) {
          setShowWarning(isLimitAttachedMailFiles);
        }

        setFiles(prev => prev.filter(file => file.token !== fileItem.token));
      } catch (error) {
        Toast.error('Failed to remove file');
      }
    },
    [cleanFileData, document, files, form, stopWatchDocumentConvertionProgress],
  );

  useEffect(() => {
    const nextUploadItem = files.find(file => !file.isUploaded && !file.isFinished);
    if (!tokenInUploading && nextUploadItem) {
      setTokenInUploading(nextUploadItem.token);
      uploadDocumentPart(nextUploadItem);
    }
  }, [files, tokenInUploading, uploadDocumentPart]);

  const documentPrepareValidationMeta = useMemo(
    () => getDocumentValidationMeta(initialValues.type),
    [initialValues.type],
  );

  const handleDocumentPrepare = useCallback(
    async (values: DocumentValues) => {
      const { errors, hasValidationErrors, hasSubmitErrors } = form.getState();

      if (hasValidationErrors || hasSubmitErrors) {
        if (errors.signers && values.signers) {
          const actualSigners = values.signers.filter(
            (signer, index) =>
              signer &&
              (isOnlyMeType || !signer.isPreparer) &&
              form.getFieldState(`signers[${index}].email` as any)?.valid &&
              form.getFieldState(`signers[${index}].name` as any)?.valid,
          );

          if (actualSigners.length < documentPrepareValidationMeta.signers.minLength) {
            return documentPrepareValidationMeta.signers.showMessage();
          }
        }
        return form.submit();
      }

      if (!isEqual(values, initialValues)) {
        const document = await updateDocument({
          values: {
            ...filterFormEmptyLists(values),
            documentId: documentId as string,
          },
        });

        if (!isNotEmpty(document)) return;

        const actualSigners = document.signers.filter(
          signer => isOnlyMeType || !signer.isPreparer,
        );

        if (actualSigners.length < documentPrepareValidationMeta.signers.minLength) {
          return documentPrepareValidationMeta.signers.showMessage();
        }

        form.change('signers', orderBy(document.signers, 'order', 'asc'));
      }

      showInteractModal();
    },
    [
      documentId,
      documentPrepareValidationMeta.signers,
      filterFormEmptyLists,
      form,
      initialValues,
      isOnlyMeType,
      showInteractModal,
      updateDocument,
    ],
  );

  const { documentButtonTitle, defaultSubmitButtonTitle } = isWithOthers
    ? {
        documentButtonTitle: 'Prepare Doc for Signing',
        defaultSubmitButtonTitle: 'Send Document',
      }
    : {
        documentButtonTitle: isTemplate ? 'Fill Template' : 'Fill Out & Sign',
        defaultSubmitButtonTitle: isTemplate
          ? initialValues.type === DocumentTypes.TEMPLATE
            ? 'Create Template'
            : 'Create Form'
          : 'Send Document',
      };

  const { title, titlePlaceholder, messagePlaceholder } = useMemo(() => {
    switch (initialValues.type) {
      case DocumentTypes.TEMPLATE:
        return {
          title: 'Template Name',
          titlePlaceholder: 'A template name to identify your template.',
          messagePlaceholder:
            'Add an optional message for all future documents created using this template.',
        };
      case DocumentTypes.FORM_REQUEST:
        return {
          title: 'Form Name',
          titlePlaceholder: 'A form name to identify your form.',
          messagePlaceholder:
            'Add an optional message for all future documents created using this form.',
        };
      default:
        return {
          title: 'Document Title',
          titlePlaceholder: 'A document title to identify your document.',
          messagePlaceholder: 'Add an optional message for the document signers.',
        };
    }
  }, [initialValues.type]);

  const firstSignerIndex = useMemo(() => {
    const signerIndex = initialValues?.signers?.findIndex(signer => signer?.order === 1);
    return signerIndex && signerIndex !== -1 ? signerIndex : 0;
  }, [initialValues]);

  const handleFileSubmit = useCallback(async () => {
    try {
      await callActionAsync(handleDocumentPrepare, values, setFileSubmitting);
    } catch (error) {
      Toast.handleErrors(error);
    }
  }, [handleDocumentPrepare, values]);

  const handleTemplateEditPrepare = useCallback(
    async (values: DocumentValues) => {
      if (form.getState().hasValidationErrors || form.getState().hasSubmitErrors) {
        return form.submit();
      }

      const document = (await createDocumentByExistTemplate({
        ...values,
        id: documentId as string,
      })) as Document;
      onDocumentCreate(document.id);

      return showInteractModal();
    },
    [
      form,
      documentId,
      onDocumentCreate,
      showInteractModal,
      createDocumentByExistTemplate,
    ],
  );

  const handleTemplateEdit = useCallback(async () => {
    try {
      await callActionAsync(handleTemplateEditPrepare, values, setFileSubmitting);
    } catch (error) {
      Toast.handleErrors(error);
    }
  }, [handleTemplateEditPrepare, values]);

  return (
    <form className="signTemplate__form">
      <div className="signTemplate__form-mainGroupField">
        <Field
          name="title"
          label={title}
          component={FieldTextInput}
          placeholder={titlePlaceholder}
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
          placeholder={messagePlaceholder}
          validate={
            userPlan.type === PlanTypes.FREE && !user.teamId
              ? composeValidators<string>(messageNotUrlProtocol)
              : undefined
          }
          parse={message => message || null}
        />

        {initialValues.type === DocumentTypes.TEMPLATE &&
          initialValues.status === DocumentStatuses.DRAFT && (
            <div>
              <Field
                name="isApiTemplate"
                label="Create an API Template"
                render={FieldCheckbox}
              />
            </div>
          )}
      </div>
      <div className="signTemplate__templateField">
        {isSignersVisible && (
          <>
            {isMeAndOthersType && !isTemplate && (
              <div className="signTemplate__emailField">
                <p className="signTemplate__emailField-title">Signers</p>
                <div className="signers__item signers__item-inner signers__item--me">
                  <Field
                    name={`signers[${firstSignerIndex}].name`}
                    label="Me"
                    component={FieldTextInput}
                    format={value => (value ? `Me (${value})` : 'Me')}
                    disabled
                  />
                  <Field
                    name={`signers[${firstSignerIndex}].email`}
                    component={FieldTextInput}
                    disabled
                  />
                </div>
              </div>
            )}
            {initialValues.type !== DocumentTypes.FORM_REQUEST && (
              <div className="signTemplate__emailField signTemplate__emailField--signers">
                {isTemplate ? (
                  <>
                    <p className="signTemplate__emailField-title">
                      Create Template Roles
                    </p>
                    <FieldArray
                      name="signers"
                      label="Role"
                      addLabel="Add role"
                      render={props => (
                        <SignersArray
                          {...props}
                          addLabel="Add Role"
                          isOrdered={values.isOrdered}
                          renderFields={name => (
                            <Field
                              key={name}
                              name={`${name}role`}
                              placeholder="Role"
                              component={FieldTextInput}
                              validate={composeValidators<string>(
                                required,
                                notOnlySpaces,
                                maxLength50,
                              )}
                            />
                          )}
                        />
                      )}
                      isItemDeletablePredicate={({ fields }) => fields.length > 1}
                    />
                  </>
                ) : (
                  <>
                    <p className="signTemplate__emailField-title">
                      {isMeAndOthersType ? 'Add Other Signers' : 'Choose Signers'}
                    </p>
                    <FieldArray
                      name="signers"
                      render={props => (
                        <SignersArray
                          {...props}
                          withRoles={isBasedOnTemplate}
                          isAdditionDisabled={isBasedOnTemplate}
                          skipFirst={isMeAndOthersType}
                          skipPreparer
                          isItemDeletablePredicate={({ fields }) =>
                            !!fields.length &&
                            fields.length > (isMeAndOthersType ? 3 : 2) &&
                            !isBasedOnTemplate
                          }
                          renderFields={name => (
                            <>
                              <Field
                                name={`${name}.name`}
                                placeholder="Name"
                                component={FieldTextInput}
                                validate={composeValidators<string>(
                                  required,
                                  notOnlySpaces,
                                )}
                              />
                              <Field
                                name={`${name}.email`}
                                placeholder="Email"
                                component={FieldTextInput}
                                parse={removeEmptyCharacters}
                                validate={composeValidators<string>(required, email)}
                              />
                            </>
                          )}
                        />
                      )}
                      isOrdered={values.isOrdered && !isBasedOnTemplate}
                    />
                  </>
                )}
                {!isBasedOnTemplate && (
                  <div className="signTemplate__emailField-isOrdered">
                    <Field
                      name="isOrdered"
                      label="Custom signing order"
                      render={FieldCheckbox}
                    />
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {initialValues.type !== DocumentTypes.TEMPLATE &&
          initialValues.type !== DocumentTypes.FORM_REQUEST && (
            <>
              <p className="signTemplate__templateField-select-title">Choose Template</p>
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
                    isLoading={isDocumentsLoading}
                    disabled={isDocumentsLoading || files.length > 0}
                  />
                )}
              />

              <p className="common__or">Or</p>
            </>
          )}
        <Field
          name="templateId"
          component={FileField}
          submitButtonTitle={
            isBasedOnTemplate ? defaultSubmitButtonTitle : documentButtonTitle
          }
          onUploadCancel={handleUploadCancel}
          onFileUpload={handleFileUpload}
          onUploadFailure={handleFileUploadFailure}
          onSubmit={isBasedOnTemplate ? handleSubmit : handleFileSubmit}
          onEditTemplate={handleTemplateEdit}
          isFileProcessed={isFileProcessed}
          isBasedOnTemplate={isBasedOnTemplate}
          disabled={
            isDocumentsLoading || isDocumentUpdating || isDocumentContainRestrictedUrl
          }
          submitting={isDocumentsLoading || fileSubmitting || submitting}
          files={files}
          onFileReorder={handleFilesReorder}
          disableReorder={isUploading}
          isCleanFileData={isCleanFileData}
          isShowWarning={isShowWarning}
        />
      </div>

      {!isTemplate && (
        <div className="signTemplate__emailField">
          <p className="signTemplate__emailField-title">Add Viewers</p>
          <FieldArray
            name="recipients"
            component={EmailRecipientsArray}
            isItemsDeletable
          />
        </div>
      )}
    </form>
  );
};

export default DocumentForm;
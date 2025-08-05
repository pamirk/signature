import { DocumentItem, FileItem } from 'Interfaces/Common';
import {
  Document,
  DocumentFileUploadResponse,
  DocumentTypes,
  DocumentUpdatePayload,
  DocumentValues,
} from 'Interfaces/Document';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Field, FormRenderProps } from 'react-final-form';
import SingleFileField from './SingleFileField';
import uuid from 'uuid/v4';
import {
  useDocumentConvertionProgressWatcher,
  useDocumentCreate,
  useDocumentFileDataClean,
  useDocumentUpload,
} from 'Hooks/Document';
import { orderBy } from 'lodash';
import Toast from 'Services/Toast';
import { isNotEmpty } from 'Utils/functions';
import UISelect from 'Components/UIComponents/UISelect';
import { tabItems, TabTypes } from './TabItems';
import BulkSendForm from 'Components/BulkSendForm';
import classNames from 'classnames';
import {
  multipleAttachingMailFilesConstaint,
  multipleFilesConstaint,
} from 'Utils/validation';

interface UploadFileStepProps extends FormRenderProps<DocumentValues> {
  document?: Document;
  initialValues: DocumentValues;
  templates?: Document[];
  isLoading?: boolean;
  onDocumentCreate: (id: string) => void;
  onTemplateSelect?: (templateId: Document['id'] | undefined) => void;
  updateDocument: (values: DocumentUpdatePayload) => void;
  isDocumentUpdating: boolean;
  tabType: TabTypes;
  setTabType: (tabType: TabTypes) => void;
  isEditMode: boolean;
  isFileProcessed: boolean | number | undefined;
  setIsFileProcessed: (isFileProcessed: boolean) => void;
}

export const UploadFileStep = ({
  values,
  form,
  submitting,
  document,
  templates,
  isLoading,
  onDocumentCreate,
  onTemplateSelect,
  updateDocument,
  isDocumentUpdating,
  tabType,
  setTabType,
  isEditMode,
  isFileProcessed,
  setIsFileProcessed,
}: UploadFileStepProps) => {
  const [createDocument] = useDocumentCreate();
  const [isConverting, setIsConverting] = useState(false);
  const [
    startWatchDocumentConvertionProgress,
    stopWatchDocumentConvertionProgress,
  ] = useDocumentConvertionProgressWatcher();
  const [cleanFileData, isCleaning] = useDocumentFileDataClean();
  const initialDocumentFiles = useMemo(() => {
    if (document && !values.templateId) {
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
  }, [document, values.templateId]);
  const [files, setFiles] = useState<DocumentItem[]>(initialDocumentFiles);
  const [tokenInUploading, setTokenInUploading] = useState<string | null>(null);

  const [uploadDocument, cancelUpload, isUploading] = useDocumentUpload();
  const [tabIndex, setTabIndex] = useState(0);
  const [isDisabledTabs, setDisabledTabs] = useState<boolean>(false);
  const [isShowWarning, setShowWarning] = useState<boolean>(false);
  const [isShowLimitationModal, setShowLimitationModal] = useState<boolean>(true);

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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { order, role, ...restSigner } = signer || {};

        return (
          signer?.isPreparer ||
          (form.getFieldState(`signers[${index}].email` as any)?.valid &&
            form.getFieldState(`signers[${index}].name` as any)?.valid)
        );
      }),
      recipients: values.recipients?.filter(
        (recipient, index) => form.getFieldState(`recipients[${index}]email` as any)?.valid,
      ),
    }),
    [form],
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
    const isFilesComplete =
      document?.parts.length &&
      document?.parts.every(part => part.filesUploaded || !!part.errorText) &&
      files.every(file => file.isFinished || !!file.errorText);

    setIsFileProcessed(isFilesComplete as boolean);

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
  }, [
    cancelUpload,
    cleanFileData,
    document,
    setIsFileProcessed,
    stopWatchDocumentConvertionProgress,
  ]);

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
        const currentTemplate =
          templates && templates.find(template => template.id === value);
        const templateSigners = orderBy(currentTemplate?.signers, 'order', 'asc');
        form.change('signers', templateSigners);
      } else {
        document &&
          updateDocument({
            values: {
              documentId: document.id,
              templateId: null,
              fields: [],
              signers: document.signers.filter(signer => signer.isPreparer),
              type: DocumentTypes.ME,
            },
          });
      }
      await handleUploadCancelAll();
    },
    [document, form, handleUploadCancelAll, onTemplateSelect, templates, updateDocument],
  );

  const handleFileUpload = useCallback(
    async (file: File) => {
      const documentFiles = files.map(item => item.file);
      const error = multipleFilesConstaint([...documentFiles, file]);
      const isLimitAttachedMailFiles = multipleAttachingMailFilesConstaint(files, file);
      setDisabledTabs(true);

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
      } else {
        Toast.error(error);
      }

      if (isLimitAttachedMailFiles) {
        setShowWarning(isLimitAttachedMailFiles);
      }
    },
    [files],
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

        if (fileItem.id && document) {
          await cleanFileData({
            documentId: document.id,
            documentPartId: fileItem.id,
          });
        }

        const isEmpty = !files.filter(file => file.token !== fileItem.token).length;

        if (isEmpty) {
          setIsConverting(false);
          setIsFileProcessed(false);
          stopWatchDocumentConvertionProgress();
        }

        setFiles(prev => prev.filter(file => file.token !== fileItem.token));
      } catch (error) {
        Toast.error('Failed to remove file');
      }
    },
    [
      cleanFileData,
      document,
      files,
      setIsFileProcessed,
      stopWatchDocumentConvertionProgress,
    ],
  );

  const showTabContent = useCallback(() => {
    switch (tabType) {
      case TabTypes.UPLOAD_FILE: {
        return (
          <>
            <Field
              name="document"
              component={SingleFileField}
              onUploadCancel={handleUploadCancel}
              onFileUpload={handleFileUpload}
              isFileProcessed={isFileProcessed}
              submitting={submitting}
              files={values.templateId ? [] : files}
              disabled={values.templateId || isCleaning || isDocumentUpdating}
              onFileReorder={handleFilesReorder}
              disableReorder={isUploading}
              isCleanFileData={isCleaning}
              isShowWarning={isShowWarning}
            />
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
                  isLoading={isLoading}
                  disabled={isLoading || isConverting || files?.length > 0}
                  contentWrapperClassName={
                    selectableOptions.length > 0
                      ? 'uiSelect__search-contentWrapper'
                      : undefined
                  }
                  isSearchable={selectableOptions.length > 0 ? true : false}
                  searchInputPlaceholder={'Search for Templates...'}
                  searchWrapperClassName={
                    selectableOptions.length > 0
                      ? 'uiSelect__search-searchWrapper'
                      : undefined
                  }
                />
              )}
            />
          </>
        );
      }
      case TabTypes.BULK_SEND: {
        return (
          <BulkSendForm
            isShowLimitationModal={isShowLimitationModal}
            setShowLimitationModal={setShowLimitationModal}
          />
        );
      }
      default:
        return null;
    }
  }, [
    files,
    handleFileUpload,
    handleFilesReorder,
    handleTemplateSelect,
    handleUploadCancel,
    isCleaning,
    isConverting,
    isDocumentUpdating,
    isFileProcessed,
    isLoading,
    isShowLimitationModal,
    isShowWarning,
    isUploading,
    selectableOptions,
    submitting,
    tabType,
    values.templateId,
  ]);

  const handleSetTab = useCallback(
    (index, type) => {
      setTabIndex(index);
      setTabType(type);
      onTemplateSelect && onTemplateSelect(undefined);
    },
    [onTemplateSelect, setTabType],
  );

  useEffect(() => {
    const nextUploadItem = files.find(file => !file.isUploaded && !file.isFinished);

    if (!tokenInUploading && nextUploadItem) {
      setTokenInUploading(nextUploadItem.token);
      uploadDocumentPart(nextUploadItem);
    }
  }, [files, tokenInUploading, uploadDocumentPart]);

  useEffect(() => {
    if (document && document.parts.length === 0 && files.length === 0) {
      setDisabledTabs(false);
    }
  }, [document, files]);

  return (
    <div className="wizardSignForm__uploadContainer">
      {document && isEditMode ? (
        <>
          <div className="wizardSignForm__tabPanel">
            <div className="wizardSignForm__tabPanel-list">
              <div className="wizardSignForm__tabPanel-tab alone">Upload File</div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="wizardSignForm__tabPanel">
            <ul className="wizardSignForm__tabPanel-list">
              {tabItems.map((item, index) => {
                const { title, type } = item;

                return (
                  <li
                    key={index}
                    className={classNames('wizardSignForm__tabPanel-tab', {
                      active: tabIndex === index,
                      inactive: tabIndex !== index && !isDisabledTabs,
                      'inactive disabled': tabIndex !== index && isDisabledTabs,
                    })}
                    onClick={() => {
                      handleSetTab(index, type);
                    }}
                  >
                    {title}
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
      {showTabContent()}
    </div>
  );
};

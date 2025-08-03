import React, { useCallback, useEffect, useState } from 'react';
import SingleFileField from 'Components/WizardSignForm/SingleFileField';
import { DocumentItem } from 'Interfaces/Common';
import {
  Document,
  DocumentFileUploadResponse,
  DocumentValues,
} from 'Interfaces/Document';
import { Field, FormRenderProps } from 'react-final-form';
import uuid from 'uuid/v4';
import {
  useDocumentConvertionProgressWatcher,
  useDocumentCreate,
  useDocumentUpload,
} from 'Hooks/Document';
import Toast from 'Services/Toast';
import { isNotEmpty } from 'Utils/functions';
import classNames from 'classnames';
import {
  multipleAttachingMailFilesConstaint,
  multipleFilesConstaint,
} from 'Utils/validation';
import { useSignUpTemporary } from 'Hooks/Auth';
import { useCompanyInfoGet } from 'Hooks/User';

interface LandingDocumentFormProps extends FormRenderProps<DocumentValues> {
  document?: Document;
  initialValues: DocumentValues;
  onDocumentCreate: (id: string) => void;
}

export const LandingDocumentForm = ({
  values,
  form,
  document,
  submitting,
  onDocumentCreate,
}: LandingDocumentFormProps) => {
  const [isFileProcessed, setIsFileProcessed] = useState<boolean>(false);
  const [createDocument] = useDocumentCreate();
  const [isConverting, setIsConverting] = useState(false);
  const [
    startWatchDocumentConvertionProgress,
    stopWatchDocumentConvertionProgress,
  ] = useDocumentConvertionProgressWatcher();
  const [files, setFiles] = useState<DocumentItem[]>([]);
  const [tokenInUploading, setTokenInUploading] = useState<string | null>(null);
  const [isShowWarning, setShowWarning] = useState<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [uploadDocument, cancelUpload, isUploading] = useDocumentUpload();
  const [getCompanyInfo] = useCompanyInfoGet();
  const [signUpTemporary] = useSignUpTemporary();

  const filterFormEmptyLists = useCallback(
    (values: DocumentValues): DocumentValues => ({
      ...values,
      signers: values.signers?.filter((signer, index) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { order, role, ...restSigner } = signer || {};

        return (
          signer?.isPreparer ||
          (form.getFieldState(`signers[${index}].email`)?.valid &&
            form.getFieldState(`signers[${index}].name`)?.valid)
        );
      }),
      recipients: values.recipients?.filter(
        (recipient, index) => form.getFieldState(`recipients[${index}]email`)?.valid,
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

  const handleUploadError = useCallback(async () => {
    setIsConverting(false);
    setIsFileProcessed(false);
    stopWatchDocumentConvertionProgress();
    setFiles([]);
  }, [setIsFileProcessed, stopWatchDocumentConvertionProgress]);

  const handleGetUserInfo = useCallback(async () => {
    await signUpTemporary(undefined);
    await getCompanyInfo(undefined);
  }, [signUpTemporary, getCompanyInfo]);

  const handleFileUpload = useCallback(
    async (file: File) => {
      const documentFiles = files.map(item => item.file);
      const error = multipleFilesConstaint([...documentFiles, file]);
      const isLimitAttachedMailFiles = multipleAttachingMailFilesConstaint(files, file);

      if (!error) {
        await handleGetUserInfo();

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
    [files, handleGetUserInfo],
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

  useEffect(() => {
    const nextUploadItem = files.find(file => !file.isUploaded && !file.isFinished);

    if (!tokenInUploading && nextUploadItem) {
      setTokenInUploading(nextUploadItem.token);
      uploadDocumentPart(nextUploadItem);
    }
  }, [files, tokenInUploading, uploadDocumentPart]);

  return (
    <div className={classNames('sign-up-landing__upload-wrapper')}>
      <p className="sign-up-landing__upload-header">Upload File</p>
      <Field
        name="document"
        component={SingleFileField}
        onFileUpload={handleFileUpload}
        isFileProcessed={isFileProcessed}
        submitting={submitting}
        files={files}
        disabled={files.length === 1}
        onFileReorder={() => {}}
        isCleanFileData={false}
        isShowWarning={isShowWarning}
        disableImportServices={true}
        filesLimit={1}
      />
    </div>
  );
};

export default LandingDocumentForm;

import { SuccessSendModal } from 'Components/DocumentForm';
import InteractModal from 'Components/Interact/InteractModal';
import arrayMutators from 'final-form-arrays';
import {
  useAllTemplatesGet,
  useAllTemplatesGetCancel,
  useDocumentCreate,
  useDocumentUpdate,
} from 'Hooks/Document';
import { useDocumentSendOut } from 'Hooks/DocumentSign';
import {
  Document,
  DocumentTypes,
  DocumentValues,
  FinalStepButtonTitle,
  Signer,
} from 'Interfaces/Document';
import { orderBy } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Form, FormRenderProps } from 'react-final-form';
import { useModal } from 'react-modal-hook';
import { useSelector } from 'react-redux';
import Toast from 'Services/Toast';
import { processSubmissionErrors } from 'Utils/functions';
import { selectDocument } from 'Utils/selectors';

import { RecursivePartial } from 'Interfaces/Common';

import { TabTypes } from './TabItems';
import WizardSignFormValues from './WizardSignFormValues';
import { useCurrentUserGet } from 'Hooks/User';

function getFinalStepButtonTitle(documentType: DocumentTypes) {
  switch (documentType) {
    case DocumentTypes.ME:
      return FinalStepButtonTitle.SIGN_DOCUMENT;
    case DocumentTypes.ME_AND_OTHER:
      return FinalStepButtonTitle.SIGN_AND_SEND;
    case DocumentTypes.OTHERS:
      return FinalStepButtonTitle.SEND;
  }
}

interface WizardSignFormProps {
  initialValues: DocumentValues;
  initialStep?: number;
  isEditMode: boolean;
}

const WizardSignForm = ({
  initialValues,
  initialStep = 1,
  isEditMode,
}: WizardSignFormProps) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [isBreadcrumbsBan, setIsBreadcrumbsBan] = useState(false);
  const [isTemplateNotEdited, setIsTemplateNotEdited] = useState(false);
  const [sendDocument, isSendingDocument] = useDocumentSendOut();
  const [updateDocument, isUpdatingDocument] = useDocumentUpdate();
  const [createDocument] = useDocumentCreate();
  const [getAllTemplates, isTemplatesLoading] = useAllTemplatesGet();
  const cancelAllTemplatesLoading = useAllTemplatesGetCancel();
  const [getCurrentUser] = useCurrentUserGet();

  const [documentId, setDocumentId] = useState<Document['id'] | undefined>(
    initialValues.id,
  );
  const document = useSelector(state => selectDocument(state, { documentId }));

  const isUploadedFile = useMemo(
    () =>
      document &&
      document.parts.length &&
      document.parts.every(part => part.filesUploaded),
    [document],
  );
  const [tabType, setTabType] = useState(TabTypes.UPLOAD_FILE);
  const [isDisableInteractTooltip, disableInteractTooltip] = useState<boolean>(false);

  const [selectedTemplateId, setSelectedTemplateId] = useState<
    Document['id'] | undefined | null
  >(initialValues.templateId);

  const selectedTemplate = useSelector(state =>
    selectDocument(state, { documentId: selectedTemplateId }),
  );

  const handleGetAllTemplates = useCallback(async () => {
    try {
      await getAllTemplates({
        withTeammateTemplates: true,
      });
    } catch (error) {
      Toast.handleErrors(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleGetAllTemplates();
    return () => cancelAllTemplatesLoading();
  }, [cancelAllTemplatesLoading, handleGetAllTemplates]);

  const [openSuccessModal, closeSuccessModal] = useModal(
    () => (
      <SuccessSendModal onClose={closeSuccessModal} document={document as Document} />
    ),
    [document],
  );

  const mergeSigners = useCallback(
    (signers: Signer[], documentSigners: Signer[]): RecursivePartial<Signer>[] =>
      signers.map((signer, index) => ({
        ...documentSigners[index],
        role: signer.role,
        order: signer.order,
      })),
    [],
  );

  const formattedInitialValues = useMemo(() => {
    const documentSigners = ((document?.signers.length || 0) >=
    (initialValues.signers?.length || 0)
      ? document?.signers
      : initialValues.signers) as Signer[];
    const recipients = initialValues?.recipients
      ? initialValues?.recipients
      : document?.recipients;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { fields, ...restDocument } = document || {};
    const { signers: templateSigners } = selectedTemplate || {};
    const mergedSigners =
      templateSigners && templateSigners.length > 0
        ? mergeSigners(
            orderBy(templateSigners, 'order', 'asc'), //because in some cases, template's signers is not ordered by default
            orderBy(documentSigners, 'order', 'asc'),
          )
        : documentSigners;

    return {
      ...initialValues,
      ...restDocument,
      signers: orderBy(mergedSigners, 'order', 'asc'),
      isOrdered: selectedTemplate
        ? selectedTemplate.isOrdered
        : document?.isOrdered || initialValues.isOrdered,
      templateId: selectedTemplate?.id,
      type: selectedTemplate ? DocumentTypes.OTHERS : initialValues.type,
      recipients,
      title: document?.title,
      message: selectedTemplate ? selectedTemplate.message : document?.message,
    } as DocumentValues;
  }, [document, initialValues, mergeSigners, selectedTemplate]);

  const [showInteractModal, closeInteractModal] = useModal(() => {
    const handleCloseModal = () => {
      closeInteractModal();
    };

    const handleSaveDocument = () => {
      closeInteractModal();
    };

    const handleInteractChooseActionStep = (step: number) => {
      setCurrentStep(step - 1);
      if (step === 1) {
        handleCloseModal();
      }
    };

    return (
      <InteractModal
        onClose={handleCloseModal}
        documentId={documentId as string}
        handleSubmit={handleSaveDocument}
        submitting={isSendingDocument || isUpdatingDocument}
        documentInitialValues={formattedInitialValues}
        wizardFormStep={currentStep}
        onChangeWizardFormStep={() => {
          setCurrentStep(prev => prev + 1);
        }}
        onChooseStep={handleInteractChooseActionStep}
        disableTooltip={disableInteractTooltip}
        isDisableTooltip={isDisableInteractTooltip}
        isChooseActionDisabled={!!selectedTemplate}
      />
    );
  }, [currentStep, documentId, isUpdatingDocument, selectedTemplate, document]);

  const onSubmit = useCallback(
    async ({ type, ...values }: any) => {
      try {
        let scopedDocument = document;
        const expirationDate = values.expirationDate
          ? (values.expirationDate as Date).toISOString()
          : undefined;

        if (scopedDocument) {
          scopedDocument = (await updateDocument({
            values: {
              ...values,
              templateId: isTemplateNotEdited ? values.templateId : null,
              documentId: documentId,
              type: isTemplateNotEdited ? type : undefined,
              expirationDate,
            },
          })) as Document;
        } else {
          scopedDocument = (await createDocument({
            ...values,
            type,
            expirationDate,
          })) as Document;
          setDocumentId(scopedDocument.id);
        }

        await sendDocument({ documentId: scopedDocument.id });

        return openSuccessModal();
      } catch (error) {
        Toast.handleErrors(error);

        return processSubmissionErrors(error);
      }
    },
    [
      createDocument,
      document,
      documentId,
      openSuccessModal,
      sendDocument,
      updateDocument,
      isTemplateNotEdited,
    ],
  );

  const handleOpenInteract = useCallback(async () => {
    await getCurrentUser(undefined);
    setCurrentStep(1);
    showInteractModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showInteractModal]);

  const handleSubmitForm = useCallback(() => {
    if (selectedTemplate) {
      setCurrentStep(3);
      setIsTemplateNotEdited(true);
      setIsBreadcrumbsBan(true);
    } else {
      handleOpenInteract();
      setIsBreadcrumbsBan(false);
    }
  }, [handleOpenInteract, selectedTemplate]);

  const handleChooseActionStep = useCallback(
    (step: number) => {
      setCurrentStep(step - 1);

      if (step > 1 && step < 4) {
        showInteractModal();
      }
    },
    [showInteractModal],
  );

  const setFirstCurrentStep = () => {
    setCurrentStep(1);
  };

  const handleSetTabType = useCallback((tabType: TabTypes) => {
    setTabType(tabType);
  }, []);

  const handleUpdateDocument = useCallback(
    async values => {
      await updateDocument({
        values: {
          ...values,
          documentId: documentId,
        },
      });
    },
    [documentId, updateDocument],
  );

  useEffect(() => {
    if (isEditMode && !selectedTemplate && !selectedTemplateId && isUploadedFile) {
      handleOpenInteract();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Form
      initialValues={formattedInitialValues}
      onSubmit={onSubmit}
      mutators={{ ...arrayMutators }}
      render={(renderProps: FormRenderProps<DocumentValues>) => (
        <WizardSignFormValues
          currentStep={currentStep}
          isBreadcrumbsBan={isBreadcrumbsBan}
          renderProps={renderProps}
          document={document}
          setDocumentId={setDocumentId}
          isTemplatesLoading={isTemplatesLoading}
          setSelectedTemplateId={setSelectedTemplateId}
          updateDocument={updateDocument}
          isUpdatingDocument={isUpdatingDocument}
          tabType={tabType}
          handleSetTabType={handleSetTabType}
          isEditMode={isEditMode}
          selectedTemplate={selectedTemplate}
          handleSubmitForm={handleSubmitForm}
          isUploadedFile={isUploadedFile}
          getFinalStepButtonTitle={getFinalStepButtonTitle}
          formattedInitialValues={formattedInitialValues}
          isSendingDocument={isSendingDocument}
          handleChooseActionStep={handleChooseActionStep}
          handleUpdateDocument={handleUpdateDocument}
          documentId={documentId}
          showInteractModal={showInteractModal}
          setFirstCurrentStep={setFirstCurrentStep}
        />
      )}
    />
  );
};

export default WizardSignForm;

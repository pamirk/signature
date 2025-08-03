import React, { useCallback, useEffect, useMemo, useState } from 'react';
import InteractModal from 'Components/Interact/InteractModal';
import arrayMutators from 'final-form-arrays';
import { useDocumentUpdate } from 'Hooks/Document';
import {
  Document,
  DocumentTypes,
  DocumentValues,
  FinalStepButtonTitle,
  Signer,
} from 'Interfaces/Document';
import { Form, FormRenderProps } from 'react-final-form';
import { useModal } from 'react-modal-hook';
import { LandingDocumentForm, LandingSetTitleForm } from './components';
import classNames from 'classnames';
import { orderBy } from 'lodash';
import { StepType } from './LandingSignUpWrapper';
import UISpinner from 'Components/UIComponents/UISpinner';

interface LandingSignDocumentProps {
  document?: Document;
  documentId?: string;
  setDocumentId: React.Dispatch<React.SetStateAction<string | undefined>>;
  setStepType: React.Dispatch<React.SetStateAction<StepType>>;
}

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

const LandingSignDocument = ({
  document,
  documentId,
  setDocumentId,
  setStepType,
}: LandingSignDocumentProps) => {
  const initialStep = 1;
  const initialValues = useMemo(() => {
    return {
      type: DocumentTypes.ME,
      signers: [
        {
          name: 'Me (Now)',
          email: 'example@example.com',
          order: -1,
          isPreparer: true,
        },
      ],
    } as DocumentValues;
  }, []);

  const [updateDocument, isUpdatingDocument] = useDocumentUpdate();

  const [currentStep, setCurrentStep] = useState(initialStep);
  const [isDisableInteractTooltip, disableInteractTooltip] = useState<boolean>(false);

  const isUploadedFile = useMemo(
    () =>
      document &&
      document.parts.length &&
      document.parts.every(part => part.filesUploaded),
    [document],
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

    return {
      ...initialValues,
      ...restDocument,
      signers: orderBy(documentSigners, 'order', 'asc'),
      isOrdered: document?.isOrdered || initialValues.isOrdered,
      type: initialValues.type,
      recipients,
      title: document?.title,
      message: document?.message,
    } as DocumentValues;
  }, [document, initialValues]);

  const [showInteractModal, closeInteractModal] = useModal(() => {
    const handleCloseModal = () => {
      closeInteractModal();
    };

    const handleSaveDocument = () => {
      closeInteractModal();
    };

    return (
      <InteractModal
        onClose={handleCloseModal}
        documentId={documentId as string}
        handleSubmit={handleSaveDocument}
        submitting={isUpdatingDocument}
        documentInitialValues={formattedInitialValues}
        wizardFormStep={currentStep}
        onChangeWizardFormStep={() => {
          setCurrentStep(prev => prev + 1);
        }}
        onChooseStep={() => {}}
        disableTooltip={disableInteractTooltip}
        isDisableTooltip={isDisableInteractTooltip}
        isChooseActionDisabled={true}
        isDisableCancelButton={true}
      />
    );
  }, [currentStep, documentId, isUpdatingDocument, document]);

  const onSubmit = useCallback(
    async (values: DocumentValues) => {
      if (document) {
        await updateDocument({
          values: {
            documentId: document.id,
            title: values.title,
          },
        });

        setCurrentStep(4);
        setStepType(StepType.SIGN_UP);
      }
    },
    [document, setStepType, updateDocument],
  );

  const handleOpenInteract = useCallback(async () => {
    setCurrentStep(2);
    showInteractModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showInteractModal]);

  useEffect(() => {
    if (isUploadedFile) {
      handleOpenInteract();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUploadedFile]);

  if (currentStep > 3) {
    return <UISpinner width={50} height={50} wrapperClassName="spinner--main__wrapper" />;
  }

  return (
    <Form
      initialValues={formattedInitialValues}
      onSubmit={onSubmit}
      mutators={{ ...arrayMutators }}
      render={(renderProps: FormRenderProps<DocumentValues>) => (
        <form
          className={classNames('sign-up-landing__upload-form')}
          onSubmit={renderProps.handleSubmit}
        >
          {currentStep < 3 && (
            <LandingDocumentForm
              {...renderProps}
              document={document}
              onDocumentCreate={setDocumentId}
            />
          )}
          {currentStep === 3 && (
            <LandingSetTitleForm
              {...renderProps}
              buttonTitle={
                document?.type
                  ? getFinalStepButtonTitle(document.type)
                  : formattedInitialValues?.type
                  ? getFinalStepButtonTitle(formattedInitialValues.type)
                  : 'Finish'
              }
            />
          )}
        </form>
      )}
    />
  );
};

export default LandingSignDocument;

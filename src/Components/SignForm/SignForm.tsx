import React, {useCallback, useState, useMemo, useEffect} from 'react';
import {Form, FormRenderProps} from 'react-final-form';
import {useSelector} from 'react-redux';
import arrayMutators from 'final-form-arrays';
import _ from 'lodash';
import Toast from 'Services/Toast';
import {useModal} from 'Hooks/Common';
import {
    useDocumentCreate,
    useDocumentUpdate,
    DocumentValidators,
    useAllTemplatesGet,
} from 'Hooks/Document';
import {useDocumentSendOut} from 'Hooks/DocumentSign';
import {Document, DocumentValues, Signer, DocumentTypes} from 'Interfaces/Document';
import {processSubmissionErrors} from 'Utils/functions';
import {selectDocument, selectUser} from 'Utils/selectors';
import {RecursivePartial, RequestErrorTypes} from 'Interfaces/Common';

import {SuccessSendModal, DocumentForm, ValidationModal} from 'Components/DocumentForm';
import UpgradeModal from 'Components/UpgradeModal';

interface SignFormProps {
    initialValues: DocumentValues;
}

function SignForm({initialValues}: SignFormProps) {
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const {freeDocumentsUsedLimit} = useSelector(selectUser);
    const [documentId, setDocumentId] = useState<Document['id'] | undefined>(
        initialValues.id,
    );
    const [selectedTemplateId, setSelectedTemplateId] = useState<Document['id'] | undefined | null>(initialValues.templateId);
    const [createDocument] = useDocumentCreate();
    const [updateDocument] = useDocumentUpdate();
    const [getAllTemplates, isTemplatesLoading] = useAllTemplatesGet();
    const [sendDocument] = useDocumentSendOut();
    const validateDocument = DocumentValidators.useDocumentValidation();
    const selectedTemplate = useSelector(state =>
        selectDocument(state, {documentId: selectedTemplateId}),
    );
    const document = useSelector(state => selectDocument(state, {documentId}));

    const [openSuccessModal, closeSuccessModal] = useModal(
        () => (
            <SuccessSendModal onClose={closeSuccessModal} document={document as Document}/>
        ),
        [document],
    );
    const [openValidationModal, closeValidationModal] = useModal(
        () => (
            <ValidationModal
                onClose={closeValidationModal}
                validationErrors={validationErrors}
            />
        ),
        [validationErrors],
    );
    const [openUpgradeModal, closeUpgradeModal] = useModal(
        () => (
            <UpgradeModal onClose={closeUpgradeModal}>
                You&apos;ve reached your limit of {freeDocumentsUsedLimit} signature requests this
                month.
                <br/>
                Please upgrade your account to request more signatures.
            </UpgradeModal>
        ),
        [],
    );

    const handleGetAllTemplates = useCallback(async () => {
        try {
            await getAllTemplates({
                withTeammateTemplates: true,
            });
        }
            //@ts-ignore
        catch (error: any) {
            Toast.handleErrors(error);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        handleGetAllTemplates();
    }, [handleGetAllTemplates]);

    const mergeSigners = useCallback(
        (signers: Signer[], documentSigners: Signer[]): RecursivePartial<Signer>[] =>
            signers.map((signer, index) => ({
                ... documentSigners[index],
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
        const recipients = document?.recipients?.length
            ? document.recipients
            : initialValues.recipients;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {fields, ... restDocument} = document || {};
        const {signers: templateSigners} = selectedTemplate || {};
        const mergedSigners =
            templateSigners && templateSigners.length > 0
                ? mergeSigners(
                _.orderBy(templateSigners, 'order', 'asc'), //because in some cases, template's signers is not ordered by default
                _.orderBy(documentSigners, 'order', 'asc'),
                )
                : documentSigners;

        return {
            ... initialValues,
            ... restDocument,
            signers: _.orderBy(mergedSigners, 'order', 'asc'),
            isOrdered: selectedTemplate?.isOrdered || initialValues.isOrdered,
            templateId: selectedTemplate?.id,
            type: selectedTemplate ? DocumentTypes.OTHERS : initialValues.type,
            recipients: !selectedTemplate ? recipients : undefined,
        } as DocumentValues;
    }, [document, initialValues, selectedTemplate, mergeSigners]);

    const onSubmit = useCallback(
        async (values: DocumentValues) => {
            try {
                let scopedDocument = document;
                if (scopedDocument) {
                    if (!_.isEqual(values, formattedInitialValues))
                        scopedDocument = (await updateDocument({
                            values: {
                                ... values,
                                documentId: scopedDocument.id,
                            },
                        })) as Document;
                } else {
                    scopedDocument = (await createDocument(values)) as Document;
                    setDocumentId(scopedDocument.id);
                }

                const documentValidationErrors = validateDocument(scopedDocument);

                if (documentValidationErrors.length !== 0) {
                    openValidationModal();
                    return setValidationErrors(documentValidationErrors);
                }

                await sendDocument({documentId: scopedDocument.id});

                return openSuccessModal();
            }
                //@ts-ignore
            catch (error: any) {

                if (error.type === RequestErrorTypes.QUOTA_EXCEEDED) {
                    return openUpgradeModal();
                }

                Toast.handleErrors(error);

                return processSubmissionErrors(error);
            }
        },
        [
            createDocument,
            document,
            formattedInitialValues,
            openSuccessModal,
            openUpgradeModal,
            openValidationModal,
            sendDocument,
            updateDocument,
            validateDocument,
        ],
    );


    // @ts-ignore
    return (
        <div className="signTemplate__wrapper">
            <h1 className="signTemplate__title">Prepare your document for signing</h1>
            <Form
                initialValues={formattedInitialValues}
                keepDirtyOnReinitialize
                onSubmit={onSubmit}
                mutators={{... arrayMutators}}
                render={(renderProps: FormRenderProps<DocumentValues>) => (
                    // @ts-ignore
                    <DocumentForm {... renderProps} onTemplateSelect={setSelectedTemplateId}
                                  onDocumentCreate={setDocumentId} document={document}
                                  isDocumentsLoading={isTemplatesLoading}/>
                )}
            />
        </div>
    );
}

export default SignForm;
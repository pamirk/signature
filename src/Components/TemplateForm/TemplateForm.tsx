import React, {useMemo, useCallback, useState} from 'react';
import {useLocation} from 'react-router-dom';
import {useSelector} from 'react-redux';
import arrayMutators from 'final-form-arrays';
import {Form, FormRenderProps} from 'react-final-form';
import _ from 'lodash';
import {useModal} from 'Hooks/Common';
import {selectDocument} from 'Utils/selectors';
import {
    useDocumentCreate,
    useDocumentUpdate,
    DocumentValidators,
    useTemplateActivate,
    useTemplateMerge,
} from 'Hooks/Document';
import Toast from 'Services/Toast';
import History from 'Services/History';
import {processSubmissionErrors} from 'Utils/functions';
import {DocumentValues, Document, DocumentStatuses} from 'Interfaces/Document';

import {DocumentForm, SuccessSendModal, ValidationModal} from 'Components/DocumentForm';
import {TemplateUpgradeModal} from 'Components/UpgradeModal';
import {RequestErrorTypes} from 'Interfaces/Common';

interface TemplateFormProps {
    initialValues: DocumentValues;
    sourceTemplateId?: Document['id'];
}

const TemplateForm = ({initialValues, sourceTemplateId}: TemplateFormProps) => {
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [createDocument] = useDocumentCreate();
    const [documentId, setDocumentId] = useState<Document['id'] | undefined>(
        initialValues.id,
    );
    const [updateDocument] = useDocumentUpdate();
    const [activateTemplate] = useTemplateActivate();
    const [mergeTemplate] = useTemplateMerge();
    const validateDocument = DocumentValidators.useDocumentValidation();
    const {search} = useLocation();

    const searchParams = new URLSearchParams(search);
    const activationStatus = searchParams.get('status') as DocumentStatuses | null;

    const document = useSelector(state => selectDocument(state, {documentId}));

    const isReplica = useMemo(
        () => sourceTemplateId && sourceTemplateId !== initialValues.id,
        [initialValues.id, sourceTemplateId],
    );
    const {headerText, description, submitButtonTitle} = useMemo(
        () =>
            isReplica
                ? {
                    headerText: 'Template has validation errors',
                    description: 'Please check requirements below and try again',
                    submitButtonTitle: 'Update Template',
                }
                : {
                    headerText: 'Template saved.',
                    description:
                        'If you want to activate it, please ensure the template meets the requirements below',
                    submitButtonTitle: initialValues.id ? 'Update Template' : 'Create Template',
                },
        [initialValues.id, isReplica],
    );

    const [openValidationModal, closeValidationModal] = useModal(
        () => (
            <ValidationModal
                onClose={closeValidationModal}
                validationErrors={validationErrors}
                headerText={headerText}
                description={description}
            />
        ),
        [validationErrors],
    );
    const [openSuccessModal, closeSuccessModal] = useModal(
        () => (
            <SuccessSendModal
                isTemplate
                onClose={() => {
                    closeSuccessModal();
                    History.push('/templates');
                }}
                onConfirm={() => {
                    closeSuccessModal();
                    History.push('/templates');
                }}
                document={document as Document}
            />
        ),
        [document],
    );
    const [openUpgradeModal, closeUpgradeModal] = useModal(
        () => <TemplateUpgradeModal onClose={closeUpgradeModal}/>,
        [],
    );

    const onSubmit = useCallback(
        async (values: DocumentValues) => {
            try {
                let scopedDocument = document;
                if (scopedDocument) {
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

                if (documentValidationErrors.length) {
                    openValidationModal();

                    return setValidationErrors(documentValidationErrors);
                }

                if (sourceTemplateId && isReplica) {
                    await mergeTemplate({sourceTemplateId, templateId: scopedDocument.id});
                    Toast.success('Template saved');

                    return History.push('/templates');
                }

                await activateTemplate({
                    documentId: scopedDocument.id,
                    status: activationStatus || undefined,
                });

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
            document,
            validateDocument,
            sourceTemplateId,
            isReplica,
            activateTemplate,
            activationStatus,
            openSuccessModal,
            updateDocument,
            createDocument,
            openValidationModal,
            mergeTemplate,
            openUpgradeModal,
        ],
    );

    const formattedInitialValues = useMemo(() => {
        const documentSigners =
            (document?.signers.length || 0) >= (initialValues.signers?.length || 0)
                ? document?.signers
                : initialValues.signers;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {fields, ... restDocument} = document || {};
        return {
            ... initialValues,
            ... restDocument,
            signers: _.orderBy(documentSigners, 'order', 'asc'),
        } as DocumentValues;
    }, [initialValues, document]);

    return (
        <div className="signTemplate__wrapper">
            <h1 className="signTemplate__title">Create New Template</h1>
            <Form
                initialValues={formattedInitialValues}
                keepDirtyOnReinitialize
                onSubmit={onSubmit}
                mutators={{... arrayMutators}}
                render={(renderProps: FormRenderProps<DocumentValues>) => (
                    //@ts-ignore
                    <DocumentForm
                        {... renderProps}
                        onDocumentCreate={setDocumentId}
                        document={document}
                        submitButtonTitle={submitButtonTitle}
                    />
                )}
            />
        </div>
    );
};

export default TemplateForm;

import React, {useCallback, useState, useMemo, useEffect} from 'react';
import {Field, FormRenderProps} from 'react-final-form';
import {FieldArray} from 'react-final-form-arrays';
import * as _ from 'lodash';

import {getDocumentValidationMeta} from 'Hooks/Document/useDocumentValidation';
import {composeValidators, isNotEmpty, callActionAsync} from 'Utils/functions';
import {
    required,
    maxLength100,
    maxLength50,
    notOnlySpaces,
    email,
    multipleFilesConstaint,
} from 'Utils/validation';

import FieldTextInput from 'Components/FormFields/FieldTextInput';
import FieldTextArea from 'Components/FormFields/FieldTextArea';
import EmailRecipientsArray from 'Components/FormFields/EmailRecipientsArray';
import SignersArray from 'Components/FormFields/SignersArray';
import {FieldCheckbox} from 'Components/FormFields';
import FileField from './FileField';

import {DocumentValues, DocumentTypes, Document} from 'Interfaces/Document';
import UISelect from 'Components/UIComponents/UISelect';
import Toast from 'Services/Toast';
import {
    useDocumentUpload,
    useDocumentFileDataClean,
    useDocumentConvertionProgressWatcher,
    useDocumentCreate,
    useDocumentUpdate,
} from 'Hooks/Document';
import {useModal} from 'Hooks/Common';
import InteractModal from 'Components/Interact/InteractModal';
import {useSelector} from 'react-redux';
import {selectActiveTemplates} from 'Utils/selectors';
import {DocumentItem, FileItem} from 'Interfaces/Common';
import uuid from 'uuid/v4';

export enum DocumentActions {
    SEND = 'Send',
    CREATE = 'Create',
    UPDATE = 'Update',
}

interface DocumentFormProps extends FormRenderProps<DocumentValues> {
    initialValues: DocumentValues;
    onDocumentCreate: (id: string) => void;
    onTemplateSelect?: (templateId: Document['id'] | undefined) => void;
    document?: Document;
    submitButtonTitle?: string;
    isDocumentsLoading?: boolean;
}

const DocumentForm = ({
                          values,
                          form,
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
    const [isConverting, setIsConverting] = useState(false);
    const [
        startWatchDocumentConvertionProgress,
        stopWatchDocumentConvertionProgress,
    ] = useDocumentConvertionProgressWatcher();
    const [cleanFileData] = useDocumentFileDataClean();
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

            return _.orderBy(fileItems, 'order');
        }

        return [];
    }, [document]);
    const [files, setFiles] = useState<DocumentItem[]>(initialDocumentFiles);
    const [tokenInUploading, setTokenInUploading] = useState<string | null>(null);

    const [uploadDocument, cancelUpload, isUploading] = useDocumentUpload();

    const {
        isBasedOnTemplate,
        isTemplate,
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

    const [showInteractModal, closeInteractModal] = useModal(() => {
        if (documentId) {
            return (
                <InteractModal
                    onClose={closeInteractModal}
                    documentId={documentId}
                    handleSubmit={handleSubmit}
                    submitting={submitting}
                    buttonSendTitle={isTemplate ? DocumentActions.CREATE : DocumentActions.SEND}
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
            ... values,
            signers: values.signers?.filter((signer, index) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const {order, role, ... restSigner} = signer || {};
                // @ts-ignore
                return isTemplate ? role?.trim() : signer?.isPreparer || (form.getFieldState(`signers[${index}].email`)?.valid && form.getFieldState(`signers[${index}].name`)?.valid);
            }),
            // @ts-ignore
            recipients: values.recipients?.filter((recipient, index) => form.getFieldState(`recipients[${index}]email`)?.valid,
            ),
        }),
        [isTemplate, form],
    );

    useEffect(() => {
        if (isConverting && document) {
            setFiles(prev =>
                prev.map(fileItem => {
                    const documentPart = document.parts.find(part => part.id === fileItem.id);

                    if (documentPart && documentPart.files && documentPart.pdfMetadata) {
                        const nextProgress =
                            (documentPart.files?.length / documentPart.pdfMetadata.pages) * 50 + 50;

                        return {
                            ... fileItem,
                            progress: nextProgress,
                            isFinished: nextProgress === 100,
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
            const isFilesPrecessed =
                document.parts.length && document.parts.every(part => part.filesUploaded);

            setIsFileProcessed(isFilesPrecessed);
        }
    }, [document, files]);

    useEffect(() => {
        const isFilesComplete =
            document?.parts.length && document?.parts.every(part => part.filesUploaded);

        if (isFilesComplete) {
            setIsConverting(false);
            stopWatchDocumentConvertionProgress();
        }
    }, [
        document,
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

                const storeSigners = _.orderBy(
                    form.getFieldState('signers')?.value,
                    'order',
                    'asc',
                );
                const templateSigners = _.orderBy(currentTemplate?.signers, 'order', 'asc');

                const mergedSigners = templateSigners?.map((signer, i) => ({
                    ... storeSigners[i],
                    role: signer.role,
                    order: signer.order,
                }));

                form.change('signers', mergedSigners);

                await handleUploadCancelAll();
            } else if (!isTemplate) {
                const storeSigners = form.getFieldState('signers')?.value;

                form.change(
                    'signers',
                    storeSigners
                        ?.map((signer, i) => ({
                            ... signer,
                            role: undefined,
                            order: i,
                        }))
                        .filter(s => s.name || s.email || s.order === 1),
                );
            }
        },
        [
            form,
            handleUploadCancelAll,
            isTemplate,
            onTemplateSelect,
            templates,
            values.message,
            values.title,
        ],
    );

    const extractCreatedDocumentPart = useCallback(
        (document: Document) => {
            return document.parts.find(part => !files.find(file => file.id === part.id));
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
                doc = (await uploadDocument({
                    documentId: doc.id,
                    file: fileItem.file,
                })) as Document;

                if (isNotEmpty(doc) && !isConverting) {
                    startWatchDocumentConvertionProgress({documentId: doc.id});
                    setIsConverting(true);
                }
                setFiles(prev =>
                    prev.map(item => {
                        if (item.token !== fileItem.token) {
                            return item;
                        }

                        const documentPart = doc && extractCreatedDocumentPart(doc);

                        return {
                            ... item,
                            isUploaded: true,
                            progress: 50,
                            id: documentPart?.id,
                            order: documentPart?.order,
                        };
                    }),
                );

                setTokenInUploading(null);
            } catch (err) {
                Toast.handleErrors(err);
            }
        },
        [
            createDocument,
            document,
            extractCreatedDocumentPart,
            filterFormEmptyLists,
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
            const error = multipleFilesConstaint(files, file);

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
                    setFiles(_.orderBy(newOrdered, 'order'));

                    const reorderedDocumentParts = document?.parts
                        .filter(part =>
                            newOrdered.find(newOrderedItem => newOrderedItem.id === part.id),
                        )
                        .map(part => {
                            const orderItem = newOrdered.find(order => order.id === part.id);
                            return orderItem ? {id: part.id, order: orderItem.order} : part;
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
                if (tokenInUploading === fileItem.token) {
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
            }
            //@ts-ignore
            catch (error:any) {
                Toast.error('Failed to remove file');
            }
        },
        [
            cleanFileData,
            document,
            files,
            stopWatchDocumentConvertionProgress,
            tokenInUploading,
        ],
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
            if (form.getState().hasValidationErrors || form.getState().hasSubmitErrors) {
                return form.submit();
            }

            if (!_.isEqual(values, initialValues)) {
                const document = await updateDocument({
                    values: {
                        ... filterFormEmptyLists(values),
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

                form.change('signers', document.signers);
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

    const {documentButtonTitle, defaultSubmitButtonTitle} = isWithOthers
        ? {
            documentButtonTitle: 'Prepare Doc for Signing',
            defaultSubmitButtonTitle: 'Send Document',
        }
        : {
            documentButtonTitle: 'Fill Out & Sign',
            defaultSubmitButtonTitle: isTemplate
                ? initialValues.type === DocumentTypes.TEMPLATE
                    ? 'Create Template'
                    : 'Create Form'
                : 'Send Document',
        };

    const {title, titlePlaceholder, messagePlaceholder} = useMemo(() => {
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

    return (
        <form className="signTemplate__form">
            <div className="signTemplate__form-mainGroupField">
                <Field
                    name="title"
                    label={title}
                    component={FieldTextInput}
                    placeholder={titlePlaceholder}
                    validate={composeValidators<string>(required, notOnlySpaces, maxLength100)}
                />
                <Field
                    name="message"
                    label={<p>Optional Message</p>}
                    component={FieldTextArea}
                    placeholder={messagePlaceholder}
                />
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
                                                    {... props}
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
                                            isItemDeletablePredicate={({fields}) => fields.length > 1}
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
                                                    {... props}
                                                    withRoles={isBasedOnTemplate}
                                                    isAdditionDisabled={isBasedOnTemplate}
                                                    skipFirst={isMeAndOthersType}
                                                    skipPreparer
                                                    isItemDeletablePredicate={({fields}) =>
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
                            render={({input}) => (
                                <UISelect
                                    options={selectableOptions}
                                    placeholder="Choose a Template"
                                    handleSelect={handleTemplateSelect}
                                    isClearable={!!input.value}
                                    emptyText="You don't have any templates available yet."
                                    value={input.value}
                                    isLoading={isDocumentsLoading}
                                    disabled={isDocumentsLoading}
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
                    isFileProcessed={isFileProcessed}
                    isBasedOnTemplate={isBasedOnTemplate}
                    disabled={isDocumentsLoading || isDocumentUpdating || isBasedOnTemplate}
                    submitting={isDocumentsLoading || fileSubmitting || submitting}
                    files={files}
                    onFileReorder={handleFilesReorder}
                    disableReorder={isUploading}
                />
            </div>

            {isOnlyMeType && (
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

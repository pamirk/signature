import React, {useCallback, useMemo, useState} from 'react';
import {useSelector} from 'react-redux';
import classNames from 'classnames';

import Toast from 'Services/Toast';
import HistoryService from 'Services/History';

import {Document, DocumentStatuses} from 'Interfaces/Document';
import {RequestErrorTypes} from 'Interfaces/Common';
import {User} from 'Interfaces/User';

import {
    useDocumentUpdate,
    useDocumentCopy,
    useTemplateAddToApi,
    useTemplateRemoveFromApi,
} from 'Hooks/Document';
import {useModal} from 'Hooks/Common';

import {formatDate, formatDocumentName} from 'Utils/formatters';
import {
    selectApiPlan,
    selectApiSubscriptionInfo,
    selectApiTemplatesCount,
    selectCommonTemplatesCount,
    selectUser,
    selectUserPlan,
} from 'Utils/selectors';

import {TemplateUpgradeModal} from 'Components/UpgradeModal';
import UICheckbox from 'Components/UIComponents/UICheckbox';
import DropDownOptions from 'Components/DropDownOptions';
import ConfirmModal from 'Components/ConfirmModal';

import IntegrationsIcon from 'Assets/images/icons/integrations-icon.svg';
import IconDocWithPencil from 'Assets/images/icons/doc-pencil-icon.svg';
import CopyIcon from 'Assets/images/icons/copy-icon.svg';
import IconRemove from 'Assets/images/icons/remove-icon.svg';
import PencilIcon from 'Assets/images/icons/pencil.svg';

import EditableTitle from './EditableTitle';
import {PlanTypes} from 'Interfaces/Billing';
import TemplateItemMobileView from './TemplateItemMobileView';
import useIsMobile from 'Hooks/Common/useIsMobile';
import DeleteModal from 'Components/DeleteModal';

interface TemplateItemProps {
    template: Document;
    className?: string;
    isSelected?: boolean;
    toggleSelect?: () => void;
    onDelete?: (templateIds?: Document['id'][]) => void;
}

const TemplateItem = ({
                          template,
                          className,
                          isSelected,
                          toggleSelect = () => {
                          },
                          onDelete,
                      }: TemplateItemProps) => {
    const [isActiveEditForm, setIsEditFormActive] = useState<boolean>(false);
    const {id: userId}: User = useSelector(selectUser);
    const apiSubscription = useSelector(selectApiSubscriptionInfo);
    const [updateTemplate] = useDocumentUpdate();
    const [copyTemplate] = useDocumentCopy();
    const isMobile = useIsMobile();

    const [addTemplateToApi] = useTemplateAddToApi();
    const [removeTemplateFromApi] = useTemplateRemoveFromApi();

    const [openUpgradeModal, closeUpgradeModal] = useModal(
        () => <TemplateUpgradeModal onClose={closeUpgradeModal}/>,
        [],
    );

    const userPlan = useSelector(selectUserPlan);
    const user = useSelector(selectUser) as User;
    const apiPlan = useSelector(selectApiPlan);
    const apiTemplatesCount = useSelector(selectApiTemplatesCount);
    const commonTemplatesCount = useSelector(selectCommonTemplatesCount);

    const handleClickRenameTemplate = useCallback(() => {
        setIsEditFormActive(true);
    }, []);

    const navigateToTemplateEdit = useCallback(() => {
        if (
            !user.teamId &&
            (userPlan.type === PlanTypes.FREE ||
                (userPlan.type == PlanTypes.PERSONAL && commonTemplatesCount >= 1))
        ) {
            if (apiTemplatesCount >= apiPlan.templateLimit && apiPlan.templateLimit !== -1) {
                HistoryService.push(`/templates/${template.id}/edit`);
            } else {
                HistoryService.push(`/templates/${template.id}/edit?status=api`);
            }
        } else {
            HistoryService.push(`/templates/${template.id}/edit`);
        }
    }, [
        apiPlan.templateLimit,
        apiTemplatesCount,
        commonTemplatesCount,
        template.id,
        user.teamId,
        userPlan.type,
    ]);

    const handleTemplateCopy = useCallback(async () => {
        try {
            await copyTemplate({documentId: template.id});
            Toast.success('Template successfully duplicated!');
        }
            //@ts-ignore
        catch (error: any) {

            if (error.type === RequestErrorTypes.QUOTA_EXCEEDED) {
                return openUpgradeModal();
            }

            Toast.handleErrors(error);
        }
    }, [copyTemplate, template.id, openUpgradeModal]);

    const handleUpdateTemplate = useCallback(
        async ({title}) => {
            try {
                await updateTemplate({
                    values: {
                        title,
                        type: template.type,
                        documentId: template.id,
                    },
                });
                Toast.success('Template successfully updated!');
                setIsEditFormActive(false);
            }
                //@ts-ignore
            catch (error: any) {

                Toast.handleErrors(error);
            }
        },
        [updateTemplate, template.type, template.id],
    );

    const handleTemplateAddToApi = useCallback(async () => {
        try {
            await addTemplateToApi({documentId: template.id});
            Toast.success('Template successfully added to API!');
        }
            //@ts-ignore
        catch (error: any) {

            Toast.handleErrors(error);
        }
    }, [addTemplateToApi, template.id]);

    const handleTemplateRemoveFromApi = useCallback(async () => {
        try {
            await removeTemplateFromApi({documentId: template.id});
            Toast.success('Template successfully removed from API!');
        }
            //@ts-ignore
        catch (error: any) {

            if (error.type === RequestErrorTypes.QUOTA_EXCEEDED) {
                return openUpgradeModal();
            }
        }
    }, [openUpgradeModal, removeTemplateFromApi, template.id]);

    const handleDelete = useCallback(() => {
        onDelete && onDelete([template.id]);
    }, [onDelete, template.id]);

    const [openTemplateCopyModal, closeTemplateCopyModal] = useModal(() => (
        <ConfirmModal
            onClose={closeTemplateCopyModal}
            onConfirm={() => {
                handleTemplateCopy();
                closeTemplateCopyModal();
            }}
            onCancel={closeTemplateCopyModal}
        >
            <div className="documents__deleteHeader">
                <h5 className="documents__deleteTitle">
                    Are you sure want to duplicate this template?
                </h5>
            </div>
        </ConfirmModal>
    ));

    const [showDeleteModal, hideDeleteModal, isDeleteModalOpen] = useModal(
        () => (
            <DeleteModal
                onClose={hideDeleteModal}
                deleteTitle="Yes, Delete"
                onConfirm={() => {
                    handleDelete();
                    hideDeleteModal();
                }}
                className="documents__deleteWrapper"
            >
                <div className="documents__deleteHeader">
                    <h5 className="documents__deleteTitle">
                        Are you sure want to delete this template?
                    </h5>
                    <p className="modal__subTitle">
                        Deleting this template will completely remove it. This cannot be undone.
                    </p>
                </div>
            </DeleteModal>
        ),
        [handleDelete],
    );

    const options = useMemo(() => {
        const options = [
            {
                name: 'Rename',
                icon: PencilIcon,
                onClick: handleClickRenameTemplate,
                hidden: template.status !== DocumentStatuses.DRAFT,
            },
            {
                name: 'Duplicate',
                icon: CopyIcon,
                onClick: openTemplateCopyModal,
            },
            {
                name: 'Edit',
                icon: IconDocWithPencil,
                onClick: navigateToTemplateEdit,
            },
            {
                name: 'Add to API',
                icon: IntegrationsIcon,
                onClick: handleTemplateAddToApi,
                hidden:
                    template.status !== DocumentStatuses.ACTIVE ||
                    template.userId !== userId ||
                    !apiSubscription,
            },
            {
                name: 'Remove from API',
                icon: IntegrationsIcon,
                onClick: handleTemplateRemoveFromApi,
                hidden: template.status !== DocumentStatuses.API || template.userId !== userId,
            },
            {
                name: 'Delete',
                icon: IconRemove,
                onClick: showDeleteModal,
                className: 'red',
                hidden: !isMobile,
            },
        ];

        return options.filter(option => !option.hidden);
    }, [
        apiSubscription,
        handleClickRenameTemplate,
        handleTemplateAddToApi,
        handleTemplateRemoveFromApi,
        isMobile,
        navigateToTemplateEdit,
        openTemplateCopyModal,
        showDeleteModal,
        template.status,
        template.userId,
        userId,
    ]);

    return isMobile ? (
        <TemplateItemMobileView template={template} userId={userId} options={options}/>
    ) : (
        <div className={classNames('table__row', 'table__dataRow', className)}>
            <div className="table__column table__column--check">
                {template.userId === userId && (
                    <UICheckbox handleClick={toggleSelect} check={isSelected}/>
                )}
            </div>
            <div className="table__column table__column--template-text-container">
                <div className="table__column--template-text">
                    {isActiveEditForm ? (
                        <EditableTitle
                            templateTitle={template.title}
                            onSubmit={handleUpdateTemplate}
                        />
                    ) : (
                        formatDocumentName(template.title, 'template')
                    )}
                </div>
                <div className="table__column table__column--status">
                    <div
                        className={`documents__documentStatus documents__documentStatus--${
                            template.status === DocumentStatuses.ACTIVE ? 'completed' : template.status
                        }`}
                    >
            <span className="documents__documentStatus-text">
              {template.status === DocumentStatuses.ACTIVE ? 'Live' : template.status}
            </span>
                    </div>
                </div>
            </div>
            <div className="table__column table__column--template-date">
                {template.createdAt && formatDate(template.createdAt)}
            </div>
            <div className="table__column table__column--template-action table__column-item--template-action">
                {template.userId === userId && (
                    <div className="table__actions">
                        <DropDownOptions options={options} anchorClassName="table__container"/>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TemplateItem;

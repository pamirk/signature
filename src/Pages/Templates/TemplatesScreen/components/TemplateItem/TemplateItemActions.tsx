import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

import Toast from 'Services/Toast';
import HistoryService from 'Services/History';

import { Document, DocumentStatuses, DocumentTypes } from 'Interfaces/Document';
import { RequestErrorTypes } from 'Interfaces/Common';
import { User, UserRoles } from 'Interfaces/User';

import { useTemplateAddToApi, useTemplateRemoveFromApi } from 'Hooks/Document';
import { useModal } from 'Hooks/Common';

import {
  selectApiPlan,
  selectApiSubscriptionInfo,
  selectApiTemplatesCount,
  selectCommonTemplatesCount,
  selectUser,
  selectUserPlan,
} from 'Utils/selectors';

import { TemplateUpgradeModal } from 'Components/UpgradeModal';
import DropDownOptions from 'Components/DropDownOptions';
import ConfirmModal from 'Components/ConfirmModal';

import IntegrationsIcon from 'Assets/images/icons/integrations-icon.svg';
import IconDocWithPencil from 'Assets/images/icons/doc-pencil-icon.svg';
import CopyIcon from 'Assets/images/icons/copy-icon.svg';
import IconRemove from 'Assets/images/icons/remove-icon.svg';
import PencilIcon from 'Assets/images/icons/pencil.svg';
import IconFolder from 'Assets/images/icons/folder-icon2.svg';
import KeyIcon from 'Assets/images/icons/key-icon.svg';

import { PlanTypes } from 'Interfaces/Billing';
import TemplateItemMobileView from './TemplateItemMobileView';
import useIsMobile from 'Hooks/Common/useIsMobile';
import DeleteModal from 'Components/DeleteModal';
import { AuthorizedRoutePaths } from 'Interfaces/RoutePaths';
import useApiUpgradeModal from 'Hooks/Common/useApiUpgradeModal';

interface TemplateItemActionsProps {
  template: Document;
  className?: string;
  isSelected?: boolean;
  toggleSelect?: () => void;
  onDelete?: (templateIds?: Document['id'][]) => void;
  onDeleteTemplate?: (templateId: Document['id'], permanently?: boolean) => void;
  onUpdateTemplate: (title: string, documentId: string, type: DocumentTypes) => void;
  onTemplateCopy?: (templateId: Document['id']) => void;
  openMoveToFolderModal?: () => void;
  setSelectedEntitiesIds?: (entitiesIds) => void;
  setRenamingTemplateId: (templateId: Document['id'] | undefined) => void;
}

const TemplateItemActions = ({
  template,
  className,
  onDeleteTemplate,
  onTemplateCopy,
  onUpdateTemplate,
  openMoveToFolderModal,
  setSelectedEntitiesIds,
  setRenamingTemplateId,
}: TemplateItemActionsProps) => {
  const { id: userId, role: userRole, plan, teamId }: User = useSelector(selectUser);
  const apiSubscription = useSelector(selectApiSubscriptionInfo);
  const isMobile = useIsMobile();

  const [addTemplateToApi] = useTemplateAddToApi();
  const [removeTemplateFromApi] = useTemplateRemoveFromApi();

  const [openUpgradeModal, closeUpgradeModal] = useModal(
    () => <TemplateUpgradeModal onClose={closeUpgradeModal} />,
    [],
  );

  const [openApiUpgradeModal] = useApiUpgradeModal();

  const userPlan = useSelector(selectUserPlan);
  const user = useSelector(selectUser) as User;
  const apiPlan = useSelector(selectApiPlan);
  const apiTemplatesCount = useSelector(selectApiTemplatesCount);
  const commonTemplatesCount = useSelector(selectCommonTemplatesCount);

  const handleClickRenameTemplate = useCallback(() => {
    setRenamingTemplateId(template.id);
  }, [setRenamingTemplateId, template.id]);

  const navigateToTemplateEdit = useCallback(() => {
    if (
      !user.teamId &&
      (userPlan.type === PlanTypes.FREE ||
        (userPlan.type === PlanTypes.PERSONAL && commonTemplatesCount >= 1))
    ) {
      if (apiTemplatesCount >= apiPlan.templateLimit && apiPlan.templateLimit !== -1) {
        HistoryService.push(`${AuthorizedRoutePaths.TEMPLATES}/${template.id}/edit`);
      } else {
        HistoryService.push(
          `${AuthorizedRoutePaths.TEMPLATES}/${template.id}/edit?status=api`,
        );
      }
    } else {
      HistoryService.push(`${AuthorizedRoutePaths.TEMPLATES}/${template.id}/edit`);
    }
  }, [
    apiPlan.templateLimit,
    apiTemplatesCount,
    commonTemplatesCount,
    template.id,
    user.teamId,
    userPlan.type,
  ]);

  const handleMoveToClick = useCallback(() => {
    if (setSelectedEntitiesIds) {
      setSelectedEntitiesIds([template.id]);
    }
    if (openMoveToFolderModal) {
      openMoveToFolderModal();
    }
  }, [template, openMoveToFolderModal, setSelectedEntitiesIds]);

  const handleTemplateCopy = useCallback(async () => {
    try {
      onTemplateCopy && (await onTemplateCopy(template.id));
      Toast.success('Template successfully duplicated!');
    } catch (error) {
      if (error.type === RequestErrorTypes.QUOTA_EXCEEDED) {
        return template.status === DocumentStatuses.API
          ? openApiUpgradeModal()
          : openUpgradeModal();
      }

      Toast.handleErrors(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onTemplateCopy, template.id, openUpgradeModal]);

  const handleUpdateTemplate = useCallback(
    async ({ title }) => {
      try {
        onUpdateTemplate(title, template.id, template.type);
        setRenamingTemplateId(undefined);
      } catch (error) {
        Toast.handleErrors(error);
      }
    },
    [onUpdateTemplate, template.id, template.type, setRenamingTemplateId],
  );

  const handleTemplateAddToApi = useCallback(async () => {
    try {
      await addTemplateToApi({ documentId: template.id });
      Toast.success('Template successfully added to API!');
    } catch (error) {
      Toast.handleErrors(error);
    }
  }, [addTemplateToApi, template.id]);

  const handleTemplateRemoveFromApi = useCallback(async () => {
    try {
      await removeTemplateFromApi({ documentId: template.id });
      Toast.success('Template successfully removed from API!');
    } catch (error) {
      if (error.type === RequestErrorTypes.QUOTA_EXCEEDED) {
        return openUpgradeModal();
      }
    }
  }, [openUpgradeModal, removeTemplateFromApi, template.id]);

  const handleCopyCodeAccess = useCallback(async () => {
    try {
      if (template.codeAccess) {
        await navigator.clipboard.writeText(template.codeAccess);
        Toast.success('Copied to clipboard');
      }
    } catch (err) {
      Toast.handleErrors(err);
    }
  }, [template.codeAccess]);

  const handleDelete = useCallback(() => {
    onDeleteTemplate && onDeleteTemplate(template.id, true);
  }, [onDeleteTemplate, template.id]);

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

  const [showDeleteModal, hideDeleteModal] = useModal(
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

  const isHiddenTeamOption = useMemo(
    () =>
      template.userId !== userId &&
      userRole !== UserRoles.OWNER &&
      userRole !== UserRoles.ADMIN,
    [userRole, userId, template],
  );

  const options = useMemo(() => {
    const options = [
      {
        name: 'Rename',
        icon: PencilIcon,
        onClick: handleClickRenameTemplate,
        hidden: template.status !== DocumentStatuses.DRAFT || template.userId !== userId,
      },
      {
        name: 'Duplicate',
        icon: CopyIcon,
        onClick: openTemplateCopyModal,
      },
      {
        name: 'Move to',
        icon: IconFolder,
        onClick: handleMoveToClick,
        hidden: isHiddenTeamOption,
      },
      {
        name: 'Edit',
        icon: IconDocWithPencil,
        onClick: navigateToTemplateEdit,
        hidden: template.userId !== userId,
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
        name: 'Copy Access Code',
        icon: KeyIcon,
        onClick: handleCopyCodeAccess,
        hidden:
          (plan.type === PlanTypes.FREE && !teamId) ||
          !template.codeAccess ||
          !!template.deletedAt,
      },
      {
        name: 'Delete',
        icon: IconRemove,
        onClick: showDeleteModal,
        className: 'red',
        classNameText: 'documents__dropdownOption--red',
        iconClassName: 'documents__dropdownOption--red-icon',
        hidden: isHiddenTeamOption,
      },
    ];

    return options.filter(option => !option.hidden);
  }, [
    apiSubscription,
    handleClickRenameTemplate,
    handleCopyCodeAccess,
    handleMoveToClick,
    handleTemplateAddToApi,
    handleTemplateRemoveFromApi,
    isHiddenTeamOption,
    navigateToTemplateEdit,
    openTemplateCopyModal,
    plan,
    showDeleteModal,
    teamId,
    template,
    userId,
  ]);

  return isMobile ? (
    <TemplateItemMobileView
      template={template}
      userId={userId}
      options={options}
      isActiveEditForm={false}
      handleUpdateTemplate={handleUpdateTemplate}
    />
  ) : (
    <div
      className={classNames('table__row', 'table__dataRow document actions', className)}
    >
      <div className="table__column table__column--template-action">
        <div className="table__actions">
          <DropDownOptions options={options} anchorClassName="table__container" />
        </div>
      </div>
    </div>
  );
};

export default TemplateItemActions;

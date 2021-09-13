import React, { useCallback, useState, useMemo } from 'react';
import classNames from 'classnames';
import UICheckbox from 'Components/UIComponents/UICheckbox';
import Toast from 'Services/Toast';
import HistoryService from 'Services/History';
import { formatDate, formatDocumentName } from 'Utils/formatters';
import { useDocumentUpdate, useDocumentCopy } from 'Hooks/Document';
import { Document, DocumentStatuses } from 'Interfaces/Document';
import { useModal } from 'Hooks/Common';
import ConfirmModal from 'Components/ConfirmModal';
// @ts-ignore
import CopyIcon from 'Assets/images/icons/copy-icon.svg';
// @ts-ignore
import IconDocWithPencil from 'Assets/images/icons/doc-pencil-icon.svg';
import { RequestErrorTypes } from 'Interfaces/Common';
import { TemplateUpgradeModal } from 'Components/UpgradeModal';
import { useSelector } from 'react-redux';
import { selectUser } from 'Utils/selectors';
import { User } from 'Interfaces/User';

import IconPencil from 'Assets/images/icons/pencil.svg';
import RemovePencil from 'Assets/images/icons/remove-icon.svg';
import IconShare from 'Assets/images/icons/share-icon.svg';
import IconPause from 'Assets/images/icons/pause.svg';
import IconPlay from 'Assets/images/icons/play.svg';
import IconUser from 'Assets/images/icons/user.svg';
import DropDownOptions from 'Components/DropDownOptions/DropDownOptions';
import ShareFormModal from 'Pages/FormRequests/FormRequestsScreen/components/modal/ShareFormModal';
import SubmittedContractsModal from 'Pages/FormRequests/FormRequestsScreen/components/modal/SubmittedContractsModal';
import EditableTitle from './EditableTitle';
import { TemplateCreate } from 'Pages/Templates';
import { FRONTEND_URL } from 'Utils/constants';
import useFormRequestDisable from 'Hooks/Document/useFormRequestDisable';
import useFormRequestEnable from 'Hooks/Document/useFormRequestEnable';
import useIsMobile from 'Hooks/Common/useIsMobile';
import FormRequestItemMobile from './FormRequestItemMobile';
import DeleteModal from 'Components/DeleteModal/DeleteModal';

interface TemplateItemProps {
  template: Document;
  className?: string;
  isSelected?: boolean;
  toggleSelect: () => void;
  onDelete?: (formIds: Document['id'][]) => void;
}

const FormRequestItem = ({
  template,
  className,
  isSelected,
  toggleSelect = () => {},
  onDelete,
}: TemplateItemProps) => {
  const [isActiveEditForm, setIsEditFormActive] = useState<boolean>(false);
  const { id: userId }: User = useSelector(selectUser);

  const [updateTemplate] = useDocumentUpdate();
  const [disableForm] = useFormRequestDisable();
  const [enableForm] = useFormRequestEnable();
  const isMobile = useIsMobile();
  const [copyTemplate] = useDocumentCopy();
  const link = `${FRONTEND_URL}/form-requests/${template.id}/send`;

  const [openUpgradeModal, closeUpgradeModal] = useModal(
    () => <TemplateUpgradeModal onClose={closeUpgradeModal} />,
    [],
  );

  const handleClickRenameTemplate = useCallback(() => {
    setIsEditFormActive(true);
  }, []);

  const navigateToTemplateEdit = useCallback(() => {
    HistoryService.push(`/form-requests/${template.id}/edit`);
  }, [template.id]);

  const handleTemplateCopy = useCallback(async () => {
    try {
      await copyTemplate({ documentId: template.id });
      Toast.success('Template successfully duplicated!');
    } catch (error:any) {
      if (error.type === RequestErrorTypes.QUOTA_EXCEEDED) {
        return openUpgradeModal();
      }

      Toast.handleErrors(error);
    }
  }, [copyTemplate, template.id, openUpgradeModal]);

  const handleUpdateTemplate = useCallback(
    async ({ title }) => {
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
      } catch (error) {
        Toast.handleErrors(error);
      }
    },
    [updateTemplate, template.type, template.id],
  );

  const handleDisableForm = async () => {
    try {
      await disableForm({ documentId: template.id });
      Toast.success('Form successfully disabled!');
    } catch (error) {
      Toast.handleErrors(error);
    }
  };

  const handleEnableForm = async () => {
    try {
      await enableForm({ documentId: template.id });
      Toast.success('Form successfully enabled!');
    } catch (error) {
      Toast.handleErrors(error);
    }
  };
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
          Are you sure want to duplicate this form?
        </h5>
      </div>
    </ConfirmModal>
  ));

  const [openSigningLinkModal, closeSigningLinkModal] = useModal(
    () => (
      <ShareFormModal
        onClose={closeSigningLinkModal}
        link={link}
        title="Share this Form"
        subtitle="Share this form to collect signatures without creating an individual request."
      />
    ),
    [template],
  );

  const [openRegisteredUsersModal, closeRegisteredUsersModal] = useModal(
    () => (
      <SubmittedContractsModal
        documentId={template.id}
        onClose={closeRegisteredUsersModal}
      />
    ),
    [template],
  );

  const handleDeleteForm = useCallback(() => {
    onDelete && onDelete([template.id]);
  }, [onDelete, template.id]);

  const [showDeleteModal, hideDeleteModal, isDeleteModalOpen] = useModal(
    () => (
      <DeleteModal
        onClose={hideDeleteModal}
        deleteTitle="Yes, Delete"
        onConfirm={() => {
          handleDeleteForm();
          hideDeleteModal();
        }}
        className="documents__deleteWrapper"
      >
        <div className="documents__deleteHeader">
          <h5 className="documents__deleteTitle">
            Are you sure want to delete this form?
          </h5>
          <p className="modal__subTitle">
            Deleting this form will completely remove it. This cannot be undone.
          </p>
        </div>
      </DeleteModal>
    ),
    [handleDeleteForm],
  );

  const options = useMemo(() => {
    const options = [
      {
        name: 'Rename',
        icon: IconPencil,
        onClick: handleClickRenameTemplate,
        hidden: template.status !== DocumentStatuses.DRAFT || template.userId !== userId,
      },
      {
        name: 'Edit',
        icon: IconDocWithPencil,
        onClick: navigateToTemplateEdit,
        hidden: !!template.deletedAt || template.userId !== userId,
      },
      {
        name: 'Share',
        icon: IconShare,
        onClick: openSigningLinkModal,
        hidden: template.status === DocumentStatuses.DRAFT || !!template.deletedAt,
      },
      {
        name: 'Duplicate',
        icon: CopyIcon,
        onClick: openTemplateCopyModal,
        hidden: !!template.deletedAt || template.userId !== userId,
      },
      {
        name: 'Registered Users',
        icon: IconUser,
        onClick: openRegisteredUsersModal,
      },
      {
        name: 'Disable Form',
        icon: IconPause,
        onClick: handleDisableForm,
        hidden: !!template.deletedAt || template.userId !== userId,
      },
      {
        name: 'Enable Form',
        icon: IconPlay,
        onClick: handleEnableForm,
        hidden: !template.deletedAt || template.userId !== userId,
      },
      {
        name: 'Delete Form',
        icon: RemovePencil,
        onClick: showDeleteModal,
        hidden: !isMobile && (!template.deletedAt || template.userId !== userId),
        className: 'red',
      },
    ];

    return options.filter(option => !option.hidden);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [TemplateCreate, handleClickRenameTemplate, template]);

  return isMobile ? (
    <FormRequestItemMobile template={template} className={className} options={options} />
  ) : (
    <div className={classNames('table__row', 'table__dataRow', className)}>
      <div className="table__column table__column--check">
        <UICheckbox handleClick={toggleSelect} check={isSelected} />
      </div>
      <div className="table__column table__column--text">
        {isActiveEditForm ? (
          <EditableTitle templateTitle={template.title} onSubmit={handleUpdateTemplate} />
        ) : (
          formatDocumentName(template.title, 'template')
        )}
      </div>
      <div className="table__column table__column--date">
        {template.createdAt && formatDate(template.createdAt)}
      </div>
      <div className="table__column table__column--status">
        <div
          className={`documents__documentStatus documents__documentStatus--${
            template.status === DocumentStatuses.ACTIVE
              ? template.deletedAt
                ? 'disabled'
                : 'completed'
              : template.status
          }`}
        >
          <span className="documents__documentStatus-text">
            {template.status === DocumentStatuses.ACTIVE
              ? template.deletedAt
                ? 'disabled'
                : 'live'
              : template.status}
          </span>
        </div>
      </div>
      <div className="table__column table__column--action">
        {template.status !== DocumentStatuses.PREPARING && (
          <DropDownOptions options={options} anchorClassName="table__container" />
        )}
      </div>
    </div>
  );
};

export default FormRequestItem;

import React, { useCallback, useMemo } from 'react';
import classNames from 'classnames';
import { formatDate } from 'Utils/formatters';
import DropDownOptions from 'Components/DropDownOptions';
import IconRemove from 'Assets/images/icons/remove-icon.svg';
import IconPencil from 'Assets/images/icons/pencil.svg';
import CrossInCircle from 'Assets/images/icons/cross-in-circle.svg';
import { ApiKey } from 'Interfaces/ApiKey';
import { useApiKeyDelete, useApiKeyRecover, useApiKeyRevoke } from 'Hooks/ApiKeys';
import Toast from 'Services/Toast';
import DeleteModal from 'Components/DeleteModal';
import { useModal } from 'Hooks/Common';
import History from 'Services/History';
import useIsMobile from 'Hooks/Common/useIsMobile';
import ApiKeyItemMobile from './ApiKeyItemMobile';
import { AuthorizedRoutePaths } from 'Interfaces/RoutePaths';
interface ApiKeyItemProps {
  apiKey: ApiKey;
  className?: string;
  onDeleteSuccess?: (id: ApiKey['id']) => void;
}

const ApiKeyItem = ({ apiKey, className, onDeleteSuccess }: ApiKeyItemProps) => {
  const isMobile = useIsMobile();
  const [revokeApiKey] = useApiKeyRevoke();
  const [deleteApiKey] = useApiKeyDelete();
  const [recoverApiKey] = useApiKeyRecover();

  const handleApiKeyRevoke = useCallback(async () => {
    try {
      await revokeApiKey(apiKey.id);
      Toast.success('API key successfully revoked');
    } catch (error) {
      Toast.handleErrors(error);
    }
  }, [apiKey.id, revokeApiKey]);

  const handleApiKeyDelete = useCallback(async () => {
    try {
      await deleteApiKey(apiKey.id);
      onDeleteSuccess?.(apiKey.id);
      Toast.success('API key successfully deleted');
    } catch (error) {
      Toast.handleErrors(error);
    }
  }, [apiKey.id, deleteApiKey, onDeleteSuccess]);

  const handleApiKeyRecover = useCallback(async () => {
    try {
      await recoverApiKey(apiKey.id);
      Toast.success('API key successfully recovered');
    } catch (error) {
      Toast.handleErrors(error);
    }
  }, [apiKey.id, recoverApiKey]);

  const [showDeleteModal, hideDeleteModal] = useModal(
    () => (
      <DeleteModal
        onClose={hideDeleteModal}
        onConfirm={() => {
          handleApiKeyDelete();
          hideDeleteModal();
        }}
        className="documents__deleteWrapper"
      >
        <div className="documents__deleteHeader">
          <h5 className="documents__deleteTitle">Are you sure want to delete API key?</h5>
          <p className="modal__subTitle">
            Deleting this API key will completely remove it. This cannot be undone.
          </p>
        </div>
      </DeleteModal>
    ),
    [handleApiKeyDelete],
  );

  const options = useMemo(() => {
    const options = [
      {
        name: 'View History',
        icon: IconPencil,
        onClick: () =>
          History.push(
            `${AuthorizedRoutePaths.SETTINGS_API}/${apiKey.id}/request_history`,
          ),
        hidden: !apiKey.requests,
      },
      {
        name: 'Revoke',
        icon: CrossInCircle,
        onClick: handleApiKeyRevoke,
        hidden: Boolean(apiKey.deletedAt),
      },
      {
        name: 'Recover',
        icon: CrossInCircle,
        onClick: handleApiKeyRecover,
        hidden: !apiKey.deletedAt,
      },
      {
        name: 'Delete',
        icon: IconRemove,
        className: 'tableControls__control--red',
        iconClassName: 'apiKeys__delete-icon',
        onClick: showDeleteModal,
      },
    ];

    return options.filter(option => !option.hidden);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey.deletedAt]);

  return isMobile ? (
    <ApiKeyItemMobile className={className} apiKey={apiKey} options={options} />
  ) : (
    <div className={classNames('table__row', 'table__dataRow', className)}>
      <div className="table__column table__column--text apiKeys__column--medium">
        {apiKey.name}
      </div>
      <div className="table__column table__column--text apiKeys__column--small">
        {apiKey.prefix}
      </div>
      <div className="table__column table__column--date apiKeys__column--medium">
        {apiKey.createdAt && formatDate(apiKey.createdAt)}
      </div>
      <div className="table__column table__column--text apiKeys__column--small">
        {apiKey.requests}
      </div>

      <div className="table__column table__column--action">
        <DropDownOptions options={options} anchorClassName="table__container" />
      </div>
    </div>
  );
};

export default ApiKeyItem;

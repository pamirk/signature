import React, { useState, useCallback, useMemo } from 'react';
import ConfirmModal from '../ConfirmModal';
import UISelect from 'Components/UIComponents/UISelect';
import { BulkSendSigner, SignerColumnIndexes } from 'Interfaces/Document';

interface HeadersSelectModalProps {
  headers: string[];
  signerRows: string[][];
  onSignersChange: (signers: BulkSendSigner[]) => void;
  buttonDisabled?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const HeadersSelectModal = ({
  onSignersChange,
  headers,
  signerRows,
  onConfirm,
  buttonDisabled,
  onClose,
}: HeadersSelectModalProps) => {
  const [columnIndexes, setColumnIndexes] = useState<SignerColumnIndexes>();
  const selectableColumns = useMemo(
    () =>
      headers
        ? headers.map((column, index) => ({
            value: index,
            label: column,
          }))
        : [],
    [headers],
  );

  const handleSelect = useCallback(
    (columnIndexes: SignerColumnIndexes) => {
      setColumnIndexes(columnIndexes);
      const { name, email } = columnIndexes;
      if (name !== undefined && email !== undefined) {
        const signers: BulkSendSigner[] = signerRows.map(row => ({
          name: row[name],
          email: row[email],
        }));
        onSignersChange(signers);
      }
    },
    [onSignersChange, signerRows],
  );

  return (
    <ConfirmModal
      isCancellable={false}
      className="modal__dialog--overflow-initial"
      confirmButtonProps={{
        priority: 'primary',
        disabled:
          columnIndexes?.email === undefined ||
          columnIndexes?.name === undefined ||
          buttonDisabled,
        type: 'button',
        className: 'bulkSendModal__button',
        title: 'Request Signatures',
        handleClick: onConfirm,
      }}
      onClose={onClose}
    >
      <div className="bulkSendModal">
        <h1 className="bulkSendModal__header">Select name and email columns</h1>
        <h2 className="bulkSendModal__subtitle">
          Please map the name and email fields below.
        </h2>
        <div className="form__field bulkSendModal__select">
          <label className="form__label">Name</label>
          <UISelect
            contentWrapperClassName="bulkSendModal__dropdown"
            options={selectableColumns}
            placeholder="Name"
            value={columnIndexes?.name}
            handleSelect={value => {
              handleSelect({ ...columnIndexes, name: value as number | undefined });
            }}
            isClearable={columnIndexes?.name !== undefined}
          />
        </div>
        <div className="form__field bulkSendModal__select bulkSendModal__bottom-select">
          <label className="form__label">Email</label>
          <UISelect
            options={selectableColumns}
            placeholder="Email"
            contentWrapperClassName="bulkSendModal__dropdown"
            value={columnIndexes?.email}
            handleSelect={value => {
              handleSelect({ ...columnIndexes, email: value as number | undefined });
            }}
            isClearable={columnIndexes?.email !== undefined}
          />
        </div>
      </div>
    </ConfirmModal>
  );
};

export default HeadersSelectModal;

import React from 'react';
import UIButton from 'Components/UIComponents/UIButton';
import { Field, Form } from 'react-final-form';
import { maxLength100, required } from 'Utils/validation';
import { FieldTextInput } from 'Components/FormFields';
import { composeValidators } from 'Utils/functions';
import { FolderCreatePayload } from 'Interfaces/Folder';

interface CreateFolderModalProps {
  onClose: () => void;
  onSubmit: (values: FolderCreatePayload) => void;
  isLoading: boolean;
}

const CreateFolderModal = ({ onClose, onSubmit, isLoading }: CreateFolderModalProps) => {
  const handleCreateFolder = (values: FolderCreatePayload) => {
    onSubmit(values);
    onClose();
  };
  return (
    <div className="createFolderModal__wrapper">
      <div className="createFolderModal__header">
        <h4 className="modal__title">Create Folder</h4>
        <p className="modal__subTitle"></p>
      </div>

      <Form
        onSubmit={handleCreateFolder}
        render={({ hasValidationErrors, submitting, handleSubmit }) => {
          return (
            <form onSubmit={handleSubmit}>
              <Field
                name="title"
                placeholder="New Folder Name"
                component={FieldTextInput}
                validate={composeValidators<string>(required, maxLength100)}
              />
              <div className="createFolderModal__actions">
                <UIButton
                  type="submit"
                  priority="primary"
                  disabled={hasValidationErrors || submitting || isLoading}
                  isLoading={false}
                  title="Create"
                />
                <div className="createFolderModal__cancel" onClick={onClose}>
                  Cancel
                </div>
              </div>
            </form>
          );
        }}
      />
    </div>
  );
};

export default CreateFolderModal;

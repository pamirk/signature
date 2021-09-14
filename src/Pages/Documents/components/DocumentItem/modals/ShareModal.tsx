import React, { useState, useCallback, useEffect, useMemo } from 'react';
import arrayMutators from 'final-form-arrays';
import { Form, FormRenderProps } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { ReactSVG } from 'react-svg';
import Toast from 'Services/Toast';
import { useDocumentShareUrlGet, useDocumentShare } from 'Hooks/DocumentSign';
import { isNotEmpty, processSubmissionErrors } from 'Utils/functions';
import { Document, DocumentSharePayload } from 'Interfaces/Document';

import EmailRecipientsArray from 'Components/FormFields/EmailRecipientsArray';
import UIButton from 'Components/UIComponents/UIButton';
import UITextInput from 'Components/UIComponents/UITextInput';
import UISpinner from 'Components/UIComponents/UISpinner';

import IconCopy from 'Assets/images/icons/copy-icon.svg';

interface ShareModalProps {
  documentId: Document['id'];
  onSuccess?: () => void;
}

const ShareModal = ({ documentId, onSuccess }: ShareModalProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | undefined>();
  const [getDocumentShareUrl, isGettingShareUrl] = useDocumentShareUrlGet();
  const [shareDocument] = useDocumentShare();
  const initialValues = useMemo(() => ({ documentId, recipients: [{ email: '' }] }), [
    documentId,
  ]);

  const handleDocumentShare = useCallback(async (values: DocumentSharePayload) => {
    try {
      await shareDocument(values);

      onSuccess && onSuccess();

      Toast.success('Document successfully sended to specified email(s).');
    } catch (err) {
      Toast.handleErrors(err);

      return processSubmissionErrors(err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDocumentShareUrlGet = useCallback(async (documentId: Document['id']) => {
    try {
      const response = await getDocumentShareUrl({ documentId });

      if (isNotEmpty(response)) {
        setShareUrl(response.result);
      }
    } catch (err) {
      Toast.handleErrors(err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShareUrlCopy = useCallback(async () => {
    try {
      if (!shareUrl) return;

      await navigator.clipboard.writeText(shareUrl);

      setIsCopied(true);
    } catch (err) {
      Toast.handleErrors(err);
    }
  }, [shareUrl]);

  useEffect(() => {
    handleDocumentShareUrlGet(documentId);
  }, [handleDocumentShareUrlGet, documentId]);

  useEffect(() => {
    if (!isCopied) return;

    const timer = setTimeout(() => setIsCopied(false), 1000);

    return () => clearTimeout(timer);
  }, [isCopied]);

  return (
    <div className="shareModal__wrapper">
      <div className="modal__header">
        <h4 className="modal__title reminerModal__header">Share this Document</h4>
        <p className="modal__subtitle">
          Share this document with additional viewers to allow them to download the signed
          document.
        </p>
      </div>
      <Form
        initialValues={initialValues}
        onSubmit={handleDocumentShare}
        mutators={{ ...arrayMutators }}
        render={({
          handleSubmit,
          values,
          submitting,
          pristine,
          valid,
        }: FormRenderProps<DocumentSharePayload>) => (
          <form className="shareModal__form">
            <FieldArray
              name="recipients"
              component={EmailRecipientsArray}
              label="Add Viewers"
              labelClassName="shareModal__label"
              addLabel="Add Viewer"
              isItemsDeletable
            />
            <div className="common__or">Or</div>
            <p></p>

            <button
              className="shareModal__copy"
              onClick={handleShareUrlCopy}
              disabled={!shareUrl}
              type="button"
            >
              {isGettingShareUrl && (
                <UISpinner wrapperClassName="spinner__wrapper spinner__wrapper--overlay spinner__wrapper--full-cover spinner__wrapper--bg-gray" />
              )}
              <UITextInput value={shareUrl} disabled />
              {shareUrl && (
                <div className="shareModal__copyInner">
                  <ReactSVG src={IconCopy} className="shareModal__copyIcon" />
                  <span className="shareModal__copyText">
                    {!isCopied ? 'COPY' : 'COPIED'}
                  </span>
                </div>
              )}
            </button>
            <UIButton
              priority="primary"
              handleClick={handleSubmit}
              disabled={pristine || !valid || submitting || !values.recipients?.length}
              isLoading={submitting}
              type="submit"
              title="Share Document"
            />
          </form>
        )}
      />
    </div>
  );
};

export default ShareModal;

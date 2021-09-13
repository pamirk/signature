import React, { useCallback, useState } from 'react';
import { Document, DocumentStatuses } from 'Interfaces/Document';
import { RouteChildrenProps } from 'react-router-dom';
import { useSelector } from 'react-redux';
import History from 'Services/History';
import { selectDocument } from 'Utils/selectors';

import UISpinner from 'Components/UIComponents/UISpinner';
import { useTemplateReplicate, useDocumentGuard } from 'Hooks/Document';
import Toast from 'Services/Toast';
import TemplateForm from 'Components/TemplateForm/TemplateForm';

interface TemplateRouteParams {
  templateId: Document['id'];
}

const TemplateEdit = ({ match }: RouteChildrenProps<TemplateRouteParams>) => {
  const sourceTemplateId = match?.params.templateId || '';
  const [replicateTemplate, isReplicateLoading] = useTemplateReplicate();
  const [templateId, setTemplateId] = useState<Document['id'] | undefined>();
  const template = useSelector(state =>
    selectDocument(state, { documentId: templateId }),
  );

  const handleTemplateCheckFailure = useCallback(() => {
    History.replace('/templates');
  }, []);

  const handleTemplateCheckSuccess = useCallback(
    async (template: Document) => {
      try {
        let updatingTemplate = template;

        if (template.status !== DocumentStatuses.DRAFT) {
          updatingTemplate = (await replicateTemplate({
            documentId: sourceTemplateId,
          })) as Document;
        }

        setTemplateId(updatingTemplate.id);
      } catch (error) {
        Toast.handleErrors(error);
        handleTemplateCheckFailure();
      }
    },
    [handleTemplateCheckFailure, replicateTemplate, sourceTemplateId],
  );

  const isCheckingTemplate = useDocumentGuard({
    documentId: sourceTemplateId,
    onFailure: handleTemplateCheckFailure,
    onSuccess: handleTemplateCheckSuccess,
  });

  if (isCheckingTemplate || isReplicateLoading) {
    return <UISpinner wrapperClassName="spinner--main__wrapper" width={50} height={50} />;
  }

  if (!template) return null;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { fields, ...restTemplate } = template;

  return (
    <TemplateForm initialValues={restTemplate} sourceTemplateId={sourceTemplateId} />
  );
};

export default TemplateEdit;

import React, { useEffect } from 'react';
import { DocumentTypes, DocumentStatuses } from 'Interfaces/Document';
import TemplateForm from 'Components/TemplateForm';
import { useSelector } from 'react-redux';
import { selectUserPlan } from 'Utils/selectors';
import { PlanTypes } from 'Interfaces/Billing';
import Templates from '../TemplatesScreen/components/Templates';
import { RouteChildrenProps } from 'react-router-dom';

function TemplateCreate({ location }: RouteChildrenProps<void>) {
  const userPlan = useSelector(selectUserPlan);

  useEffect(() => {
    if (
      userPlan.type === PlanTypes.FREE ||
      (userPlan.type === PlanTypes.PERSONAL && Templates.length >= 1)
    ) {
      //History.push('/settings/billing/plan');
    }
  }, [userPlan.type]);

  const searchParams = new URLSearchParams(location.search);
  const activationStatus = searchParams.get('status') as DocumentStatuses | null;

  const isApiTemplate = activationStatus === DocumentStatuses.API;

  return (
    <TemplateForm
      initialValues={{
        type: DocumentTypes.TEMPLATE,
        status: DocumentStatuses.DRAFT,
        signers: [{ isPreparer: true, order: -1, role: 'Me (Now)' }, { order: 1 }],
        isApiTemplate,
      }}
    />
  );
}

export default TemplateCreate;

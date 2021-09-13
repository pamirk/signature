import React, { useEffect } from 'react';
import { DocumentTypes, DocumentStatuses } from 'Interfaces/Document';
import TemplateForm from 'Components/TemplateForm/TemplateForm';
import { useSelector } from 'react-redux';
import { selectUserPlan } from 'Utils/selectors';
import { PlanTypes } from 'Interfaces/Billing';
import Templates from '../TemplatesScreen/components/Templates';

function TemplateCreate() {
  const userPlan = useSelector(selectUserPlan);

  useEffect(() => {
    if (
      userPlan.type === PlanTypes.FREE ||
      (userPlan.type == PlanTypes.PERSONAL && Templates.length >= 1)
    ) {
      //History.push('/settings/billing/plan');
    }
  }, [userPlan.type]);

  return (
    <TemplateForm
      initialValues={{
        type: DocumentTypes.TEMPLATE,
        status: DocumentStatuses.DRAFT,
        signers: [{ isPreparer: true, order: -1, role: 'Me (Now)' }, { order: 1 }],
      }}
    />
  );
}

export default TemplateCreate;

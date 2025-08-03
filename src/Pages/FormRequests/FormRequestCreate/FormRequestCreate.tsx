import React, { useEffect } from 'react';
import { DocumentTypes, DocumentStatuses } from 'Interfaces/Document';
import { useSelector } from 'react-redux';
import { selectUser, selectUserPlan } from 'Utils/selectors';
import { PlanTypes } from 'Interfaces/Billing';
import FormRequestForm from 'Components/FormRequestsForm';
import History from 'Services/History';
import { User } from 'Interfaces/User';
import { AuthorizedRoutePaths } from 'Interfaces/RoutePaths';

function FormRequestCreate() {
  const userPlan = useSelector(selectUserPlan);
  const user = useSelector(selectUser) as User;

  useEffect(() => {
    if (userPlan.type !== PlanTypes.BUSINESS && !user.teamId) {
      History.push(AuthorizedRoutePaths.SETTINGS_BILLING_PLAN);
    }
  }, [user.teamId, userPlan.type]);

  return (
    <FormRequestForm
      initialValues={{
        type: DocumentTypes.FORM_REQUEST,
        status: DocumentStatuses.DRAFT,
        signers: [
          { isPreparer: true, order: -1, role: 'Me (Now)' },
          { order: 0, role: 'SIGNER' },
        ],
      }}
    />
  );
}

export default FormRequestCreate;

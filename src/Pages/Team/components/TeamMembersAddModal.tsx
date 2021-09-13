import React, { useCallback, useMemo } from 'react';
import arrayMutators from 'final-form-arrays';
import { Form, FormRenderProps } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import { OnSubmitReturnType } from 'Interfaces/FinalForm';

import EmailRecipientsArray from 'Components/FormFields/EmailRecipientsArray';
import UIButton from 'Components/UIComponents/UIButton';
import { TeamMembersAddPayload } from 'Interfaces/Team';
import dayjs from 'dayjs';
import {
  SubscriptionInfo,
  PlanDurations,
  PlanDetails,
  AppSumoStatus,
} from 'Interfaces/Billing';
import { UserRoles } from 'Interfaces/User';

interface TeamMembersAddModalProps {
  subscriptionInfo: SubscriptionInfo;
  userRole: UserRoles;
  plan: PlanDetails;
  appSumoStatus: AppSumoStatus;
  sendDocument: (values: TeamMembersAddPayload) => OnSubmitReturnType;
  onClose: () => void;
}

const formInitialValues = { emails: [{}] } as TeamMembersAddPayload;

const TeamMembersAddModal = ({
  sendDocument,
  onClose,
  subscriptionInfo,
  userRole,
  plan,
  appSumoStatus,
}: TeamMembersAddModalProps) => {
  const { subscriptionPrice, nextBillingDate } = useMemo(() => {
    return {
      subscriptionPrice: subscriptionInfo.amount - subscriptionInfo.discountAmount,
      nextBillingDate: dayjs(subscriptionInfo.nextBillingDate).format('MMMM DD, YYYY'),
    };
  }, [subscriptionInfo]);

  const handleSendDocument = useCallback(
    async (values: TeamMembersAddPayload) => {
      await sendDocument(values);
      onClose();
    },
    [onClose, sendDocument],
  );

  return (
    <div className="teamModal__wrapper">
      <div className="modal__header teamModal__header">
        <h4 className="modal__title teamModal__title">Add Team Member</h4>
        <p className="teamModal__subtitle">
          Invite new team members to your Signaturely account.
        </p>
      </div>
      <Form
        onSubmit={handleSendDocument}
        initialValues={formInitialValues}
        mutators={{ ...arrayMutators }}
        render={({
          handleSubmit,
          values,
          submitting,
        }: FormRenderProps<TeamMembersAddPayload>) => (
          <form onSubmit={handleSubmit}>
            <div className="teamModal__email-wrapper">
              <FieldArray
                name="emails"
                component={EmailRecipientsArray}
                label="Email"
                labelClassName="shareModal__label"
                addLabel="Add team member"
                isItemsDeletable
              />
            </div>
            {userRole === UserRoles.OWNER && !appSumoStatus && (
              <>
                <div className="teamModal__price teamModal__text teamModal__text--bold">
                  <span className="teamModal__text--black">You’ll be charged</span>&nbsp;
                  <span className="teamModal__text--blue">
                    ${values.emails.length * subscriptionPrice}
                  </span>
                  &nbsp;
                  <span className="teamModal__text--black">
                    for inviting per{' '}
                    {plan.duration === PlanDurations.MONTHLY ? 'month' : 'year'}
                  </span>
                  &nbsp;
                  <span className="teamModal__text--blue">
                    {values.emails.length} new user(s)
                  </span>{' '}
                  &nbsp;(
                  {`$${subscriptionPrice}/${
                    plan.duration === PlanDurations.MONTHLY ? 'mo' : 'yr'
                  } for each user`}
                  ).
                </div>
                <div className="teamModal__price-description teamModal__text">
                  The pricing change will be reflected on your next bill on (
                  {nextBillingDate}
                  ).
                </div>
              </>
            )}
            <div className="teamModal__buttons-group">
              <div className="teamModal__submit-button">
                <UIButton
                  priority="primary"
                  type="submit"
                  handleClick={handleSubmit}
                  disabled={submitting || !values.emails?.length}
                  isLoading={submitting}
                  title={`Send Invite${!appSumoStatus ? 's' : ''}`}
                />
              </div>
              <div className="teamModal__cancel" onClick={onClose}>
                Cancel
              </div>
            </div>
          </form>
        )}
      />
    </div>
  );
};

export default TeamMembersAddModal;

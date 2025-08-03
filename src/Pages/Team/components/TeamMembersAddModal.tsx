import arrayMutators from 'final-form-arrays';
import React, { useCallback, useMemo } from 'react';
import { Form, FormRenderProps } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import { OnSubmitReturnType } from 'Interfaces/FinalForm';

import { TeammateFieldArray } from 'Components/FormFields/TeammatesArray';
import UIButton from 'Components/UIComponents/UIButton';
import {
  AppSumoStatus,
  LtdTier,
  PlanDetails,
  PlanDurations,
  SubscriptionInfo,
} from 'Interfaces/Billing';
import { TeamMembersAddPayload } from 'Interfaces/Team';
import { UserRoles } from 'Interfaces/User';
import dayjs from 'dayjs';
import { isNotEmpty } from 'Utils/functions';

interface TeamMembersAddModalProps {
  subscriptionInfo: SubscriptionInfo;
  userRole: UserRoles;
  plan: PlanDetails;
  appSumoStatus: AppSumoStatus;
  sendDocument: (values: TeamMembersAddPayload) => OnSubmitReturnType;
  onClose: () => void;
  ltdTier: LtdTier;
  teamSize: number;
}

const formInitialValues = {
  members: [{ role: UserRoles.USER }],
} as unknown as TeamMembersAddPayload;

const TeamMembersAddModal = ({
  sendDocument,
  onClose,
  subscriptionInfo,
  userRole,
  plan,
  appSumoStatus,
  ltdTier,
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
                name="members"
                component={TeammateFieldArray}
                label="Team members"
                labelClassName="shareModal__label"
                addLabel="Add team member"
                isItemsDeletable
                isRoleSelectable={userRole === UserRoles.OWNER}
              />
            </div>
            {userRole === UserRoles.OWNER &&
              (!(appSumoStatus || isNotEmpty(ltdTier)) ||
                (appSumoStatus === AppSumoStatus.STANDARD &&
                  isNotEmpty(subscriptionInfo))) && (
                <>
                  <div className="teamModal__price teamModal__text teamModal__text--bold">
                    <span className="teamModal__text--black">You’ll be charged</span>
                    &nbsp;
                    <span className="teamModal__text--blue">
                      ${((values?.members?.length ?? 0) * subscriptionPrice).toFixed(2)}
                    </span>
                    &nbsp;
                    <span className="teamModal__text--black">
                      for inviting per{' '}
                      {plan.duration === PlanDurations.MONTHLY ? 'month' : 'year'}
                    </span>
                    &nbsp;
                    <span className="teamModal__text--blue">
                      {values?.members?.length} new user(s)
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
                  disabled={submitting || !values?.members?.length}
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

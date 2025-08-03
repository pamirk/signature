import arrayMutators from 'final-form-arrays';
import React, { useCallback } from 'react';
import { Form, FormRenderProps } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { TeammateFieldArray } from 'Components/FormFields/TeammatesArray';
import UIButton from 'Components/UIComponents/UIButton';
import { TeamMembersAddPayload } from 'Interfaces/Team';
import { User, UserRoles } from 'Interfaces/User';
import { useSelector } from 'react-redux';
import { selectUser } from 'Utils/selectors';
import UIModal from 'Components/UIComponents/UIModal';
import { LtdTypes } from 'Interfaces/Billing';

const formInitialValues = {
  members: [{ role: UserRoles.USER }],
} as TeamMembersAddPayload;

const LtdSubtitleMap: {
  [T in LtdTypes]: string;
} = {
  [LtdTypes.APPSUMO]: 'AppSumo plan',
  [LtdTypes.TIER]: 'LTD Tier',
  [LtdTypes.NONE]: '',
};

interface AdditionalTeamMembersAddModalProps {
  onClose: () => void;
  onSetFutureTeamMembers: (values: TeamMembersAddPayload) => void;
  showBillingModal: () => void;
  teamLimit?: number;
  ltdType: LtdTypes;
}

const AdditionalTeamMembersAddModal = ({
  onClose,
  onSetFutureTeamMembers,
  showBillingModal,
  teamLimit,
  ltdType,
}: AdditionalTeamMembersAddModalProps) => {
  const user: User = useSelector(selectUser);

  const handleContinue = useCallback(
    (values: TeamMembersAddPayload) => {
      onSetFutureTeamMembers(values);
      showBillingModal();
      onClose();
    },
    [onClose, onSetFutureTeamMembers, showBillingModal],
  );

  return (
    <UIModal className="teamModal" onClose={onClose}>
      <div className="teamModal__wrapper">
        <div className="modal__header teamModal__header">
          <h4 className="modal__title teamModal__title">
            Add extra users by upgrading your signaturely subscription
          </h4>
          <p className="teamModal__subtitle">
            Your {LtdSubtitleMap[ltdType]} only includes {teamLimit} users, in order to
            keep adding more, please select either our monthly or yearly plans.
          </p>
        </div>
        <Form
          onSubmit={handleContinue}
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
                  isRoleSelectable={user.role === UserRoles.OWNER}
                />
              </div>
              {
                <>
                  <div className="teamModal__price teamModal__text teamModal__text--bold" />
                  <div className="teamModal__price-description teamModal__text">
                    To enhance your Life Time Deal (LTD) and include additional users, you
                    need to select either our monthly or yearly plans. Regrettably,
                    it&apos;s not feasible to increase user numbers directly through the
                    LTD. However, as a valued customer, we offer a lifetime{' '}
                    <b>discount of 30%</b> for each new user you incorporate. Expand your
                    team&apos;s capabilities with Signaturely today!
                  </div>
                </>
              }
              <div className="teamModal__buttons-group">
                <div className="teamModal__submit-button">
                  <UIButton
                    priority="primary"
                    type="submit"
                    handleClick={handleSubmit}
                    disabled={submitting || !values.members?.length}
                    isLoading={submitting}
                    title={'Continue'}
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
    </UIModal>
  );
};

export default AdditionalTeamMembersAddModal;

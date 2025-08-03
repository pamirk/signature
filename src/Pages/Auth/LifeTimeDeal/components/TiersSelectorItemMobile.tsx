import React from 'react';
import { LtdTier } from 'Interfaces/Billing';
import { planTypeToName, removeEmptyCharacters } from 'Utils/formatters';
import TierOptions from './TierOptions';
import {
  LtdOptionNames,
  popularTiers,
} from 'Pages/Settings/Billing/screens/LifeTimeDealScreen/planTableItems';
import classNames from 'classnames';
import UIButton from 'Components/UIComponents/UIButton';
import { AnyObject, Field, Form } from 'react-final-form';
import { FieldTextInput } from 'Components/FormFields';
import { composeValidators } from 'Utils/functions';
import { email, required } from 'Utils/validation';

interface TiersSelectorItemMobileProps {
  tier: LtdTier;
  onClick: (tier: LtdTier) => void;
  isActive?: boolean;
  learnMore: boolean;
  setLearnMore: (value: boolean) => void;
  isGettingLtdTiers: boolean;
  handleSubmit: (values: AnyObject) => void;
}

const TiersSelectorItemMobile = ({
  tier,
  onClick,
  isActive = false,
  learnMore,
  setLearnMore,
  isGettingLtdTiers,
  handleSubmit,
}: TiersSelectorItemMobileProps) => {
  const isPopularTier = popularTiers.includes(tier.id);
  const selectedOptions = isActive
    ? [
        LtdOptionNames.USERS,
        LtdOptionNames.API_REQUESTS,
        LtdOptionNames.SIGNATURE_REQUESTS,
        LtdOptionNames.TEMPLATES,
      ]
    : [LtdOptionNames.USERS, LtdOptionNames.API_REQUESTS];

  return (
    <div
      className="lifeTimeDeal__content-right selector mobile"
      onClick={() => onClick(tier)}
    >
      <div
        className={classNames(
          'plan-badge select',
          {
            active: isActive,
            inactive: !isActive,
            popular: !isActive && isPopularTier,
          },
          'mobile',
        )}
      >
        {isPopularTier && <div className="plan-badge__best-value mobile">BEST VALUE</div>}
        <div className="plan-badge__wrapper select-item mobile">
          <div className="plan-badge__label mobile">
            <div className="plan-badge__tier-label">
              <div className="plan-badge__name mobile">
                {planTypeToName[tier.planType]} Plan
              </div>
              <div className="plan-badge__price__tier-billet mobile">
                Tier {tier.tierNumber}
              </div>
            </div>
            <div className="plan-badge__price">
              ${tier.price}
              &nbsp;
              <span>/Lifetime</span>
            </div>
          </div>
          <TierOptions ltdTier={tier} selectedOptions={selectedOptions} isMobile={true} />
          {isActive && (
            <div className="lifeTimeDeal__content-right selector mobile">
              <Form
                onSubmit={handleSubmit}
                render={({ handleSubmit, submitting }) => (
                  <form className={classNames('credentials mobile')}>
                    <div
                      className={classNames(
                        'credentials__container',
                        'lifeTimeDeal__fields-tier-wrapper',
                        'mobile',
                      )}
                    >
                      <div className="credentials-personal__items">
                        <UIButton
                          className={classNames(
                            'lifeTimeDeal__common-button__go-to-checkout mobile',
                          )}
                          handleClick={() => {
                            setLearnMore(!learnMore);
                            window.scrollTo(0, 0);
                          }}
                          priority="secondary"
                          title="Learn More"
                          disabled={submitting || isGettingLtdTiers}
                          isLoading={isGettingLtdTiers}
                        />
                        <div className={classNames('credentials-personal-item mobile')}>
                          <Field
                            name="email"
                            label="Email Address"
                            placeholder="username@gmail.com"
                            component={FieldTextInput}
                            parse={removeEmptyCharacters}
                            validate={composeValidators<string>(required, email)}
                            onKeyDown={event => {
                              if (event.key === 'Enter') {
                                event.preventDefault();
                                handleSubmit();
                              }
                            }}
                          />
                        </div>
                        <UIButton
                          className={classNames(
                            'lifeTimeDeal__common-button__go-to-checkout mobile',
                          )}
                          handleClick={handleSubmit}
                          priority="primary"
                          title="Go to Checkout"
                          disabled={submitting || isGettingLtdTiers}
                          isLoading={isGettingLtdTiers}
                        />
                      </div>
                    </div>
                  </form>
                )}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TiersSelectorItemMobile;

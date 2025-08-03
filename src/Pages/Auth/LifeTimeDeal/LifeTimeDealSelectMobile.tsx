import React, { useState } from 'react';
import { FieldTextInput } from 'Components/FormFields';
import { Field, Form } from 'react-final-form';
import { composeValidators } from 'Utils/functions';
import { required, email } from 'Utils/validation';
import classNames from 'classnames';
import { LtdTier } from 'Interfaces/Billing';
import { removeEmptyCharacters } from 'Utils/formatters';
import UIButton from 'Components/UIComponents/UIButton';
import UISpinner from 'Components/UIComponents/UISpinner';
import TierSection from './components/TierSection';
import { tierNumberById } from 'Pages/Settings/Billing/screens/LifeTimeDealScreen/planTableItems';
import TiersSelectorItemMobile from './components/TiersSelectorItemMobile';
import { AnyObject } from 'final-form';
import FeedbackBadge from './components/FeedbackBadge';

interface LifeTimeDealSelectMobileProps {
  ltdTiers: LtdTier[];
  currentLtd: LtdTier;
  setCurrentLtd: (tier: LtdTier) => void;
  handleSubmit: (values: AnyObject) => void;
  isGettingLtdTiers: boolean;
  isMobile: boolean;
}

const LifeTimeDealSelectMobile = ({
  ltdTiers,
  currentLtd,
  setCurrentLtd,
  handleSubmit,
  isGettingLtdTiers,
  isMobile,
}: LifeTimeDealSelectMobileProps) => {
  const [learnMore, setLearnMore] = useState(false);

  if (isGettingLtdTiers || !currentLtd || !ltdTiers) {
    return (
      <UISpinner
        wrapperClassName="spinner--main__wrapper card-form__spinner"
        width={60}
        height={60}
      />
    );
  }

  return (
    <div className="lifeTimeDeal">
      <div className={classNames('lifeTimeDeal__wrapper mobile')}>
        <div className={classNames('lifeTimeDeal__content-left mobile')}>
          <div className={classNames('label mobile')}>
            <div className="label-title">Select Signaturely Business Plan LTD</div>
          </div>
        </div>
        <div className={classNames('lifeTimeDeal__content mobile')}>
          {!learnMore ? (
            <>
              <div className={classNames('lifeTimeDeal__content-left mobile')}>
                {ltdTiers.map((tier, index) => (
                  <TiersSelectorItemMobile
                    key={index}
                    tier={{ ...tier, tierNumber: tierNumberById[tier.id] }}
                    onClick={(tier: LtdTier) => {
                      setCurrentLtd(tier);
                    }}
                    learnMore={learnMore}
                    setLearnMore={(value: boolean) => {
                      setLearnMore(value);
                    }}
                    isActive={tier.id === currentLtd.id}
                    isGettingLtdTiers={isGettingLtdTiers}
                    handleSubmit={handleSubmit}
                  />
                ))}
              </div>
              <div className="lifeTimeDeal__content-right mobile">
                <FeedbackBadge />
              </div>
            </>
          ) : (
            <TierSection tier={currentLtd} isMobile={isMobile}>
              <Form
                onSubmit={handleSubmit}
                render={({ handleSubmit, submitting }) => (
                  <form className={classNames('credentials mobile')}>
                    <div
                      className={classNames(
                        'credentials__container',
                        'lifeTimeDeal__fields-tier-wrapper',
                        { mobile: isMobile },
                      )}
                    >
                      <div className="credentials-personal__items">
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
                        <UIButton
                          className={classNames(
                            'lifeTimeDeal__common-button__go-to-checkout mobile',
                          )}
                          handleClick={() => {
                            setLearnMore(false);
                            window.scrollTo(0, 0);
                          }}
                          priority="secondary"
                          title="Go Back"
                          disabled={submitting || isGettingLtdTiers}
                          isLoading={isGettingLtdTiers}
                        />
                      </div>
                    </div>
                  </form>
                )}
              />
            </TierSection>
          )}
        </div>
      </div>
    </div>
  );
};

export default LifeTimeDealSelectMobile;

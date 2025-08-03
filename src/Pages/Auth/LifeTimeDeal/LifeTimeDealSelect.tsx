import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FieldTextInput } from 'Components/FormFields';
import { Field, Form } from 'react-final-form';
import { composeValidators, isNotEmpty } from 'Utils/functions';
import { required, email } from 'Utils/validation';
import classNames from 'classnames';
import { LtdTier } from 'Interfaces/Billing';
import Toast from 'Services/Toast';
import History from 'Services/History';
import { useIsMobile, useIsTablet } from 'Hooks/Common';
import { removeEmptyCharacters } from 'Utils/formatters';
import { UnauthorizedRoutePaths } from 'Interfaces/RoutePaths';
import { RouteChildrenProps } from 'react-router-dom';
import UIButton from 'Components/UIComponents/UIButton';
import { useLtdTiersGet } from 'Hooks/Billing';
import UISpinner from 'Components/UIComponents/UISpinner';
import TiersSelectorItem from './components/TiersSelectorItem';
import TierSection from './components/TierSection';
import {
  LtdTiersIds,
  tierNumberById,
} from 'Pages/Settings/Billing/screens/LifeTimeDealScreen/planTableItems';
import LifeTimeDealSelectMobile from './LifeTimeDealSelectMobile';

type tierNumberType = { tierNumber: string };

const LifeTimeDealSelect = ({ location }: RouteChildrenProps<tierNumberType>) => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const [getLtdTiers, isGettingLtdTiers] = useLtdTiersGet();
  const [ltdTiers, setLtdTiers] = useState<LtdTier[]>();
  const [currentLtd, setCurrentLtd] = useState<LtdTier>();

  const initialValues = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    return {
      email: searchParams.get('email') || undefined,
    };
  }, [location.search]);

  const handleSubmit = useCallback(
    async values => {
      const { email } = values;

      if (!currentLtd) return Toast.error('Please select some LTD tier');

      sessionStorage.setItem('ltd_email', email);
      History.push(
        UnauthorizedRoutePaths.LIFE_TIME_DEAL_TIER.replace(
          ':tierNumber',
          String(currentLtd?.tierNumber),
        ),
      );
    },
    [currentLtd],
  );

  const handleGetLtdTiers = useCallback(async () => {
    const response = await getLtdTiers(undefined);

    if (!isNotEmpty(response)) {
      return Toast.error('Something went wrong. Please try again.');
    }

    setLtdTiers(response);
    const firstTier = response.find(tier => tier.id === LtdTiersIds.B_TIER_1);

    if (firstTier) {
      setCurrentLtd({
        ...firstTier,
        tierNumber: tierNumberById[firstTier.id],
      });
    }
  }, [getLtdTiers]);

  useEffect(() => {
    handleGetLtdTiers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isGettingLtdTiers || !currentLtd || !ltdTiers) {
    return (
      <UISpinner
        wrapperClassName="spinner--main__wrapper card-form__spinner"
        width={60}
        height={60}
      />
    );
  }

  return isMobile || isTablet ? (
    <LifeTimeDealSelectMobile
      ltdTiers={ltdTiers}
      currentLtd={currentLtd}
      setCurrentLtd={(tier: LtdTier) => {
        setCurrentLtd(tier);
      }}
      handleSubmit={handleSubmit}
      isGettingLtdTiers={isGettingLtdTiers}
      isMobile={isMobile || isTablet}
    />
  ) : (
    <div className="lifeTimeDeal">
      <div className="lifeTimeDeal__wrapper">
        <div className="lifeTimeDeal__content-left">
          <div className="label">
            <div className="label-title">
              Select Signaturely Business Plan Lifetime Deal Tier
            </div>
          </div>
        </div>
        <div className="lifeTimeDeal__content">
          <div className="lifeTimeDeal__content-left">
            {ltdTiers.map((tier, index) => (
              <TiersSelectorItem
                key={index}
                tier={{ ...tier, tierNumber: tierNumberById[tier.id] }}
                onClick={(tier: LtdTier) => {
                  setCurrentLtd(tier);
                }}
                isActive={tier.id === currentLtd.id}
              />
            ))}
          </div>
          <div className="lifeTimeDeal__divisor" />
          <TierSection tier={currentLtd}>
            <Form
              onSubmit={handleSubmit}
              initialValues={initialValues}
              render={({ handleSubmit, submitting }) => (
                <form className="credentials">
                  <div
                    className={classNames(
                      'credentials__container',
                      'lifeTimeDeal__fields-tier-wrapper',
                    )}
                  >
                    <div className="credentials-personal__items">
                      <div className="credentials-personal-item">
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
                        className="lifeTimeDeal__common-button__go-to-checkout"
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
          </TierSection>
        </div>
      </div>
    </div>
  );
};

export default LifeTimeDealSelect;

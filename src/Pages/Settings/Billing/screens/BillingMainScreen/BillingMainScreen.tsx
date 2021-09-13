import React, { useEffect, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import CardFields from 'Components/CardFields/CardFields';
import {
  AppSumoBillingTable,
  BillingDetails,
  InvoiceTable,
  SubscriptionInfoBlock,
} from '../../components';
import { Form, FormRenderProps } from 'react-final-form';
import UIButton from 'Components/UIComponents/UIButton';
import {
  useUpdateCard,
  useCardGet,
  useCreateCard,
  useInvoicesGet,
  useSubscriptionDataGet,
  usePlansGet,
  usePlanChange,
} from 'Hooks/Billing';
import Toast from 'Services/Toast';
import {
  selectCardFormValues,
  selectCardType,
  selectInvoices,
  selectSubsciptionInfo,
  selectUser,
  selectUserPlan,
} from 'Utils/selectors';
import {
  CardFormValues,
  PlanTypes,
  PlanDurations,
  InvoiceTypes,
} from 'Interfaces/Billing';
import ConfirmModal from 'Components/ConfirmModal';
import { useModal } from 'Hooks/Common';
import { User } from 'Interfaces/User';
import CardForm from 'Components/CardForm';
import SubscriptionInfoBlockMobile from '../../components/SubscriptionInfoBlockMobile';
import classNames from 'classnames';
import useIsMobile from 'Hooks/Common/useIsMobile';

const BillingMainScreen = () => {
  const [getInvoices, isInvoicesLoading] = useInvoicesGet();
  const userPlan = useSelector(selectUserPlan);
  const { appSumoStatus }: User = useSelector(selectUser);
  const [getCard, isGettingCard] = useCardGet();
  const [getPlans] = usePlansGet();
  const [changePlan, isChangingPlan] = usePlanChange();
  const [getSubscriptionData, isGettingSubscriptionData] = useSubscriptionDataGet();
  const subscriptionInfo = useSelector(selectSubsciptionInfo);
  const invoices = useSelector(selectInvoices);
  const cardInitialValues = useSelector(selectCardFormValues);
  const cardType = useSelector(selectCardType);
  const isMobile = useIsMobile();
  const handleSubscriptionDataGet = useCallback(async () => {
    try {
      await getSubscriptionData(undefined);
    } catch (error) {
      Toast.handleErrors(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubscriptionCancel = useCallback(async () => {
    try {
      await changePlan({
        type: PlanTypes.FREE,
        duration: PlanDurations.MONTHLY,
      });
      await handleSubscriptionDataGet();
    } catch (error) {
      Toast.handleErrors(error);
    }
  }, [changePlan, handleSubscriptionDataGet]);

  const handlePlansGet = useCallback(async () => {
    try {
      await getPlans(undefined);
    } catch (error) {
      Toast.handleErrors(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCardGet = useCallback(async () => {
    try {
      await getCard(undefined);
    } catch (error) {
      Toast.handleErrors(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInvoicesGet = useCallback(async () => {
    try {
      await getInvoices(InvoiceTypes.DEFAULT);
    } catch (error) {
      Toast.handleErrors(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [showSubscriptionCancelModal, hideSubscriptionCancelModal] = useModal(
    () => (
      <ConfirmModal
        onClose={hideSubscriptionCancelModal}
        isCancellable
        confirmButtonProps={{
          isLoading: isChangingPlan || isGettingSubscriptionData,
          disabled: isChangingPlan || isGettingSubscriptionData,
          priority: 'primary',
          handleClick: async () => {
            await handleSubscriptionCancel();
            hideSubscriptionCancelModal();
          },
          title: 'Cancel Subscription',
        }}
        onCancel={hideSubscriptionCancelModal}
      >
        <div className="billing__plan-modal">
          <div className="billing__plan-modal-title">Cancel Subscription</div>
          <div className="billing__plan-modal-subtitle">
            Do you want to cancel subscription?
          </div>
        </div>
      </ConfirmModal>
    ),
    [handleSubscriptionCancel, isChangingPlan, isGettingSubscriptionData],
  );

  useEffect(() => {
    handleCardGet();
    handlePlansGet();
    handleInvoicesGet();
    handleSubscriptionDataGet();
  }, [handleCardGet, handleInvoicesGet, handlePlansGet, handleSubscriptionDataGet]);

  return (
    <div className="billing">
      <div className="settings__block">
        <h1 className="settings__title">Card Details</h1>
        <div
          className={classNames('billing__card settings__block--small', {
            mobile: isMobile,
          })}
        >
          <CardForm
            isLoading={isGettingCard}
            cardType={cardType}
            cardInitialValues={cardInitialValues}
          />
        </div>
      </div>
      <div className="settings__block">
        <SubscriptionInfoBlockMobile
          appSumoStatus={appSumoStatus}
          subscriptionInfo={subscriptionInfo}
          plan={userPlan}
        />
      </div>
      {appSumoStatus && (
        <div className="settings__block">
          <AppSumoBillingTable isAlignLeftTitle />
        </div>
      )}
      <div className="settings__block">
        <div className={classNames('billing__details-section', { mobile: isMobile })}>
          <BillingDetails />
        </div>
      </div>
      <div className="settings__block">
        <InvoiceTable invoiceItems={invoices} isLoading={isInvoicesLoading} />
      </div>
      {!appSumoStatus && (
        <div className="settings__block">
          <div className="billing__header">Cancel subscription</div>
          <div className={classNames('billing__details-description', { mobile: true })}>
            <p className="settings__text settings__text--grey">
              If you want to cancel subscription, please do it here.
            </p>
          </div>
          <UIButton
            priority="secondary"
            className="settings__button-cancel"
            title="Cancel subscription"
            handleClick={showSubscriptionCancelModal}
            isLoading={isChangingPlan}
            disabled={userPlan.type === PlanTypes.FREE}
          />
        </div>
      )}
    </div>
  );
};

export default BillingMainScreen;

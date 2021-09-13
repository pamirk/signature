import React, { useCallback, useEffect, useState } from 'react';
import {
  PlanDurations,
  ApiPlan,
  ApiPlanTypes,
  ApiPlanChangePayload,
  CardFormValues,
  InvoiceTypes,
} from 'Interfaces/Billing';
import DurationSwitcher from 'Components/DurationSwitcher';
import {
  apiPlanItems,
  apiPlanPriorityByDuration,
  nonPayedPlansDescription,
} from './constants';
import ApiPlanCard from 'Components/ApiPlanCard';
import {
  BillingDetails,
  InvoiceTable,
  PayModal,
} from 'Pages/Settings/Billing/components';
import {
  useInvoicesGet,
  useCreateCard,
  useCardGet,
  useApiPlanRemove,
} from 'Hooks/Billing';
import { useSelector } from 'react-redux';
import {
  selectApiPlan,
  selectApiSubscriptionInfo,
  selectCardFormValues,
  selectCardType,
  selectInvoices,
} from 'Utils/selectors';
import Toast from 'Services/Toast';
import useApiPlanChange from 'Hooks/Billing/useApiPlanChange';
import ConfirmModal from 'Components/ConfirmModal';
import { useModal } from 'Hooks/Common';
import { HttpStatus } from 'Interfaces/HttpStatusEnum';
import UIButton from 'Components/UIComponents/UIButton';
import CardForm from 'Components/CardForm';
import History from 'Services/History';
import user from 'Store/ducks/user';
import useIsMobile from 'Hooks/Common/useIsMobile';
import Slider from 'Components/Slider';

const ApiPlansSection = () => {
  const isMobile = useIsMobile();
  const [getInvoices, isInvoicesLoading] = useInvoicesGet();
  const [changeApiPlan, isChangePlanLoading] = useApiPlanChange();
  const [createCard, isCreateLoading] = useCreateCard();
  const [getCard, isGettingCard] = useCardGet();
  const [removeApiPLan, isApiPlanRemoving] = useApiPlanRemove();

  const cardType = useSelector(selectCardType);
  const cardInitialValues = useSelector(selectCardFormValues);
  const userApiSubscription = useSelector(selectApiSubscriptionInfo);
  const userApiPlan = useSelector(selectApiPlan);
  const invoices = useSelector(selectInvoices);

  const [selectedPlanDuration, setSelectedPlanDuration] = useState(
    userApiPlan.duration || PlanDurations.MONTHLY,
  );
  const [planToChange, setPlanToUpgrade] = useState<ApiPlan>({
    type: ApiPlanTypes.FREE,
    duration: PlanDurations.MONTHLY,
    title: 'Free',
  });

  const isAppSumo =
    userApiPlan.type === ApiPlanTypes.APPSUMO_FULL ||
    userApiPlan.type === ApiPlanTypes.APPSUMO_STANDARD;

  const isAppSumoOrFree = isAppSumo || userApiPlan.type === ApiPlanTypes.FREE;

  const currentPlanItems = apiPlanItems[selectedPlanDuration];

  const userApiPlanPriority =
    apiPlanPriorityByDuration[userApiPlan.duration][userApiPlan.type];

  const handleInvoicesGet = useCallback(async () => {
    try {
      await getInvoices(InvoiceTypes.API);
    } catch (error) {
      Toast.handleErrors(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRemovePlan = useCallback(async () => {
    try {
      await removeApiPLan(undefined);
      Toast.success('Subscription successfully removed');
    } catch (error) {
      Toast.handleErrors(error);
    }
  }, [removeApiPLan]);

  const handleChangePlan = useCallback(
    async (payload: ApiPlanChangePayload) => {
      try {
        await changeApiPlan(payload);
      } catch (error) {
        Toast.handleErrors(error);
      }
    },
    [changeApiPlan],
  );

  const handlePaySubmit = useCallback(
    async (values: CardFormValues) => {
      try {
        const { type, duration } = planToChange;

        await createCard(values);
        await handleChangePlan({ type, duration });
      } catch (error) {
        Toast.handleErrors(error);
      }
    },
    [createCard, handleChangePlan, planToChange],
  );

  const [showPayModal, hideModal] = useModal(
    () => (
      <PayModal
        onSubmit={handlePaySubmit}
        isLoading={isCreateLoading || isChangePlanLoading}
        plan={planToChange}
        onClose={hideModal}
      />
    ),
    [planToChange, isCreateLoading, cardInitialValues],
  );

  const [showChangeApiPlanModal, hideChangePlanModal] = useModal(
    () => (
      <ConfirmModal
        onClose={hideChangePlanModal}
        isCancellable
        confirmButtonProps={{
          isLoading: isChangePlanLoading,
          disabled: isChangePlanLoading,
          priority: 'primary',
          handleClick: async () => {
            await handleChangePlan({
              type: planToChange.type,
              duration: planToChange.duration,
            });
            hideChangePlanModal();
          },
          title: `${
            userApiPlanPriority >
            apiPlanPriorityByDuration[planToChange.duration][planToChange.type]
              ? 'Downgrade'
              : 'Upgrade'
          } Plan`,
        }}
        onCancel={hideChangePlanModal}
      >
        <div className="billing__plan-modal">
          <div className="billing__plan-modal-title">{`Change plan to ${planToChange.title}`}</div>
          <div className="billing__plan-modal-subtitle">
            Do you want to change your plan to {planToChange.title}?
          </div>
        </div>
      </ConfirmModal>
    ),
    [userApiPlan.type, userApiPlan.duration, planToChange, cardInitialValues],
  );

  const openModal = useCallback(
    async newPlan => {
      setPlanToUpgrade({
        type: newPlan.type,
        duration: newPlan.duration,
        title: newPlan.title,
      });

      if (!cardInitialValues && newPlan.type !== ApiPlanTypes.FREE) {
        showPayModal();
      } else {
        showChangeApiPlanModal();
      }
    },
    [cardInitialValues, showChangeApiPlanModal, showPayModal],
  );

  const handleGetCard = useCallback(async () => {
    try {
      await getCard(undefined);
    } catch (error:any) {
      if (error.statusCode !== HttpStatus.NOT_FOUND) {
        Toast.handleErrors(error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [showSubscriptionCancelModal, hideSubscriptionCancelModal] = useModal(
    () => (
      <ConfirmModal
        onClose={hideSubscriptionCancelModal}
        isCancellable
        confirmButtonProps={{
          isLoading: isApiPlanRemoving,
          disabled: isApiPlanRemoving,
          priority: 'primary',
          handleClick: async () => {
            await handleRemovePlan();
            hideSubscriptionCancelModal();
          },
          title: 'Cancel Subscription',
        }}
        onCancel={hideSubscriptionCancelModal}
      >
        <div className="billing__plan-modal">
          <div className="billing__plan-modal-title">Cancel API Plan</div>
          <div className="billing__plan-modal-subtitle">
            Do you want to cancel API plan?
          </div>
        </div>
      </ConfirmModal>
    ),
    [handleRemovePlan, isApiPlanRemoving],
  );

  useEffect(() => {
    handleInvoicesGet();
    handleGetCard();
  }, [handleGetCard, handleInvoicesGet]);

  return (
    <div className="api-billing">
      <div className={`api-billing__header${isMobile ? '--mobile' : ''}`}>
        <div className="api-billing__title">Choose your Signaturely API plan</div>
        <div className={`api-billing__select-duration${isMobile ? '--mobile' : ''}`}>
          <div className="api-billing__select-duration-item">
            <DurationSwitcher
              text="Monthly"
              isActive={selectedPlanDuration === PlanDurations.MONTHLY}
              onClick={() => setSelectedPlanDuration(PlanDurations.MONTHLY)}
            />
          </div>
          <div className="api-billing__select-duration-item">
            <DurationSwitcher
              text="Annually"
              isActive={selectedPlanDuration === PlanDurations.ANNUALLY}
              discountText="Save 20%"
              onClick={() => setSelectedPlanDuration(PlanDurations.ANNUALLY)}
            />
          </div>
        </div>
      </div>
      <div className="api-billing__plans-container">
        <div className="api-billing__plan-cards-container">
          {!isMobile ? (
            <>
              {currentPlanItems.map(item => {
                const isCurrent =
                  userApiPlanPriority ===
                  apiPlanPriorityByDuration[item.duration][item.type];
                return (
                  <ApiPlanCard
                    key={item.title}
                    item={item}
                    isCurrent={isCurrent}
                    presentRequestUsage={
                      isCurrent || (item.type === ApiPlanTypes.GOLD && isAppSumo)
                    }
                    presentTestRequestUsage={
                      isCurrent || (item.type === ApiPlanTypes.GOLD && isAppSumoOrFree)
                    }
                    presentTemplateUsage={
                      isCurrent || (item.type === ApiPlanTypes.GOLD && isAppSumoOrFree)
                    }
                    onUpgrade={() => openModal(item)}
                    buttonText={`${
                      userApiPlanPriority >
                      apiPlanPriorityByDuration[item.duration][item.type]
                        ? 'Select'
                        : 'Upgrade'
                    }`}
                    testRequestsMonthlyUsed={userApiSubscription?.testRequestsMonthlyUsed}
                    requestsUsed={userApiSubscription?.requestsMonthlyUsed}
                    templatesUsed={userApiSubscription?.templatesCount}
                  />
                );
              })}
            </>
          ) : (
            <Slider>
              {currentPlanItems.map(item => {
                const isCurrent =
                  userApiPlanPriority ===
                  apiPlanPriorityByDuration[item.duration][item.type];
                return (
                  <ApiPlanCard
                    key={item.title}
                    item={item}
                    isCurrent={isCurrent}
                    presentRequestUsage={
                      isCurrent || (item.type === ApiPlanTypes.GOLD && isAppSumo)
                    }
                    presentTestRequestUsage={
                      isCurrent || (item.type === ApiPlanTypes.GOLD && isAppSumoOrFree)
                    }
                    presentTemplateUsage={
                      isCurrent || (item.type === ApiPlanTypes.GOLD && isAppSumoOrFree)
                    }
                    onUpgrade={() => openModal(item)}
                    buttonText={`${
                      userApiPlanPriority >
                      apiPlanPriorityByDuration[item.duration][item.type]
                        ? 'Select'
                        : 'Upgrade'
                    }`}
                    testRequestsMonthlyUsed={userApiSubscription?.testRequestsMonthlyUsed}
                    requestsUsed={userApiSubscription?.requestsMonthlyUsed}
                    templatesUsed={userApiSubscription?.templatesCount}
                  />
                );
              })}
            </Slider>
          )}
        </div>
        {isAppSumoOrFree && (
          <div className="api-billing__extra-plan">
            <div className="api-billing__extra-plan-text">
              <h2 className="api-billing__extra-plan-title">
                You are currently in the {userApiPlan.name} plan
              </h2>
              <div className="settings__text settings__text--grey">
                {nonPayedPlansDescription[userApiPlan.type]}
              </div>
            </div>
            {isAppSumo && (
              <UIButton
                priority="primary"
                className="api-billing__extra-plan-button"
                handleClick={() => {
                  History.push('/settings/billing');
                }}
                title="View AppSumo Plan"
              />
            )}
          </div>
        )}
      </div>
      <div className="api-billing__details">
        <div
          className={`billing__card settings__block--small${isMobile ? ' mobile' : ''}`}
        >
          <h1 className="settings__title">Card Details</h1>
          <CardForm
            isLoading={isGettingCard}
            cardType={cardType}
            cardInitialValues={cardInitialValues}
            extraButtonRenderProps={() => (
              <UIButton
                priority="secondary"
                handleClick={showSubscriptionCancelModal}
                title="Cancel Plan"
                disabled={userApiPlan.type === ApiPlanTypes.FREE || isApiPlanRemoving}
                isLoading={isApiPlanRemoving}
              />
            )}
          />
        </div>
        <BillingDetails />
      </div>
      <InvoiceTable invoiceItems={invoices} isLoading={isInvoicesLoading} />
    </div>
  );
};

export default ApiPlansSection;

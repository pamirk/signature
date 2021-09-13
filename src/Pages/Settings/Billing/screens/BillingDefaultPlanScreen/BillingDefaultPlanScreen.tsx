import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useSelector} from 'react-redux';
import {ReactSVG} from 'react-svg';
import Toggler from 'react-toggle';
import 'react-toggle/style.css';
import Toast from 'Services/Toast';
import {DataLayerAnalytics, FacebookPixel} from 'Services/Integrations';
import {useModal} from 'Hooks/Common';
import {useCardGet, useCreateCard, usePlanChange} from 'Hooks/Billing';
import {selectCardFormValues, selectIsCompanyRedirect, selectUser, selectUserPlan,} from 'Utils/selectors';
import {CardFormValues, Plan, PlanChangePayload, PlanDurations, PlanTypes,} from 'Interfaces/Billing';
import {HttpStatus} from 'Interfaces/HttpStatusEnum';
import {
    headerItems,
    planAnnuallyInformationItems,
    PlanFieldTypes,
    planMonthlyInformationItems,
} from './planTableItems';

import UIButton from 'Components/UIComponents/UIButton';
import ConfirmModal from 'Components/ConfirmModal';
import {BillingPlansSlider, PayModal} from '../../components';
import ArrowCircleIcon from 'Assets/images/icons/arrow-circle.svg';
import PaymentSurveyModal from '../../components/modals/PaymentSurveyModal';
import {User} from 'Interfaces/User';
import useIsMobile from 'Hooks/Common/useIsMobile';
import BillingPlanTableMobileView from '../../components/BillingPlanTableMobileView';

const renderCell = (type: PlanFieldTypes, value: string | boolean) =>
    type === PlanFieldTypes.BOOLEAN && value ? (
        <ReactSVG src={ArrowCircleIcon} className="billing__table-icon"/>
    ) : (
        value
    );

export const planPriorityByDuration = {
    [PlanDurations.MONTHLY]: {
        [PlanTypes.FREE]: 0,
        [PlanTypes.PERSONAL]: 1,
        [PlanTypes.BUSINESS]: 2,
    },
    [PlanDurations.ANNUALLY]: {
        [PlanTypes.FREE]: 0,
        [PlanTypes.PERSONAL]: 3,
        [PlanTypes.BUSINESS]: 4,
    },
};

const BillingDefaultPlanScreen = () => {
    const user: User = useSelector(selectUser);
    const userPlan = useSelector(selectUserPlan);
    const [selectedPlanDuration, setSelectedPlanDuration] = useState(
        userPlan.duration || PlanDurations.MONTHLY,
    );
    const [planToChange, setPlanToUpgrade] = useState<Plan>({
        type: PlanTypes.FREE,
        duration: PlanDurations.MONTHLY,
        title: 'Free',
    });

    const planInformationItems =
        selectedPlanDuration === PlanDurations.MONTHLY
            ? planMonthlyInformationItems
            : planAnnuallyInformationItems;

    const currentHeaderItems = useMemo(() => headerItems[selectedPlanDuration], [
        selectedPlanDuration,
    ]);
    const userPlanPriority = useMemo(
        () => planPriorityByDuration[userPlan.duration][userPlan.type],
        [userPlan],
    );
    const isFromCompany = useSelector(selectIsCompanyRedirect);
    const [changePlan, isChangePlanLoading] = usePlanChange();
    const [createCard, isCreateLoading] = useCreateCard();
    const [getCard] = useCardGet();
    const cardInitialValues = useSelector(selectCardFormValues);

    const isMobile = useIsMobile();

    const [currentDisplayedPlan, setCurrentDisplayedPlan] = useState<PlanTypes>(
        userPlan.type,
    );

    const handleChangePlan = useCallback(
        async (payload: PlanChangePayload) => {
            try {
                await changePlan(payload);

                if (payload.type !== PlanTypes.FREE) {
                    FacebookPixel.firePlanChangeEvent(payload);
                }

                DataLayerAnalytics.firePlanChangeEvent(payload);
                Toast.success('Plan has been successfully changed.');
            } catch (error) {
                Toast.handleErrors(error);
            }
        },
        [changePlan],
    );

    const handleSubmitPaymentSurvey = (paymentSurveyAnswer: string | undefined) => {
        handleChangePlan({
            ... planToChange,
            paymentSurveyAnswer,
        });
    };

    const [openPaymentSurveyModal, closePaymentSurveyModal] = useModal(
        () => (
            <PaymentSurveyModal
                onClose={() => {
                    closePaymentSurveyModal();
                    handleChangePlan(planToChange);
                }}
                onSubmit={paymentSurveyAnswer => {
                    handleSubmitPaymentSurvey(paymentSurveyAnswer);
                    closePaymentSurveyModal();
                }}
                isLoading={isChangePlanLoading}
            />
        ),
        [planToChange, isChangePlanLoading],
    );

    const handleClickChangePlan = useCallback(
        async (payload: PlanChangePayload) => {
            setPlanToUpgrade({
                type: payload.type,
                duration: payload.duration,
                title: payload.type,
            });
            if (payload.type !== PlanTypes.FREE && !user.paymentSurveyAnswer) {
                openPaymentSurveyModal();
            } else {
                await handleChangePlan(payload);
            }
        },
        [handleChangePlan, openPaymentSurveyModal, user.paymentSurveyAnswer],
    );

    const handlePaySubmit = useCallback(
        async (values: CardFormValues) => {
            try {
                const {type, duration} = planToChange;

                await createCard(values);
                await handleClickChangePlan({type, duration});
            } catch (error) {
                Toast.handleErrors(error);
            }
        },
        [createCard, handleClickChangePlan, planToChange],
    );

    const handlePlanDurationChange = useCallback(event => {
        setSelectedPlanDuration(
            event.target.checked ? PlanDurations.ANNUALLY : PlanDurations.MONTHLY,
        );
    }, []);

    const [showPayModal, hideModal] = useModal(
        () => (
            <PayModal
                onSubmit={handlePaySubmit}
                isLoading={isCreateLoading || isChangePlanLoading}
                plan={planToChange}
                onClose={hideModal}
            />
        ),
        [planToChange, isFromCompany, isCreateLoading, cardInitialValues],
    );

    const [showChangePlanModal, hideChangePlanModal] = useModal(
        () => (
            <ConfirmModal
                onClose={hideChangePlanModal}
                isCancellable
                confirmButtonProps={{
                    isLoading: isChangePlanLoading,
                    disabled: isChangePlanLoading,
                    priority: 'primary',
                    handleClick: async () => {
                        await handleClickChangePlan({
                            type: planToChange.type,
                            duration: planToChange.duration,
                        });
                        hideChangePlanModal();
                    },
                    title: `${
                        userPlanPriority >
                        planPriorityByDuration[planToChange.duration][planToChange.type]
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
        [userPlan.type, userPlan.duration, planToChange, cardInitialValues],
    );

    const openModal = useCallback(
        async newPlan => {
            setPlanToUpgrade({
                type: newPlan.type,
                duration: newPlan.duration,
                title: newPlan.title,
            });

            if (!cardInitialValues && newPlan.type !== PlanTypes.FREE) {
                showPayModal();
            } else {
                showChangePlanModal();
            }
        },
        [cardInitialValues, showChangePlanModal, showPayModal],
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

    useEffect(() => {
        handleGetCard();
    }, [handleGetCard]);

    return (
        <div className="billing__plan-page">
            <div className="billing__switch-container">
                <div className="billing__switch">
                    <span className="billing__switch-item billing__switch-text">Monthly</span>
                    <Toggler
                        className="billing__switch-item"
                        icons={false}
                        checked={selectedPlanDuration === PlanDurations.ANNUALLY}
                        onChange={handlePlanDurationChange}
                    />
                    <span className="billing__switch-item billing__switch-text">Annually</span>
                </div>
                <div className="billing__discount">Save 20%</div>
            </div>
            {!isMobile ? (
                <div className="billing__info-table">
                    <div className="table">
                        <div className="table__container">
                            <div className="table__innerContainer">
                                <div className="table__row billing__table-row">
                                    <div
                                        className="billing__table-column billing__table-column--header billing__table-column--name"></div>
                                    {currentHeaderItems.map(headerItem => (
                                        <div
                                            key={headerItem.type}
                                            className="billing__table-column billing__table-column--header"
                                        >
                                            <div className="billing__table-title">{headerItem.header}</div>
                                            <div className="billing__table--description">
                                                {headerItem.description}
                                            </div>
                                            {userPlanPriority ===
                                            planPriorityByDuration[headerItem.duration][headerItem.type] ? (
                                                <div className="billing__current-plan">Current Plan</div>
                                            ) : (
                                                <div className="billing__table-button">
                                                    <UIButton
                                                        title={`${
                                                            userPlanPriority >
                                                            planPriorityByDuration[headerItem.duration][headerItem.type]
                                                                ? 'Select'
                                                                : 'Upgrade'
                                                        }`}
                                                        handleClick={() => {
                                                            openModal(headerItem);
                                                        }}
                                                        priority="primary"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div
                                className="billing__plan-info table__row billing__table-row--borderless settings__text settings__text--bold settings__text--default-size">
                                Plan Information
                            </div>
                            {planInformationItems.map(item => (
                                <div key={item.name} className="billing__table-row table__row">
                                    <div className="billing__table-column billing__table-column--name">
                                        {item.name}
                                    </div>
                                    <div className="billing__table-column billing__table-column">
                                        {renderCell(item.type, item.freeValue)}
                                    </div>
                                    <div className="billing__table-column billing__table-column">
                                        {renderCell(item.type, item.personalValue)}
                                    </div>
                                    <div className="billing__table-column billing__table-column">
                                        {renderCell(item.type, item.businessValue)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <BillingPlansSlider
                        items={currentHeaderItems}
                        userPlanPriority={userPlanPriority}
                        planPriorityByDuration={planPriorityByDuration}
                        openModal={openModal}
                        currentDisplayedPlan={currentDisplayedPlan}
                        handleChangeCurrentPlan={planType => setCurrentDisplayedPlan(planType)}
                    />
                    <div className="billing__info-table">
                        <div className="table">
                            <div className="table__container">
                                <BillingPlanTableMobileView
                                    planInformationItems={planInformationItems}
                                    currentDisplayedPlan={currentDisplayedPlan}
                                    renderCell={renderCell}
                                />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default BillingDefaultPlanScreen;

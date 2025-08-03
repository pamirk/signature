import UIButton from 'Components/UIComponents/UIButton';
import UIRadioBtn from 'Components/UIComponents/UIRadioBtn';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Field, Form } from 'react-final-form';
import {
  EmailRecipientsArray,
  FieldCheckbox,
  FieldTextInput,
} from 'Components/FormFields';
import SignersArray from 'Components/FormFields/SignersArray';
import { FieldArray } from 'react-final-form-arrays';
import { composeValidators } from 'Utils/functions';
import { email, notOnlySpaces, required } from 'Utils/validation';
import {
  DocumentTypes,
  DocumentValues,
  SignAction,
  Document,
  SignActionLabel,
  InteractExtraValues,
} from 'Interfaces/Document';
import { User } from 'Interfaces/User';
import arrayMutators from 'final-form-arrays';
import TooltipBlock, { ContentPosition } from 'Components/Tooltip/TooltipBlock';
import { useDocumentFieldDelete } from 'Hooks/DocumentFields';
import { useSelector } from 'react-redux';
import { selectUser } from 'Utils/selectors';

interface SelectActionProps {
  initialValues?: DocumentValues;
  onSubmit: (values: any) => void;
  currentDocument?: Document;
  setCurrentDocumentType: (SignAction) => void;
  isLoading?: boolean;
  isChooseActionDisabled?: boolean;
}

function getSignType(action: SignAction) {
  switch (action) {
    case SignAction.SignDocument:
      return DocumentTypes.ME;
    case SignAction.SignAndSend:
      return DocumentTypes.ME_AND_OTHER;
    case SignAction.Send:
      return DocumentTypes.OTHERS;
  }
}

function getActionType(type: DocumentTypes) {
  switch (type) {
    case DocumentTypes.ME:
      return SignAction.SignDocument;
    case DocumentTypes.ME_AND_OTHER:
      return SignAction.SignAndSend;
    case DocumentTypes.OTHERS:
      return SignAction.Send;
  }
}

const SelectActionForm = ({
  initialValues,
  onSubmit,
  currentDocument,
  setCurrentDocumentType,
  isLoading,
  isChooseActionDisabled,
}: SelectActionProps) => {
  const tooltipRef = useRef<HTMLDivElement>();
  const deleteDocumentField = useDocumentFieldDelete();
  const [selectedAction, setSelectedAction] = useState<SignAction>(
    (currentDocument && getActionType(currentDocument.type)) ||
      (initialValues && getActionType(initialValues.type)) ||
      SignAction.SignDocument,
  );
  const user: User = useSelector(selectUser);
  const [extraValues, setExtraValues] = useState(initialValues);

  const handleRadioButtonClick = (action: SignAction) => {
    setCurrentDocumentType(getSignType(action));
    setSelectedAction(action);
  };

  const handleSubmit = (values: any) => {
    const type = getSignType(selectedAction);
    const hasOtherSigners =
      type === DocumentTypes.ME &&
      currentDocument?.signers.find(signer => !signer.isPreparer);

    if (!hasOtherSigners) {
      onSubmit({
        ...values,
        type: type,
      });
    }

    if (hasOtherSigners && window.confirm('All changes will be lost')) {
      currentDocument?.fields.forEach(field => deleteDocumentField(field));
      onSubmit({
        ...values,
        type: type,
        signers: [currentDocument?.signers.find(signer => signer.isPreparer)],
        recipients: values.recipients,
      });
    }
  };

  const firstSignerIndex = useMemo(() => {
    const signersOrders = initialValues?.signers
      ?.map(signer => signer?.order)
      .filter(order => order !== undefined) as Array<number>;
    const minimalOrder = signersOrders.reduce((prev, curr) =>
      prev > curr ? curr : prev,
    );
    const signerIndex = initialValues?.signers?.findIndex(
      signer => signer?.order === minimalOrder,
    );
    return signerIndex && signerIndex !== -1 ? signerIndex : 0;
  }, [initialValues]);

  const handleMouseEnter = useCallback(event => {
    if (tooltipRef.current) {
      const { target } = event;
      const parent = document.getElementsByClassName('interactModal__fieldBar-wrapper');
      const label = event.target.innerText;

      switch (label) {
        case SignActionLabel.SIGN_DOCUMENT:
          tooltipRef.current.innerText = 'Sign a document yourself';
          break;
        case SignActionLabel.SIGN_AND_SEND:
          tooltipRef.current.innerText = 'Sign a document and send to others to sign';
          break;
        case SignActionLabel.SEND:
          tooltipRef.current.innerText = 'Send a document for others to sign';
      }

      tooltipRef.current.style.display = 'initial';
      tooltipRef.current.style.top = `${target.offsetTop - parent[0].scrollTop - 15}px`;
      tooltipRef.current.style.left = `${target.offsetLeft + target.clientWidth}px`;
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (tooltipRef.current) {
      tooltipRef.current.style.display = 'none';
    }
  }, []);

  const handleSetExtraValues = useCallback(
    (values: InteractExtraValues) => {
      if (extraValues && values.signers) {
        setExtraValues({
          ...extraValues,
          signers: values.signers,
          isOrdered: values.isOrdered,
        });
      }

      if (extraValues && values.recipients) {
        setExtraValues({
          ...extraValues,
          recipients: values.recipients,
        });
      }

      if (extraValues && !values.signers && values.isOrdered !== undefined) {
        setExtraValues({
          ...extraValues,
          isOrdered: values.isOrdered,
        });
      }
    },
    [extraValues],
  );

  return (
    <div className="wizardSignForm__mainWrap">
      <div className="wizardSignForm__innerContainer">
        <div className="wizardSignForm__title">Choose an action</div>
        <div className="wizardSignForm__radioGroup">
          <UIRadioBtn
            label={SignActionLabel.SIGN_DOCUMENT}
            handleCheck={() => handleRadioButtonClick(SignAction.SignDocument)}
            isChecked={selectedAction === SignAction.SignDocument}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            isDisabled={isChooseActionDisabled}
          />
          <UIRadioBtn
            label={SignActionLabel.SIGN_AND_SEND}
            handleCheck={() => handleRadioButtonClick(SignAction.SignAndSend)}
            isChecked={selectedAction === SignAction.SignAndSend}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            isDisabled={isChooseActionDisabled}
          />
          <UIRadioBtn
            label={SignActionLabel.SEND}
            handleCheck={() => handleRadioButtonClick(SignAction.Send)}
            isChecked={selectedAction === SignAction.Send}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            isDisabled={isChooseActionDisabled}
          />
          <TooltipBlock contentPosition={ContentPosition.RIGHT} ref={tooltipRef}>
            Send a document for others to sign
          </TooltipBlock>
        </div>
      </div>

      {selectedAction === SignAction.SignDocument && (
        <Form
          initialValues={{ ...extraValues, signers: initialValues?.signers }}
          onSubmit={handleSubmit}
          mutators={{ ...arrayMutators }}
          render={({ handleSubmit }) => (
            <form className="wizardSignForm__form" onSubmit={handleSubmit}>
              <div className="signTemplate__emailField">
                <p className="signTemplate__emailField-title">Add Viewers</p>
                <FieldArray
                  name="recipients"
                  label={null}
                  component={EmailRecipientsArray}
                  isItemsDeletable
                  handleSetRecipientsValues={handleSetExtraValues}
                />
              </div>
              <UIButton
                priority="primary"
                title="Continue"
                handleClick={handleSubmit}
                isLoading={isLoading}
                disabled={isLoading}
              />
            </form>
          )}
        />
      )}
      {selectedAction === SignAction.SignAndSend && (
        <Form
          initialValues={extraValues}
          onSubmit={handleSubmit}
          mutators={{ ...arrayMutators }}
          render={({ handleSubmit, hasValidationErrors, submitting, values }) => (
            <form className="wizardSignForm__form" onSubmit={handleSubmit}>
              <div className="wizardSignForm__emailField">
                <p className="wizardSignForm__emailField-title">Signers</p>
                <div className="signers__item vertical signers__item-inner signers__item--me">
                  <Field
                    name={`signers[${firstSignerIndex}].name`}
                    label="Me"
                    component={FieldTextInput}
                    format={value => (value ? `Me (${user.name})` : 'Me')}
                    disabled
                  />
                  <Field
                    name={`signers[${firstSignerIndex}].email`}
                    component={FieldTextInput}
                    disabled
                  />
                </div>
              </div>
              <p className="wizardSignForm__emailField-title">Add Other Signers</p>
              <div className="wizardSignForm__signersContainer">
                <FieldArray
                  name="signers"
                  render={props => (
                    <SignersArray
                      {...props}
                      isAdditionDisabled={isChooseActionDisabled}
                      isRemoveDisabled={isChooseActionDisabled}
                      isItemDeletablePredicate={({ fields }) =>
                        !!fields.length && fields.length > 2
                      }
                      handleSetSignersValues={handleSetExtraValues}
                      renderFields={name => (
                        <div className="wizardSignForm__signerItem">
                          <Field
                            name={`${name}.name`}
                            placeholder="Name"
                            component={FieldTextInput}
                            validate={composeValidators<string>(required, notOnlySpaces)}
                            disabled={isChooseActionDisabled}
                          />
                          <Field
                            name={`${name}.email`}
                            placeholder="Email"
                            component={FieldTextInput}
                            validate={composeValidators<string>(required, email)}
                            disabled={isChooseActionDisabled}
                          />
                        </div>
                      )}
                    />
                  )}
                  isOrdered={values.isOrdered}
                />
              </div>
              <div className="wizardSignForm__emailField-isOrdered">
                <Field
                  name="isOrdered"
                  label="Custom signing order"
                  render={FieldCheckbox}
                  onClick={handleSetExtraValues}
                />
              </div>
              <div className="signTemplate__emailField">
                <p className="signTemplate__emailField-title">Add Viewers</p>
                <FieldArray
                  name="recipients"
                  label={null}
                  component={EmailRecipientsArray}
                  isItemsDeletable
                  handleSetRecipientsValues={handleSetExtraValues}
                />
              </div>
              <UIButton
                priority="primary"
                title="Continue"
                type="submit"
                isLoading={isLoading}
                disabled={
                  values.signers.length < 2 ||
                  hasValidationErrors ||
                  submitting ||
                  isLoading
                }
              />
            </form>
          )}
        />
      )}
      {selectedAction === SignAction.Send && (
        <Form
          initialValues={extraValues}
          onSubmit={handleSubmit}
          mutators={{ ...arrayMutators }}
          render={({ handleSubmit, hasValidationErrors, submitting, values }) => (
            <form className="wizardSignForm__form" onSubmit={handleSubmit}>
              <p className="wizardSignForm__emailField-title">Choose Signers</p>
              <div className="wizardSignForm__signersContainer">
                <FieldArray
                  name="signers"
                  render={props => (
                    <SignersArray
                      {...props}
                      isAdditionDisabled={isChooseActionDisabled}
                      isRemoveDisabled={isChooseActionDisabled}
                      isOrderedDisabled={isChooseActionDisabled}
                      isItemDeletablePredicate={({ fields }) =>
                        !!fields.length && fields.length > 2
                      }
                      handleSetSignersValues={handleSetExtraValues}
                      renderFields={name => (
                        <div className="wizardSignForm__signerItem">
                          <Field
                            name={`${name}.name`}
                            placeholder="Name"
                            component={FieldTextInput}
                            validate={composeValidators<string>(required, notOnlySpaces)}
                            disabled={isChooseActionDisabled}
                          />
                          <Field
                            name={`${name}.email`}
                            placeholder="Email"
                            component={FieldTextInput}
                            validate={composeValidators<string>(required, email)}
                            disabled={isChooseActionDisabled}
                          />
                        </div>
                      )}
                    />
                  )}
                  isOrdered={values.isOrdered}
                />
              </div>
              <div className="wizardSignForm__emailField-isOrdered">
                <Field
                  name="isOrdered"
                  label="Custom signing order"
                  render={FieldCheckbox}
                  disabled={isChooseActionDisabled}
                  onClick={handleSetExtraValues}
                />
              </div>
              <div className="signTemplate__emailField">
                <p className="signTemplate__emailField-title">Add Viewers</p>
                <FieldArray
                  name="recipients"
                  label={null}
                  component={EmailRecipientsArray}
                  isItemsDeletable
                  handleSetRecipientsValues={handleSetExtraValues}
                />
              </div>
              <UIButton
                priority="primary"
                title="Continue"
                type="submit"
                isLoading={isLoading}
                disabled={
                  values.signers.length < 2 ||
                  hasValidationErrors ||
                  submitting ||
                  isLoading
                }
              />
            </form>
          )}
        />
      )}
    </div>
  );
};

export default SelectActionForm;

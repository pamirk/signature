import React, { useCallback } from 'react';
import { ReactSVG } from 'react-svg';
import uuid from 'uuid/v4';
import { fontFamilyByValue } from 'Services/Fonts';
import Toast from 'Services/Toast';
import {
  Requisite,
  RequisiteSiblings,
  RequisiteType,
  RequisiteValueType,
  RequisitesPayload,
} from 'Interfaces/Requisite';
import { useToggler } from 'Hooks/Common';
import { useRequisitesCreate, useRequisitesPayloadCreation } from 'Hooks/Requisite';
import UICheckbox from 'Components/UIComponents/UICheckbox';
import UIButton from 'Components/UIComponents/UIButton';

import CloseIcon from 'Assets/images/icons/close-icon.svg';

const textFontSize = 300;

interface RequisiteAutoGenModalProps {
  onClose: () => void;
  requisiteValue: string;
  siblingRequisiteValue: string;
  title?: string;
  fontFamilyType?: string;
  requisiteType?: RequisiteType;
  onSuccessfulSubmit?: (requisite: Requisite) => void;
  onClickCustomCreate: () => void;
  onChangeValue: (value: string) => void;
}

function RequisiteAutoGenModal({
  requisiteValue,
  siblingRequisiteValue,
  requisiteType = RequisiteType.SIGN,
  onClose,
  title,
  onSuccessfulSubmit,
  onClickCustomCreate,
  onChangeValue,
  fontFamilyType = 'dancingScript',
}: RequisiteAutoGenModalProps) {
  const [isTermsAccepted, toggleTermsAccepted] = useToggler(false);
  const [createRequisites, isRequisitesCreating] = useRequisitesCreate();

  const [createRequisitesPayload, isPayloadCreating] = useRequisitesPayloadCreation({
    fontStyle: { textFontSize, fontFamilyType },
    requisiteValueType: RequisiteValueType.TEXT,
  });

  const isLoading = isRequisitesCreating || isPayloadCreating;

  const handleRequisitesCreate = useCallback(
    async (requisitesPayload: RequisitesPayload) => {
      try {
        const requisites = (await createRequisites(requisitesPayload)) as [
          Requisite,
          Requisite,
        ];
        Toast.success(
          `${
            requisiteType === RequisiteType.SIGN ? 'Signature' : 'Initial'
          } created successfully`,
        );
        return requisites;
      } catch (err) {
        Toast.handleErrors(err);
      }
    },
    [createRequisites, requisiteType],
  );

  const handleSubmit = useCallback(async () => {
    try {
      const id: Requisite['id'] = uuid();
      const siblingId: Requisite['id'] = uuid();

      const requisitesPayload = await createRequisitesPayload([
        {
          id,
          siblingId,
          type: requisiteType,
          value: requisiteValue,
        },
        {
          id: siblingId,
          siblingId: id,
          type:
            requisiteType === RequisiteType.SIGN
              ? RequisiteType.INITIAL
              : RequisiteType.SIGN,
          value: siblingRequisiteValue,
        },
      ]);

      if (!requisitesPayload) return;

      const resultRequisites = (await handleRequisitesCreate(
        requisitesPayload as RequisitesPayload,
      )) as RequisiteSiblings;

      if (resultRequisites) {
        const currentRequisite = resultRequisites.find(r => r.id === id) as Requisite;
        onSuccessfulSubmit && onSuccessfulSubmit(currentRequisite);
        onClose();
      }
    } catch (error) {
      Toast.handleErrors(error);
    }
  }, [
    createRequisitesPayload,
    handleRequisitesCreate,
    onClose,
    onSuccessfulSubmit,
    requisiteType,
    siblingRequisiteValue,
    requisiteValue,
  ]);

  return (
    <div className="requisiteModal">
      <div className="requisiteModal__inner">
        <div className="requisiteModal__header">
          <p className="requisiteModal__title">{title}</p>
          <ReactSVG
            src={CloseIcon}
            className="requisiteModal__header-icon"
            onClick={onClose}
          />
        </div>
        <div className="requisiteModal__content">
          <div>
            <div className="requisiteModal__area requisiteModal__area--type">
              <input
                type="text"
                className="requisiteModal__type-input"
                value={requisiteValue}
                style={{
                  fontFamily: fontFamilyByValue[fontFamilyType],
                }}
                onChange={e => onChangeValue(e.target.value)}
              />
            </div>
            <p className="requisiteModal__custom-signature">
              Need a custom signature?
              <span onClick={() => onClickCustomCreate()}> Create it now! </span>
            </p>
          </div>
        </div>
      </div>
      <footer className="requisiteModal__footer">
        <UICheckbox handleClick={toggleTermsAccepted} check={isTermsAccepted}>
          I agree to sign electronically pursuant to the&nbsp;
          <a
            className="requisiteModal__footer__link"
            href="https://signaturely.com/electronic-signature-disclosure-and-consent"
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
          >
            Electronic Signature Disclosure
          </a>
          .
        </UICheckbox>
        <UIButton
          priority="primary"
          title={'Sign Now'}
          isLoading={isLoading}
          disabled={isLoading || !isTermsAccepted}
          handleClick={handleSubmit}
        />
      </footer>
    </div>
  );
}

export default RequisiteAutoGenModal;

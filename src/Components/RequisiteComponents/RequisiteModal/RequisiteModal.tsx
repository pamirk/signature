import React, { useState, useCallback, useMemo } from 'react';
import { ReactSVG } from 'react-svg';
import SignaturePad from 'signature_pad';
import uuid from 'uuid/v4';
import Toast from 'Services/Toast';
import {
  Requisite,
  RequisiteValueType,
  RequisiteType,
  RequisiteSiblingValues,
  defaultRequisiteTypesOrder,
  RequisitesPayload,
  RequisiteSiblings,
} from 'Interfaces/Requisite';
import {
  useRequisitesUpdate,
  useRequisitesCreate,
  useRequisitesPayloadCreation,
} from 'Hooks/Requisite';
import { useToggler } from 'Hooks/Common';
import { useRequisitePayloadGet } from 'Hooks/Requisite';

import RequisiteTabItem from '../RequisiteTabItem';
import UIButton from 'Components/UIComponents/UIButton';
import UICheckbox from 'Components/UIComponents/UICheckbox';
import {
  RequisiteModalText,
  RequisiteModalDraw,
  RequisiteModalUpload,
} from './components';

import CloseIcon from 'Assets/images/icons/close-icon.svg';
import useIsMobile from 'Hooks/Common/useIsMobile';
import classNames from 'classnames';
import FileResizer from 'react-image-file-resizer';

interface RequisiteModalProps {
  requisiteItem?: Requisite;
  siblingRequisiteItem?: Requisite;
  availableSignatureTypes?: RequisiteValueType[];
  onClose: () => void;
  title?: string;
  buttonText?: string;
  requisiteType?: RequisiteType;
  defaultValues?: RequisiteSiblingValues;
  defaultFontFamilyType?: string;
  onSuccessfulSubmit?: (requisite: Requisite) => void;
}

const maxFileSize = 41943040;
const textFontSize = 300;

function RequisiteModal({
  onClose,
  requisiteItem,
  siblingRequisiteItem,
  title,
  onSuccessfulSubmit,
  buttonText = 'Create Signature',
  requisiteType = requisiteItem?.type || RequisiteType.SIGN,
  defaultValues = {
    signatureValue: '',
    initialsValue: '',
  },
  defaultFontFamilyType = 'dancingScript',
  availableSignatureTypes = defaultRequisiteTypesOrder,
}: RequisiteModalProps) {
  const [activeTab, setActiveTab] = useState<RequisiteValueType>(
    requisiteItem?.valueType || availableSignatureTypes[0],
  );
  const isMobile = useIsMobile();

  const [fontFamilyType, setFontFamilyType] = useState<string>(
    requisiteItem?.fontFamily || defaultFontFamilyType,
  );

  const [signRequisite, initialRequisite] = useMemo(() => {
    return requisiteItem?.type === RequisiteType.SIGN
      ? [requisiteItem, siblingRequisiteItem]
      : [siblingRequisiteItem, requisiteItem];
  }, [requisiteItem, siblingRequisiteItem]);

  const [updateRequisites, isRequisiteUploading] = useRequisitesUpdate();
  const [createRequisites, isRequisitesCreating] = useRequisitesCreate();

  const [
    canvasSignRef,
    [imageSignFile, setImageSignFile],
    [drawnSignFile],
    [requisiteSignValue, setRequisiteSignValue],
    isSignDownloading,
  ] = useRequisitePayloadGet({
    requisite: signRequisite,
    defaultValue: defaultValues.signatureValue,
    requisiteValueType: activeTab,
  });
  const [
    canvasInitialRef,
    [imageInitialFile, setImageInitialFile],
    [drawnInitialFile],
    [requisiteInitialValue, setRequisiteInitialValue],
    isInitialDownloading,
  ] = useRequisitePayloadGet({
    requisite: initialRequisite,
    defaultValue: defaultValues.initialsValue,
    requisiteValueType: activeTab,
  });

  const [isTermsAccepted, toggleTermsAccepted] = useToggler(false);

  const [createRequisitesPayload, isPayloadCreating] = useRequisitesPayloadCreation({
    fontStyle: { textFontSize, fontFamilyType },
    requisiteValueType: activeTab,
  });

  const isLoading =
    isRequisiteUploading ||
    isSignDownloading ||
    isInitialDownloading ||
    isRequisitesCreating ||
    isPayloadCreating;

  const checkIsTabContentEmpty = useCallback(() => {
    switch (activeTab) {
      case RequisiteValueType.TEXT:
        if (
          requisiteSignValue &&
          requisiteSignValue !== '' &&
          requisiteInitialValue &&
          requisiteInitialValue !== ''
        ) {
          return false;
        }
        break;
      case RequisiteValueType.DRAW:
        if (drawnSignFile && drawnInitialFile) {
          return false;
        }
        break;
      case RequisiteValueType.UPLOAD:
        if (imageSignFile && imageInitialFile) {
          return false;
        }
        break;
      default:
        return true;
    }
    return true;
  }, [
    activeTab,
    imageInitialFile,
    drawnInitialFile,
    imageSignFile,
    drawnSignFile,
    requisiteInitialValue,
    requisiteSignValue,
  ]);

  const handleOnClearFile = useCallback(
    (type: RequisiteType) => {
      if (type === RequisiteType.SIGN) setImageSignFile(undefined);
      else setImageInitialFile(undefined);
    },
    [setImageInitialFile, setImageSignFile],
  );

  const handleOnClearRequisite = useCallback(
    (canvasRef: React.RefObject<HTMLCanvasElement>, type: RequisiteType) => {
      const canvas = canvasRef.current as HTMLCanvasElement;
      const sig = new SignaturePad(canvas);
      sig.clear();
      handleOnClearFile(type);
    },
    [handleOnClearFile],
  );

  const handleRequisitesUpdate = useCallback(
    async (requisitesPayload: RequisitesPayload) => {
      try {
        const requisites = (await updateRequisites(requisitesPayload)) as [
          Requisite,
          Requisite,
        ];

        Toast.success(
          `${
            requisiteType === RequisiteType.SIGN ? 'Signature' : 'Initials'
          } updated successfully`,
        );

        return requisites;
      } catch (err) {
        Toast.handleErrors(err);
      }
    },
    [requisiteType, updateRequisites],
  );

  const handleRequisitesCreate = useCallback(
    async (requisitesPayload: RequisitesPayload) => {
      try {
        const requisites = (await createRequisites(requisitesPayload)) as [
          Requisite,
          Requisite,
        ];

        Toast.success(
          `${
            requisiteType === RequisiteType.SIGN ? 'Signature' : 'Initials'
          } created successfully`,
        );

        return requisites;
      } catch (err) {
        Toast.handleErrors(err);
      }
    },
    [requisiteType, createRequisites],
  );

  const onSubmit = useCallback(async () => {
    try {
      const initialId: Requisite['id'] = initialRequisite?.id || uuid();
      const signId: Requisite['id'] = signRequisite?.id || uuid();

      const signValue =
        activeTab === RequisiteValueType.TEXT
          ? requisiteSignValue
          : activeTab === RequisiteValueType.DRAW
          ? (drawnSignFile as File)
          : (imageSignFile as File);

      const initialValue =
        activeTab === RequisiteValueType.TEXT
          ? requisiteInitialValue
          : activeTab === RequisiteValueType.DRAW
          ? (drawnInitialFile as File)
          : (imageInitialFile as File);

      const requisitesPayload = await createRequisitesPayload([
        {
          id: signId,
          siblingId: initialId,
          type: RequisiteType.SIGN,
          value: signValue,
        },
        {
          id: initialId,
          siblingId: signId,
          type: RequisiteType.INITIAL,
          value: initialValue,
        },
      ]);

      if (!requisitesPayload) return;

      const resultRequisites = (requisiteItem
        ? await handleRequisitesUpdate(requisitesPayload as RequisitesPayload)
        : await handleRequisitesCreate(
            requisitesPayload as RequisitesPayload,
          )) as RequisiteSiblings;

      if (resultRequisites) {
        const currentRequisite = resultRequisites.find(
          r => r.type === requisiteType,
        ) as Requisite;
        onSuccessfulSubmit && onSuccessfulSubmit(currentRequisite);
        onClose();
      }
    } catch (error) {
      Toast.handleErrors(error);
    }
  }, [
    initialRequisite,
    signRequisite,
    createRequisitesPayload,
    activeTab,
    requisiteSignValue,
    imageSignFile,
    drawnSignFile,
    requisiteInitialValue,
    imageInitialFile,
    drawnInitialFile,
    requisiteItem,
    handleRequisitesUpdate,
    handleRequisitesCreate,
    onSuccessfulSubmit,
    onClose,
    requisiteType,
  ]);

  const resizeImage = (file: File) => {
    return new Promise<File>(resolve => {
      FileResizer.imageFileResizer(
        file,
        1280,
        1280,
        'PNG',
        100,
        0,
        file => {
          resolve(file as File);
        },
        'file',
      );
    });
  };

  const handleChangeFile = useCallback(
    (type: RequisiteType) => async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files.length > 0) {
        let result: File = event.target.files[0];
        if (result.size > maxFileSize) {
          return Toast.error('Max file size is 40MB');
        }
        result = await resizeImage(result);
        if (type === RequisiteType.SIGN) {
          setImageSignFile(result);
        } else setImageInitialFile(result);
      }
    },
    [setImageInitialFile, setImageSignFile],
  );

  const handleSelect = (val: string) => setFontFamilyType(val as string);

  const handleOnChangeValue = useCallback(
    (type: RequisiteType) => (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.value.length > 100) return;

      if (type === RequisiteType.SIGN) setRequisiteSignValue(event.target.value);
      else setRequisiteInitialValue(event.target.value);
    },
    [setRequisiteInitialValue, setRequisiteSignValue],
  );

  const getContent = (tabType: RequisiteValueType) => {
    switch (tabType) {
      case RequisiteValueType.DRAW: {
        return (
          <RequisiteModalDraw
            isDownloading={isSignDownloading || isInitialDownloading}
            handleOnClearRequisite={handleOnClearRequisite}
            canvasSignRef={canvasSignRef}
            canvasInitialsRef={canvasInitialRef}
          />
        );
      }
      case RequisiteValueType.TEXT: {
        return (
          <RequisiteModalText
            fontFamilyType={fontFamilyType}
            handleSelect={handleSelect}
            handleOnChange={handleOnChangeValue}
            signatureValue={requisiteSignValue}
            initialsValue={requisiteInitialValue}
          />
        );
      }
      case RequisiteValueType.UPLOAD: {
        return (
          <RequisiteModalUpload
            imageSignFile={imageSignFile}
            imageInitialFile={imageInitialFile}
            handleOnClearFile={handleOnClearFile}
            handleChangeFile={handleChangeFile}
          />
        );
      }
      default: {
        break;
      }
    }
  };

  return (
    <div className={classNames('requisiteModal', { mobile: isMobile })}>
      <div className="requisiteModal__inner">
        <div className="requisiteModal__header">
          <p className="requisiteModal__title">{title}</p>
          <ReactSVG
            src={CloseIcon}
            className="requisiteModal__header-icon"
            onClick={onClose}
          />
        </div>
        <div className="requisiteModal__nav-list-select-wrapper">
          <ul className="requisiteModal__nav-list">
            {availableSignatureTypes.includes(RequisiteValueType.TEXT) && (
              <RequisiteTabItem
                title="Type it in"
                isActive={activeTab === RequisiteValueType.TEXT}
                onClick={() => setActiveTab(RequisiteValueType.TEXT)}
              />
            )}
            {availableSignatureTypes.includes(RequisiteValueType.DRAW) && (
              <RequisiteTabItem
                title="Draw it in"
                isActive={activeTab === RequisiteValueType.DRAW}
                onClick={() => setActiveTab(RequisiteValueType.DRAW)}
              />
            )}
            {availableSignatureTypes.includes(RequisiteValueType.UPLOAD) && (
              <RequisiteTabItem
                title="Upload Image"
                isActive={activeTab === RequisiteValueType.UPLOAD}
                onClick={() => setActiveTab(RequisiteValueType.UPLOAD)}
              />
            )}
          </ul>
        </div>
        <div className="requisiteModal__content">{getContent(activeTab)}</div>
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
          title={buttonText}
          isLoading={isLoading}
          disabled={isLoading || !isTermsAccepted || checkIsTabContentEmpty()}
          handleClick={onSubmit}
        />
      </footer>
    </div>
  );
}

export default RequisiteModal;

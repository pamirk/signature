import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { ReactSVG } from 'react-svg';
import { Signer } from 'Interfaces/Document';
import { User } from 'Interfaces/User';
import {
  RequisiteType,
  RequisiteValueType,
  Requisite,
  RequisiteSiblingValues,
  defaultRequisiteTypesOrder,
} from 'Interfaces/Requisite';
import {
  selectSignatures,
  selectInitials,
  selectRequisite,
  selectUser,
} from 'Utils/selectors';
import { getInitials } from 'Utils/formatters';

import { RequisiteModal, RequisiteAutoGenModal } from 'Components/RequisiteComponents';
import UIButton from 'Components/UIComponents/UIButton';
import { UIAddButton } from 'Components/UIComponents/UIAddButton';
import UIModal from 'Components/UIComponents/UIModal';
import RequisiteTabItem from '../RequisiteTabItem/RequisiteTabItem';
import RequisiteListItem from './RequisiteListItem/RequisiteListItem';

// @ts-ignore
import CloseIcon from 'Assets/images/icons/close-icon.svg';

interface RequisiteSelectModalProps {
  signer?: Signer;
  type: RequisiteType;
  availableSignatureTypes?: RequisiteValueType[];
  onSelect: (requisite: Requisite) => void;
  onClose: () => void;
}

const RequisiteSelectModal = ({
  type,
  onSelect,
  onClose,
  signer,
  availableSignatureTypes = defaultRequisiteTypesOrder,
}: RequisiteSelectModalProps) => {
  const { name = '' }: User = useSelector(selectUser);
  const [requisiteValues, setRequisiteValues] = useState<RequisiteSiblingValues>({
    signatureValue: '',
    initialsValue: '',
  });
  const [selectedRequisite, setSelectedRequisite] = useState<Requisite>();
  const [isInItemView, setIsInItemView] = useState(false);
  const [isCustomCreate, setIsCustomCreate] = useState(false);
  const [activeTab, setActiveTab] = useState<RequisiteValueType>(
    availableSignatureTypes[0],
  );
  const requisiteTypeName = useMemo(
    () => (type === RequisiteType.SIGN ? 'Signature' : 'Initial'),
    [type],
  );
  const requisitesSelector = useMemo(
    () => (type === RequisiteType.SIGN ? selectSignatures : selectInitials),
    [type],
  );
  const requisites: any = useSelector(requisitesSelector);

  const filteredRequisites = useMemo(() => {
    return requisites.filter((requisite:any) => requisite.valueType === activeTab);
  }, [requisites, activeTab]);

  const siblingRequisite = useSelector(state =>
    selectRequisite(state, { requisiteId: selectedRequisite?.siblingId || '' }),
  );

  const requisiteAddTitle = useMemo(() => {
    return `Create New ${type === RequisiteType.SIGN ? 'Signature' : 'Initial'}`;
  }, [type]);
  const defaultValues = useMemo(() => {
    return isCustomCreate
      ? { defaultValues: requisiteValues, defaultFontFamilyType: 'dancingScript' }
      : {};
  }, [isCustomCreate, requisiteValues]);

  const closeItemView = useCallback(() => {
    setIsInItemView(false);
  }, []);

  const onCreateClick = useCallback(() => {
    setSelectedRequisite(undefined);
    setIsInItemView(true);
  }, []);

  const onCreateCustomClick = useCallback(() => {
    setSelectedRequisite(undefined);
    setIsCustomCreate(true);
    setIsInItemView(true);
  }, []);

  const onChangeValue = useCallback(
    value => {
      setRequisiteValues(prevState => {
        const newRequisiteValues:
          | Pick<RequisiteSiblingValues, 'initialsValue'>
          | Pick<RequisiteSiblingValues, 'signatureValue' | 'initialsValue'> =
          type === RequisiteType.SIGN
            ? { signatureValue: value, initialsValue: getInitials(value) }
            : { initialsValue: value };
        return { ...prevState, ...newRequisiteValues };
      });
    },
    [type],
  );

  const handleSelect = useCallback(() => {
    selectedRequisite && onSelect(selectedRequisite);
  }, [selectedRequisite, onSelect]);

  useEffect(() => {
    const value = signer?.userId ? signer?.name : name;
    setRequisiteValues({
      signatureValue: value || '',
      initialsValue: getInitials(value),
    });
  }, [signer, name, type]);

  if (isInItemView) {
    return (
      <UIModal
        className="requisiteModal__wrapper responsive"
        onClose={closeItemView}
        hideCloseIcon
      >
        <RequisiteModal
          onClose={closeItemView}
          requisiteItem={selectedRequisite}
          siblingRequisiteItem={selectedRequisite ? siblingRequisite : undefined}
          requisiteType={type}
          onSuccessfulSubmit={onSelect}
          title={selectedRequisite?.id ? `Edit Signature` : `Create New Signature`}
          buttonText={selectedRequisite?.id ? `Update Signature` : `Create Signature`}
          availableSignatureTypes={availableSignatureTypes}
          {...defaultValues}
        />
      </UIModal>
    );
  }

  if (
    requisites.length === 0 &&
    availableSignatureTypes.includes(RequisiteValueType.TEXT)
  )
    return (
      <UIModal className="requisiteModal__wrapper" onClose={onClose} hideCloseIcon>
        <RequisiteAutoGenModal
          requisiteValue={
            type === RequisiteType.SIGN
              ? requisiteValues.signatureValue
              : requisiteValues.initialsValue
          }
          siblingRequisiteValue={
            type === RequisiteType.SIGN
              ? requisiteValues.initialsValue
              : requisiteValues.signatureValue
          }
          title={`We created a ${requisiteTypeName.toLocaleLowerCase()} for you`}
          onClose={onClose}
          requisiteType={type}
          onClickCustomCreate={onCreateCustomClick}
          onSuccessfulSubmit={onSelect}
          onChangeValue={onChangeValue}
        />
      </UIModal>
    );

  return (
    <UIModal
      className="requisiteModal__wrapper requisiteModal__wrapper-select responsive"
      onClose={onClose}
      hideCloseIcon
    >
      <div className="requisiteModal requisiteModal-select">
        <div className="requisiteModal__inner requisiteModal__inner-select">
          <div className="requisiteModal__header">
            <p className="requisiteModal__title">Choose {requisiteTypeName}</p>
            <ReactSVG
              src={CloseIcon}
              onClick={onClose}
              className="requisiteModal__header-icon"
            />
          </div>
          <div
            className={classNames('requisiteModal__nav-list-select-wrapper', {
              shadowed: requisites.length > 3,
            })}
          >
            <ul className="requisiteModal__nav-list requisiteModal__nav-list-select">
              {availableSignatureTypes.includes(RequisiteValueType.TEXT) && (
                <RequisiteTabItem
                  title="Typed"
                  onClick={() => setActiveTab(RequisiteValueType.TEXT)}
                  isActive={activeTab === RequisiteValueType.TEXT}
                />
              )}
              {availableSignatureTypes.includes(RequisiteValueType.DRAW) && (
                <RequisiteTabItem
                  title="Drawn"
                  onClick={() => setActiveTab(RequisiteValueType.DRAW)}
                  isActive={activeTab === RequisiteValueType.DRAW}
                />
              )}
              {availableSignatureTypes.includes(RequisiteValueType.UPLOAD) && (
                <RequisiteTabItem
                  title="Uploaded"
                  onClick={() => setActiveTab(RequisiteValueType.UPLOAD)}
                  isActive={activeTab === RequisiteValueType.UPLOAD}
                />
              )}
            </ul>
          </div>

          <div
            className={classNames(
              'requisiteModal__content',
              'requisiteModal__content-select',
            )}
          >
            <ul
              className={classNames(
                'requisiteModal__content',
                'requisiteModal__content-select',
                'requisiteModal__content-select--inner',
                {
                  'requisiteModal__content-select--empty': !filteredRequisites.length,
                },
              )}
            >
              {filteredRequisites.length ? (
                filteredRequisites.map((requisite:any) => (
                  <RequisiteListItem
                    key={requisite.id}
                    onItemClick={setSelectedRequisite}
                    onItemDoubleClick={handleSelect}
                    isSelected={selectedRequisite?.id === requisite.id}
                    onItemEdit={() => {
                      setSelectedRequisite(requisite);
                      setIsInItemView(true);
                    }}
                    requisite={requisite}
                  />
                ))
              ) : (
                <div className="requisiteModal__empty">
                  <div className="requisiteModal__empty-content">
                    <h4 className="requisiteModal__empty-content-header">
                      No {requisiteTypeName.toLocaleLowerCase()}s available yet.
                    </h4>
                    <p className="requisiteModal__empty-content-text">
                      Create your first {requisiteTypeName.toLocaleLowerCase()} to be able
                      to sign any document.
                      <br />
                      Your created {requisiteTypeName.toLocaleLowerCase()}s will appear
                      here.
                    </p>
                  </div>
                  <UIButton
                    priority="primary"
                    className="requisiteModal__empty-button"
                    handleClick={onCreateClick}
                    title={requisiteAddTitle}
                  />
                </div>
              )}
            </ul>
            {!!filteredRequisites.length && (
              <div className="requisiteModal__footer requisiteModal__footer-select">
                <UIAddButton
                  onClick={onCreateClick}
                  label={requisiteAddTitle}
                  wrapperClassName="requisiteModal__addButton-wrapper"
                  iconClassName="requisiteModal__addButton-icon"
                  labelClassName="requisiteModal__addButton-label"
                />
                <UIButton
                  handleClick={onCreateClick}
                  priority="primary"
                  className="requisiteModal__addButton--mobile"
                  title={requisiteAddTitle}
                />
                <UIButton
                  priority="primary"
                  title="Sign Now"
                  disabled={!selectedRequisite}
                  handleClick={handleSelect}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </UIModal>
  );
};

export default RequisiteSelectModal;

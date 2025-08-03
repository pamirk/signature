import React, { useEffect, useMemo, useRef } from 'react';
import { ReactSVG } from 'react-svg';
import classNames from 'classnames';
import { Requisite, RequisiteType } from 'Interfaces/Requisite';
import { Signer } from 'Interfaces/Document';
import { FieldColorNames } from 'Hooks/DocumentFields/useDocumentFieldColor';

import { RequisiteItem } from 'Components/RequisiteComponents';

import SignIcon from 'Assets/images/icons/sign-icon.svg';
import InIcon from 'Assets/images/icons/in-icon.svg';
import {
  DocumentFieldLabels,
  DocumentFieldsCRUDMeta,
  DocumentFieldUpdatePayload,
  FieldCreateType,
} from 'Interfaces/DocumentFields';

interface RequisiteFieldProps {
  requisite?: Requisite;
  requisiteType?: RequisiteType;
  disabled?: boolean;
  signer?: Signer;
  fieldColor?: FieldColorNames;
  updateField?: (
    payload: Omit<DocumentFieldUpdatePayload, 'id'>,
    meta?: DocumentFieldsCRUDMeta,
  ) => void;
  createType?: FieldCreateType;
  imgRef?: React.Ref<HTMLImageElement>;
}

const RequisiteField = ({
  requisite,
  requisiteType,
  signer,
  fieldColor,
  updateField,
  createType,
  imgRef,
}: RequisiteFieldProps) => {
  const title = useMemo(() => {
    if (signer && !signer.isPreparer) {
      return signer.name || signer.role;
    }

    return requisiteType === RequisiteType.SIGN
      ? DocumentFieldLabels.SIGNATURE
      : DocumentFieldLabels.INITIALS;
  }, [requisiteType, signer]);

  const shadowRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (
      shadowRef.current &&
      createType === FieldCreateType.ADD &&
      requisiteType === RequisiteType.SIGN
    ) {
      const width = Math.max(shadowRef?.current?.clientWidth + 40, 110);

      updateField && updateField({ width }, { pushToHistory: false });
    }
  }, [
    updateField,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    signer?.name?.length,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    signer?.role?.length,
    createType,
    requisiteType,
  ]);

  if (requisite?.id) {
    return (
      <RequisiteItem
        requisiteItem={requisite}
        imgRef={imgRef}
        spinnerProps={{ width: 14, height: 14 }}
      />
    );
  }

  return (
    <div
      className={classNames(
        'fieldDropDown__requisite-blank',
        `fieldColor__${fieldColor}`,
        (requisiteType === RequisiteType.INITIAL ||
          requisiteType === RequisiteType.SIGN) &&
          'fieldDropDown__requisite-blank-center',
      )}
    >
      <pre
        ref={shadowRef}
        style={{
          fontSize: '16px',
        }}
        dangerouslySetInnerHTML={{ __html: title || '' }}
        className={classNames(
          'fieldDropDown__requisite-blank-content',
          'fieldDropDown__requisite-blank-shadow',
          'fieldDropDown__requisite-blank-content--insertable',
        )}
      />
      <ReactSVG
        className="fieldDropDown__requisite-blank-icon"
        src={requisiteType === RequisiteType.SIGN ? SignIcon : InIcon}
      />
      {requisiteType === RequisiteType.SIGN && (
        <span className="fieldDropDown__requisite-blank-title">{title}</span>
      )}
    </div>
  );
};

export default RequisiteField;

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
  DocumentFieldsCRUDMeta,
  DocumentFieldUpdatePayload,
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
}

const RequisiteField = ({
  requisite,
  requisiteType,
  signer,
  fieldColor,
  updateField,
}: RequisiteFieldProps) => {
  const title = useMemo(() => {
    if (signer && !signer.isPreparer) {
      return signer.name || signer.role;
    }

    return requisiteType === RequisiteType.SIGN ? 'Signature' : 'Initials';
  }, [requisiteType, signer]);

  const shadowRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (shadowRef.current) {
      const width = Math.max(shadowRef?.current?.clientWidth + 40, 110);

      updateField && updateField({ width }, { pushToHistory: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateField, signer?.name?.length, signer?.role?.length]);

  if (requisite?.id) {
    return (
      <RequisiteItem requisiteItem={requisite} spinnerProps={{ width: 14, height: 14 }} />
    );
  }

  return (
    <div
      className={classNames(
        'fieldDropDown__requisite-blank',
        `fieldColor__${fieldColor}`,
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
      <span className="fieldDropDown__requisite-blank-title">{title}</span>
    </div>
  );
};

export default RequisiteField;

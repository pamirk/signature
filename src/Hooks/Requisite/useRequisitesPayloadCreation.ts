import { useCallback, useState } from 'react';
import {
  Requisite,
  RequisitePayload,
  RequisitesPayload,
  RequisiteType,
  RequisiteValueType,
} from 'Interfaces/Requisite';
import { useBacketUploader, useImageFromTextCreation } from 'Hooks/Requisite';

interface RequisiteCreationPayload {
  id: Requisite['id'];
  siblingId: Requisite['siblingId'];
  type: RequisiteType;
  value: Requisite['text'] | File;
}

interface Props {
  fontStyle: {
    textFontSize: number;
    fontFamilyType: string;
  };
  requisiteValueType: RequisiteValueType;
}

export default ({ fontStyle, requisiteValueType }: Props) => {
  const createImageFromText = useImageFromTextCreation(fontStyle);
  const [uploadToBacket] = useBacketUploader();
  const [isCreating, setIsCreating] = useState(false);

  const createRequisitePayload = useCallback(
    async ({
      id,
      siblingId,
      type,
      value,
    }: RequisiteCreationPayload): Promise<RequisitePayload | undefined> => {
      switch (requisiteValueType) {
        case RequisiteValueType.TEXT:
          if (value && value !== '') {
            const convertedImage = createImageFromText(value as Requisite['text']);
            const fileKey = await uploadToBacket(convertedImage, id);
            return {
              id,
              type,
              text: value as Requisite['text'],
              siblingId,
              fileKey,
              valueType: requisiteValueType,
              fontFamily: fontStyle.fontFamilyType,
              fontSize: fontStyle.textFontSize,
            };
          }
          break;
        case RequisiteValueType.DRAW:
        case RequisiteValueType.UPLOAD:
          if (value) {
            const fileKey = await uploadToBacket(value as File, id);
            return {
              id,
              type,
              siblingId,
              fileKey,
              valueType: requisiteValueType,
            };
          }
          break;
        default:
          break;
      }
    },
    [
      createImageFromText,
      fontStyle.fontFamilyType,
      fontStyle.textFontSize,
      requisiteValueType,
      uploadToBacket,
    ],
  );

  const createRequisitesPayload = useCallback(
    async (
      requisitesCreationPayload: [RequisiteCreationPayload, RequisiteCreationPayload],
    ): Promise<RequisitesPayload | undefined> => {
      setIsCreating(true);
      const requisitesPayload = await Promise.all([
        createRequisitePayload(requisitesCreationPayload[0]),
        createRequisitePayload(requisitesCreationPayload[1]),
      ]);
      setIsCreating(false);
      if (!requisitesPayload[0] || !requisitesPayload[1]) return;
      return requisitesPayload as RequisitesPayload;
    },
    [createRequisitePayload],
  );

  return [createRequisitesPayload, isCreating] as const;
};

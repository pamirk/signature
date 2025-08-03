export enum RequisiteValueType {
  TEXT = 'text',
  DRAW = 'draw',
  UPLOAD = 'upload',
}

export enum RequisiteType {
  SIGN = 'sign',
  INITIAL = 'initial',
}

export interface Requisite {
  id: string;
  siblingId: string;
  type: RequisiteType;
  valueType: RequisiteValueType;
  fileKey: string;
  text: string;
  fontSize: number;
  fontFamily: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  url: string;
}

export type RequisitePayload = Pick<
  Requisite,
  'id' | 'siblingId' | 'type' | 'valueType' | 'fileKey'
> &
  Partial<Pick<Requisite, 'text' | 'fontSize' | 'fontFamily'>>;

export type RequisitesPayload = [RequisitePayload, RequisitePayload];

export type RequisiteSiblings = [Requisite, Requisite];

export type RequisiteDeletePayload = Pick<Requisite, 'id'>;

export const defaultRequisiteTypesOrder = [
  RequisiteValueType.TEXT,
  RequisiteValueType.DRAW,
  RequisiteValueType.UPLOAD,
];

export interface RequisiteSiblingValues {
  signatureValue: Requisite['text'];
  initialsValue: Requisite['text'];
}

export interface SelectedSignature {
  id: Requisite['id'];
  siblingId: Requisite['id'];
}

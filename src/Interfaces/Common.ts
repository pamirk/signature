import { Location } from 'history';

export interface Action<TPayload, TResponse> {
  (arg: TPayload): TResponse;
}

export enum RequestErrorTypes {
  QUOTA_EXCEEDED = 'QuotaExceeded',
}

export interface RequestError {
  type: RequestErrorTypes;
  message: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface OrderingParams {
  orderingKey: string;
  orderingDirection: string;
}

export interface SelectableOption<TValue> {
  value: TValue;
  label: string;
}

export interface PaginationData {
  pageCount: number;
  totalItems: number;
  itemsCount: number;
}

export interface TablePaginationProps extends PaginationData {
  itemsLimit: number;
  pageNumber: number;
}

export enum UploadStatuses {
  UPLOADED = 'uploaded',
  CANCELLED = 'cancelled',
  ERROR = 'ERROR',
}

export interface SignedUrlPayload {
  key: string;
}

export interface SignedUrlResponse {
  result: string;
}

export interface BulkSignedUrlPayload {
  keys: string[];
}

export interface BulkSignedUrlResponse {
  [key: string]: string;
}

export interface NormalizedEntity<T> {
  [key: string]: T;
}

export interface EntityDates {
  createdAt?: string;
  updatedAt?: string;
}

export enum OrderingDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export enum PDFPageLayouts {
  PORTRAIT = 'portrait',
}

export interface PDFPageMetadata {
  width: number;
  height: number;
  layout: PDFPageLayouts;
  rotate: number;
  offsetX: number;
  offsetY: number;
  size: [this['width'], this['height']];
  mediaBox: [this['offsetX'], this['offsetY'], this['width'], this['height']];
  pageNumber: number;
}

export interface PDFMetadata {
  [key: number]: PDFPageMetadata;
  pages: number;
}

export type SelectableItem<T> = T & { isSelected: boolean };

export type RecursivePartial<T> = {
  [K in keyof T]?: RecursivePartial<T[K]>;
};

export interface WrapperProps {
  location: Location;
  children: React.ReactNode;
}

export interface ParsedCsvData {
  headers?: string[];
  rows: string[][];
}

export interface SocketConnectPayload {
  onConnect?: () => any;
  onReconnect?: () => any;
}

export interface DatePipeOptions {
  minYYYY?: number;
  maxYYYY?: number;
  minYY?: number;
  maxYY?: number;
  isSameOrFuture?: boolean;
}

export interface FileItem {
  id?: string;
  token: string;
  filename: string;
  progress?: number;
  isUploaded?: boolean;
  isFinished?: boolean;
  order?: number;
  errorText?: string;
}

export type DocumentItem = FileItem & { file?: File };

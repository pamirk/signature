import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { byteToMB } from './formatters';
import { MAX_FILE_SIZE_MB, MAX_TOTAL_FILE_SIZE_MB } from './constants';
import { SignatureTypesPreferences } from 'Interfaces/User';
import { DocumentItem } from 'Interfaces/Common';
dayjs.extend(customParseFormat);

const emailRegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const onlyDigitsRegExp = /^\d+$/;
const digitsAndCharsRegExp = /^[A-Za-z0-9]+$/i;
const digitsAndCharsAndSpecialSymbolsRegExp = /^[A-Za-z0-9-!@#$%^&*()_+|~=±`{}\\[\]:";'<>?,./]+$/i;
const atleastDigitRegexp = /^(?=.*?[0-9]).+$/i;
const expirationDateRegExp = /\b(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})\b/;
const cvvRegExp = /^\d{3,4}$/;
const postalCodeRegExp = /^\S{10}$/;
const nameRegExp = /^[\S]+(([',. -][\S ])?[\S]*)*$/;
const urlRegExp = /^(?:http(s)?:\/\/)/;

export const required = <FieldValue>(value?: FieldValue) =>
  value || (typeof value === 'number' && !Number.isNaN(value)) ? undefined : 'Required';

const maxLength = (length: number) => <FieldValue extends string>(value?: FieldValue) =>
  value && value.length > length
    ? `Maximum length of this field must be less than ${length} symbols`
    : undefined;

export const maxLength100 = maxLength(100);

export const maxLength50 = maxLength(50);

export const notOnlySpaces = <FieldValue extends string>(value?: FieldValue) =>
  value && value.trim().length === 0
    ? 'The field must not contain only spaces'
    : undefined;

export const atleastDigit = <FieldValue extends string>(value?: FieldValue) =>
  value && !atleastDigitRegexp.test(value)
    ? 'Password must have at least one digit'
    : undefined;

export const passwordLength = <FieldValue extends string>(value?: FieldValue) =>
  value && value.length < 6 ? 'Minimum password length is 6 symbols' : undefined;

export const onlyDigitsAndChars = <FieldValue extends string>(value?: FieldValue) =>
  value && !digitsAndCharsRegExp.test(value)
    ? 'Only digits and characters allowed'
    : undefined;

export const onlyDigitsAndCharsAndSpecialSymbols = <FieldValue extends string>(
  value?: FieldValue,
) =>
  value && !digitsAndCharsAndSpecialSymbolsRegExp.test(value)
    ? 'Only digits, characters and special symbols allowed'
    : undefined;

export const password = <FieldValue extends string>(value?: FieldValue) => {
  const validationErrors = [
    atleastDigit(value),
    passwordLength(value),
    onlyDigitsAndCharsAndSpecialSymbols(value),
  ].filter(result => result);

  return validationErrors.length ? validationErrors.join('\n') : undefined;
};

export const confirmPassword = <FieldValue extends string>(
  value: FieldValue,
  formValues,
) =>
  formValues.password !== value
    ? 'Password and confirmation password do not match'
    : undefined;

export const email = <FieldValue extends string>(value?: FieldValue) =>
  value && !emailRegExp.test(value) ? 'Invalid email address' : undefined;

export const expirationDate = value => {
  if (value && !expirationDateRegExp.test(value)) return 'Invalid date';
  if (value && dayjs(value, 'MM/YYYY').isBefore(dayjs())) {
    return 'Expiration date must be in future';
  }
  return undefined;
};

export const cardNumberDigits = <FieldValue extends string>(value?: FieldValue) =>
  value && !onlyDigitsRegExp.test(value) ? 'Only digits allowed' : undefined;

export const cardNumberLength = <FieldValue extends string>(value?: FieldValue) =>
  value && value.length < 15 ? 'Card Number must be 15 or 16 digits' : undefined;

export const cardNumber = <FieldValue extends string>(value?: FieldValue) => {
  const validationErrors = [cardNumberDigits(value), cardNumberLength(value)].filter(
    result => result,
  );

  return validationErrors.length ? validationErrors.join('\n') : undefined;
};

export const cvv = <FieldValue extends string>(value?: FieldValue) =>
  value && !cvvRegExp.test(value) ? 'CVV must be 3 or 4 digits' : undefined;

export const postalCode = <FieldValue extends string>(value?: FieldValue) =>
  value && value.length > 10 ? 'Postal Code must be maximum 10 symbols' : undefined;

export const name = <FieldValue extends string>(value?: FieldValue) =>
  value && !value.trim().length ? 'Incorrect name' : undefined;

export const urlProtocol = <FieldValue extends string>(value?: FieldValue) =>
  value && !urlRegExp.test(value)
    ? 'url should start with https:// or http://'
    : undefined;

export const phoneNumberLength = <FieldValue extends string>(value?: FieldValue) =>
  value && !value.length ? 'Phone number should not be empty' : undefined;

export const lessThan40MB = (bytes: number) => {
  const sizeInMB = byteToMB(bytes);

  return sizeInMB > MAX_FILE_SIZE_MB ? 'File size must be less than 40 mb' : undefined;
};

export const lessThan100MB = (bytes: number) => {
  const sizeInMB = byteToMB(bytes);

  return sizeInMB > MAX_TOTAL_FILE_SIZE_MB
    ? 'Total size of files must be less than 100 mb'
    : undefined;
};

export const multipleFilesConstaint = (files: DocumentItem[], newFile: File) => {
  const totalSize =
    files.reduce((size, documentPart) => size + (documentPart.file?.size || 0), 0) +
    newFile.size;

  const sizeError = !!lessThan100MB(totalSize);
  const filesNumberError = files.length + 1 > 5;

  if (sizeError || filesNumberError) {
    return 'Uploading files for a document is limited to 5 files and total size must be less than 100 mb';
  }
};

export const signatureTypesPreferences = (value: SignatureTypesPreferences) => {
  const activeSignatureTypesCount = [
    value.isDrawnSignaturesAvailable,
    value.isTypedSignaturesAvailable,
    value.isUploadedSignaturesAvailable,
  ].filter(Boolean).length;

  return activeSignatureTypesCount === 0
    ? 'At least one signature available type must be active'
    : undefined;
};

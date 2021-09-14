import dayjs from 'dayjs';
import * as _ from 'lodash';
import { DateFormats } from 'Interfaces/User';

const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  return `${monthNames[monthIndex]} ${day}, ${year}`;
};

export const trim = value => value && value.trim();

export const toLowerCase = value => value && value.toLowerCase();

export const capitalize = (str: string) => {
  if (!str) return str;
  return str[0].toUpperCase() + str.slice(1);
};

export const cardNumberMaskedProps = {
  mask: [
    /[\d*]/,
    /[\d*]/,
    /[\d*]/,
    /[\d*]/,
    ' ',
    /[\d*]/,
    /[\d*]/,
    /[\d*]/,
    /[\d*]/,
    ' ',
    /[\d*]/,
    /[\d*]/,
    /[\d*]/,
    /[\d*]/,
    ' ',
    /[\d*]/,
    /[\d*]/,
    /[\d*]/,
    /[\d*]/,
  ],
  parse: value => {
    return value && value.replace(/ /g, '');
  },
};

export const expirationMaskedProps = {
  mask: [/[\d]/, /[\d]/, ' ', '/', ' ', /[\d]/, /[\d]/, /[\d]/, /[\d]/],
  parse: value => {
    return value && value.replace(/ /g, '');
  },
};

export const phoneNumberMaskedProps = {
  mask: [
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ],
  parse: value => {
    return value && value.replace(/[ ()-]+/g, '');
  },
};

export const phoneCodeMaskedProps = {
  mask: ['+', /\d/, /\d/, /\d/, /\d/],
  parse: value => {
    return value && value.replace(/[ ()-]+/g, '');
  },
};

export const cvvMask = [/[\d*]/, /[\d*]/, /[\d*]/, /[\d*]/];

export const postalCodeMask = [
  /[\S]/,
  /[\S]/,
  /[\S]/,
  /[\S]/,
  /[\S]/,
  /[\S]/,
  /[\S]/,
  /[\S]/,
  /[\S]/,
  /[\S]/,
];

export const dateFormatMasks = {
  [DateFormats.DD_MM_YYYY]: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/],
  [DateFormats.MM_DD_YYYY]: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/],
  [DateFormats.DD_MM_YY]: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/],
  [DateFormats.MM_DD_YY]: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/],
};

export const formatDateStringToStartDay = (date: string) => {
  return dayjs(date)
    .startOf('day')
    .toDate();
};

export const formatDateStringToEndDay = (date: string) => {
  return dayjs(date)
    .endOf('day')
    .toDate();
};

export const formatDateToIsoString = (date?: Date) => {
  if (date) return dayjs(date).toISOString();
};

export const formatDateToHumanString = (date?: string) => {
  if (date) return dayjs(date).format('MM-DD-YYYY HH-mm-ss');
};

export const getHourFromDateString = (date: string) => {
  return dayjs(date).format('hh:mm A');
};

export const formatDocumentName = (name: string, type: 'document' | 'template') =>
  name || `No name ${capitalize(type)}`;

export const byteToMB = (bytes: number) => bytes / 10 ** 6;

export const getFirstCapital = (string?: string) => {
  return _.capitalize(string)?.charAt(0);
};

export const getInitials = (name?: string) => {
  const [firstName, lastName] = name?.split(' ') || [];

  return [firstName, lastName].map(namePart => getFirstCapital(namePart)).join('');
};

export const getAvatarContent = (name?: string, email?: string) => {
  return getInitials(name) || getFirstCapital(email);
};

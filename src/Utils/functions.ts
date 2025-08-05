import { Dispatch } from 'redux';
import { FieldValidator, FORM_ERROR } from 'final-form';
import { v4 as uuid } from 'uuid';
import dayjs from 'dayjs';
import { START_WATCH_PROMISIFIED_ACTION } from 'Store/actionTypes';
import { Action, DatePipeOptions } from 'Interfaces/Common';
import { AsyncActionCreator } from 'Interfaces/ActionCreators';
import { isEmpty, isArray } from 'lodash';
import { DocumentFieldTypes } from 'Interfaces/DocumentFields';
import Papa from 'papaparse';
import { User, UserRoles, WorkflowVersions } from 'Interfaces/User';
import { DocumentBulkSendValues } from 'Interfaces/Document';
import {
  DISABLE_SALE_PLAN_DURATIONS,
  DISABLE_SALE_PLAN_TYPES,
  FRONTEND_URL,
  FRONTEND_URL_VERSION_B,
  NODE_ENV,
  WORKFLOW_PREFIX,
} from './constants';
import { ApiPlanTypes, PlanDurations, PlanTypes } from 'Interfaces/Billing';
import { slashAgnostic } from 'Utils/slash-agnostic';

const FrontendUrlByWorkflowVersionMap: {
  [T in WorkflowVersions]: string;
} = {
  [WorkflowVersions.A]: FRONTEND_URL,
  [WorkflowVersions.B]: FRONTEND_URL_VERSION_B,
};

export const fakeRequest = <T>(data: T, delay = 1500) =>
  new Promise<T>(resolve => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });

export const checkPermission = (
  userRole: UserRoles,
  allowedRoles?: Array<UserRoles> | UserRoles,
): boolean => {
  return isArray(allowedRoles)
    ? allowedRoles.includes(userRole)
    : allowedRoles === undefined || userRole === allowedRoles;
};

export const promisifyAsyncAction = <
  TAsyncActionCreator extends AsyncActionCreator,
  TRequest = ReturnType<TAsyncActionCreator['request']>['payload'],
  TSuccess = ReturnType<TAsyncActionCreator['success']>['payload']
>(
  actionCreators: TAsyncActionCreator,
) => (dispatch: Dispatch, payload?: TRequest): Promise<TSuccess | {}> =>
  new Promise((resolve, reject) =>
    dispatch({
      type: START_WATCH_PROMISIFIED_ACTION,
      payload,
      meta: {
        defer: { resolve, reject },
        taskId: uuid(),
        actionCreators,
      },
    }),
  );

export const parseJwtToken = (token: string) => {
  const dataString = atob(token.split('.')[1]);
  return JSON.parse(dataString);
};

export const parseCsvByStep = (file: File, rowLimit?: number, columnLimit?: number) => {
  let counter = 0;
  const results: string[][] = [];

  return new Promise<string[][]>((resolve, reject) => {
    Papa.parse(file, {
      step: (row, parser) => {
        if (rowLimit && counter > rowLimit) {
          reject(new Error(`Maximum number of rows is ${rowLimit}`));
          parser.abort();
        }
        // @ts-ignore
        if (columnLimit && row.data.length > columnLimit) {
          reject(new Error(`Maximum number of columns is ${columnLimit}`));
          parser.abort();
        }

        // @ts-ignore
        results.push(row.data);
        counter++;
      },

      complete: () => resolve(results),
    });
  });
};

export const callActionAsync = async <TPayload, TResponse>(
  action: Action<TPayload, TResponse>,
  actionPayload: TPayload,
  loaderToggler: Function = () => {},
): Promise<TResponse> => {
  let result;

  try {
    loaderToggler(true);
    result = await action(actionPayload);
  } finally {
    loaderToggler(false);
  }

  return result;
};

export const findOffsetParent = (
  fromElement: HTMLElement | null,
  predicate: (offsetParent: HTMLElement | null) => boolean,
  elementsPath: HTMLElement[] = [],
): {
  anchor: Element | null;
  elementsPath: HTMLElement[];
} => {
  if (!fromElement) return { anchor: fromElement, elementsPath };

  const offsetParent = fromElement.offsetParent as HTMLElement;

  if (predicate(offsetParent)) {
    return {
      anchor: offsetParent,
      elementsPath,
    };
  }

  const nextElementsPath = [...elementsPath, offsetParent];

  return findOffsetParent(offsetParent, predicate, nextElementsPath);
};

export const composeValidators = <FieldValue>(
  ...validators: FieldValidator<FieldValue>[]
) => (...args: Parameters<FieldValidator<FieldValue>>) =>
  validators.reduce((error, validator) => error || validator(...args), undefined);

export const isExpired = (expirationDate?: string | number) =>
  dayjs().isAfter(dayjs(expirationDate));

export const moveArrayItem = <T>(
  itemsArray: T[],
  sourceIndex: number,
  destinationIndex: number,
): T[] => {
  const tempItemsArray = [...itemsArray];

  tempItemsArray.splice(destinationIndex, 0, tempItemsArray.splice(sourceIndex, 1)[0]);

  return tempItemsArray;
};

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const isNotEmpty = <T>(entity: {} | T): entity is T => {
  return !isEmpty(entity);
};

export const base64ToFile = (base64String: string, filename: string) => {
  const arr = base64String.split(',');
  const mime = (arr[0].match(/:(.*?);/) as string[])[1];
  const bstr = atob(arr[1]);
  const u8arr = new Uint8Array(bstr.length);

  u8arr.forEach((item, index) => {
    u8arr[index] = bstr.charCodeAt(index);
  });

  return new File([u8arr], filename, { type: mime });
};

export const openPopupCenter = (
  url: string,
  title: string,
  width: number,
  height: number,
) => {
  const left = window.screen.width / 2 - width / 2;
  const top = window.screen.height / 2 - height / 2;

  return window.open(
    url,
    title,
    `
      toolbar=no,
      location=no,
      directories=no,
      status=no,
      menubar=no,
      scrollbars=no,
      resizable=no,
      copyhistory=no,
      width=${width},
      height=${height},
      top=${top},
      left=${left},
    `,
  ) as Window;
};

export const mapSubmissionErrors = errors => {
  let result = {};
  errors.forEach(error => {
    result = {
      ...result,
      [error.property]:
        error.children && error.children.length
          ? mapSubmissionErrors(error.children)
          : Object.keys(error.constraints)
              .map(key => error.constraints[key])
              .join(' '),
    };
  });
  return result;
};

export const processSubmissionErrors = error => {
  if (error.errors && Array.isArray(error.errors)) {
    return mapSubmissionErrors(error.errors);
  }

  if (error.message) {
    return { [FORM_ERROR]: error.message };
  }

  return { [FORM_ERROR]: 'Something went wrong' };
};

export const maxLengthArray = <T1, T2>(arrayA: T1[], arrayB: T2[]) =>
  arrayA.length >= arrayB.length ? arrayA : arrayB;

export const getCurrentDate = (format = 'MM/DD/YYYY') => dayjs().format(format);

export const checkIfDateOrText = (type: DocumentFieldTypes) =>
  [DocumentFieldTypes.Name, DocumentFieldTypes.Text, DocumentFieldTypes.Date].includes(
    type,
  );

export const isCheckbox = (type: DocumentFieldTypes) =>
  type === DocumentFieldTypes.Checkbox;

export const isRequisite = (type: DocumentFieldTypes) =>
  [DocumentFieldTypes.Signature, DocumentFieldTypes.Initials].includes(type);

const maxValueMonth = [31, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const formatOrder = ['YYYY', 'YY', 'MM', 'DD'];

export function createAutoCorrectedDatePipe(
  dateFormat = 'MM DD YYYY',
  {
    minYYYY = 1,
    maxYYYY = 9999,
    minYY = 0,
    maxYY = 99,
    isSameOrFuture = false,
  }: DatePipeOptions = {},
) {
  const dateFormatArray = dateFormat
    .split(/[^DMY]+/)
    .sort((a, b) => formatOrder.indexOf(a) - formatOrder.indexOf(b));

  return function(conformedValue) {
    const dateValue = dayjs(conformedValue);
    const todayDate = dayjs(dayjs(Date.now()).format(dateFormat));

    if (isSameOrFuture && dateValue.isValid() && dateValue.isBefore(todayDate)) {
      return false;
    }

    const indexesOfPipedChars = [];
    const maxValue = { DD: 31, MM: 12, YY: maxYY, YYYY: maxYYYY };
    const minValue = { DD: 1, MM: 1, YY: minYY, YYYY: minYYYY };
    const conformedValueArr = conformedValue.split('');
    // Check first digit
    dateFormatArray.forEach(format => {
      const position = dateFormat.indexOf(format);
      const maxFirstDigit = parseInt(maxValue[format].toString().substr(0, 1), 10);

      if (parseInt(conformedValueArr[position], 10) > maxFirstDigit) {
        conformedValueArr[position + 1] = conformedValueArr[position];
        conformedValueArr[position] = 0;
        //@ts-ignore
        indexesOfPipedChars.push(position);
      }
    });

    // Check for invalid date
    let month = 0;

    const isInvalid = dateFormatArray.some(format => {
      const position = dateFormat.indexOf(format);
      const length = format.length;
      const textValue = conformedValue.substr(position, length).replace(/\D/g, '');
      const value = parseInt(textValue, 10);

      if (format === 'MM') {
        month = value || 0;
      }

      const maxValueForFormat = format === 'DD' ? maxValueMonth[month] : maxValue[format];

      if (format === 'YYYY' || format === 'YY') {
        const scopedMaxValue = parseInt(
          maxValue[format].toString().substring(0, textValue.length),
          10,
        );
        const scopedMinValue = parseInt(
          minValue[format].toString().substring(0, textValue.length),
          10,
        );
        return value < scopedMinValue || value > scopedMaxValue;
      }
      return (
        value > maxValueForFormat ||
        (textValue.length === length && value < minValue[format])
      );
    });

    if (isInvalid) {
      return false;
    }

    return {
      value: conformedValueArr.join(''),
      indexesOfPipedChars,
    };
  };
}

export const handleCsvFileCrlf = (values: DocumentBulkSendValues) => {
  const signers = values.signers;

  if (!signers) {
    return values;
  }

  const lastSigner = signers[signers.length - 1];
  const isCRLF = lastSigner && !lastSigner.name && !lastSigner.email;

  return isCRLF ? { ...values, signers: signers.slice(0, signers.length - 1) } : values;
};

export const resizeFile = (
  file: File,
  width: number,
  height: number,
  errorMessage?: string,
): Promise<File> =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = width;
    canvas.height = height;

    img.onerror = () => reject(errorMessage || 'Something went wrong');
    img.onload = function() {
      ctx && ctx.drawImage(img, 0, 0, width, height);

      const res = canvas.toDataURL();
      const resizedFile = base64ToFile(res, file.name);
      resolve(resizedFile);
    };

    img.src = url;
  });

export const getFrontendUrlStaticPath = (path: string) =>
  new URL(slashAgnostic(WORKFLOW_PREFIX, path), FRONTEND_URL).href;

export const getWorkflowVersion = (options?: {
  enableExperimentation: boolean;
}): WorkflowVersions => {
  if (options?.enableExperimentation) {
    return WorkflowVersions.B;
  }

  const currentUrl = window.location.href;
  const prefix = WORKFLOW_PREFIX === '/' ? '' : WORKFLOW_PREFIX.split('/')[1];

  const match = currentUrl.match(`(?:http(s)?://)[a-zA-Z.0-9-:]+/${prefix}`);
  const referrerHost = match && match[0];

  return referrerHost === FRONTEND_URL_VERSION_B
    ? WorkflowVersions.B
    : WorkflowVersions.A;
};

export const redirectToUserWorkflowVersion = (userWorkflowVersion?: WorkflowVersions) => {
  const currectWorkflowVersion = getWorkflowVersion();

  if (
    NODE_ENV === 'development' ||
    !userWorkflowVersion ||
    userWorkflowVersion === currectWorkflowVersion
  ) {
    return;
  }

  const { pathname, search } = window.location;
  const route = pathname.slice(WORKFLOW_PREFIX.length, pathname.length);

  window.location.href = `${FrontendUrlByWorkflowVersionMap[userWorkflowVersion]}/${route}${search}`;
};

export const isNewTrialUser = (user: User) =>
  user.plan.type === PlanTypes.FREE && !user.teamId && user.showTrialStep;

export const disabledSalePlanTypes = DISABLE_SALE_PLAN_TYPES
  ? (DISABLE_SALE_PLAN_TYPES.split(',') as PlanTypes[])
  : [];
export const disabledSalePlanDurations = DISABLE_SALE_PLAN_DURATIONS
  ? (DISABLE_SALE_PLAN_DURATIONS.split(',') as PlanDurations[])
  : [];

export const isAvailablePlanForSale = (
  type: PlanTypes | ApiPlanTypes,
  duration: PlanDurations,
) =>
  !disabledSalePlanTypes.includes(type as PlanTypes) &&
  !disabledSalePlanDurations.includes(duration);

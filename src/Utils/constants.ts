export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.signaturely.com' as string;
export const API_GLOBAL_PREFIX = process.env.REACT_APP_API_GLOBAL_PREFIX || 'api' as string;
export const API_VERSION = process.env.REACT_APP_API_VERSION || 'v1' as string;
export const API_URL = `${API_BASE_URL}/${API_GLOBAL_PREFIX}/${API_VERSION}`;

export const FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL || "https://app.signaturely.com" as string;

export const GOOGLE_SDK_URL = 'https://apis.google.com/js/api.js';
export const GOOGLE_DRIVE_API_URL = 'https://www.googleapis.com/drive/v2';
export const BASE_ASSETS_URL = 'https://signaturely-assets.s3-us-west-2.amazonaws.com/';
export const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '' as string;
export const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY || '' as string;
export const GA_TRACKER_ID = process.env.REACT_APP_GA_TRACKER_ID || '' as string;
export const WOOTRIC_ID = process.env.REACT_APP_WOOTRIC_ID || '' as string;
export const UPVOTY_PUBLIC_KEY = process.env.REACT_APP_UPVOTY_PUBLIC_KEY || '' as string;

const isUnderMaintenance = process.env.REACT_APP_UNDER_MAINTENANCE  || false as string | boolean;
export const UNDER_MAINTENANCE =
  isUnderMaintenance && (isUnderMaintenance === 'true' || isUnderMaintenance === true)
    ? true
    : false;

export const GOOGLE_PIXEL_ID = process.env.REACT_APP_FB_PIXEL_ID || '' as string;

export const DROPBOX_SDK_URL = 'https://www.dropbox.com/static/api/2/dropins.js';
export const DROPBOX_APP_KEY = process.env.REACT_APP_DROPBOX_APP_KEY || '' as string;

export const ONEDRIVE_SDK_URL = 'https://js.live.net/v7.2/OneDrive.js';
export const ONEDRIVE_APP_ID = process.env.REACT_APP_ONEDRIVE_APP_ID || '' as string;

export const MAX_FILE_SIZE_MB = 40;
export const MAX_TOTAL_FILE_SIZE_MB = 100;

export const ACCESS_TOKEN_NAME = 'accessToken';

export const MIME_TYPES = {
  '.png': 'image/png',
  '.bmp': 'image/bmp',
  '.gif': 'image/gif',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.htm': 'text/html',
  '.html': 'text/html',
  '.csv': 'text/csv',
  '.rtf': 'application/rtf',
  '.txt': 'text/plain',
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.xls': 'application/vnd.ms-excel',
  '.ppt': 'application/vnd.ms-powerpoint',
  '.odt': 'application/vnd.oasis.opendocument.text',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.ppsx': 'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
};

export const GOOGLE_MIME_TYPES = {
  'application/vnd.google-apps.document': MIME_TYPES['.docx'],
  'application/vnd.google-apps.spreadsheet': MIME_TYPES['.xlsx'],
  'application/vnd.google-apps.presentation': MIME_TYPES['.pptx'],
};

export const FREE_DOCUMENTS_PER_MONTH = 3;

export const DEFAULT_CANVAS_FONTSIZE = 46;
export const DEFAULT_CANVAS_TEXT_WIDTH = 300;
export const CONFIRMATION_CODE_LENGTH = 10;
export const IDLE_TIMEOUT_MINUTES = Number(process.env.REACT_APP_IDLE_TIMEOUT_MINUTES || 5);
export const UNDER_MAINTENANCE_START = process.env.REACT_APP_UNDER_MAINTENANCE_START || false;
export const UNDER_MAINTENANCE_STOP = process.env.REACT_APP_UNDER_MAINTENANCE_STOP || false;

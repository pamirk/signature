export enum TabTypes {
  UPLOAD_FILE = 'upload',
  BULK_SEND = 'bulk',
}

interface TabItem {
  title: string;
  type: TabTypes;
}

export const tabItems: TabItem[] = [
  {
    title: 'Upload File',
    type: TabTypes.UPLOAD_FILE,
  },
  {
    title: 'Bulk Send',
    type: TabTypes.BULK_SEND,
  },
];

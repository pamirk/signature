import {
  setDocumentFields,
  createDocumentField,
  updateDocumentField,
  updateDocumentFieldLocally,
  deleteDocumentField,
  changeDocumentFieldsMeta,
  pushToDocumentFieldsHistory,
  undoDocumentFieldsHistory,
  redoDocumentFieldsHistory,
} from './actionCreators';
import sagas from './sagas';
import reducer from './reducer';

export default {
  sagas,
  reducer,
  actions: {
    setDocumentFields,
    createDocumentField,
    updateDocumentField,
    updateDocumentFieldLocally,
    deleteDocumentField,
    changeDocumentFieldsMeta,
    pushToDocumentFieldsHistory,
    undoDocumentFieldsHistory,
    redoDocumentFieldsHistory,
  },
};

export const $actions = {
  setDocumentFields,
};

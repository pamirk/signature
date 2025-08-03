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
  createEmbedDocumentField,
  updateEmbedDocumentField,
  deleteEmbedDocumentField,
  changeEmbedDocumentFieldsMeta,
  pushToEmbedDocumentFieldsHistory,
  undoEmbedDocumentFieldsHistory,
  redoEmbedDocumentFieldsHistory,
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
    createEmbedDocumentField,
    updateEmbedDocumentField,
    deleteEmbedDocumentField,
    changeEmbedDocumentFieldsMeta,
    pushToEmbedDocumentFieldsHistory,
    undoEmbedDocumentFieldsHistory,
    redoEmbedDocumentFieldsHistory,
  },
};

export const $actions = {
  setDocumentFields,
};

import { createReducer } from 'typesafe-actions';
import { NormalizedEntity } from 'Interfaces/Common';
import { Document } from 'Interfaces/Document';
import {
  createDocument,
  getDocument,
  getFormRequests,
  updateDocument,
  uploadDocument,
  cleanFileData,
  copyDocument,
  getAllDocuments,
  activateTemplate,
  revertDocument,
  mergeTemplate,
  replicateTemplate,
  getDocumentConvertionStatus,
  createDocumentFromFormRequest,
  addTemplateToApi,
  removeTemplateFromApi,
  getFormRequest,
  disableForm,
  enableForm,
  getAllTemplates,
  createDocumentByExistTemplate,
  updateDocumentByExistTemplate,
  signSeparateDocument,
  signSeparateDocumentActivities,
  deleteDocument,
  getEmbedDocument,
  updateEmbedDocument,
} from './actionCreators';
import {
  getSignerDocument,
  sendCodeAccess,
  sendDocumentOut,
  sendOutEmbedDocument,
} from '../documentSign/actionCreators';

export default createReducer({} as NormalizedEntity<Document>)
  .handleAction(
    [
      createDocument.success,
      getSignerDocument.success,
      addTemplateToApi.success,
      removeTemplateFromApi.success,
      sendCodeAccess.success,
      getDocument.success,
      updateDocument.success,
      cleanFileData.success,
      sendDocumentOut.success,
      createDocumentByExistTemplate.success,
      updateDocumentByExistTemplate.success,
      copyDocument.success,
      activateTemplate.success,
      revertDocument.success,
      replicateTemplate.success,
      mergeTemplate.success,
      createDocumentFromFormRequest.success,
      getFormRequest.success,
      disableForm.success,
      enableForm.success,
      sendOutEmbedDocument.success,
      getEmbedDocument.success,
      updateEmbedDocument.success,
    ],
    (state, action) => ({
      ...state,
      [action.payload.id]: action.payload,
    }),
  )
  .handleAction([uploadDocument.success], (state, action) => ({
    ...state,
    [action.payload.document.id]: {
      ...state[action.payload.document.id],
      ...action.payload.document,
    },
  }))
  .handleAction(
    [
      getDocumentConvertionStatus.success,
      signSeparateDocument.success,
      signSeparateDocumentActivities.success,
    ],
    (state, action) => ({
      ...state,
      [action.payload.id]: {
        ...state[action.payload.id],
        ...action.payload,
      },
    }),
  )
  .handleAction(getFormRequests.success, (state, action) => ({
    ...action.payload.documents,
  }))
  .handleAction(getAllDocuments.success, (state, action) => ({ ...action.payload }))
  .handleAction(getAllTemplates.success, (state, action) => ({
    ...state,
    ...action.payload,
  }))
  .handleAction(deleteDocument.success, (state, action) => {
    const deleteId = action.payload.documentId;
    const newState = { ...state };
    delete newState[deleteId];

    return newState;
  });

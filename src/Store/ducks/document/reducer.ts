import { createReducer } from 'typesafe-actions';
import { NormalizedEntity } from 'Interfaces/Common';
import { Document } from 'Interfaces/Document';
import {
  createDocument,
  getDocument,
  getDocuments,
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
  toggleEmailNotification,
  getAllTemplates,
} from './actionCreators';
import {
  getSignerDocument,
  sendCodeAccess,
  sendDocumentOut,
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
      uploadDocument.success,
      cleanFileData.success,
      sendDocumentOut.success,
      copyDocument.success,
      activateTemplate.success,
      revertDocument.success,
      replicateTemplate.success,
      mergeTemplate.success,
      createDocumentFromFormRequest.success,
      getFormRequest.success,
      disableForm.success,
      enableForm.success,
      toggleEmailNotification.success,
    ],
    (state, action) => ({
      ...state,
      [action.payload.id]: action.payload,
    }),
  )
  .handleAction(getDocumentConvertionStatus.success, (state, action) => ({
    ...state,
    [action.payload.id]: {
      ...state[action.payload.id],
      ...action.payload,
    },
  }))
  .handleAction(getDocuments.success, (state, action) => ({
    ...action.payload.documents,
  }))
  .handleAction(getAllDocuments.success, (state, action) => ({ ...action.payload }))
  .handleAction(getAllTemplates.success, (state, action) => ({
    ...state,
    ...action.payload,
  }));

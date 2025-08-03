import { NormalizedEntity } from 'Interfaces/Common';
import { SignatureRequest } from 'Interfaces/SignatureRequest';
import { createReducer } from 'typesafe-actions';

export default createReducer({} as NormalizedEntity<SignatureRequest>);

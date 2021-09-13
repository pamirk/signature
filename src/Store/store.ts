import { createStore, applyMiddleware } from 'redux';
import { persistStore } from 'redux-persist';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import actionPromisifyWatcher from './watchers/promisifyWatcher';
import failureWatcher from './watchers/failureWatcher';
import { rootSagas, rootReducer } from './ducks';

const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware];

if (process.env.NODE_ENV === 'development') {
  const logger:any= createLogger({ collapsed: true });
  middlewares.push(logger);
}

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(...middlewares)),
);
const persistor = persistStore(store);
const sagas = [rootSagas, actionPromisifyWatcher, failureWatcher];

sagas.forEach(saga => sagaMiddleware.run(saga));

export { store, persistor };

import React from 'react';
import ReactDOM from 'react-dom';
import 'react-toastify/dist/ReactToastify.css';
import 'Assets/styles/main.css';
import App from './App';

declare module 'typesafe-actions' {
  export type RootState = any;
  export type EmptyActionCreator = any;
}

// "prestart": "npm-link-shared ./node_modules/use-dropdown/node_modules . react",
ReactDOM.render(<App />, document.getElementById('root'));

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'react-toastify/dist/ReactToastify.css';
import 'Assets/styles/main.css';

declare module 'typesafe-actions' {
  export type RootState = any;
  export type EmptyActionCreator = any;
}

// "prestart": "npm-link-shared ./node_modules/use-dropdown/node_modules . react",
ReactDOM.render(<App />, document.getElementById('root'));

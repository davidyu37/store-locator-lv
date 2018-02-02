import React from 'react';
import ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import i18n from './components/Language/i18Next'; // initialized i18next instance

ReactDOM.render(
  <I18nextProvider i18n={i18n}>
    <App />
  </I18nextProvider>,
  document.getElementById('root'),
);
registerServiceWorker();

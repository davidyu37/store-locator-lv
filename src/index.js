import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import '.'
import i18n from './components/Language/i18Next'; // initialized i18next instance
import { I18nextProvider } from 'react-i18next';

ReactDOM.render(
  <I18nextProvider i18n={i18n}>
    <App />
  </I18nextProvider>, 
  document.getElementById('root'));
registerServiceWorker();

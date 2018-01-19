// import i18next from 'i18next';  
// import LngDetector from 'i18next-browser-languagedetector';
// import { reactI18nextModule } from 'react-i18next';

//Translation samples: http://i18next.github.io/i18next/pages/sample.html?setLng=de-DE

import i18n from 'i18next'; // Document: https://www.i18next.com/api.html#language
import XHR from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { reactI18nextModule } from 'react-i18next';


i18n
  .use(XHR)
  .use(LanguageDetector)
  .use(reactI18nextModule) // if not using I18nextProvider
  .init({
    fallbackLng: 'en',
    debug: true,
    lowerCaseLng: true,
    ns: ['translations'],
    defaultNS: 'translations',
    interpolation: {
      escapeValue: false, // not needed for react!!
    },
    // Currently using static file in /public/locales
    // backend: {
    //   loadPath: 'http://localhost:3000/{{lng}}.json',
    //   addPath: 'http://localhost:3000/{{lng}}',
    //   parse: function (data) { console.log("DATA", data) },
    //   init: {
    //     mode: 'no-cors',
    //     credentials: 'include',
    //     cache: 'default'
    //   }
    // },
    // react i18next special options (optional)
    react: {
      wait: true,
    }
  });


export default i18n;



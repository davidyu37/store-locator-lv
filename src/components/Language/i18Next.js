// import i18next from 'i18next';
// import LngDetector from 'i18next-browser-languagedetector';
// import { reactI18nextModule } from 'react-i18next';

// Translation samples: http://i18next.github.io/i18next/pages/sample.html?setLng=de-DE

import i18n from 'i18next'; // Document: https://www.i18next.com/api.html#language
import XHR from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { reactI18nextModule } from 'react-i18next';


i18n
  // TODO: should be enabled once server is up
  .use(XHR)
  .use(LanguageDetector)
  .use(reactI18nextModule) // if not using I18nextProvider
  .init({
    fallbackLng: 'en-us',
    debug: false,
    lowerCaseLng: true,
    ns: ['app', 'stores'],
    defaultNS: 'app',
    interpolation: {
      escapeValue: false, // not needed for react!!
    },
    // Currently using static file in /public/locales
    // TODO: should be enabled once server is up
    // backend: {
    //   loadPath: (lngs, namespaces) => {
    //     const userLangauge = lngs[0];
    //     let languageToRequest = 'en-us'
    //     const namespace = namespaces[0];
    //     const host = 'http://localhost:3000';

    //     //TODO: to
    //     // Check if the language is supported, if not go to en-us
    //     if (userLangauge === 'zh-cn' || userLangauge === 'zh-tw') {
    //       languageToRequest = 'zh-hans'
    //     }

    //     const url = `${host}/${namespaces[0]}/?format=json&lang=${languageToRequest}`
    //     return url;
    //   },
    //   // addPath: 'http://df5fffcd.ngrok.io/api/stores/?format=json&lang=zh-hans',
    //   init: {
    //     mode: 'cors',
    //     credentials: 'include',
    //     cache: 'default'
    //   },
    //   crossDomain: true,
    //   // ajax: function (url, options, callback, data) {
    //       //Use this if the built in ajax is not flexible enough
    //   //   console.log('ajax url', url)
    //   //   console.log('options', options)
    //   //   console.log('callback', callback);
    //   //   console.log('data', data);
    //   // },
    //   // parse: function (data) { console.log("DATA", data) },
    // },
    // react i18next special options (optional)
    react: {
      wait: true,
    },
  });


export default i18n;


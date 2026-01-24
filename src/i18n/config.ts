import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enCommon from './locales/en/common.json';
import enNavbar from './locales/en/navbar.json';
import enHome from './locales/en/home.json';
import enBooking from './locales/en/booking.json';
import enAbout from './locales/en/about.json';
import enFooter from './locales/en/footer.json';
import enAuth from './locales/en/auth.json';
import enAdmin from './locales/en/admin.json';

import svCommon from './locales/sv/common.json';
import svNavbar from './locales/sv/navbar.json';
import svHome from './locales/sv/home.json';
import svBooking from './locales/sv/booking.json';
import svAbout from './locales/sv/about.json';
import svFooter from './locales/sv/footer.json';
import svAuth from './locales/sv/auth.json';
import svAdmin from './locales/sv/admin.json';

const resources = {
  en: {
    common: enCommon,
    navbar: enNavbar,
    home: enHome,
    booking: enBooking,
    about: enAbout,
    footer: enFooter,
    auth: enAuth,
    admin: enAdmin,
  },
  sv: {
    common: svCommon,
    navbar: svNavbar,
    home: svHome,
    booking: svBooking,
    about: svAbout,
    footer: svFooter,
    auth: svAuth,
    admin: svAdmin,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'navbar', 'home', 'booking', 'about', 'footer', 'auth', 'admin'],
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  });

export default i18n;


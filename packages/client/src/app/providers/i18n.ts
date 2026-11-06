import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from '@/locales/en.json'
import ru from '@/locales/ru.json'

export const i18n = i18next.createInstance()

void i18n.use(initReactI18next).init({
  lng: 'ru',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: { translation: en },
    ru: { translation: ru },
  },
})

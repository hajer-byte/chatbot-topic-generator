import { useTranslation } from 'react-i18next';

export const translate = (key: string) => {
  const { t } = useTranslation();
  return t(key);
};
export const translateMultiple = (keys: string[]) => {
  const { t } = useTranslation();
  const translations = {};

  keys.forEach((key) => {
    translations[key] = t(key) || key;
  });

  return translations;
};


export default translate;

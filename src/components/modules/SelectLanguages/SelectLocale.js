import { React } from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { BsTranslate } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';
import { supportedLanguages } from '../../../langs/Translation';

const SelectLocale = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    // 언어 설정을 localStorage에 저장하여 페이지 새로고침 후에도 유지
    localStorage.setItem('i18nextLng', lng);
  };

  return (
    <InputGroup className='w-auto'>
      <InputGroup.Text>
        <BsTranslate />
      </InputGroup.Text>
      <Form.Select
        value={t('value')}
        onChange={(e) => {
          changeLanguage(e.target.value);
        }}
      >
        {supportedLanguages.map((lang) => {
          return (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          );
        })}
      </Form.Select>
    </InputGroup>
  );
};

export default SelectLocale;

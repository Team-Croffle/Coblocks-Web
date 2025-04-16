import { React } from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { useTranslation } from 'react-i18next';
import { supportedLanguages } from '../../../langs/Translation';

const SelectLocale = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    // 언어 설정을 localStorage에 저장하여 페이지 새로고침 후에도 유지
    localStorage.setItem('i18nextLng', lng);
  };

  return (
    <InputGroup className='w-auto'>
      <Form.Select
        defaultValue='' // 기본값 설정
        onChange={(e) => {
          changeLanguage(e.target.value);
        }}
      >
        <option value='' disabled>
          Language
        </option>
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

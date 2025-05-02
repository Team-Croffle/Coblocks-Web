import React from 'react';
import ContactList from './ContactList';
import 'bootstrap/dist/css/bootstrap.min.css';
import ContactForm from './ContactForm';

/* To do:
1. 회원과 관리자 페이지를 구분하여 문의사항을 보여주기(관리자의 경우 모든 회원의 문의를 확인 할 수 있어야 함)
2. 관리자는 문의 처리여부 및 알림을 보낼 수 있어야함
3. 문의사항을 열람할 때 어떤 형식으로 보여줄지 결정해야함
*/

const ContactContainer = () => {
  return (
    <div className='contactContainer p-2 my-0 mx-auto' style={{ width: '800px' }}>
      <section className='contactMenu'>
        <h1 className='text-center text-center mb-3'>문의하기</h1>
        <span>문의사항이 있으시면 아래 양식을 작성해주세요.</span>
        <div className='contactListContainer'>
          <div className='contactListHeader'>
            <ContactForm />
          </div>
          <ContactList />
        </div>
      </section>
    </div>
  );
};

export default ContactContainer;

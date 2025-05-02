import React, { useState, useEffect } from 'react';

const ContactList = () => {
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    const storedInquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');
    setInquiries(storedInquiries);
  }, []);

  return (
    <div className='container mt-4'>
      <h1 className='mb-4 text-center'>문의함</h1>
      {inquiries.length > 0 ? (
        <ul className='list-group'>
          {inquiries.map((inquiry, index) => {
            return (
              <li
                key={inquiry.id ? inquiry.id : index}
                className='list-group-item list-group-item-action'
                style={{ cursor: 'pointer' }}
              >
                <div className='d-flex justify-content-between align-items-start'>
                  <div className='ms-2 me-auto'>
                    <div className='fw-bold'>{inquiry.title}</div>
                    <div className='text-muted'>
                      {inquiry.date} | {inquiry.userId} | {inquiry.category}
                    </div>
                  </div>
                  <span className='badge bg-primary rounded-pill'>미처리</span>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className='text-center p-5 border rounded bg-light'>
          <p className='text-muted mb-0'>문의 내역이 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default ContactList;

import React, { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';

const ContactForm = () => {
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const onContactSubmit = (event) => {
    event.preventDefault();

    if (!category || !title || !content) {
      alert('모든 항목을 작성해주세요.');
      return;
    }

    const timeStamp = new Date();
    // 문의 작성 날짜
    const date = new Date(timeStamp).toLocaleDateString();

    // id for test
    const userId = 'testUser';

    const formData = { id: timeStamp, date, userId, category, title, content };
    try {
      const inquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');
      inquiries.push(formData);
      localStorage.setItem('inquiries', JSON.stringify(inquiries));
      alert('문의사항이 성공적으로 전송되었습니다.');
    } catch (error) {
      alert('문의사항 저장에 실패했습니다.');
      console.error('localStorage 오류:', error);
    }

    setCategory('');
    setTitle('');
    setContent('');
    setShowModal(false);
  };

  const handleShowModal = () => {
    return setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className='contactFormContainer'>
      <Button variant='primary' onClick={handleShowModal}>
        문의하기
      </Button>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>문의하기</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <section className='formContainer'>
            <Form className='contactForm' onSubmit={onContactSubmit}>
              <p>
                <span className='fw-bold border-bottom border-secondary'>문의사항을 작성해주세요.</span>
              </p>
              <Form.Group className='mb-3' controlId='contactCategory'>
                <Form.Label>문의 카테고리</Form.Label>
                <Form.Select
                  aria-label='select category'
                  value={category}
                  onChange={handleCategoryChange}
                  name='category'
                >
                  <option value=''>유형을 선택해주세요</option>
                  <option value='문제관련'>문제관련</option>
                  <option value='사이트 오류'>사이트 오류</option>
                  <option value='계정관련'>계정관련</option>
                  <option value='개선사항'>개선사항</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className='mb-3' controlId='contactTitle'>
                <Form.Label>제목</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='제목을 작성해주세요'
                  value={title}
                  onChange={handleTitleChange}
                />
              </Form.Group>
              <Form.Group className='mb-3' controlId='contactContent'>
                <Form.Label>문의 작성란</Form.Label>
                <Form.Control
                  as='textarea'
                  rows={3}
                  style={{ resize: 'none', height: '200px' }}
                  value={content}
                  onChange={handleContentChange}
                />
              </Form.Group>
              <Button type='submit' variant='secondary' style={{ margin: '0 auto', display: 'block' }}>
                보내기
              </Button>
            </Form>
          </section>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ContactForm;

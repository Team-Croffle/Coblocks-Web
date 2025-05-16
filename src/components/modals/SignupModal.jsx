import React, { useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import supabase from '@utils/supabase';

const SignupModal = ({ show, onHide }) => {
  const [formData, setFormData] = useState({
    email: '',
    nickname: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.email) throw new Error('이메일을 입력해주세요.');
    if (!formData.nickname) throw new Error('닉네임을 입력해주세요.');
    if (formData.nickname.length < 3) {
      throw new Error('닉네임은 최소 3자 이상이어야 합니다.');
    }
    if (formData.nickname.length > 20) {
      throw new Error('닉네임은 20자 이내로 입력해주세요.');
    }
    if (!/^[a-zA-Z0-9]+$/.test(formData.nickname)) {
      throw new Error('닉네임은 영문자와 숫자만 포함할 수 있습니다.');
    }
    if (!formData.password) throw new Error('비밀번호를 입력해주세요.');
    if (!formData.confirmPassword) {
      throw new Error('비밀번호 확인을 입력해주세요.');
    }
    if (formData.password !== formData.confirmPassword) {
      throw new Error('비밀번호가 일치하지 않습니다.');
    }
    if (formData.password.length < 8) {
      throw new Error('비밀번호는 최소 8자 이상이어야 합니다.');
    }
    if (!/[A-Z]/.test(formData.password)) {
      throw new Error('비밀번호는 최소 하나의 대문자를 포함해야 합니다.');
    }
    if (!/[a-z]/.test(formData.password)) {
      throw new Error('비밀번호는 최소 하나의 소문자를 포함해야 합니다.');
    }
    if (!/[0-9]/.test(formData.password)) {
      throw new Error('비밀번호는 최소 하나의 숫자를 포함해야 합니다.');
    }
    if (!/[!@#$%^&*]/.test(formData.password)) {
      throw new Error('비밀번호는 최소 하나의 특수문자(!@#$%^&*)를 포함해야 합니다.');
    }
  };

  const getErrorMessage = (error) => {
    if (error.message.includes('User already exists')) {
      return '이미 등록된 이메일입니다. 다른 이메일을 사용해주세요.';
    }
    return error.message || '오류가 발생했습니다. 다시 시도해주세요.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      validateForm();

      const { email, password } = formData;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nickname: formData.nickname,
          },
        },
      });

      if (error) throw error;

      setSuccess(true);
      // 성공 후 모달을 닫지 않고, 성공 메시지 표시
    } catch (err) {
      setError(getErrorMessage(err));
      console.error('회원가입 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // 모달 닫기 시 초기화
    if (!loading) {
      setFormData({
        email: '',
        nickname: '',
        password: '',
        confirmPassword: '',
      });
      setError(null);
      setSuccess(false);
      onHide();
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>회원가입</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant='danger'>{error}</Alert>}
        {success && (
          <Alert variant='success'>회원가입이 완료되었습니다. 이메일을 확인하여 계정을 활성화해주세요.</Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className='mb-3'>
            <Form.Label>이메일</Form.Label>
            <Form.Control
              type='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete='email'
              disabled={success}
            />
          </Form.Group>

          <Form.Group className='mb-3'>
            <Form.Label>닉네임</Form.Label>
            <Form.Control
              type='text'
              name='nickname'
              value={formData.nickname}
              onChange={handleChange}
              required
              disabled={success}
            />
            <Form.Text className='text-muted'>3-20자 영문, 숫자만 사용 가능합니다.</Form.Text>
          </Form.Group>

          <Form.Group className='mb-3'>
            <Form.Label>비밀번호</Form.Label>
            <Form.Control
              type='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete='new-password'
              disabled={success}
            />
            <Form.Text className='text-muted'>8자 이상, 대소문자, 숫자, 특수문자를 포함해야 합니다.</Form.Text>
          </Form.Group>

          <Form.Group className='mb-3'>
            <Form.Label>비밀번호 확인</Form.Label>
            <Form.Control
              type='password'
              name='confirmPassword'
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              autoComplete='new-password'
              disabled={success}
            />
          </Form.Group>

          {!success && (
            <Button
              variant='primary'
              type='submit'
              disabled={loading}
              className='w-100'
            >
              {loading ? '처리 중...' : '회원가입'}
            </Button>
          )}

          {success && (
            <Button
              variant='secondary'
              onClick={handleClose}
              className='w-100'
            >
              닫기
            </Button>
          )}
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default SignupModal;

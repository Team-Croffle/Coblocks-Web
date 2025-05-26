import React, { useState } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import SignupModal from '@modals/SignupModal';
import supabase from '@utils/supabase';
import mainLogo from '@assets/images/Logo/mainlogo-bg-tp.png';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getErrorMessage = (error) => {
    if (error.message.includes('Invalid login credentials')) {
      return '이메일 또는 비밀번호가 올바르지 않습니다.';
    }
    return '오류가 발생했습니다. 다시 시도해주세요.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { email, password } = formData;
      if (!email) throw new Error('이메일을 입력해주세요.');
      if (!password) throw new Error('비밀번호를 입력해주세요.');

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      // 로그인 성공 시 홈페이지로 이동
      navigate('/');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className='mt-5'>
      <div className='d-flex justify-content-center'>
        <Card
          className='p-4 shadow'
          style={{ maxWidth: '450px', width: '100%' }}
        >
          <Card.Body>
            <div className='text-center mb-4'>
              <img
                src={mainLogo}
                alt='메인 로고'
                style={{ height: '150px', objectFit: 'contain' }}
              />
            </div>

            {error && <Alert variant='danger'>{error}</Alert>}

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
                />
              </Form.Group>

              <Form.Group className='mb-3'>
                <Form.Label>비밀번호</Form.Label>
                <Form.Control
                  type='password'
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete='current-password'
                />
              </Form.Group>

              <div className='d-flex justify-content-end mb-3'>
                <Link to='/forgot-password'>비밀번호를 잊으셨나요?</Link>
              </div>

              <Button
                variant='primary'
                type='submit'
                disabled={loading}
                className='w-100'
              >
                {loading ? '로그인 중...' : '로그인'}
              </Button>

              <div className='text-center mt-3'>
                계정이 없으신가요?{' '}
                <Button
                  variant='link'
                  className='p-0'
                  onClick={() => setShowSignupModal(true)}
                >
                  회원가입
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>

      {/* 회원가입 모달 */}
      <SignupModal
        show={showSignupModal}
        onHide={() => setShowSignupModal(false)}
      />
    </Container>
  );
};

export default LoginPage;

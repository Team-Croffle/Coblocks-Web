import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '@utils/supabase';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [hash, setHash] = useState(null);
  const navigate = useNavigate();

  // URL 파라미터에서 해시 값 추출
  useEffect(() => {
    const url = new URL(window.location.href);
    const typeParam = url.hash
      .substring(1)
      .split('&')
      .find((param) => param.startsWith('type'))
      ?.split('=')[1];

    const accessToken = url.hash
      .substring(1)
      .split('&')
      .find((param) => param.startsWith('access_token'));

    console.log('URL:', url);
    console.log('Type Parameter:', typeParam);
    console.log('Access Token:', accessToken);

    if (typeParam === 'recovery' && accessToken) {
      const token = accessToken.split('=')[1];
      setHash(token);
    } else {
      setError('유효하지 않은 비밀번호 재설정 링크입니다.');
    }
  }, []);

  const validatePassword = (password) => {
    if (password.length < 8) {
      return '비밀번호는 최소 8자 이상이어야 합니다.';
    }
    if (!/[A-Z]/.test(password)) {
      return '비밀번호는 최소 하나의 대문자를 포함해야 합니다.';
    }
    if (!/[a-z]/.test(password)) {
      return '비밀번호는 최소 하나의 소문자를 포함해야 합니다.';
    }
    if (!/[0-9]/.test(password)) {
      return '비밀번호는 최소 하나의 숫자를 포함해야 합니다.';
    }
    if (!/[!@#$%^&*]/.test(password)) {
      return '비밀번호는 최소 하나의 특수문자(!@#$%^&*)를 포함해야 합니다.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 비밀번호 유효성 검사
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    // 비밀번호 일치 확인
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError('비밀번호 재설정 중 오류가 발생했습니다: ' + err.message);
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
            <h2 className='text-center mb-4'>비밀번호 재설정</h2>

            {error && <Alert variant='danger'>{error}</Alert>}

            {success ? (
              <Alert variant='success'>
                비밀번호가 성공적으로 재설정되었습니다. 3초 후 로그인 페이지로 이동합니다.
              </Alert>
            ) : (
              <Form onSubmit={handleSubmit}>
                <Form.Group className='mb-3'>
                  <Form.Label>새 비밀번호</Form.Label>
                  <Form.Control
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete='new-password'
                  />
                  <Form.Text className='text-muted'>8자 이상, 대소문자, 숫자, 특수문자를 포함해야 합니다.</Form.Text>
                </Form.Group>

                <Form.Group className='mb-4'>
                  <Form.Label>새 비밀번호 확인</Form.Label>
                  <Form.Control
                    type='password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    autoComplete='new-password'
                  />
                </Form.Group>

                <Button
                  variant='primary'
                  type='submit'
                  disabled={loading || !hash}
                  className='w-100 mb-3'
                >
                  {loading ? '처리 중...' : '비밀번호 재설정'}
                </Button>

                <div className='text-center'>
                  <Link to='/login'>로그인 페이지로 돌아가기</Link>
                </div>
              </Form>
            )}
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default ResetPasswordPage;

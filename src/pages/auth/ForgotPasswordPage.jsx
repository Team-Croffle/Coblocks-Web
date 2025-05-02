import React, { useState } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import supabase from '@utils/supabase';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!email) {
      setError('이메일을 입력해주세요.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setSuccess(true);
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError('비밀번호 재설정 이메일 전송 중 오류가 발생했습니다.');
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
            <h2 className='text-center mb-4'>비밀번호 찾기</h2>

            {error && <Alert variant='danger'>{error}</Alert>}
            {success && (
              <Alert variant='success'>비밀번호 재설정 링크가 이메일로 전송되었습니다. 이메일을 확인해주세요.</Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className='mb-4'>
                <Form.Label>이메일</Form.Label>
                <Form.Control
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete='email'
                  disabled={success}
                />
                <Form.Text className='text-muted'>
                  가입 시 사용한 이메일을 입력하시면 비밀번호 재설정 링크를 보내드립니다.
                </Form.Text>
              </Form.Group>

              {!success && (
                <Button
                  variant='primary'
                  type='submit'
                  disabled={loading}
                  className='w-100 mb-3'
                >
                  {loading ? '처리 중...' : '비밀번호 재설정 링크 받기'}
                </Button>
              )}

              <div className='text-center'>
                <Link
                  to='/login'
                  className='btn btn-link'
                >
                  로그인 페이지로 돌아가기
                </Link>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default ForgotPasswordPage;

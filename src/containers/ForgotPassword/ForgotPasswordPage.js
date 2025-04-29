import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isEmailDisabled, setIsEmailDisabled] = useState(false); // 추가된 상태
  const [timer, setTimer] = useState(300); // 5분(300초) 타이머 상태 추가

  useEffect(() => {
    let interval;
    if (showCodeInput && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          return prevTimer - 1; // 중괄호 추가
        });
      }, 1000);
    }
    return () => {
      clearInterval(interval); // 중괄호 추가
    };
  }, [showCodeInput, timer]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('이메일을 다시 확인해주세요.');
      return;
    }
    if (!showCodeInput) {
      alert(`인증코드가 ${email} 로 전송되었습니다.`);
      setShowCodeInput(true);
      setIsEmailDisabled(true); // 이메일 입력 비활성화
      setTimer(300); // 타이머 초기화
    } else {
      alert(`입력한 인증코드: ${verificationCode}`);
    }
  };

  const handleResendCode = () => {
    alert('인증코드가 재전송되었습니다.');
    setTimer(300); // 타이머 초기화
  };

  return (
    <div className='d-flex justify-content-center align-items-center mt-5'>
      <Form className='shadow p-3 mb-5 bg-white rounded' onSubmit={handleSubmit}>
        <div className='text-center mb-4'>
          <h3>비밀번호 찾기</h3>
        </div>
        <Form.Group controlId='formGroupEmail'>
          <Form.Label>이메일</Form.Label>
          <Form.Control
            type='email'
            placeholder='이메일 입력'
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            disabled={isEmailDisabled} // 비활성화 상태 적용
            style={{ width: '250px', fontSize: '12px' }}
          />
        </Form.Group>
        {showCodeInput && (
          <Form.Group controlId='formGroupCode' className='mt-3'>
            <Form.Label>인증코드</Form.Label>
            <div className='position-relative d-flex align-items-center' style={{ width: '250px' }}>
              <Form.Control
                type='text'
                placeholder='6자리 인증코드 입력'
                value={verificationCode}
                onChange={(e) => {
                  setVerificationCode(e.target.value);
                }}
                style={{ fontSize: '12px', paddingRight: '50px' }} // 오른쪽 여백 추가
              />
              <span
                className='position-absolute'
                style={{
                  top: '50%',
                  right: '80px',
                  transform: 'translateY(-50%)',
                  fontSize: '12px',
                  color: 'red',
                }}
              >
                {formatTime(timer)}
              </span>
              <Button
                onClick={handleResendCode}
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '10px',
                  transform: 'translateY(-50%)',
                  fontSize: '12px',
                  padding: '5px 10px',
                }}
              >
                재전송
              </Button>
            </div>
          </Form.Group>
        )}
        <div className='text-center mt-4'>
          <Button type='submit' className='btn btn-primary'>
            {showCodeInput ? '코드 확인하기' : '이메일 인증하기'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ForgotPasswordPage;

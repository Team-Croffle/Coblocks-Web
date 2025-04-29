import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import coblocksLogo from '../../assets/images/mainlogo-bg-tp.png';

const User = {
  email: 'abc@naver.com',
  pw: 'System2000!!',
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(false); // 모달 상태 추가
  const [isVerificationDisabled, setIsVerificationDisabled] = useState(false);
  const [timer, setTimer] = useState(0);

  const [, setEmailValid] = useState(false);
  const [, setPwValid] = useState(false);

  const nicknameRef = useRef(null);
  const emailPart1Ref = useRef(null);
  const emailPart2Ref = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          return prev - 1; // 중괄호와 return 추가
        });
      }, 1000);
    } else if (timer === 0 && isVerificationDisabled) {
      setIsVerificationDisabled(false);
    }
    return () => {
      clearInterval(interval);
    };
  }, [timer, isVerificationDisabled]);

  const handleEmail = (e) => {
    setEmail(e.target.value);
    const regex =
      /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:"]+\.)+[^<>()[\].,;:"]{2,})$/i;
    if (regex.test(e.target.value)) {
      setEmailValid(true);
    } else {
      setEmailValid(false);
    }
  };

  const handlePw = (e) => {
    setPw(e.target.value);
    const regex = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&()\-_=+])(?!.*[^a-zA-z0-9$`~!@$!%*#^?&()\-_=+]).{6,}$/;
    if (regex.test(e.target.value)) {
      setPwValid(true);
    } else {
      setPwValid(false);
    }
  };

  const onClickConfirmButton = (e) => {
    e.preventDefault();
    if (email === User.email && pw === User.pw) {
      alert('로그인에 성공했습니다.');
    } else {
      alert('등록되지 않은 회원이거나 입력한 값이 일치하지 않습니다.');
    }
  };

  const handleRegister = () => {
    const nickname = nicknameRef.current.value.trim();
    const emailPart1 = emailPart1Ref.current.value.trim();
    const emailPart2 = emailPart2Ref.current.value.trim();
    const password = passwordRef.current.value.trim();
    const confirmPassword = confirmPasswordRef.current.value.trim();

    if (!nickname || !emailPart1 || !emailPart2 || !password || !confirmPassword) {
      alert('입력란을 모두 채워 주십시오.');
      return;
    }

    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 회원가입 로직 추가 가능
    alert('회원가입이 완료되었습니다.');
  };

  const handleVerification = () => {
    setIsVerificationDisabled(true);
    setTimer(300); // 5분 = 300초
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className='d-flex justify-content-center align-items-center mt-5'>
      <Form className='shadow p-3 mb-5 bg-white rounded'>
        <div className='text-center mb-4'>
          <img
            src={coblocksLogo}
            alt='Coblocks Logo'
            className='img-fluid'
            style={{ width: '150px', height: 'auto' }} // 이미지 크기 조정
          />
        </div>
        <div>
          <Form.Group controlId='formGroupEmail'>
            <Form.Label>ID</Form.Label>
            <Form.Control
              type='email'
              placeholder='ID'
              value={email}
              onChange={handleEmail}
              style={{ width: '250px', fontSize: '12px' }}
            />
          </Form.Group>

          <Form.Group controlId='formGroupPassword' className='mt-3'>
            <Form.Label>PW</Form.Label>
            <Form.Control
              type='password'
              placeholder='********'
              value={pw}
              onChange={handlePw}
              style={{ width: '250px', fontSize: '12px' }}
            />
          </Form.Group>
        </div>

        <div className='text-center mt-4'>
          <button type='submit' onClick={onClickConfirmButton} className='btn btn-primary'>
            로그인
          </button>
        </div>
        <div className='d-flex justify-content-between mt-4' style={{ fontSize: '12px' }}>
          <Link to='/forgot-password' style={{ color: 'gray' }}>
            비밀번호 찾기
          </Link>
          <span
            style={{ color: 'gray', cursor: 'pointer' }}
            role='button'
            tabIndex={0}
            onClick={() => {
              setShowRegisterModal(true); // 모달 열기
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setShowRegisterModal(true); // 키보드로 모달 열기
              }
            }}
          >
            가입하기
          </span>
        </div>
      </Form>

      {/* 회원가입 모달 */}
      <Modal
        show={showRegisterModal}
        onHide={() => {
          setShowRegisterModal(false); // 블록 문 추가
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>회원가입</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* 이름 입력 필드 제거 */}
            {/* 아이디 입력 필드 제거 */}
            <Form.Group controlId='registerNickname' className='mt-3'>
              <Form.Label>닉네임</Form.Label>
              <Form.Control
                ref={nicknameRef}
                type='text'
                placeholder='닉네임 입력'
                style={{ width: '250px', fontSize: '12px' }}
              />
            </Form.Group>
            <Form.Group controlId='registerEmail' className='mt-3'>
              <Form.Label>이메일</Form.Label>
              <div className='d-flex align-items-center'>
                <Form.Control
                  ref={emailPart1Ref}
                  type='text'
                  placeholder='example'
                  className='me-2'
                  style={{ width: '120px', fontSize: '12px' }}
                />
                <span>@</span>
                <Form.Control
                  ref={emailPart2Ref}
                  type='text'
                  placeholder='example.com'
                  className='ms-2'
                  style={{ width: '120px', fontSize: '12px' }}
                />
                <Button
                  variant={isVerificationDisabled ? 'secondary' : 'outline-primary'}
                  className='ms-2'
                  style={{ fontSize: '12px' }}
                  onClick={handleVerification}
                  disabled={isVerificationDisabled}
                >
                  {isVerificationDisabled ? `${formatTime(timer)}` : '인증하기'}
                </Button>
                {isVerificationDisabled && (
                  <Button
                    variant='outline-secondary'
                    className='ms-2'
                    style={{ fontSize: '12px' }}
                    onClick={() => {
                      setTimer(300); // 타이머 초기화
                      alert('인증코드가 재전송되었습니다.'); // 메시지 추가
                    }}
                  >
                    재전송
                  </Button>
                )}
              </div>
              {isVerificationDisabled && (
                <div className='d-flex align-items-center mt-2'>
                  <Form.Control type='text' placeholder='인증코드' style={{ width: '120px', fontSize: '12px' }} />
                </div>
              )}
            </Form.Group>
            <Form.Group controlId='registerPassword' className='mt-3'>
              <Form.Label>비밀번호</Form.Label>
              <Form.Control
                ref={passwordRef}
                type='password'
                placeholder='비밀번호 입력'
                style={{ width: '250px', fontSize: '12px' }}
              />
            </Form.Group>
            <Form.Group controlId='registerConfirmPassword' className='mt-3'>
              <Form.Label>비밀번호 확인</Form.Label>
              <Form.Control
                ref={confirmPasswordRef}
                type='password'
                placeholder='비밀번호 확인'
                style={{ width: '250px', fontSize: '12px' }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='primary'
            onClick={handleRegister} // 회원가입 버튼 클릭 핸들러 추가
          >
            회원가입
          </Button>
          <Button
            variant='secondary'
            onClick={() => {
              setShowRegisterModal(false); // 모달 닫기
              setIsVerificationDisabled(false); // 인증 버튼 활성화
              setTimer(0); // 타이머 초기화
            }}
          >
            닫기
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default Login;

import { React, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AiOutlineUser, AiFillHome } from 'react-icons/ai';
import { FaSchool } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Nav, Navbar, Button, Dropdown } from 'react-bootstrap';
import mainLogo from '@assets/images/Logo/minilogo-bg-tp.png';
import supabase from '@utils/supabase'; // Supabase client import

const NavigationBar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 기본값을 true로 설정 (개발후 로그아웃 상태로 개발)
  const [user, setUser] = useState(null); // User Information
  const [isNavbarExpanded, setIsNavbarExpanded] = useState(false);

  useEffect(() => {
    // Check current login session
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsLoggedIn(!!session); // Update login state based on session
      setUser(session?.user || null); // Update user information
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setIsLoggedIn(!!session); // Update login state based on session
      setUser(session?.user || null); // Update user information
    });

    return () => {
      subscription.unsubscribe(); // Unsubscribe from auth state changes on component unmount
    };
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      alert('로그아웃 되셨습니다.');
      navigate('/');
    } else {
      console.error('로그아웃 오류:', error);
      alert('로그아웃 중 오류가 발생했습니다.');
    }
  };

  const handleUserClick = () => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  };

  const memberBtn = () => {
    if (isLoggedIn) {
      return (
        <Dropdown>
          <Dropdown.Toggle
            as={Button}
            variant='outline-light'
            className='d-flex align-items-center justify-content-center p-2'
            style={{ width: '50px', height: '50px' }} // 박스 크기 키움
          >
            <AiOutlineUser style={{ fontSize: '2rem' }} /> {/* 아이콘 크기 키움 */}
          </Dropdown.Toggle>
          <Dropdown.Menu align='end'>
            <Dropdown.ItemText className='test-startA'>
              {user?.user_metadata.email + '\n' + user?.user_metadata.nickname} {/* 이메일 표시 */}
            </Dropdown.ItemText>
            <Dropdown.Item
              as={Link}
              to='/profile'
            >
              회원정보 {/* 회원정보 */}
            </Dropdown.Item>
            <Dropdown.Item onClick={handleLogout}>
              {t('nav.logout')} {/* 로그아웃 */}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );
    }
    return (
      <Button
        variant='outline-light'
        className='d-flex align-items-center justify-content-center p-2'
        style={{ width: '50px', height: '50px' }} // 박스 크기 키움
        onClick={handleUserClick}
      >
        <AiOutlineUser style={{ fontSize: '2rem' }} /> {/* 아이콘 크기 키움 */}
      </Button>
    );
  };

  return (
    <Navbar
      expand='lg'
      className='shadow py-3'
      expanded={isNavbarExpanded}
      onToggle={setIsNavbarExpanded}
      style={{ backgroundColor: '#5193d9' }} // 살짝 진한 하늘색 배경색 설정
    >
      <Container>
        <Navbar.Toggle
          aria-controls='basic-navbar-nav'
          className='text-light'
          onClick={() => {
            setIsNavbarExpanded(!isNavbarExpanded);
          }}
        />
        <div className='d-flex align-items-center'>
          <Navbar.Brand
            as={Link}
            to='/'
            className='text-light rounded px-2 py-1 me-3'
          >
            <img
              src={mainLogo}
              alt='Logo'
              style={{ height: '60px' }}
            />{' '}
            {/* 로고 크기를 키움 */}
          </Navbar.Brand>
        </div>
        {/* 화면이 Collapse 되었을 때 (lg 미만) memberBtn을 Nav 메뉴 오른쪽에 배치 */}
        <div className='d-lg-none'>{memberBtn()}</div>
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='me-auto'>
            <Nav.Link
              as={Link}
              to='/'
              className='text-light rounded px-3 py-2 me-2 d-flex align-items-center'
              style={{
                border: '2px solid white', // 흰색 테두리 추가
                borderRadius: '5px', // 테두리 모서리를 둥글게
                padding: '5px 10px', // 내부 여백 추가
              }}
            >
              <AiFillHome style={{ fontSize: '1.5rem', marginRight: '5px' }} /> {/* 아이콘 추가 */}
              {t('nav.home')}
            </Nav.Link>
            <Nav.Link
              as={Link}
              to='/classroom-main'
              className='text-light rounded px-3 py-2 me-2 d-flex align-items-center'
              style={{
                border: '2px solid white',
                borderRadius: '5px',
                padding: '5px 10px',
              }}
            >
              <FaSchool style={{ fontSize: '1.5rem', marginRight: '5px' }} /> {/* 아이콘 추가 */}
              {t('nav.classroom')}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
        {/* 화면이 Collapse 되지 않았을 때 (lg 이상) memberBtn을 오른쪽에 배치 */}
        <div className='d-none d-lg-flex align-items-center ms-auto'>{memberBtn()}</div>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;

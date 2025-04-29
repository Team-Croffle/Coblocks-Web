import { React, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AiOutlineUser, AiFillHome } from 'react-icons/ai';
import { FaSchool } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import mainLogo from '../../../assets/images/mainlogo-bg-tp.png';

const NavigationBar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(true); // 로그인 상태 기본값을 true로 설정 (개발후 로그아웃 상태로 개발)
  const [isNavbarExpanded, setIsNavbarExpanded] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
    alert('로그아웃 되셨습니다.');
    navigate('/'); // 홈 페이지로 이동
  };

  const handleUserClick = () => {
    if (!isLoggedIn) {
      navigate('/login'); // 로그인 페이지로 이동
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
            <Dropdown.Item as={Link} to='/profile'>
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
    <Navbar expand='lg' className='bg-secondary shadow py-3' expanded={isNavbarExpanded} onToggle={setIsNavbarExpanded}>
      <Container>
        <Navbar.Toggle
          aria-controls='basic-navbar-nav'
          className='text-light'
          onClick={() => {
            setIsNavbarExpanded(!isNavbarExpanded);
          }}
        />
        <div className='d-flex align-items-center'>
          <Navbar.Brand as={Link} to='/' className='text-light rounded px-2 py-1 me-3'>
            <img src={mainLogo} alt='Logo' style={{ height: '60px' }} /> {/* 로고 크기를 키움 */}
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
              to='/classroom'
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

import { React, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AiOutlineUser } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import SelectLocale from '../../modules/SelectLanguages/SelectLocale';

const NavigationBar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(true); // 로그인 상태 기본값을 true로 설정 (개발후 로그아웃 상태로 개발)

  const handleLogout = () => {
    setIsLoggedIn(false);
    alert('You have been logged out.');
  };

  const handleUserClick = () => {
    if (!isLoggedIn) {
      navigate('/login'); // 로그인 페이지로 이동
    }
  };

  return (
    <Navbar expand='lg' className='bg-secondary shadow py-3'>
      <Container>
        <div className='d-flex align-items-center'>
          <Navbar.Brand as={Link} to='/' className='text-light rounded px-2 py-1 me-3'>
            Logo
          </Navbar.Brand>
          {isLoggedIn ? (
            <Dropdown>
              <Dropdown.Toggle
                as={Button}
                variant='outline-light'
                className='d-flex align-items-center justify-content-center p-2 me-3'
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
          ) : (
            <Button
              variant='outline-light'
              className='d-flex align-items-center justify-content-center p-2 me-3'
              style={{ width: '50px', height: '50px' }} // 박스 크기 키움
              onClick={handleUserClick}
            >
              <AiOutlineUser style={{ fontSize: '2rem' }} /> {/* 아이콘 크기 키움 */}
            </Button>
          )}
        </div>
        <Navbar.Toggle aria-controls='basic-navbar-nav' className='text-light' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='me-auto'>
            <Nav.Link as={Link} to='/' className='text-light rounded px-3 py-2 me-2'>
              {t('nav.home')}
            </Nav.Link>
            <Nav.Link as={Link} to='/classroom' className='text-light rounded px-3 py-2'>
              {t('nav.classroom')}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <div className='d-flex align-items-center'>
          <Navbar.Text className='d-flex align-items-center'>
            <SelectLocale />
          </Navbar.Text>
        </div>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;

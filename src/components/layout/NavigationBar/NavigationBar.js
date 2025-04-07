import { React } from 'react';
import { useTranslation } from 'react-i18next';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import SelectLocale from '../../modules/SelectLanguages/SelectLocale';

const NavigationBar = () => {
  const { t } = useTranslation();

  return (
    <Navbar expand='lg' className='bg-body-tertinary shadow py-3'>
      <Container>
        <Navbar.Brand href='#home'>Logo</Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='me-auto'>
            <Nav.Link href='#home'>{t('nav.home')}</Nav.Link>
            <Nav.Link href='#link'>{t('nav.classroom')}</Nav.Link>
            <NavDropdown title={t('nav.algorithm')} id='basic-nav-dropdown'>
              <NavDropdown.Item href='#action/3.1'>{t('nav.beginner')}</NavDropdown.Item>
              <NavDropdown.Item href='#action/3.2'>{t('nav.intermediate')}</NavDropdown.Item>
              <NavDropdown.Item href='#action/3.3'>{t('nav.advanced')}</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href='#action/3.4'>Separated link</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
        <SelectLocale /> {/* 언어 선택기, 다른데로 옮겨서 사용가능 */}
      </Container>
    </Navbar>
  );
};

export default NavigationBar;

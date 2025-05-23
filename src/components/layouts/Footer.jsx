import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer
      className='py-2'
      style={{
        backgroundColor: '#000',
        color: '#fff',
        position: 'fixed',
        left: 0,
        bottom: 0,
        width: '100%',
        zIndex: 100,
        fontSize: '0.85rem',
      }}
    >
      <Container>
        <Row>
          <Col className='text-center'>
            <div>
              <strong>Create by Team.Croffle</strong> |{' '}
              <Link
                to='/developer-info'
                style={{ color: '#fff', textDecoration: 'underline' }}
              >
                팀원소개
              </Link>{' '}
              | <strong>이메일:</strong> croffledev@gmail.com | <strong>학교:</strong>{' '}
              <a
                href='https://www.wku.ac.kr/'
                target='_blank'
                rel='noopener noreferrer'
                style={{ color: '#fff', textDecoration: 'underline' }}
              >
                원광대학교
              </a>{' '}
              | <strong>학과:</strong> 컴퓨터소프트웨어공학과 | <strong>주소:</strong> 전북특별자치도 익산시 익산대로
              460
            </div>
            <div className='mt-1'>
              <small>&copy; {new Date().getFullYear()} Coblocks. All rights reserved.</small>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;

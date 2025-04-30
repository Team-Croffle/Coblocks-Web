import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DeveloperCard from './Card';
import Developers from './Developers.json';

const developerInfo = () => {
  return (
    <div className='bg-primary bg-opacity-25 p-4 rounded-4 mx-auto my-4 mt-2 mb-5' style={{ maxWidth: '1000px' }}>
      <Container>
        <Row className='justify-content-md-center mb-3'>
          <Col md='auto' className='mx-3'>
            <DeveloperCard developer={Developers.developers[0]} />
          </Col>
          <Col md='auto' className='mx-3'>
            <DeveloperCard developer={Developers.developers[1]} />
          </Col>
        </Row>
        <Row className='justify-content-md-center'>
          <Col md='auto' className='mx-3'>
            <DeveloperCard developer={Developers.developers[2]} />
          </Col>
          <Col md='auto' className='mx-3'>
            <DeveloperCard developer={Developers.developers[3]} />
          </Col>
          <Col md='auto' className='mx-3'>
            <DeveloperCard developer={Developers.developers[4]} />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default developerInfo;

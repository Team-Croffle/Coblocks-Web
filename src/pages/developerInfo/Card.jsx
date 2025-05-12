import React from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import { FaGithub, FaInstagram } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import InfoCSS from './DeveloperInfo.module.css';
import mbtiImages from '../../assets/images/DeveloperInfoMbti/MBTI';
import wkuLogo from '../../assets/images/wkuLogo/wkuLogo.png';

const DeveloperCard = ({ developer }) => {
  return (
    <Card className={InfoCSS.customCard}>
      <Card.Body>
        <Card.Title style={{ textAlign: 'center' }}>
          <h5 className='fw-bold'>Team Croffle</h5>
        </Card.Title>
        <Card.Img
          className='d-flex mx-auto'
          style={{ width: '10rem', height: 'auto' }}
          src={mbtiImages[developer.mbti]}
        />
        <Container className='text-end px-0 mx-0'>
          <div className='mt-3'>
            <Card.Img
              className='me-1'
              src={wkuLogo}
              style={{ width: '1.6rem', height: 'auto' }}
            />
            <span>{developer.school}</span>
          </div>
          <div>
            <p className='m-1 mb-2'>{developer.name}</p>
            <p
              className='m-1 mb-2'
              style={{ fontSize: '0.8rem' }}
            >
              {developer.major}
            </p>
            <span className='m-2 fs-4'>
              <a
                className='m-1'
                href={developer.github}
                target='_blank'
                rel='noopener noreferrer'
              >
                <FaGithub />
              </a>
              <a
                className='ml-2'
                href={developer.insta}
                target='_blank'
                rel='noopener noreferrer'
              >
                <FaInstagram />
              </a>
            </span>
          </div>
        </Container>
        <p
          className='mx-0 mt-2 mb-0 text-end'
          style={{ fontSize: '0.7rem' }}
        >
          <MdEmail /> Email:
          <br />
          {developer.email}
        </p>
      </Card.Body>
    </Card>
  );
};

DeveloperCard.propTypes = {
  developer: PropTypes.shape({
    name: PropTypes.string.isRequired,
    school: PropTypes.string.isRequired,
    major: PropTypes.string.isRequired,
    github: PropTypes.string.isRequired,
    insta: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    mbti: PropTypes.string.isRequired,
  }).isRequired,
};

export default DeveloperCard;

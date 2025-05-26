import React from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import { FaGithub, FaInstagram } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import InfoCSS from './DeveloperInfo.module.css';
import mbtiImages from '@assets/images/DeveloperInfoMbti/MBTI';
import wkuLogo from '@assets/images/Logo/wkuLogo.png';

const DeveloperCard = ({ developer }) => {
  return (
    <Card className={InfoCSS.customCard}>
      <Card.Body
        className='text-center'
        style={{ fontSize: '0.75rem' }} // 전체 글자 크기 축소
      >
        <Card.Title>
          <h5
            className='fw-bold mb-2'
            style={{ fontSize: '1rem' }} // 제목 크기 축소
          >
            Team Croffle
          </h5>
        </Card.Title>
        <Card.Img
          className='d-block mx-auto mb-3'
          style={{ width: '5rem', height: 'auto' }} // 이미지 크기 축소
          src={mbtiImages[developer.mbti]}
          alt='MBTI'
        />
        <div className='text-start'>
          <div
            className='d-flex align-items-center mb-2'
            style={{ fontSize: '0.85rem' }} // 텍스트 크기 축소
          >
            <Card.Img
              className='me-2'
              src={wkuLogo}
              style={{ width: '1rem', height: 'auto' }} // 로고 크기 축소
              alt='School Logo'
            />
            <span>{developer.school}</span>
          </div>
          <p
            className='m-1 mb-2 fw-bold'
            style={{ fontSize: '0.85rem' }} // 이름 크기 축소
          >
            {developer.name}
          </p>
          <p
            className='m-1 mb-2'
            style={{ fontSize: '0.7rem' }} // 전공 크기 축소
          >
            {developer.major}
          </p>
          <div className='d-flex justify-content-center mb-2'>
            <a
              className='m-1'
              href={developer.github}
              target='_blank'
              rel='noopener noreferrer'
              aria-label='GitHub'
            >
              <FaGithub style={{ fontSize: '1rem' }} /> {/* 아이콘 크기 축소 */}
            </a>
            <a
              className='m-1'
              href={developer.insta}
              target='_blank'
              rel='noopener noreferrer'
              aria-label='Instagram'
            >
              <FaInstagram style={{ fontSize: '1rem' }} /> {/* 아이콘 크기 축소 */}
            </a>
          </div>
          <div
            className='mt-2 d-flex align-items-center justify-content-center'
            style={{
              fontSize: '0.65rem', // 이메일 섹션 글자 크기 축소
              wordWrap: 'break-word',
            }}
          >
            <MdEmail style={{ fontSize: '0.9rem', marginRight: '0.5rem' }} /> {/* 아이콘 크기 축소 */}
            <a
              href={`mailto:${developer.email}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
              aria-label='Send Email'
            >
              {developer.email}
            </a>
          </div>
        </div>
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

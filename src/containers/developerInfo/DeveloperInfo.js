import React from 'react';
import './DeveloperInfo.css';
import Card from './Card';

const DeveloperInfo = () => {
  return (
    <div className='mainBoard'>
      <div className='row'>
        <Card />
        <Card />
        <Card />
      </div>
      <div className='row'>
        <Card />
        <Card />
      </div>
    </div>
  );
};

export default DeveloperInfo;

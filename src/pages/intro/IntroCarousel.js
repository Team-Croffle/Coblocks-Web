import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { FaCubes, FaComments, FaUserPlus, FaCode } from 'react-icons/fa6';
import carouselData from '../../data/CarouselData.json';
import 'bootstrap/dist/css/bootstrap.min.css';
import './IntroCarousel.css';

const iconMap = {
  FaCubes,
  FaComments,
  FaUserPlus,
  FaCode,
};

const IntroCarousel = () => {
  const carouselItems = Object.values(carouselData);

  return (
    <Carousel>
      {carouselItems.map((item) => {
        const IconComponent = iconMap[item.icons];
        return (
          <Carousel.Item key={item.id}>
            <Carousel.Caption>
              {IconComponent && <IconComponent size='2rem' />}
              <h3>{item.title}</h3>
              <p>{item.content}</p>
            </Carousel.Caption>
          </Carousel.Item>
        );
      })}
    </Carousel>
  );
};

export default IntroCarousel;

import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './sliders.css';

var settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  draggble: true,
  arrows: true,
  accessibility: true,
  slidesToScroll: 2,
  responsive: [
    {
      breakpoint: 900,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    },
  ]
};

class SlickSlider extends React.Component {

  render() {
    
    return (
      <Slider style={{width: '100%'}} {...{...settings, ...this.props.settings }} >
        {this.props.children}
      </Slider>
    );
  }
}

export default SlickSlider;
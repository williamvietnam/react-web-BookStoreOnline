import React from 'react';
import './sliders.css';
import { NavLink } from 'react-router-dom';

function MainSlider(props){
    return (<div style={{display: 'block'}} className="slider-area brown__nav slider--15 slide__activation slide__arrow01 owl-carousel owl-theme">
    {/* Start Single Slide */}
    <div className="slide animation__style10 bg-image--1 fullscreen align__center--left">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="slider__content">
              <div className="contentbox">
                <h2>Mua <span>Sách </span></h2>
                <h2>Ưa Thích<span>Của Bạn </span></h2>
                <h2>Ở <span>Đây </span></h2>
                <NavLink className="shopbtn" to="/books">Mua ngay</NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    {/* End Single Slide */}
    </div>
    )
}

export default MainSlider;
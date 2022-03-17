import React, { useEffect, Fragment } from 'react';
import ProductItem from './ProductItem';
import SlickSlider from '../shared/slider/SlickSlider';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../shared/slider/sliders.css';
import { GET_BOOKS, GET_BOOKS_FOR_BROWSING } from '../../api/bookApi';
import { useQuery } from '@apollo/react-hooks';
import { Skeleton, Empty } from 'antd';

function ProductSection(props) {


  const { sectionName, variables, isFullWidth, slickSettings } = props;

  const { loading, error, data={} } = useQuery(GET_BOOKS_FOR_BROWSING, {
    variables,
  })

  if (loading) return (<section className="wn__product__area brown--color pt--80  pb--30">
    <div className="container" style={{ maxWidth: isFullWidth ? '100%' : undefined }}>
      <div className="row">
        <div className="col-lg-12">
          <div className="section__title text-center">
            <h2 className="title__be--2" style={{ color: '#CE7852' }}>{sectionName}</h2>
            <hr />
            <br />
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        <SlickSlider settings={slickSettings}>
          <div style={{ padding: 8 }}>
            <Skeleton active />
          </div>
          <div style={{ padding: 8 }}>
            <Skeleton active />
          </div>
          <div style={{ padding: 8 }}>
            <Skeleton active />
          </div>
          <div style={{ padding: 8 }}>
            <Skeleton active />
          </div>
          <div style={{ padding: 8 }}>
            <Skeleton active />
          </div>
          <div style={{ padding: 8 }}>
            <Skeleton active />
          </div>
          <div style={{ padding: 8 }}>
            <Skeleton active />
          </div>
        </SlickSlider>
      </div>
    </div>
  </section>)

  const renderProducts = () => {
    return data.getBooksForBrowsing.books.map((book, index) => {
      return (
        <div key={index}><ProductItem width={250} thumbHeight={280} book={book} /></div>
      )
    });
  }

  return (<section className="wn__product__area brown--color pt--80  pb--30">
    <div className="container" style={{ maxWidth: isFullWidth ? '100%' : undefined }}>
      <div className="row">
        <div className="col-lg-12">
          <div className="section__title text-center">
            <h2 className="title__be--2" style={{ color: '#CE7852' }}>{sectionName}</h2>
            <hr />
            <br />
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {data.getBooksForBrowsing&&data.getBooksForBrowsing.books&&data.getBooksForBrowsing.books.length>0?<SlickSlider settings={slickSettings}>
          {renderProducts()}
        </SlickSlider>:<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={"Không có dữ liệu"}/>}
      </div>
    </div>
  </section>)
}


export default ProductSection;
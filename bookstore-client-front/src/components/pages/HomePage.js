import React, { Fragment } from 'react';
import SlickSlider from '../shared/slider/SlickSlider';
import MainSlider from '../shared/slider/MainSlider';
import ProductSectionContainer from '../../containers/products/ProductSectionContainer';

function HomePage(props) {
    return (
        <Fragment>
            <SlickSlider settings={{ slidesToShow: 1, dots: false, arrows: true, slidesToScroll: 1, autoplay: true }}>
                <MainSlider />
            </SlickSlider>
            <ProductSectionContainer isFullWidth slickSettings={{
                slidesToShow: 5,
                rows: 1,
                dots: false, slidesToScroll: 4, autoplay: true
            }} sectionName={"Sách mới"} variables={{
                orderBy: 'createdAt_DESC',
                skip: 0,
                first: 20,
            }}>
            </ProductSectionContainer>
            <ProductSectionContainer isFullWidth slickSettings={{
                slidesToShow: 5,
                rows: 1,
                dots: false, slidesToScroll: 4, autoplay: true
            }} sectionName={"Kinh điển"} variables={{
                where: {
                    categories_some: {
                        id: "ck63t10bb00c30818qwhmi7no"
                    }
                },
                orderBy: 'createdAt_DESC',
                skip: 0,
                first: 20,
            }}>
            </ProductSectionContainer>
        </Fragment>
    )
}

export default HomePage;
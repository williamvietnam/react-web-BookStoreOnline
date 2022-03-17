import React, { Fragment, useState, useRef, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { GET_BOOK, ADD_BOOK_TO_WISH_LIST } from '../../../api/bookApi';
import { Link, NavLink, useParams, useHistory } from 'react-router-dom';
import NumberFormat from 'react-number-format';
import moment from 'moment';
import './product-page.css';
import BookReviewSection from '../../reivews/BookReviewSection';
import { connect } from 'react-redux';
import isTokenValid from '../../../utils/tokenValidation';
import { GET_REVIEWS_BY_BOOK } from '../../../api/reviewApi';
import { message, Rate, Button, Skeleton, Empty } from 'antd';
import { changeFilter } from '../../../redux/actions/filtersActions';
import { RESET_FILTERS, FILTER_TYPE_AUTHOR, FILTER_TYPE_CAT, FILTER_TYPE_PUBLISHER } from '../../../constants';
import { addSingleItemToCartAysnc } from '../../../redux/actions/cartAction';
import { withApollo } from '@apollo/react-hoc';
import ProductSectionContainer from '../../../containers/products/ProductSectionContainer';
import { calculateDiscount, calculateReviewScore } from '../../../utils/common';

function ProductPage(props) {
  const { auth, changeFilter, cart, addSingleItemToCart } = props;
  const qtyRef = useRef();
  const history = useHistory();
  const { id: bookId } = useParams()
  const isAuthenticated = isTokenValid(localStorage.getItem('token'));
  const { loading, error, data = {} } = useQuery(GET_BOOK, {
    onError() {
      message.error('Có lỗi xảy ra, vui lòng thử tải lại trang.')
    },
    variables: {
      id: bookId
    }
  });
  const [addBookToWishList, { loading: addingToWishList }] = useMutation(ADD_BOOK_TO_WISH_LIST, {
    onError() {
      message.error("Có lỗi xảy ra, vui lòng thử lại sau");
    },
    onCompleted(data) {
      if (data.addBookToWishList.statusCode === 200) {
        message.success("Đã thêm vào danh sách ưa thích")
      } else {
        message.error(data.addBookToWishList.message);
      }
    }
  });
  const { loading: gettingReviewSummary, data: reviewSummary = { getBookReviewsByBook: { bookReviews: [] } }, refetch: refetchReviewSummary } = useQuery(GET_REVIEWS_BY_BOOK, {
    onError(err) {
      message.error("Có lỗi xảy ra khi lấy đánh giá");
    },
    fetchPolicy: 'cache-and-network',
    variables: {
      bookId: bookId,
      orderBy: 'createdAt_DESC',
      first: 0,
      skip: 0
    }
  });
  const avgScore = calculateReviewScore(reviewSummary.getBookReviewsByBook);

  if (loading) {
    return (<div className="container m-t-120 m-b-80">
      <div className="row">
        <Skeleton active />
      </div>
    </div>)
  }

  if (error) {
    return (<div className="container m-t-120 m-b-80">
      <div className="row">
        <Empty style={{ margin: 'auto' }} image={Empty.PRESENTED_IMAGE_DEFAULT} description={"Có lỗi xảy ra khi lấy dữ liệu"}></Empty>
      </div>
    </div>)
  }
  const onReadMoreClick = (tab = 'description') => {
    document.querySelector(`.nav-item[href="#nav-${tab}"]`).click();
    document.querySelector('.product__info__detailed').scrollIntoView({
      behavior: 'smooth'
    });
  }

  const { id, title, basePrice, description, thumbnail, dimensions, translator, format, isbn, publishedDate, discounts, availableCopies, pages, publisher, authors, categories } = data.getBook;
  const [discountedPrice, discountRate, discountAmount] = calculateDiscount(basePrice, discounts);
  return (
    <Fragment>
      <div className="ht__bradcaump__area bg-image--5">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="bradcaump__inner text-center">
                <h2 className="bradcaump-title">{title}</h2>
                <nav className="bradcaump-content">
                  <NavLink className="breadcrumb_item" to="/">Trang chủ</NavLink>
                  <span className="brd-separetor">/</span>
                  <NavLink className="breadcrumb_item" to="/books">Cửa hàng sách</NavLink>
                  <span className="brd-separetor">/</span>
                  <span className="breadcrumb_item active">{title}</span>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="scroll-anchor"></div>
      <div className="maincontent bg--white pt--80 pb--55">
        <div className="container">
          <div className="row">
            <div className="col-lg-9 col-12">
              <div className="wn__single__product">
                <div className="row">
                  <div className="col-lg-6 col-12">
                    <img src={thumbnail} alt="Book image" />
                  </div>
                  <div className="col-lg-6 col-12">
                    <div className="product__info__main">
                      <h1>{title}</h1>
                      <div className="book-brief-info d-flex justify-content">
                        <div className="book-authors">
                          Tác giả:&nbsp;
                      {authors.map((item, index) => (
                          <Fragment key={item.id} ><a onClick={() => {
                            changeFilter(RESET_FILTERS);
                            changeFilter(FILTER_TYPE_AUTHOR, item.id);
                            history.push('/books');
                          }} className="text-primary">{item.pseudonym}</a>{index !== authors.length - 1 && ','} </Fragment>
                        ))}
                        </div>
                        &nbsp;&nbsp;&nbsp;
                    <div className="book-format text-primary">
                          {format === "PaperBack" ? "Bìa mềm" : format === "HardCover" ? "Bìa cứng" : ""}
                        </div>
                      </div>
                      {reviewSummary.getBookReviewsByBook.totalCount > 0 && <div className="product-reviews-summary d-flex">
                        <Rate disabled value={avgScore} style={{ color: '#FF5501', fontSize: 16 }} />
                        <a onClick={() => onReadMoreClick('review')}>(Xem {reviewSummary.getBookReviewsByBook.totalCount} đánh giá)</a>
                      </div>}
                      <div className="price-box">
                        <span><NumberFormat value={discountedPrice} displayType={'text'}
                          suffix="đ" thousandSeparator={true} /></span>
                        {(discountRate > 0 || discountAmount > 0) && <p style={{ textDecoration: 'line-through' }}>
                          <NumberFormat style={{ fontSize: 'inherit', color: 'inherit', fontWeight: 300 }} value={basePrice} displayType={'text'}
                            suffix="đ" thousandSeparator={true} /></p>}
                      </div>
                      <div className="product__overview">
                        <div className="product_overview_content" dangerouslySetInnerHTML={{ __html: description }}></div>
                        <div className="fade-footer">
                          <span onClick={() => onReadMoreClick('description')}
                            className="read-more text-primary font-weight-bold">Xem thêm</span>
                        </div>
                      </div>
                      <div className="box-tocart d-flex">
                        <span>Số lượng: </span>
                        <input id="qty" className="input-text qty"
                          ref={qtyRef} style={{ width: 75 }}
                          onBlur={e => {
                            let value = parseInt(e.target.value)
                            if (value < 0) {
                              qtyRef.current.value = Math.abs(value);
                            }
                          }}
                          name="qty" defaultValue={1} min={1} title="Qty" type="number" />
                        <div className="addtocart__actions">
                          <Button className="tocart" loading={cart.adding}
                            onClick={() => {
                              addSingleItemToCart(data.getBook, Math.abs(parseInt(qtyRef.current.value)))
                            }}
                            htmlType="submit" title="Add to Cart">THÊM VÀO GIỎ</Button>
                        </div>
                        <div className="product-addto-links clearfix">
                          <a className="wishlist" onClick={() => {
                            if (isAuthenticated) {
                              addBookToWishList({
                                variables: {
                                  bookId
                                }
                              })
                            } else {
                              history.push('/auth/login', {
                                from: history.location.pathname
                              });
                            }
                          }} />
                        </div>
                      </div>
                      <div className="product_meta">
                        <span className="posted_in">Thể loại:&nbsp;
                      {categories.map((item, index) => (
                          <Fragment key={item.id} ><a onClick={() => {
                            changeFilter(RESET_FILTERS);
                            changeFilter(FILTER_TYPE_CAT, item.id);
                            history.push('/books');
                          }}>{item.name}</a>{index !== categories.length - 1 && ','} </Fragment>
                        ))}
                        </span>
                      </div>
                      <div className="product-share">
                        <ul>
                          <li className="categories-title">Share :</li>
                          <li>
                            <a href="#">
                              <i className="icon-social-twitter icons" />
                            </a>
                          </li>
                          <li>
                            <a href="#">
                              <i className="icon-social-tumblr icons" />
                            </a>
                          </li>
                          <li>
                            <a href="#">
                              <i className="icon-social-facebook icons" />
                            </a>
                          </li>
                          <li>
                            <a href="#">
                              <i className="icon-social-linkedin icons" />
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="product__info__detailed">
                <div className="pro_details_nav nav justify-content-start" role="tablist">
                  <a className="nav-item nav-link active" data-toggle="tab" href="#nav-description" role="tab">Mô tả</a>
                  <a className="nav-item nav-link" data-toggle="tab" href="#nav-details" role="tab">Chi tiết</a>
                  <a className="nav-item nav-link" data-toggle="tab" href="#nav-review" role="tab">Đánh giá</a>

                </div>
                <div className="tab__container">
                  {/* Start Single Tab Content */}
                  <div className="pro__tab_label tab-pane fade show active" id="nav-description" role="tabpanel">
                    <div className="description__attribute" dangerouslySetInnerHTML={{ __html: description }}>
                    </div>
                  </div>
                  {/* End Single Tab Content */}
                  {/* Start Single Tab Content */}
                  <div className="pro__tab_label tab-pane fade" id="nav-details" role="tabpanel">
                    <div className="description__attribute">
                      <table className="table-book-details">
                        <tbody>
                          <tr>
                            <td><b>Nhà xuất bản</b></td>
                            <td className="text-align-right"><i><a onClick={() => {
                              changeFilter(RESET_FILTERS);
                              changeFilter(FILTER_TYPE_PUBLISHER, publisher.id);
                              history.push('/books');
                            }} className="text-primary">{publisher.name}</a></i></td>
                          </tr>
                          <tr>
                            <td><b>Ngày xuất bản</b></td>
                            <td className="text-align-right"><i>{moment(publishedDate).format('DD/MM/YYYY')}</i></td>
                          </tr>
                          <tr>
                            <td><b>Kích thước</b></td>
                            <td className="text-align-right"><i>{dimensions}</i></td>
                          </tr>
                          <tr>
                            <td><b>Số trang</b></td>
                            <td className="text-align-right"><i>{pages}</i></td>
                          </tr>
                          <tr>
                            <td><b>ISBN</b></td>
                            <td className="text-align-right"><i>{isbn}</i></td>
                          </tr>
                          <tr>
                            <td><b>Dịch giả</b></td>
                            <td className="text-align-right"><i>{translator}</i></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {/* End Single Tab Content */}
                  {/* Start Single Tab Content */}
                  <div className="pro__tab_label tab-pane fade" id="nav-review" role="tabpanel">
                    <BookReviewSection isAuthenticated={isAuthenticated}
                      refetchReviewSummary={refetchReviewSummary}
                      getBookReviewsByBook={reviewSummary.getBookReviewsByBook}
                      bookId={id} bookTitle={title} avgScore={avgScore} />
                  </div>
                  {/* End Single Tab Content */}
                </div>
              </div>
              {/* <ProductSectionContainer slickSettings={{
                width: '100%',
                slidesToShow: 4,
                rows: 1,
                dots: false, slidesToScroll: 2, autoplay: true
              }} sectionName={"Cùng tác giả"} variables={{
                where: {
                  authors_some: {
                    OR: authors.map(item => ({ id: item.id })),
                  }
                },
                orderBy: 'createdAt_DESC',
                skip: 0,
                first: 20,
              }}>
              </ProductSectionContainer> */}
              <ProductSectionContainer slickSettings={{
                slidesToShow: 4,
                rows: 1,
                dots: false, slidesToScroll: 2, autoplay: true
              }} sectionName={"Cùng thể loại"} variables={{
                where: {
                  categories_some: {
                    OR: categories.map(item => ({ id: item.id })),
                  }
                },
                orderBy: 'createdAt_DESC',
                skip: 0,
                first: 20,
              }}>
              </ProductSectionContainer>
            </div>
          </div>
        </div>
      </div></Fragment>)
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    cart: state.cart
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    changeFilter: (type, value) => {
      dispatch(changeFilter(type, value));
    },
    addSingleItemToCart: (item, qty) => {
      dispatch(addSingleItemToCartAysnc(ownProps.client, item, qty))
    }
  }
}

export default withApollo(connect(mapStateToProps, mapDispatchToProps)(ProductPage));
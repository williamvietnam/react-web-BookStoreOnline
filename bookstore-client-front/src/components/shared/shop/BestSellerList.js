import React, { useEffect, useState, Fragment } from 'react';
import ProductItem from '../../products/ProductItem';
import ListProductItem from '../../products/ListProductItem';
import Pagination from '../pagination/Pagination';
import { VIEW_MODE_GRID, VIEW_MODE_LIST, SORT_DIRECTION_LATEST, SORT_DIRECTION_NAME_AZ, SORT_DIRECTION_NAME_ZA, SORT_DIRECTION_PRICE_ASC, SORT_DIRECTION_PRICE_DESC, FILTER_TYPE_CAT, FILTER_TYPE_AUTHOR, FILTER_TYPE_PUBLISHER, DATE_VN, DATE_US } from '../../../constants';
import CommonFilter from '../filters/CommonFilter';
import PriceFilter from '../filters/PriceFilter';
import { NavLink } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { GET_BEST_SELLER, GET_BEST_SELLER_FOR_BROWSING } from '../../../api/bookApi';
import { message, Empty, Skeleton } from 'antd';
import moment from 'moment';

const sortDirections = [
    {
        value: "all_time",
        label: "Tất cả thời gian"
    },
    {
        value: "this_week",
        label: "Tuần này",
    }, {
        value: "this_month",
        label: "Tháng này",
    }, {
        value: "this_quarter",
        label: "Quý này",
    }, {
        value: "this_year",
        label: "Năm nay"
    }
]

function BestSellerList(props) {
    const [currentPage, setCurrentPage] = useState(1);
    const [viewMode, setViewMode] = useState(VIEW_MODE_GRID);

    const [timeRange, setTimeRange] = useState({
        dateFrom: null,
        dateTo: null
    });

    const changeTimeRage = (e) => {
        const value = e.target.value;
        const today = moment();
        switch (value) {
            case "this_week":
                setTimeRange({
                    dateFrom: today.startOf('week').format(DATE_US),
                    dateTo: today.endOf('week').format(DATE_US),
                });
                break;
            case "this_month":
                setTimeRange({
                    dateFrom: today.startOf('month').format(DATE_US),
                    dateTo: today.endOf('month').format(DATE_US),
                });
                break;
            case "this_quarter":
                setTimeRange({
                    dateFrom: today.startOf('quarter').format(DATE_US),
                    dateTo: today.endOf('quarter').format(DATE_US),
                });
                break;
            case "this_year":
                setTimeRange({
                    dateFrom: today.startOf('year').format(DATE_US),
                    dateTo: today.endOf('year').format(DATE_US),
                });
                break;
            case "all_time":
                setTimeRange({
                    dateFrom: null,
                    dateTo: null
                });
                break;
        }
    }

    const goToPage = (pageNumber) => {
        setCurrentPage(pageNumber);
    }

    const { loading, data = { getBestSellerForBrowsing: { books: [], totalCount: 0 } } } = useQuery(GET_BEST_SELLER_FOR_BROWSING, {
        onError() {
            message.error("Có lỗi xảy ra khi lấy dữ liệu")
        },
        fetchPolicy: 'network-only',
        variables: {
            first: 20,
            skip: (currentPage - 1) * 20,
            dateFrom: timeRange.dateFrom,
            dateTo: timeRange.dateTo
        }
    });

    const renderProducts = () => {
        const listWrapper = document.querySelector(".shop__list__wrapper");
        if (loading) {
            return (<Fragment><div className="d-flex w-100 m-b-8">
              <Skeleton active loading />
              <Skeleton active loading />
              <Skeleton active loading />
              <Skeleton active loading />
            </div>
              <div className="d-flex w-100">
                <Skeleton active loading />
                <Skeleton active loading />
                <Skeleton active loading />
                <Skeleton active loading />
              </div>
            </Fragment>)
          }
        if (data.getBestSellerForBrowsing.books.length) {
            return data.getBestSellerForBrowsing.books.map((book, index) => {
                return (
                    <div key={index}><ProductItem width={220} thumbHeight={240} book={book} /></div>
                )
            });
        } else {
            return <div className="d-flex justify-content-center w-100"><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có dữ liệu" /></div>;
        }
    }

    const renderProductsList = () => {
        const listWrapper = document.querySelector(".shop__list__wrapper");
        if (loading) {
            return (<Fragment>
              <Skeleton active loading />
            </Fragment>)
          }
        if (data.getBestSellerForBrowsing.books.length) {

            return data.getBestSellerForBrowsing.books.map((book, index) => {
                return (
                    <div key={index}><ListProductItem width={300} thumbHeight={360} book={book} /></div>
                )
            });
        } else {
            return <div className="d-flex justify-content-center w-100"><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có dữ liệu" /></div>;
        }
    }

    return (
        <Fragment>
            <div className="ht__bradcaump__area bg-image--6">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="bradcaump__inner text-center">
                                <h2 className="bradcaump-title">Sách bán chạy</h2>
                                <nav className="bradcaump-content">
                                    <NavLink className="breadcrumb_item" to="/">Trang chủ</NavLink>
                                    <span className="brd-separetor">/</span>
                                    <span className="breadcrumb_item active">Sách bán chạy</span>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="page-shop-sidebar left--sidebar bg--white section-padding--lg">
                <div className="container">
                    <div className="row">
                        {/* <div className="col-lg-3 col-12 order-2 order-lg-1 md-mt-40 sm-mt-40">
              <div className="shop__sidebar">
                <CommonFilter filterType={FILTER_TYPE_CAT} filterName="Thể loại" filterItems={categories} />
                <CommonFilter filterType={FILTER_TYPE_AUTHOR} filterName="Tác giả" filterItems={authors} />
                <PriceFilter />
                <CommonFilter filterType={FILTER_TYPE_PUBLISHER} filterName="Nhà xuất bản" filterItems={publishers} />

                <aside className="wedget__categories sidebar--banner">
                  <img src="images/others/banner_left.jpg" alt="banner images" />
                  <div className="text">
                    <h2>new products</h2>
                    <h6>save up to <br /> <strong>40%</strong>off</h6>
                  </div>
                </aside>
              </div>
            </div> */}
                        <div className="col-lg-12 col-12 order-1 order-lg-2">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="shop__list__wrapper d-flex flex-wrap flex-md-nowrap justify-content-between">
                                        <div className="shop__list nav justify-content-center" role="tablist">
                                            <a className={`nav-item nav-link${viewMode === VIEW_MODE_GRID ? " active" : ""}`}
                                                onClick={() => setViewMode(VIEW_MODE_GRID)} data-toggle="tab" href="#nav-grid" role="tab"><i className="fa fa-th" /></a>
                                            {/* <a className={`nav-item nav-link${viewMode === VIEW_MODE_LIST ? " active" : ""}`}
                                                data-toggle="tab" onClick={() => setViewMode(VIEW_MODE_LIST)} href="#nav-list" role="tab"><i className="fa fa-list" /></a> */}
                                        </div>
                                        <p>Hiển thị {(currentPage - 1) * 20 + 1 > data.getBestSellerForBrowsing.totalCount ? data.getBestSellerForBrowsing.totalCount : (currentPage - 1) * 20 + 1} – {(currentPage - 1) * 20 + 20 >
                                            data.getBestSellerForBrowsing.totalCount ? data.getBestSellerForBrowsing.totalCount : (currentPage - 1) * 20 + 20} trên {data.getBestSellerForBrowsing.totalCount} kết quả</p>
                                        <div className="orderby__wrapper">
                                            <span>Khoảng thời gian: </span>
                                            <select className="shot__byselect" defaultValue="all_time" onChange={changeTimeRage}>
                                                {sortDirections.map(item => {
                                                    return (<option key={item.value} value={item.value}>{item.label}</option>)
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="tab__container">
                                <div className={`shop-grid tab-pane fade${viewMode === VIEW_MODE_GRID ? " show active" : ""}`} id="nav-grid" role="tabpanel">
                                    <div className="row">
                                        {viewMode === VIEW_MODE_GRID && renderProducts()}
                                    </div>

                                </div>
                                <div className={`shop-grid tab-pane fade${viewMode === VIEW_MODE_LIST ? " show active" : ""}`} id="nav-list" role="tabpanel">
                                    <div className="list__view__wrapper">
                                        {viewMode === VIEW_MODE_LIST && renderProductsList()}
                                    </div>
                                </div>
                            </div>
                            <br />
                            <br />
                            <Pagination page={currentPage} goToPage={goToPage}
                                totalCount={data.getBestSellerForBrowsing.totalCount} itemsPerPage={20} />
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default BestSellerList;

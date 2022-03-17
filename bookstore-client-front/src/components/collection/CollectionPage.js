import React, { useEffect, useState, Fragment } from 'react';
import {
    VIEW_MODE_GRID, VIEW_MODE_LIST, SORT_DIRECTION_LATEST,
    SORT_DIRECTION_NAME_AZ, SORT_DIRECTION_NAME_ZA, SORT_DIRECTION_PRICE_ASC,
    SORT_DIRECTION_PRICE_DESC
} from '../../constants';
import { NavLink, useHistory, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { GET_BOOKS, GET_BOOKS_FOR_BROWSING } from '../../api/bookApi';
import { GET_COLLECTION } from '../../api/collectionApi';
import { message, Skeleton } from 'antd';
import ListProductItem from '../products/ListProductItem';
import ProductItem from '../products/ProductItem';
import Pagination from '../shared/pagination/Pagination';

const sortDirections = [
    {
        value: SORT_DIRECTION_LATEST,
        label: "Mới nhất",
    }, {
        value: SORT_DIRECTION_NAME_AZ,
        label: "Tên A-Z",
    }, {
        value: SORT_DIRECTION_NAME_ZA,
        label: "Tên Z-A"
    }, {
        value: SORT_DIRECTION_PRICE_ASC,
        label: "Giá tăng dần"
    }, {
        value: SORT_DIRECTION_PRICE_DESC,
        label: "Giá giảm dần"
    }
]

function CollectionPage(props) {

    const [currentPage, setCurrentPage] = useState(1);
    const params = useParams();
    const { id: collectionId } = params;
    const [viewMode, setViewMode] = useState(VIEW_MODE_GRID);
    const [orderBy, setOrderBy] = useState(SORT_DIRECTION_LATEST);
    const { loading: gettingCollection, data: collectionInfo = { getCollection: {} } } = useQuery(GET_COLLECTION, {
        onError() {
            message.error("Có lỗi xảy ra khi lấy thông tin tuyển tập")
        },
        variables: {
            id: collectionId
        }
    });
    const { loading, data = { getBooksForBrowsing: { books: [] } } } = useQuery(GET_BOOKS_FOR_BROWSING, {
        onError() {
            message.error("Có lỗi xảy ra khi lấy dữ liệu");
        },
        variables: {
            where: {
                collections_some: {
                    id: collectionId
                }
            },
            orderBy,
            first: 20,
            skip: (currentPage - 1) * 20,
        }
    })
    const { books } = data.getBooksForBrowsing;

    const renderProducts = () => {
        const listWrapper = document.querySelector(".shop__list__wrapper");
        if (listWrapper) {
            listWrapper.scrollIntoView();
        }
        return books.map((book, index) => {
            return (
                <div key={index}><ProductItem width={220} thumbHeight={240} book={book} /></div>
            )
        });
    }

    const renderProductsList = () => {
        const listWrapper = document.querySelector(".shop__list__wrapper");
        if (listWrapper) {
            listWrapper.scrollIntoView();
        }
        return books.map((book, index) => {
            return (
                <div key={index}><ListProductItem width={300} thumbHeight={360} book={book} /></div>
            )
        });
    }
    console.log(collectionInfo)
    if (loading) return (
        <Fragment>
            <div className="ht__bradcaump__area bg-image--6">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="bradcaump__inner text-center">
                                <h2 className="bradcaump-title">{collectionInfo.name}</h2>
                                <nav className="bradcaump-content">
                                    <NavLink className="breadcrumb_item" to="/">Trang chủ</NavLink>
                                    <span className="brd-separetor">/</span>
                                    <NavLink className="breadcrumb_item" to="/collections">Tuyển tập</NavLink>
                                    <span className="brd-separetor">/</span>
                                    <span className="breadcrumb_item active">{collectionInfo.name}</span>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="page-shop-sidebar left--sidebar bg--white section-padding--lg">
                <div className="container">
                    <div className="row">
                        <Skeleton loading active />
                    </div>
                </div>
            </div>
        </Fragment>
    )

    return (
        <Fragment>
            <div className="ht__bradcaump__area bg-image--6">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="bradcaump__inner text-center">
                                <h2 className="bradcaump-title">{collectionInfo.getCollection.name}</h2>
                                <nav className="bradcaump-content">
                                    <NavLink className="breadcrumb_item" to="/">Trang chủ</NavLink>
                                    <span className="brd-separetor">/</span>
                                    <NavLink className="breadcrumb_item" to="/collections">Tuyển tập</NavLink>
                                    <span className="brd-separetor">/</span>
                                    <span className="breadcrumb_item active">{collectionInfo.getCollection.name}</span>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="page-shop-sidebar left--sidebar bg--white section-padding--lg" style={{ paddingTop: 40 }}>
                <div className="container">
                    <h4 className="w-100" style={{textAlign: 'center'}}>Một vài nét về tuyển tập</h4>
                    <br />
                    <div style={{textAlign: 'center'}} dangerouslySetInnerHTML={{ __html: collectionInfo.getCollection.description }}></div>
                    <br />
                    <div className="row">
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
                                        <p>Hiển thị {(currentPage - 1) * 20 + 1 > data.getBooksForBrowsing.totalCount ? data.getBooksForBrowsing.totalCount : (currentPage - 1) * 20 + 1} – {(currentPage - 1) * 20 + 20 >
                                            data.getBooksForBrowsing.totalCount ? data.getBooksForBrowsing.totalCount : (currentPage - 1) * 20 + 20} trên {data.getBooksForBrowsing.totalCount} kết quả</p>
                                        <div className="orderby__wrapper">
                                            <span>Sắp xếp theo: </span>
                                            <select className="shot__byselect" value={orderBy} onChange={(e) => { setOrderBy(e.target.value) }}>
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
                            <Pagination page={currentPage} goToPage={(page) => setCurrentPage(page)}
                                totalCount={data.getBooksForBrowsing.totalCount} itemsPerPage={20} />
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default CollectionPage;

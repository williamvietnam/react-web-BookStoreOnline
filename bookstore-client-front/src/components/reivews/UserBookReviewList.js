import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { connect } from 'react-redux';
import { message, Skeleton, Rate, Tooltip, Pagination } from 'antd';
import moment from 'moment';
import { DATE_TIME_VN_24H } from '../../constants';
import { GET_REVIEWS } from '../../api/reviewApi';
import { NavLink } from 'react-router-dom';

function UserBookReviewList(props) {
    const { auth } = props;
    const [currentPage,setCurrentPage] = useState(1);
    const { loading, data = {} } = useQuery(GET_REVIEWS, {
        onError() {
            message.error("Có lỗi xảy ra khi lấy các nhận xét của bạn")
        },
        fetchPolicy: 'cache-and-network',
        variables: {
            where: {
                author: {
                    id: auth.user.id
                }
            },
            orderBy: "updatedAt_DESC",
            skip: (currentPage-1)*10,
            first: 10
        }
    });
    if (loading) {
        return (
            <div className={`col-12 m-b-16 col-sm-12`}>
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <Skeleton avatar active />
                        </div>
                    </div>
                </div>
            </div>
        )
    } else {
        const { getBookReviews } = data;
        const { bookReviews, totalCount } = getBookReviews;
        return (
            <div className={`col-12 m-b-16 col-sm-12`}>
                <h4>Nhận xét của tôi ({totalCount})</h4>
                <br />
                {bookReviews && bookReviews.length > 0 &&
                    bookReviews.map(item => (
                        <div className="card m-b-8" key={item.id}>
                            <div className="card-body" style={{padding: '0.75rem'}}>
                                <div className="row" >
                                    <div className="col col-md-3">
                                        <NavLink to={`/book/${item.book.id}`}>
                                            <img src={item.book.thumbnail} alt="product_img" />
                                        </NavLink>
                                    </div>
                                    <div className="col col-md-9">
                                        <NavLink to={`/book/${item.book.id}`} 
                                        className="text-primary fs-16">{item.book.title}</NavLink>
                                        <div className="m-t-18 m-b-12 fs-12">
                                            <Tooltip style={{color: "#787878"}}
                                             title={moment(item.updatedAt).format(DATE_TIME_VN_24H)}>
                                                {moment(item.updatedAt).fromNow()}
                                            </Tooltip>
                                        </div>
                                        <Rate disabled style={{ color: '#FF5501', fontSize: 13 }} value={item.rating} />
                                        <h6 className="m-b-8">{item.reviewHeader}</h6>
                                        <p>{item.reviewText}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                }
                <Pagination current={currentPage} onChange={(page)=>{
                    setCurrentPage(page)
                }} total={totalCount} />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth
    }
}

export default connect(mapStateToProps, null)(UserBookReviewList);
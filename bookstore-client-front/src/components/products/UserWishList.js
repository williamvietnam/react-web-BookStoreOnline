import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { connect } from 'react-redux';
import { message, Skeleton, Rate, Tooltip, Pagination } from 'antd';
import moment from 'moment';
import { DATE_TIME_VN_24H } from '../../constants';
import { NavLink } from 'react-router-dom';
import { GET_WISH_LIST, REMOVE_BOOK_FROM_WISH_LIST } from '../../api/bookApi';

function UserWishList(props) {
    const { auth } = props;
    const [currentPage, setCurrentPage] = useState(1);
    const { loading, data = {} ,refetch} = useQuery(GET_WISH_LIST, {
        onError() {
            message.error("Có lỗi xảy ra khi lấy dữ liệu")
        },
        fetchPolicy: 'network-only',
        onCompleted(data) {
            if (!data.getWishList.statusCode === 200) {
                message.error(data.getWishList.message);
            }
        }
    });
    const [removeFromWishList, { loading: removingFromWishList }] = useMutation(REMOVE_BOOK_FROM_WISH_LIST, {
        onError() {
            message.error("Có lỗi xảy ra, vui lòng thử lại sau");
        },
        onCompleted(data) {
            if (data.removeBookFromWishList.statusCode === 200) {
                message.success("Đã loại khỏi danh sách ưa thích");
                refetch();
            } else {
                message.error(data.removeBookFromWishList.message);
            }
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
        const { data: wishListData } = data.getWishList;
        const { books, totalCount } = wishListData;
        return (
            <div className={`col-12 m-b-16 col-sm-12`}>
                <h4>Sách ưa thích của tôi ({books.length})</h4>
                <br />
                {books && books.length > 0 &&
                    books.map(item => (
                        <div className="card m-b-8" key={item.id}>
                            <div className="card-body" style={{ padding: '0.75rem' }}>
                                <div className="row" >
                                    <div className="col-12 col-md-2">
                                        <NavLink to={`/book/${item.id}`}>
                                            <img height={100} src={item.thumbnail} alt="product_img" />
                                        </NavLink>
                                    </div>
                                    <div className="col-12 col-md-10">
                                        <NavLink to={`/book/${item.id}`}
                                            className="text-primary fs-16">{item.title}</NavLink>
                                        <div className="m-t-8"
                                        onClick={()=>removeFromWishList({
                                            variables: {
                                                bookId: item.id
                                            }
                                        })}
                                        ><a className="fs-12" 
                                        style={{ textDecoration: 'underline' }}>Xóa</a></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                }
                {/* <Pagination current={currentPage} onChange={(page) => {
                    setCurrentPage(page)
                }} total={totalCount} /> */}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth
    }
}

export default connect(mapStateToProps, null)(UserWishList);
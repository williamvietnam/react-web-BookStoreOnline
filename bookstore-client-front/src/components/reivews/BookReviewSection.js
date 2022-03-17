import React, { Fragment, useState } from 'react';
import { Rate, Skeleton, Progress, Icon, Popconfirm, Button as AntdButton, message, Pagination, Empty } from 'antd';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { CREATE_BOOK_REVIEW, GET_REVIEWS } from '../../api/reviewApi';
import { useParams, useHistory } from 'react-router-dom';
import BookReviewItem from './BookReviewItem';
import { Button } from '@material-ui/core';
import { roundHalf, calculateReviewScore } from '../../utils/common';

function BookReviewSection(props) {

    const { id: bookId } = useParams();
    const [currentPage, setCurrentPage] = useState(1);

    const { loading, data = {getBookReviews: {bookReviews: [],totalCount: 0}},refetch: refetchBookReviews } = useQuery(GET_REVIEWS, {
            onCompleted() {
                const mainContent = document.querySelector('.review-fieldset');
                if (mainContent) {
                    mainContent.scrollIntoView({});
                }
            },
            onError(){
                message.error("Có lỗi xảy ra khi lấy đánh giá")
            },
            variables: {
                where: {
                    book: {
                        id: bookId
                    }
                },
                orderBy: 'createdAt_DESC',
                skip: (currentPage - 1) * 10,
                first: 10
            }
        });


    const { isAuthenticated, bookTitle,avgScore,getBookReviewsByBook,refetchReviewSummary } = props;

    const history = useHistory();

    const [showReviewEditor, setShowReviewEditor] = useState(false);

    const [reviewInputs, setReviewInputs] = useState({
        reviewHeader: '',
        reviewText: '',
        rating: 0
    });

    const handleInputChange = (e) => {
        const target = e.target;
        const { name, value } = target;
        setReviewInputs(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const [createReview, { loading: creatingReview,
        error: errorCreatingReivew, data: dataCreatingReview }] = useMutation(CREATE_BOOK_REVIEW, {
            onCompleted() {
                refetchReviewSummary();
                refetchBookReviews();
                setShowReviewEditor(false);
            },
            onError(error) {
                message.error("Có lỗi xảy ra, xin thử lại sau");
            }
        });


    if (loading) {
        return <Skeleton avatar paragraph={{ rows: 4 }} />
    }

    const renderPercentage = (data) => {
        const { fiveStar, fourStar, threeStar, twoStar, oneStar, totalCount } = data;
        const fourStarPercent = roundHalf(fourStar / totalCount * 100)
        const threeStarPercent = roundHalf(threeStar / totalCount * 100)
        const twoStarPercent = roundHalf(twoStar / totalCount * 100)
        const fiveStarPercent = roundHalf(fiveStar / totalCount * 100)
        const oneStarPercent = roundHalf(oneStar / totalCount * 100)

        return (<Fragment>
            <div className="d-flex align-items-center">5&nbsp;<Icon type="star" style={{ color: '#52C41A' }} theme="filled" />&nbsp;<Progress percent={fiveStarPercent} strokeColor="#52C41A" status="normal" /></div>
            <div className="d-flex align-items-center">4&nbsp;<Icon type="star" style={{ color: '#52C41A' }} theme="filled" />&nbsp;<Progress percent={fourStarPercent} strokeColor="#52C41A" status="normal" /></div>
            <div className="d-flex align-items-center">3&nbsp;<Icon type="star" style={{ color: '#1890FF' }} theme="filled" />&nbsp;<Progress percent={threeStarPercent} status="normal" /></div>
            <div className="d-flex align-items-center">2&nbsp;<Icon type="star" style={{ color: '#e8a81e' }} theme="filled" />&nbsp;<Progress percent={twoStarPercent} strokeColor="#e8a81e" status="normal" /></div>
            <div className="d-flex align-items-center">1&nbsp;<Icon type="star" style={{ color: '#F5222D' }} theme="filled" />&nbsp;<Progress percent={oneStarPercent} strokeColor="#F5222D" status="normal" /></div>
        </Fragment>)
    }

    const openReviewEditor = () => {
        if (!isAuthenticated) {
            history.push('/auth/login', {
                from: history.location.pathname
            });
        } else {
            setShowReviewEditor(prev => !prev);
        }
    }

    const submitReview = (e) => {
        e.preventDefault();
        createReview({
            variables: {
                data: {
                    reviewText: reviewInputs.reviewText,
                    reviewHeader: reviewInputs.reviewHeader,
                    rating: reviewInputs.rating,
                    book: bookId
                }
            },
        })
    }

    return (<Fragment>
        <div className="review__attribute">
            <h2>Đánh giá trung bình</h2>
            <div className="review__ratings__type d-flex">
                <div className="review-ratings">
                    <div className="rating-summary d-flex flex-column align-items-center">
                        <h1 style={{ marginBottom: '0.5rem', color: '#FE302E' }}>
                            <b>{avgScore}/5</b>
                        </h1>
                        <Rate disabled defaultValue={avgScore} value={avgScore} style={{ color: '#FF5501' }} />
                        <div className="p-t-10">{`(${data.getBookReviews?.totalCount} đánh giá)`}</div>
                    </div>
                </div>
                <div className="review-content" >
                    {renderPercentage(getBookReviewsByBook)}
                </div>
                <div className="leave-comment-section m-l-50 p-l-50 d-flex flex-column align-items-center" >
                    <h6 className="fs-14 m-b-8">Chia sẻ đánh giá</h6>
                    {!isAuthenticated ? <Popconfirm
                        title="Bạn cần đăng nhập để sử dụng chức năng này"
                        onConfirm={openReviewEditor}
                        okText="Đồng ý"
                        cancelText="Không"
                    >
                        <Button color="primary" style={{ fontSize: 12 }} variant="contained">{showReviewEditor ? 'Đóng' : 'Viết đánh giá'}</Button>
                    </Popconfirm> :
                        <Button color="primary" style={{ fontSize: 12 }} onClick={openReviewEditor}
                            variant="contained">{showReviewEditor ? 'Đóng' : 'Viết đánh giá'}</Button>
                    }
                </div>
            </div>
        </div>
        <div className="review-fieldset">
            {showReviewEditor ? <form onSubmit={submitReview} className="review-editor">
                <h2>Bạn đang đánh giá:</h2>
                <h4>{bookTitle}</h4>
                <div className="review-field-ratings m-t-10">
                    <div className="product-review-table">
                        <div className="review-field-rating d-flex">
                            <span>Điểm số của bạn dành cho sản phẩm</span>
                            <Rate onChange={(rating) => setReviewInputs(prev => ({ ...prev, rating }))} value={reviewInputs.rating}
                                style={{ color: '#FF5501' }} />
                        </div>
                    </div>
                </div>
                <div className="review_form_field">
                    <div className="input__box">
                        <span>Tiêu đề đánh giá: </span>
                        <input id="summery_field" type="text" onChange={handleInputChange}
                            value={reviewInputs.reviewHeader} name="reviewHeader" />
                    </div>
                    <div className="input__box">
                        <span>Nội dung đánh giá</span>
                        <textarea onChange={handleInputChange}
                            value={reviewInputs.reviewText} name="reviewText" />
                    </div>
                    <div className="review-form-actions">
                        <AntdButton htmlType='submit'
                            loading={creatingReview}>Gửi đánh giá</AntdButton>
                    </div>
                </div>
            </form> : <Fragment>
                    {data.getBookReviews.bookReviews.length>0?data.getBookReviews?.bookReviews.map(review => (
                        <BookReviewItem refetchBookReviews={()=>{
                            refetchReviewSummary();
                            refetchBookReviews();
                        }} bookId={bookId} key={review.id} review={review} />
                    )):<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có đánh giá nào" />}
                    <Pagination current={currentPage} onChange={(page) => {
                        setCurrentPage(page)
                    }} total={data.getBookReviews?.totalCount} />
                </Fragment>}
        </div>
    </Fragment>)
}

export default BookReviewSection;
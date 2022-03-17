import React, { useState, Fragment } from 'react'
import { Comment, Tooltip, Icon, Avatar, Rate, Input, Button, Form, message } from 'antd';
import moment from 'moment';
import { DATE_TIME_VN_24H } from '../../constants';
import { useMutation } from '@apollo/react-hooks';
import { CREATE_REVIEW_REPLY } from '../../api/reviewApi';
import getAvatarAlt from '../../utils/getAvatarAlt';

const { TextArea } = Input;

const Editor = ({ onChange, onSubmit, submitting, value, userInfo }) => (
    <div>
        <Form.Item>
            <div className="d-flex">
                <Avatar style={{minWidth: 32}} className="m-r-8" src={userInfo.avatar} alt={getAvatarAlt(userInfo)}>
                    {getAvatarAlt(userInfo)}
                </Avatar>
                <div className="w-100"><TextArea rows={4} onChange={onChange} value={value} />
                    <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
                        Gửi trả lời
                    </Button>
                </div>
            </div>
        </Form.Item>
    </div>
);

function BookReviewItem(props) {

    const { bookId, refetchBookReviews } = props;

    const { id, reviewHeader, reviewText, rating, author, createdAt, updatedAt, replies } = props.review;

    const action = null;

    const [text, setText] = useState("");

    const handleInputChange = (e) => {
        setText(e.target.value);
    }
  
    const [showReplies, setShowReplies] = useState(false);
    const [showReplyEditor, setShowReplyEditor] = useState(false);
    const [createReply, { loading }] = useMutation(CREATE_REVIEW_REPLY, {
        onError() {
            message.error("Có lỗi xảy ra khi thêm trả lời, vui lòng thử lại sau.")
        },
        onCompleted() {
            message.success("Thêm phản hồi thành công")
            refetchBookReviews();
            setShowReplies(true);
            setShowReplyEditor(false);
        }
    })
    const actions = [
        <Fragment>{replies && replies.length > 0 && <span onClick={() => {
            setShowReplies(prev => !prev)
        }} key="comment-basic-show-replies">{showReplies ? "Ẩn" : "Xem"} trả lời</span>}</Fragment>,
        <span onClick={() => {
            setShowReplyEditor(prev => !prev)
        }} key="comment-basic-reply-to">Trả lời</span>,
    ];

    return (
        <Comment
            actions={actions}
            author={<a>{author.fullName??author.username}</a>}
            avatar={
                <Avatar src={author.avatar} alt={getAvatarAlt(author)}>
                    {getAvatarAlt(author)}
                </Avatar>
            }
            content={
                <div className="review-content">
                    <div className="review-content-rating">
                        <Rate value={rating} defaultValue={0} disabled style={{ fontSize: 10 }} allowHalf />
                    </div>
                    <div className="review-header p-b-10">
                        <h5>{reviewHeader}</h5>
                    </div>
                    <div className="review-text">
                        <p>{reviewText}</p>
                    </div>
                </div>
            }
            datetime={
                <Tooltip title={moment(createdAt).format(DATE_TIME_VN_24H)}>
                    <span>{moment(createdAt).locale('vi').fromNow()}</span>
                </Tooltip>
            }
        >
            {showReplies && replies && replies.length > 0 && replies.map(reply => {
                return (<Comment
                    author={<a>{reply.author.fullName??reply.author.username}</a>}
                    avatar={
                        <Avatar src={reply.author.avatar} alt={getAvatarAlt(reply.author)}>
                            {getAvatarAlt(reply.author)}
                        </Avatar>
                    }
                    content={
                        <div className="review-content">
                            <div className="review-text">
                                <p>{reply.text}</p>
                            </div>
                        </div>
                    }
                    datetime={
                        <Tooltip title={moment(reply.updatedAt).format(DATE_TIME_VN_24H)}>
                            <span>{moment(reply.updatedAt).locale('vi').fromNow()}</span>
                        </Tooltip>
                    }
                />)
            })}
            {showReplyEditor && <Editor userInfo={author} onChange={handleInputChange} value={text} onSubmit={() => {
                createReply({
                    variables: {
                        data: {
                            text,
                            bookReview: id,
                            book: bookId
                        }
                    }
                })
            }} submitting={loading} />}
        </Comment>
    )
}

export default BookReviewItem;
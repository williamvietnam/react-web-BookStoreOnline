import React, { useEffect } from 'react';
import { message, Table, Button, Rate } from 'antd';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';

import { GET_REVIEWS } from '../../api/reviewApi';
import moment from 'moment';
import { DATE_TIME_VN_24H } from '../../constants';

function ReviewList(props) {
    const { selectedRowKeys, setSelectedRowKeys, currentPage, setCurrentPage, rowsPerPage, setRowsPerPage
        , orderBy, setOrderBy, searchValues, setSearchValues,canRefetch,setCanRefetch, renderSort, getColumnSearchProps,
        filterDropdownCustom } = props;

    useEffect(() => {

    }, [])


    const { loading, data = { getBookReviews: { bookReviews: [] } },refetch } = useQuery(GET_REVIEWS, {
        onError() {
            message.error("Có lỗi xảy ra khi lấy dữ liệu");
        },
        variables: {
            orderBy,
            first: rowsPerPage,
            skip: (currentPage - 1) * rowsPerPage,
        }
    });

    useEffect(()=>{
        if (canRefetch){
            refetch();
            setCanRefetch(false);
        }
    },[canRefetch]);

    const columns = [
        {
            title: 'Tiêu đề',
            dataIndex: 'reviewHeader',
            key: 'reviewHeader',
        },
        {
            title: <div className="d-flex">
                <span className="m-r-12">Nội dung</span>
            </div>,
            dataIndex: 'reviewText',
            ellipsis: true,
            colSpan: 3,
            key: 'reviewText',
            render: (reviewText) => {
                return {
                    children: reviewText,
                    props: {
                        colSpan: 3
                    }
                }
            },
            ...getColumnSearchProps('reviewText')
        },
        {
            title: 'Điểm đánh giá',
            dataIndex: 'rating',
            key: 'rating',
            ...renderSort('rating'),
            render: (rating) => {
                return {
                    children: <Rate value={rating} disabled style={{ fontSize: 13 }} />
                }
            }
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            ...renderSort('createdAt'),
            render: (createdAt) => {
                return {
                    children: moment(createdAt).format(DATE_TIME_VN_24H)
                }
            }
        }];
    const createDataSource = (reviews) => {
        if (!reviews) return [];
        return reviews.map((item, index) => {
            return {
                ...item,
                key: item.id
            }
        })
    }

    return (
        <Table columns={columns} loading={loading}
            rowSelection={{
                selectedRowKeys,
                onChange(keys) {
                    setSelectedRowKeys(keys);
                }
            }}
            scroll={{ x: 1200 }}
            bordered={true}
            pagination={{
                pageSize: rowsPerPage,
                pageSizeOptions: ['10', '20', '50', '100'],
                showTotal: (total) =>
                    `Hiển thị ${(currentPage - 1) * rowsPerPage + 1} - ${currentPage * rowsPerPage <= data.getBookReviews.totalCount ? currentPage * rowsPerPage : data.getBookReviews.totalCount} trên ${data.getBookReviews.totalCount} kết quả`,
                showSizeChanger: true,
                onShowSizeChange(current, size){this.current = 1; setRowsPerPage(size)},
                total: data.getBookReviews.totalCount,
                onChange: (page) => { setCurrentPage(page) }
            }}
            dataSource={createDataSource(data.getBookReviews.bookReviews)} />

    )

}

export default ReviewList;
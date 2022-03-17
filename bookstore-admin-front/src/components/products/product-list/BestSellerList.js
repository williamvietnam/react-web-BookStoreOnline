import React, { useEffect } from 'react';
import {  message, Table, Button } from 'antd';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import NumberFormat from 'react-number-format';
import { NavLink } from 'react-router-dom';
import { GET_BESTSELLER_LIST } from '../../../api/statisticApi';

function BestSellerList(props) {
    const { selectedRowKeys, setSelectedRowKeys, currentPage, setCurrentPage, rowsPerPage, setRowsPerPage
        , orderBy, setOrderBy, searchValues,canRefetch,setCanRefetch, setSearchValues, renderSort, getColumnSearchProps,
        filterDropdownCustom } = props;

    const { loading, data = { getBestSellerList: { entities: [] } },refetch } = useQuery(GET_BESTSELLER_LIST, {
        onError() {
            message.error("Có lỗi xảy ra khi lấy dữ liệu");
        },
        variables: {
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
            title: <div className="d-flex">
                <span className="m-r-12">Tựa đề</span>
                {/* <div className="d-flex" style={{flexDirection: 'column'}}>
                    <i className="fa fa-sort-asc"></i>
                    <i className="fa fa-sort-desc"></i>
                </div> */}
            </div>,
            dataIndex: 'title',
            ellipsis: true,
            colSpan: 4,
            key: 'title',
            render: (title) => {
                return {
                    children: title,
                    props: {
                        colSpan: 4
                    }
                }
            }
        },
        {
            title: 'SKU',
            dataIndex: 'sku',
            key: 'sku'
        },
        {
            title: 'Tổng số',
            dataIndex: 'totalQuantity',
            key: 'totalQuantity',
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
        }];
    const createDataSource = (entities) => {
        console.log(data.getBestSellerList.entities)
        if (!entities) return [];
        return entities.map((item, index) => {
            return {
                ...item,
                title: <NavLink to={`/catalog/book/edit/${item.id}`}>{item.title}</NavLink>,
                key: item.id,
                totalQuantity: <NumberFormat value={item.totalQuantity} displayType={'text'}
                 thousandSeparator={true} />,
                totalPrice: <NumberFormat value={item.totalPrice} displayType={'text'}
                    suffix="đ" thousandSeparator={true} />,
            }
        })
    }

    return (
        <Table columns={columns} loading={loading}
            scroll={{ x: 1200 }}
            bordered={true}
            pagination={{
                pageSize: rowsPerPage,
                pageSizeOptions: ['10', '20', '50', '100'],
                showTotal: (total) =>
                    `Hiển thị ${(currentPage - 1) * rowsPerPage + 1} - ${currentPage * rowsPerPage <= data.getBestSellerList.totalCount ? currentPage * rowsPerPage : data.getBestSellerList.totalCount} trên ${data.getBestSellerList.totalCount} kết quả`,
                showSizeChanger: true,
                onShowSizeChange(current, size){this.current = 1; setRowsPerPage(size)},
                total: data.getBestSellerList.totalCount,
                onChange: (page) => { setCurrentPage(page) }
            }}
            dataSource={createDataSource(data.getBestSellerList.entities)} />
    )

}

export default BestSellerList;
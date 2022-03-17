import React, { Children, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_CATEGORIES_PAGING_NO_RELATION } from '../../api/categoryApi';
import { message, Table, Button } from 'antd';
import moment from 'moment';
import { DATE_TIME_VN_24H } from '../../constants';
import { NavLink, useHistory } from 'react-router-dom';
import { GET_DISCOUNTS } from '../../api/discountApi';
import NumberFormat from 'react-number-format';
import { EditOutlined } from '@ant-design/icons';

function DiscountList(props) {

    const { selectedRowKeys, setSelectedRowKeys, currentPage, setCurrentPage, rowsPerPage, setRowsPerPage
        , orderBy, setOrderBy, searchValues,canRefetch,setCanRefetch, setSearchValues, renderSort, getColumnSearchProps,
        filterDropdownCustom } = props;

    const { loading, data = { getDiscounts: { discounts: [] } },refetch } = useQuery(GET_DISCOUNTS, {
        onError() {
            message.error("Có lỗi xảy ra khi lấy dữ liệu");
        },
        variables: {
            where: {
                name_contains:  searchValues.name ? searchValues.name: undefined,
                from: searchValues.from ? searchValues.from: undefined,
                to: searchValues.to ? searchValues.to: undefined,
            },
            orderBy,
            skip: (currentPage - 1) * rowsPerPage,
            first: rowsPerPage
        }
    });
    
    const history = useHistory();

    useEffect(()=>{
        if (canRefetch){
            refetch();
            setCanRefetch(false);
        }
    },[canRefetch]);

    const columns = [{
        title: 'Tên',
        dataIndex: 'name',
        key: 'name',
        colSpan: 2,
        render: (name) => {
            return {
                children: name,
                props: {
                    colSpan: 2
                }
            }
        },
        ...getColumnSearchProps('name'),
        ...renderSort('name'),
    }, {
        title: 'Giảm',
        dataIndex: 'discount',
        key: 'discount',
    },{
        title: 'Ngày bắt đầu',
        dataIndex: 'from',
        key: 'from',
        render: (from) => {
            return {
                children: moment(from).format(DATE_TIME_VN_24H)
            }
        },
        ...renderSort('from'),
    }, {
        title: 'Ngày kết thúc',
        dataIndex: 'to',
        key: 'to',
        ...renderSort('to'),
        render: (to) => {
            return {
                children: moment(to).format(DATE_TIME_VN_24H)
            }
        },
        ...renderSort('to'),
    }, {
        title: 'Hành động',
        dataIndex: 'actions',
        key: 'actions'
    }]

    const createDataSource = (discounts) => {
        if (!discounts) return [];
        return discounts.map((item, index) => {
            return {
                key: item.id,
                name: item.name,
                from: item.from,
                to: item.to,
                discount: item.usePercentage?`${item.discountRate*100}%` :<NumberFormat value={item.discountAmount} displayType={'text'}
                thousandSeparator={true} suffix="đ" />,
                actions: <Button type="ghost" onClick={()=>  history.push(`/promotion/discount/edit/${item.id}`)}><EditOutlined/>&nbsp;Sửa</Button>
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
                    `Hiển thị ${(currentPage - 1) * rowsPerPage + 1} - ${currentPage * rowsPerPage <= data.getDiscounts.totalCount ? currentPage * rowsPerPage : data.getDiscounts.totalCount} trên ${data.getDiscounts.totalCount} kết quả`,
                showSizeChanger: true,
                onShowSizeChange(current, size){this.current = 1; setRowsPerPage(size)},
                total: data.getDiscounts.totalCount,
                onChange: (page) => { setCurrentPage(page) }
            }}
            dataSource={createDataSource(data.getDiscounts.discounts)} />
    )
}

export default DiscountList;
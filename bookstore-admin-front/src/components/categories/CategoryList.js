import React, { Children, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_CATEGORIES_PAGING_NO_RELATION } from '../../api/categoryApi';
import { message, Table } from 'antd';
import moment from 'moment';
import { DATE_TIME_VN_24H } from '../../constants';
import { NavLink } from 'react-router-dom';

function CategoryList(props) {

    const { selectedRowKeys, setSelectedRowKeys, currentPage, setCurrentPage, rowsPerPage, setRowsPerPage
        , orderBy, setOrderBy,canRefetch,setCanRefetch, searchValues, setSearchValues, renderSort, getColumnSearchProps,
        filterDropdownCustom } = props;

    const { loading, data = { getCategoriesPaging: { categories: [] } }, refetch } = useQuery(GET_CATEGORIES_PAGING_NO_RELATION, {
        onError() {
            message.error("Có lỗi xảy ra khi lấy dữ liệu");
        },
        variables: {
            where: {
                name_contains: searchValues.name ? searchValues.name : undefined
            },
            orderBy,
            skip: (currentPage - 1) * rowsPerPage,
            first: rowsPerPage
        }
    });

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
        title: 'Ngày tạo',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (createdAt) => {
            return {
                children: moment(createdAt).format(DATE_TIME_VN_24H)
            }
        },
        ...renderSort('createdAt'),
    }, {
        title: 'Cập nhật lần cuối',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        ...renderSort('updatedAt'),
        render: (updatedAt) => {
            return {
                children: moment(updatedAt).format(DATE_TIME_VN_24H)
            }
        }
    }]

    const createDataSource = (categories) => {
        return categories.map(c => {
            return {
                ...c,
                key: c.id,
                name: <NavLink to={`/catalog/category/edit/${c.id}`}>{c.name}</NavLink>
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
                    `Hiển thị ${(currentPage - 1) * rowsPerPage + 1} - ${currentPage * rowsPerPage <= data.getCategoriesPaging.totalCount ? currentPage * rowsPerPage : data.getCategoriesPaging.totalCount} trên ${data.getCategoriesPaging.totalCount} kết quả`,
                showSizeChanger: true,
                onShowSizeChange(current, size){ setRowsPerPage(size);console.log(current);this.current = 1; console.log(this.current)},
                total: data.getCategoriesPaging.totalCount,
                onChange: (page) => { setCurrentPage(page) }
            }}
            dataSource={createDataSource(data.getCategoriesPaging.categories)} />
    )
}

export default CategoryList;
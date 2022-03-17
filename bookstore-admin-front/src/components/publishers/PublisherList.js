import React, { Children, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { message, Table, Button } from 'antd';
import moment from 'moment';
import { DATE_TIME_VN_24H } from '../../constants';
import { NavLink, useHistory } from 'react-router-dom';
import { EditOutlined } from '@ant-design/icons';
import { GET_PUBLISHERS_PAGING } from '../../api/publisherApi';

function PublisherList(props) {

    const { selectedRowKeys, setSelectedRowKeys, currentPage, setCurrentPage, rowsPerPage, setRowsPerPage
        , orderBy, setOrderBy, searchValues, canRefetch, setCanRefetch, setSearchValues, renderSort, getColumnSearchProps,
        filterDropdownCustom } = props;

    const { loading, data = { getPublishersPaging: { publishers: [] } }, refetch } = useQuery(GET_PUBLISHERS_PAGING, {
        onError() {
            message.error("Có lỗi xảy ra khi lấy dữ liệu");
        },
        fetchPolicy: 'cache-and-network',
        variables: {
            where: {
                name_contains: searchValues.name ? searchValues.name : undefined,
            },
            orderBy,
            skip: (currentPage - 1) * rowsPerPage,
            first: rowsPerPage
        }
    });
    const history = useHistory();
    useEffect(() => {
        if (canRefetch) {
            refetch();
            setCanRefetch(false);
        }
    }, [canRefetch]);

    const columns = [ {
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
    },
    {
        title: 'Ngày tạo',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (createdAt) => {
            return {
                children: moment(createdAt).format(DATE_TIME_VN_24H)
            }
        },
        ...renderSort('createdAt'),
    },
    {
        title: 'Hành động',
        dataIndex: 'actions',
        key: 'actions',
    }]

    const createDataSource = (authors) => {
        if (!authors) return [];
        return authors.map((item, index) => {
            return {
                key: item.id,
                name: <NavLink to={`/catalog/publisher/edit/${item.id}`}>{item.name}</NavLink>,
                createdAt: item.createdAt,
                actions: <Button type="ghost" onClick={() => history.push(`/catalog/publisher/edit/${item.id}`)}><EditOutlined />&nbsp;Sửa</Button>
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
                    `Hiển thị ${(currentPage - 1) * rowsPerPage + 1} - ${currentPage * rowsPerPage <= data.getPublishersPaging.totalCount ? currentPage * rowsPerPage : data.getPublishersPaging.totalCount} trên ${data.getPublishersPaging.totalCount} kết quả`,
                showSizeChanger: true,
                onShowSizeChange(current, size) { this.current = 1; setRowsPerPage(size) },
                total: data.getPublishersPaging.totalCount,
                onChange: (page) => { setCurrentPage(page) }
            }}
            dataSource={createDataSource(data.getPublishersPaging.publishers)} />
    )
}

export default PublisherList;
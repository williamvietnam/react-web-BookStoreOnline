import React, { Children, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_CATEGORIES_PAGING_NO_RELATION } from '../../api/categoryApi';
import { message, Table, Button } from 'antd';
import moment from 'moment';
import { DATE_TIME_VN_24H } from '../../constants';
import { NavLink, useHistory } from 'react-router-dom';
import { GET_AUTHORS, GET_AUTHORS_PAGING } from '../../api/authorApi';
import { EditOutlined } from '@ant-design/icons';

function AuthorList(props) {

    const { selectedRowKeys, setSelectedRowKeys, currentPage, setCurrentPage, rowsPerPage, setRowsPerPage
        , orderBy, setOrderBy, searchValues, canRefetch, setCanRefetch, setSearchValues, renderSort, getColumnSearchProps,
        filterDropdownCustom } = props;

    const { loading, data = { getAuthorsPaging: { authors: [] } }, refetch } = useQuery(GET_AUTHORS_PAGING, {
        onError() {
            message.error("Có lỗi xảy ra khi lấy dữ liệu");
        },
        fetchPolicy: 'cache-and-network',
        variables: {
            where: {
                realName_contains: searchValues.realName ? searchValues.realName : undefined,
                pseudonym_contains: searchValues.pseudonym ? searchValues.pseudonym : undefined,
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

    const columns = [{
        title: 'Tên thật',
        dataIndex: 'realName',
        key: 'realName',
        colSpan: 2,
        render: (name) => {
            return {
                children: name,
                props: {
                    colSpan: 2
                }
            }
        },
        ...getColumnSearchProps('realName'),
        ...renderSort('realName'),
    }, {
        title: 'Bút danh',
        dataIndex: 'pseudonym',
        key: 'pseudonym',
        colSpan: 2,
        render: (name) => {
            return {
                children: name,
                props: {
                    colSpan: 2
                }
            }
        },
        ...getColumnSearchProps('pseudonym'),
        ...renderSort('pseudonym'),
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
                realName: <NavLink to={`/catalog/author/edit/${item.id}`}>{item.realName}</NavLink>,
                pseudonym: <NavLink to={`/catalog/author/edit/${item.id}`}>{item.pseudonym}</NavLink>,
                createdAt: item.createdAt,
                actions: <Button type="ghost" onClick={() => history.push(`/catalog/author/edit/${item.id}`)}><EditOutlined />&nbsp;Sửa</Button>
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
                    `Hiển thị ${(currentPage - 1) * rowsPerPage + 1} - ${currentPage * rowsPerPage <= data.getAuthorsPaging.totalCount ? currentPage * rowsPerPage : data.getAuthorsPaging.totalCount} trên ${data.getAuthorsPaging.totalCount} kết quả`,
                showSizeChanger: true,
                onShowSizeChange(current, size) { this.current = 1; setRowsPerPage(size) },
                total: data.getAuthorsPaging.totalCount,
                onChange: (page) => { setCurrentPage(page) }
            }}
            dataSource={createDataSource(data.getAuthorsPaging.authors)} />
    )
}

export default AuthorList;
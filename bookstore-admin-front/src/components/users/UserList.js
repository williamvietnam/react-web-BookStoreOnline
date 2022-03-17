import React, { Children } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { message, Table, Tag } from 'antd';
import moment from 'moment';
import { DATE_TIME_VN_24H } from '../../constants';
import { NavLink } from 'react-router-dom';
import { GET_USERS } from '../../api/authApi';

function UserList(props) {

    const { selectedRowKeys, setSelectedRowKeys, currentPage, setCurrentPage, rowsPerPage, setRowsPerPage
        , orderBy, setOrderBy, searchValues, setSearchValues, renderSort, getColumnSearchProps,
        filterDropdownCustom } = props;

    const { loading, data = { getUsers: { users: [] } } } = useQuery(GET_USERS, {
        onError() {
            message.error("Có lỗi xảy ra khi lấy dữ liệu");
        },
        variables: {
            where: {
                email_contains: searchValues.email?searchValues.email:undefined,
                fullName_contains: searchValues.fullName?searchValues.fullName:undefined,
                username_contains: searchValues.username?searchValues.username:undefined,
                phone_contains: searchValues.phone?searchValues.phone: undefined,
                OR: searchValues.gender && searchValues.gender.length ?
                searchValues.gender.map(g => ({ gender: g }))
                : undefined,
                OR: searchValues.role && searchValues.role.length ?
                searchValues.role.map(r => ({ role: r }))
                : undefined,
                
            },
            orderBy,
            skip: (currentPage - 1) * rowsPerPage,
            first: rowsPerPage
        }
    })

    const columns = [{
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        colSpan: 2,
        render: (email) => {
            return {
                children: email,
                props: {
                    colSpan: 2
                }
            }
        },
        ...getColumnSearchProps('email'),
        ...renderSort('email'),
    }, {
        title: 'Username',
        dataIndex: 'username',
        key: 'username',
        render: (username) => {
            return {
                children: username,
                props: {
                }
            }
        },
        ...getColumnSearchProps('username'),
        ...renderSort('username'),
    }, {
        title: 'Tên',
        dataIndex: 'fullName',
        key: 'fullName',
        render: (fullName) => {
            return {
                children: fullName,
                props: {
                }
            }
        },
        ...getColumnSearchProps('fullName'),
        ...renderSort('fullName'),
    }, {
        title: 'Số điện thoại',
        dataIndex: 'phone',
        key: 'phone',
        render: (phone) => {
            return {
                children: phone,
                props: {
                }
            }
        },
        ...getColumnSearchProps('phone'),
    }, {
        title: 'Vai trò',
        dataIndex: 'role',
        key: 'role',
        colSpan: 1,
        render: (role) => {
            return {
                children: role,
                props: {
                    colSpan: 1
                }
            }
        },
        filters: [{
            text: "User",
            value: "User"
        }, {
            text: "Admin",
            value: "Admin",
        }],
        filterDropdown: filterDropdownCustom('role',null, null,false)
    },{
        title: 'Trạng thái hoạt động',
        dataIndex: 'isActive',
        key: 'isActive',
        render: (isActive) => {
            return {
                children: isActive?<Tag color="#40A9FF">Hoạt động</Tag>:<Tag color="#FF7674">Ngừng</Tag>
            }
        }
    },{
        title: 'Giới tính',
        dataIndex: 'gender',
        key: 'gender',
        render: (gender) => {
            return {
                children: gender==true?"Nam":gender==false?"Nữ":""
            }
        },
        filters: [{
            text: "Nam",
            value: true
        }, {
            text: "Nữ",
            value: false
        }],
        filterDropdown: filterDropdownCustom('gender',null, null,false)
    },{
        title: 'Ngày tạo',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (createdAt) => {
            return {
                children: moment(createdAt).format(DATE_TIME_VN_24H)
            }
        },
        ...renderSort('createdAt'),
    }]

    const createDataSource = (users) => {
        if (!users) return [];
        return users.map((item, index) => {
            return {
                ...item,
                key: item.id,
                email: <NavLink to={`/users/edit/${item.id}`}>{item.email}</NavLink>,
            }
        })
    }

    return (
        <Table columns={columns} loading={loading}
            rowSelection={selectedRowKeys}
            scroll={{ x: 1200 }}
            bordered={true}
            pagination={{
                pageSize: rowsPerPage,
                pageSizeOptions: ['10', '20', '50', '100'],
                showTotal: (total) =>
                    `Hiển thị ${(currentPage - 1) * rowsPerPage + 1} - ${currentPage * rowsPerPage <= data.getUsers.totalCount ? currentPage * rowsPerPage : data.getUsers.totalCount} trên ${data.getUsers.totalCount} kết quả`,
                showSizeChanger: true,
                onShowSizeChange(current, size){this.current = 1; setRowsPerPage(size)},
                total: data.getUsers.totalCount,
                onChange: (page) => { setCurrentPage(page) }
            }}
            dataSource={createDataSource(data.getUsers.users)} />
    )
}

export default UserList;
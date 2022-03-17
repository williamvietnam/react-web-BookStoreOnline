import React, { useState, useRef, useEffect, Fragment } from 'react';
import { Collapse, Select, message, Table, Button, Input, Checkbox, Icon } from 'antd';
import { SearchOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import useScroll from '../../custom-hooks/useScroll';
import { useMutation } from '@apollo/react-hooks';
import { useLocation } from 'react-router-dom';
import { convertErrString } from '../../utils/common';

const { Panel } = Collapse;

function ListCommon(Component, defaultOrderBy, listName, deleteManyApi) {

    return function ListCommonWrapper(props) {

        const { onClickCreate, showDelete = true, showCreate=true,standAlone } = props;

        const location = useLocation();

        const [selectedRowKeys, setSelectedRowKeys] = useState([]);

        const [currentPage, setCurrentPage] = useState(1);

        const [rowsPerPage, setRowsPerPage] = useState(10);

        const [orderBy, setOrderBy] = useState(defaultOrderBy);

        const [searchValues, setSearchValues] = useState({

        })
        const [canRefetch, setCanRefetch] = useState(false);
        const searchInput = useRef();

        let searchTimeout = null;
        const [deleteMany, { loading: deletingMany }] = useMutation(deleteManyApi, {
            onCompleted(data) {
                if (location.pathname.indexOf('reviews') >= 0) {
                    message.success(`Xóa thành công ${data.deleteReviews.count} bản ghi`);
                } else if (location.pathname.indexOf('books') >= 0) {
                    message.success(`Xóa thành công ${data.deleteBooks.count} bản ghi`);
                } else if (location.pathname.indexOf('collections') >= 0) {
                    message.success(`Xóa thành công ${data.deleteCollections.count} bản ghi`);
                } else if (location.pathname.indexOf('categories') >= 0) {
                    message.success(`Xóa thành công ${data.deleteCategories.count} bản ghi`);
                } else if (location.pathname.indexOf('discounts') >= 0) {
                    message.success(`Xóa thành công ${data.deleteDiscounts.count} bản ghi`);
                } else if (location.pathname.indexOf('authors') >= 0) {
                    message.success(`Xóa thành công ${data.deleteAuthors.count} bản ghi`);
                } else if (location.pathname.indexOf('publishers') >= 0) {
                    message.success(`Xóa thành công ${data.deletePublishers.count} bản ghi`);
                }
                setCanRefetch(true);
            },
            onError(err) {
                message.error(convertErrString(err.message));
            }
        });

        const handleSearch = (e) => {
            const { name, value } = e.target;
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => setSearchValues(prev => ({
                ...prev,
                [name]: value
            })), 300)
        };

        const handleReset = clearFilters => {
            clearFilters();
            this.setState({ searchText: '' });
        };

        const getColumnSearchProps = dataIndex => ({
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        ref={searchInput}
                        placeholder={`Search ${dataIndex}`}
                        name={dataIndex}
                        onChange={e => handleSearch(e)}
                        // onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        style={{ width: 188, marginBottom: 8, display: 'block' }}
                    />
                    <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
                </Button>
                </div>
            ),
            filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
            onFilter: (value, record) =>
                record[dataIndex]
                    .toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()),
            onFilterDropdownVisibleChange: visible => {
                if (visible) {
                    setTimeout(() => searchInput.current.select());
                }
            },
            // render: text =>
            //     this.state.searchedColumn === dataIndex ? (
            //         <Highlighter
            //             highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            //             searchWords={[this.state.searchText]}
            //             autoEscape
            //             textToHighlight={text.toString()}
            //         />
            //     ) : (
            //             text
            //         ),
        });

        const filterDropdownCustom = (dataIndex, placeholder, onInputChange, showInput = true) => {
            return ({ setSelectedKeys, selectedKeys, filters }) => {
                return (
                    <div style={{ padding: 8 }}>
                        {showInput && <Input placeholder={placeholder} onChange={(e) => {
                            e.persist();
                            clearTimeout(searchTimeout);
                            searchTimeout = setTimeout(() => onInputChange(e), 300)
                        }} />}
                        <div className="m-t-8">
                            {filters.map(item => (<div key={item.value} ><Checkbox
                                checked={selectedKeys.some(key => key === item.value)}
                                onChange={(e) => {
                                    const { checked } = e.target;
                                    if (checked) {
                                        setSelectedKeys([...selectedKeys, item.value]);
                                    } else {
                                        setSelectedKeys(selectedKeys.filter(key => key !== item.value));
                                    }
                                }}
                            >{item.text}</Checkbox></div>))}
                        </div>
                        <hr />
                        <Button onClick={() => setSearchValues(prev => ({
                            ...prev,
                            [dataIndex]: selectedKeys
                        }))} size="small" style={{ width: 90 }}>
                            Lọc
                    </Button>
                    &nbsp;
                        <Button type="danger" onClick={() => {
                            setSearchValues(prev => ({
                                ...prev,
                                [dataIndex]: []
                            }));
                            setSelectedKeys([]);
                        }} size="small" style={{ width: 90 }}>
                            Xóa bộ lọc
                    </Button>
                    </div>
                )
            }
        }
        const renderSort = (dataIndex) => {
            return {
                sorter: true,
                sortOrder: orderBy.indexOf(dataIndex) >= 0 ? orderBy === `${dataIndex}_DESC` ? 'descend' : 'ascend' : false,
                onHeaderCell: () => {
                    return {
                        onClick() {
                            if (orderBy.indexOf(dataIndex) < 0) {
                                setOrderBy(`${dataIndex}_DESC`);
                            } else {
                                if (orderBy.indexOf("DESC") >= 0) {
                                    setOrderBy(`${dataIndex}_ASC`);
                                } else {
                                    setOrderBy(`${dataIndex}_DESC`);
                                }
                            }
                        }
                    }
                }
            }
        }

        const isScrolled = useScroll(62);
        if (standAlone) {
           return <Component {...props} filterDropdownCustom={filterDropdownCustom}
                setCanRefetch={setCanRefetch}
                canRefetch={canRefetch}
                getColumnSearchProps={getColumnSearchProps}
                orderBy={orderBy}
                handleSearch={handleSearch} handleReset={handleReset}
                searchValues={searchValues} setSearchValues={setSearchValues}
                rowsPerPage={rowsPerPage} setRowsPerPage={(size) => { setCurrentPage(1); setRowsPerPage(size); }}
                selectedRowKeys={selectedRowKeys} setSelectedRowKeys={setSelectedRowKeys}
                currentPage={currentPage} setCurrentPage={setCurrentPage}
                renderSort={renderSort}
            />
        } else {
            return (
                <div className="content-wrapper">
                    <div className={`content-header m-b-20${isScrolled ? ' sticky' : ''}`}>
                        <h3>{listName}</h3>
                        <div className="pull-right">
                            {showCreate&&<Button type="primary" onClick={onClickCreate} ><PlusOutlined /> Thêm mới</Button>}
                            {showDelete && <Button disabled={selectedRowKeys.length === 0}
                                loading={deletingMany}
                                onClick={() => deleteMany({
                                    variables: {
                                        id: selectedRowKeys
                                    }
                                })}
                                className="m-l-8" type="danger"><DeleteOutlined /> Xóa chọn</Button>}
                        </div>
                    </div>
                    <div className="content-body" style={{ minHeight: '120%', backgroundColor: 'inherit' }}>
                        <Component {...props} filterDropdownCustom={filterDropdownCustom}
                            setCanRefetch={setCanRefetch}
                            canRefetch={canRefetch}
                            getColumnSearchProps={getColumnSearchProps}
                            orderBy={orderBy}
                            handleSearch={handleSearch} handleReset={handleReset}
                            searchValues={searchValues} setSearchValues={setSearchValues}
                            rowsPerPage={rowsPerPage} setRowsPerPage={(size) => { setCurrentPage(1); setRowsPerPage(size); }}
                            selectedRowKeys={selectedRowKeys} setSelectedRowKeys={setSelectedRowKeys}
                            currentPage={currentPage} setCurrentPage={setCurrentPage}
                            renderSort={renderSort}
                        />
                    </div>
                </div >
            )
        }
    }
}

export default ListCommon;
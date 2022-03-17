import React, { useEffect } from 'react';
import {  message, Table, Button } from 'antd';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import { GET_BOOKS } from '../../../api/bookApi';
import NumberFormat from 'react-number-format';
import { GET_AUTHORS_BASIC } from '../../../api/authorApi';
import { GET_PUBLISHERS_BASIC } from '../../../api/publisherApi';
import { GET_CATEGORIES_BASIC } from '../../../api/categoryApi';
import { NavLink } from 'react-router-dom';

function ProductList(props) {
    const { selectedRowKeys, setSelectedRowKeys, currentPage, setCurrentPage, rowsPerPage, setRowsPerPage
        , orderBy, setOrderBy, searchValues,canRefetch,setCanRefetch, setSearchValues, renderSort, getColumnSearchProps,
        filterDropdownCustom } = props;

    const [getAuthors, { loading: loadingAuthors, data: dataAuthors = { getAuthors: [] } }] = useLazyQuery(GET_AUTHORS_BASIC, {
        onError() {
            message.error("Có lỗi xảy ra khi lấy dữ liệu");
        },
        variables: {
            first: 10,
            skip: 0,
            orderBy: 'pseudonym_DESC'
        }
    });

    const [getCategories, { loading: loadingCategories, data: dataCategories = { getCategories: [] } }] = useLazyQuery(GET_CATEGORIES_BASIC, {
        onError() {
            message.error("Có lỗi xảy ra khi lấy dữ liệu");
        },
        variables: {
            first: 10,
            skip: 0,
            orderBy: 'name_DESC'
        }
    });

    const [getPublishers, { loading: loadingPublishers, data: dataPublishers = { getPublishers: [] } }] = useLazyQuery(GET_PUBLISHERS_BASIC, {
        onError() {
            message.error("Có lỗi xảy ra khi lấy dữ liệu");
        },
        variables: {
            first: 10,
            skip: 0,
            orderBy: 'name_DESC'
        }
    })

    useEffect(() => {
        getAuthors();
        getPublishers();
        getCategories();
    }, [])

    const filterAuthors = dataAuthors.getAuthors.map((item) => ({
        text: item.pseudonym,
        value: item.id
    }));

    const { loading, data = { getBooks: { books: [] } },refetch } = useQuery(GET_BOOKS, {
        onError() {
            message.error("Có lỗi xảy ra khi lấy dữ liệu");
        },
        variables: {
            where: {
                title_contains: searchValues.title ? searchValues.title : undefined,
                sku_contains: searchValues.sku ? searchValues.sku : undefined,
                authors_some: searchValues.authors && searchValues.authors.length ? {
                    id_in: searchValues.authors
                } : undefined,
                categories_some: searchValues.categories && searchValues.categories.length ? {
                    id_in: searchValues.categories
                } : undefined,
                publisher: searchValues.publishers && searchValues.publishers.length ? {
                    id_in: searchValues.publishers
                } : undefined,

                OR: searchValues.formats && searchValues.formats.length ?
                    searchValues.formats.map(f => ({ format: f }))
                    : undefined,
            },
            orderBy,
            first: rowsPerPage,
            skip: (currentPage - 1) * rowsPerPage,
            selection: `{
                id
                title
                basePrice
                description
                thumbnail
                sku
                images
                dimensions
                translator
                format
                isbn
                publishedDate
                availableCopies
                pages
                discounts{
                  id
                  from
                  to
                  discountRate
                }
                publisher{
                  id
                  name
                }
                authors{
                  id
                  pseudonym
                }
                categories{
                  id
                  name
                }
              }`
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
            title: 'Ảnh',
            dataIndex: 'thumbnail',
            key: 'thumbnail',
        },
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
            },
            ...renderSort('title'),
            ...getColumnSearchProps('title')
        },
        {
            title: 'SKU',
            dataIndex: 'sku',
            key: 'sku',
            ...getColumnSearchProps('sku'),
            ...renderSort('sku'),
        },
        {
            title: 'Giá',
            dataIndex: 'basePrice',
            key: 'basePrice',
            ...renderSort('basePrice')
        },
        {
            title: 'Số lượng',
            dataIndex: 'availableCopies',
            key: 'availableCopies',
            ...renderSort('availableCopies'),
        },
        {
            title: 'Tác giả',
            dataIndex: 'authors',
            key: 'authors',
            filters: filterAuthors,
            filterDropdown: filterDropdownCustom('authors', 'Tìm tác giả', (e) => getAuthors(
                {
                    variables: {
                        where: e.target.value ? {
                            OR: [
                                {
                                    pseudonym_contains: e.target.value
                                },
                                {
                                    realName_contains: e.target.value
                                },
                            ]
                        } : undefined
                    }
                }
            ))
        },
        {
            title: 'Thể loại',
            dataIndex: 'categories',
            key: 'categories',
            colSpan: 2,
            filters: dataCategories.getCategories.map(c => ({
                text: c.name,
                value: c.id
            })),
            filterDropdown: filterDropdownCustom('categories', 'Tìm thể loại', (e) => getCategories(
                {
                    variables: {
                        where: e.target.value ? {
                            name_contains: e.target.value
                        } : undefined
                    }
                }
            )),
            render: (categories) => {
                return {
                    children: categories,
                    props: {
                        colSpan: 2
                    }
                }
            },
            ellipsis: true
        },
        {
            title: 'NXB',
            dataIndex: 'publisher',
            key: 'publisher',
            filters: dataPublishers.getPublishers.map(p => ({
                text: p.name,
                value: p.id
            })),
            filterDropdown: filterDropdownCustom('publishers', 'Tìm NXB', (e) => getPublishers(
                {
                    variables: {
                        where: e.target.value ? {
                            name_contains: e.target.value
                        } : undefined
                    }
                }
            ))
        },
        {
            title: 'Định dạng',
            dataIndex: 'format',
            key: 'format',
            filters: [{
                text: "Bìa mềm",
                value: "PaperBack"
            }, {
                text: "Bìa cứng",
                value: "HardCover"
            }],
            filterDropdown: filterDropdownCustom('formats')
        }];
    const createDataSource = (books) => {
        if (!books) return [];
        return books.map((item, index) => {
            return {
                ...item,
                title: <NavLink to={`/catalog/book/edit/${item.id}`}>{item.title}</NavLink>,
                key: item.id,
                basePrice: <NumberFormat value={item.basePrice} displayType={'text'}
                    suffix="đ" thousandSeparator={true} />,
                availableCopies: <NumberFormat value={item.availableCopies} displayType={'text'}
                    thousandSeparator={true} />,
                publisher: item.publisher.name,
                authors: item.authors.map(author => <div>{author.pseudonym}</div>),
                categories: item.categories.map(category => <div>{category.name}</div>),
                format: item.format === "PaperBack" ? "Bìa mềm" : "Bìa cứng",
                thumbnail: <img width="50" src={item.thumbnail} />
            }
        })
    }

    return (
        <Table columns={columns} loading={loading}
            rowSelection={{
                selectedRowKeys,
                onChange(keys){
                    setSelectedRowKeys(keys);
                }
            }}
            scroll={{ x: 1200 }}
            bordered={true}
            pagination={{
                pageSize: rowsPerPage,
                pageSizeOptions: ['10', '20', '50', '100'],
                showTotal: (total) =>
                    `Hiển thị ${(currentPage - 1) * rowsPerPage + 1} - ${currentPage * rowsPerPage <= data.getBooks.totalCount ? currentPage * rowsPerPage : data.getBooks.totalCount} trên ${data.getBooks.totalCount} kết quả`,
                showSizeChanger: true,
                onShowSizeChange(current, size){this.current = 1; setRowsPerPage(size)},
                total: data.getBooks.totalCount,
                onChange: (page) => { setCurrentPage(page) }
            }}
            dataSource={createDataSource(data.getBooks.books)} />

    )

}

export default ProductList;
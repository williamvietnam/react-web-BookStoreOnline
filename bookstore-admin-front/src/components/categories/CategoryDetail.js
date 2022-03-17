import React, { useState, useEffect, Fragment } from 'react';
import { Collapse, Button, Form, Input, Select, InputNumber, DatePicker, message, Table, Drawer, } from 'antd';
import useScroll from '../../custom-hooks/useScroll';
import { SaveOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks';
import { GET_CATEGORY, UPDATE_CATEGORY, CREATE_CATEGORY } from '../../api/categoryApi';
import { useHistory, useParams, NavLink } from 'react-router-dom';
import moment from 'moment';
import { DATE_VN, DATE_US } from '../../constants';
import { GET_BOOKS, GET_BOOKS_NO_RELATION } from '../../api/bookApi';
import NumberFormat from 'react-number-format';

const { Option } = Select;
const { Panel } = Collapse;

function CategoryDetail(props) {

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);

    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [orderBy, setOrderBy] = useState('title_DESC');

    const [drawerActive, setDrawerActive] = useState(false);

    const [booksToAdd, setBooksToAdd] = useState([]);

    const { isCreating } = props;
    const isScrolled = useScroll(62);
    const { id } = useParams();
    const history = useHistory();
    const [inputs, setInputs] = useState({
        name: '',
        bookName: ''
    });

    const [getBooksToAdd, { loading: gettingBooksToAdd, data: dataBooksToAdd = { getBooks: { books: [] } } }]
        = useLazyQuery(GET_BOOKS_NO_RELATION, {
            fetchPolicy: 'network-only',
            onError() {
                message.error("Có lỗi xảy ra khi lấy dữ liệu");
            }
        });

    const [getCategory, { loading: loadingCategory, refetch: refetchCategory }] = useLazyQuery(GET_CATEGORY, {
        onError() {
            message.error("Có lỗi xảy ra khi lấy dữ liệu");
        },
        fetchPolicy: 'network-only',
        onCompleted(data) {
            if (data.getCategory) {
                setInputs({
                    name: data.getCategory.name
                });
            }
        },
        variables: {
            id
        }
    });

    const [createCategory, { loading: creatingCategory }] = useMutation(CREATE_CATEGORY, {
        onError() {
            message.error("Có lỗi xảy ra khi tạo thể loại");
        },
        onCompleted(data) {
            message.success("Tạo thành công");
            history.push('/catalog/category/edit/' + data.createBookCategory.id)
        }
    });

    const [updateCategory, { loading: updatingCategory }] = useMutation(UPDATE_CATEGORY, {
        onError() {
            message.error("Có lỗi xảy ra khi tạo thể loại");
        },
        onCompleted(data) {
            message.success("Cập nhật thành công");
            refetchCategory();
        }
    });

    useEffect(() => {
        if (!isCreating) {
            getCategory();
        }
    }, [id]);

    const onInputChange = (e) => {
        const { name, value } = e.target;
        setInputs(prev => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    const { loading: gettingBooks, data: dataGettingBooks = { getBooks: { books: [] } }, refetch: refetchBooks } = useQuery(GET_BOOKS, {
        onError() {
            message.error("Có lỗi xảy ra khi lấy dữ liệu");
        },
        variables: {
            where: {
                categories_some: {
                    id
                }
            },
            orderBy,
            first: rowsPerPage,
            skip: (currentPage - 1) * rowsPerPage
            , selection: `{
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
        },
        {
            title: 'SKU',
            dataIndex: 'sku',
            key: 'sku',
        },
        {
            title: 'Giá',
            dataIndex: 'basePrice',
            key: 'basePrice',
        },
        {
            title: 'Số lượng',
            dataIndex: 'availableCopies',
            key: 'availableCopies',
        },
        {
            title: 'Tác giả',
            dataIndex: 'authors',
            key: 'authors',
        },
        {
            title: 'NXB',
            dataIndex: 'publisher',
            key: 'publisher',
        }];

    const createDataSource = (books) => {
        if (!books) return [];
        return books.map((item, index) => {
            return {
                ...item,
                key: item.id,
                title: <NavLink to={`/catalog/book/edit/${item.id}`}>{item.title}</NavLink>,
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

    let searchTimeout = null;
    console.log(dataBooksToAdd.getBooks.books)
    return (
        <div className="content-wrapper">
            <div className={`content-header m-b-20${isScrolled ? ' sticky' : ''}`}>
                <h3>{isCreating ? "Thêm thể loại" : "Cập nhật thể loại"}</h3>
                <div className="pull-right">
                    <Button type="primary"
                        loading={isCreating ? creatingCategory : updatingCategory}
                        onClick={async () => {
                            if (isCreating) {
                                createCategory({
                                    variables: {
                                        data: {
                                            name: inputs.name
                                        }
                                    }
                                })
                            } else {
                                await updateCategory({
                                    variables: {
                                        id,
                                        data: {
                                            name: inputs.name
                                        }
                                    }
                                });
                                refetchCategory();
                            }
                        }} ><SaveOutlined className="m-l-2" /> Lưu</Button>
                </div>
            </div>
            <div className="content-body">
                <Collapse defaultActiveKey={['1']}>
                    <Panel header={<span><i className="fa fa-info m-r-12"></i><b>Thông tin thể loại</b></span>} key="1" showArrow={false}>
                        <div className="d-grid grid-columns-2">
                            <div className="p-r-8">
                                <Form.Item
                                    label="Tên thể loại"
                                    name="name"
                                    labelAlign="right"
                                    className="p-r-8"
                                    rules={[{ required: true, message: 'Please input your username!' }]}
                                >
                                    <Input name="name" value={inputs.name} onChange={onInputChange} />
                                </Form.Item>
                            </div>
                        </div>
                    </Panel>
                    <Panel header={<span><i className="fa fa-book m-r-12"></i><b>Sách</b></span>} key="2" showArrow={false}>
                        {isCreating ? "Bạn cần tạo thể loại trước khi truy cập chức năng này" :
                            <Fragment><div className="actions">
                                <Button type="primary" onClick={() => setDrawerActive(true)}><span><PlusOutlined /> Thêm sách vào thể loại</span></Button>
                                <Button disabled={selectedRowKeys.length === 0}
                                    loading={updatingCategory}
                                    onClick={async () => {
                                        await updateCategory({
                                            variables: {
                                                id,
                                                data: {
                                                    books: {
                                                        disconnect: selectedRowKeys.map(item => ({ id: item }))
                                                    }
                                                }
                                            },
                                        });
                                        refetchBooks();
                                    }}
                                    className="m-l-8" type="danger"><span><DeleteOutlined /> Xóa khỏi thể loại</span></Button>
                            </div>
                                <br />
                                <Table columns={columns}
                                    rowSelection={{
                                        selectedRowKeys,
                                        onChange(keys) {
                                            setSelectedRowKeys(keys);
                                        }
                                    }}
                                    loading={gettingBooks}
                                    pagination={{
                                        pageSize: rowsPerPage,
                                        pageSizeOptions: ['10', '20', '50', '100'],
                                        showTotal: (total) =>
                                            `Hiển thị ${(currentPage - 1) * rowsPerPage + 1} - ${currentPage * rowsPerPage <= dataGettingBooks.getBooks.totalCount ? currentPage * rowsPerPage : dataGettingBooks.getBooks.totalCount} trên ${dataGettingBooks.getBooks.totalCount} kết quả`,
                                        showSizeChanger: true,
                                        onShowSizeChange(current, size) { this.current = 1; setRowsPerPage(size) },
                                        total: dataGettingBooks.getBooks.totalCount,
                                        onChange: (page) => { setCurrentPage(page) }
                                    }}
                                    dataSource={createDataSource(dataGettingBooks.getBooks.books)} />
                            </Fragment>}
                    </Panel>
                </Collapse>
                <Drawer
                    title="Create a new account"
                    width={400}
                    onClose={() => setDrawerActive(false)}
                    visible={drawerActive}
                    bodyStyle={{ paddingBottom: 80 }}
                >
                    <Form onSubmit={async (e) => {
                        e.preventDefault();
                        await updateCategory({
                            variables: {
                                id,
                                data: {
                                    books: {
                                        connect: booksToAdd.map(item => ({ id: item }))
                                    }
                                }
                            }
                        });
                        refetchBooks();
                        setBooksToAdd([]);
                        setDrawerActive(false)
                    }}>
                        <Form.Item
                            label="Chọn sách"
                        >
                            <Select
                                loading={gettingBooksToAdd}
                                mode="multiple"
                                placeholder="Tìm qua tựa đề sách hoặc SKU"
                                defaultActiveFirstOption={false}
                                showArrow={false}
                                value={booksToAdd}
                                onChange={(ids) => {
                                    setBooksToAdd(ids);
                                }}
                                filterOption={false}
                                notFoundContent={null}
                                onSearch={(value) => {
                                    console.log(value)
                                    if (value) {
                                        clearTimeout(searchTimeout);
                                        searchTimeout = setTimeout(() => getBooksToAdd({
                                            variables: {
                                                where: {
                                                    OR: [{ title_contains: value }, { sku_contains: value }],
                                                    categories_every: {
                                                        id_not: id
                                                    }
                                                }
                                            }
                                        }), 300)
                                    }
                                }}
                            >
                                {dataBooksToAdd.getBooks.books.length && dataBooksToAdd.getBooks.books.map(b => {
                                    return (
                                        <Option key={b.id} title={b.title} value={b.id}>{b.title}</Option>
                                    )
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Button htmlType="submit" type="primary">Thêm</Button>
                        </Form.Item>
                    </Form>
                </Drawer>
            </div>
        </div >

    )

}

export default CategoryDetail;
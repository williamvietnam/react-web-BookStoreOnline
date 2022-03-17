import React, { useState, Fragment } from 'react';
import { Collapse, Button, Form, Input, message, Drawer, Select, Table } from 'antd';
import { SaveOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useLazyQuery } from '@apollo/react-hooks';
import { useHistory, NavLink, useParams } from 'react-router-dom';
import '@ckeditor/ckeditor5-build-classic/build/translations/vi';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import useScroll from '../../custom-hooks/useScroll';
import { GET_BOOKS_NO_RELATION, GET_BOOKS } from '../../api/bookApi';
import NumberFormat from 'react-number-format';
import { GET_AUTHOR, UPDATE_AUTHOR } from '../../api/authorApi';
import { GET_PUBLISHER, UPDATE_PUBLISHER } from '../../api/publisherApi';

const { Panel } = Collapse;
const { Option } = Select;

const ckEditorConfig = {
    language: 'vi',
}

function PublisherEdit(props) {

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);

    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [orderBy, setOrderBy] = useState('title_DESC');
    const [booksToAdd, setBooksToAdd] = useState([]);
    const [drawerActive, setDrawerActive] = useState(false);

    const { id } = useParams();

    const [inputs, setInputs] = useState({
        name: '',
        description: ''
    });


    const history = useHistory();
    const isScrolled = useScroll(62);


    const onInputChange = (e) => {
        const { name, value } = e.target;
        setInputs(prev => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    const { loading: gettingPublisher, refetch: refetchPublisher } = useQuery(GET_PUBLISHER, {
        onError() {
            message.error("Có lỗi xảy ra khi cập nhật nhà xuất bản");
        },
        onCompleted(data) {
            if (data.getPublisher) {
                setInputs({
                    name: data.getPublisher.name,
                    description: data.getPublisher.description,
                });
            }
        },
        variables: {
            id
        }
    })

    const [updatePublisher, { loading: updatingPublisher }] = useMutation(UPDATE_PUBLISHER, {
        onError() {
            message.error("Có lỗi xảy ra khi cập nhật nhà xuất bản");
        },
        onCompleted() {
            message.success("Cập nhật thành công")
        }
    })

    const [getBooksToAdd, { loading: gettingBooksToAdd, data: dataBooksToAdd = { getBooks: { books: [] } } }]
        = useLazyQuery(GET_BOOKS_NO_RELATION, {
            fetchPolicy: 'network-only',
            onError() {
                message.error("Có lỗi xảy ra khi lấy dữ liệu");
            }
        });

    const { loading: gettingBooks, data: dataGettingBooks = { getBooks: { books: [] } }, refetch: refetchBooks } = useQuery(GET_BOOKS, {
        onError() {
            message.error("Có lỗi xảy ra khi lấy dữ liệu");
        },
        variables: {
            where: {
                publisher: {
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

    return (
        <div className="content-wrapper">
            <div className={`content-header m-b-20${isScrolled ? ' sticky' : ''}`}>
                <h3>Cập nhật nhà xuất bản</h3>
                <div className="pull-right">
                    <Button type="primary"
                        loading={updatingPublisher}
                        onClick={async () => {
                            updatePublisher({
                                variables: {
                                    id,
                                    data: {
                                        ...inputs
                                    }
                                }
                            })
                        }} ><SaveOutlined className="m-l-2" /> Lưu</Button>
                </div>
            </div>
            <div className="content-body">
                <Collapse defaultActiveKey={['1']}>
                    <Panel header={<span><i className="fa fa-info m-r-12"></i><b>Thông tin nhà xuất bản</b></span>} key="1" showArrow={false}>
                        <div className="d-grid grid-columns-2">
                            <div className="p-r-8">
                                <Form.Item
                                    label="Tên"
                                    name="name"
                                    labelAlign="right"
                                    className="p-r-8"
                                    rules={[{ required: true, message: 'Please input your username!' }]}
                                >
                                    <Input name="name" value={inputs.name} onChange={onInputChange} />
                                </Form.Item>
                            </div>
                        </div>
                        <div>
                            <Form.Item>
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={inputs.description ? inputs.description : ''}
                                    config={ckEditorConfig}
                                    onInit={editor => {
                                        // You can store the "editor" and use when it is needed.
                                        console.log('Editor is ready to use!', editor);
                                    }}
                                    onChange={(event, editor) => {
                                        const data = editor.getData();
                                        setInputs(prev => ({
                                            ...prev,
                                            description: data
                                        }))
                                    }}
                                    onBlur={(event, editor) => {
                                        console.log('Blur.', editor);
                                    }}
                                    onFocus={(event, editor) => {
                                        console.log('Focus.', editor);
                                    }}
                                />
                            </Form.Item>
                        </div>
                    </Panel>
                    <Panel header={<span><i className="fa fa-book m-r-12"></i><b>Sách</b></span>} key="2" showArrow={false}>
                        <Fragment><div className="actions">
                            <Button type="primary" onClick={() => setDrawerActive(true)}><span><PlusOutlined /> Thêm sách</span></Button>
                            <Button disabled={selectedRowKeys.length === 0}
                                loading={updatingPublisher}
                                onClick={async () => {
                                    await updatePublisher({
                                        variables: {
                                            id,
                                            data: {
                                                books: {
                                                    disconnect: selectedRowKeys.map(item => ({ id: item }))
                                                }
                                            }
                                        },
                                    });
                                    setSelectedRowKeys([]);
                                    refetchBooks();
                                }}
                                className="m-l-8" type="danger"><span><DeleteOutlined /> Xóa khỏi nhà xuất bản</span></Button>
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
                        </Fragment>
                    </Panel>
                </Collapse>
                <Drawer
                    title="Thêm sách"
                    width={400}
                    onClose={() => setDrawerActive(false)}
                    visible={drawerActive}
                    bodyStyle={{ paddingBottom: 80 }}
                >
                    <Form onSubmit={async (e) => {
                        e.preventDefault();
                        await updatePublisher({
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

export default PublisherEdit;
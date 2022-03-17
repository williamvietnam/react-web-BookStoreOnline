import React, { useState, Fragment } from 'react';
import { Collapse, Button, Form, Input, message, Switch, DatePicker, InputNumber, Table, Drawer, Select } from 'antd';
import { SaveOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useLazyQuery } from '@apollo/react-hooks';
import { useHistory, useParams, NavLink } from 'react-router-dom';
import '@ckeditor/ckeditor5-build-classic/build/translations/vi';
import useScroll from '../../custom-hooks/useScroll';
import { UPDATE_DISCOUNT, GET_DISCOUNT_BY_ID } from '../../api/discountApi';
import { DATE_TIME_VN_24H, DATE_TIME_US_24H } from '../../constants';
import moment from 'moment';
import { GET_BOOKS, GET_BOOKS_NO_RELATION } from '../../api/bookApi';
import NumberFormat from 'react-number-format';

const { Panel } = Collapse;
const { RangePicker } = DatePicker;
const { Option } = Select;

function DiscountEdit(props) {

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);

    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [orderBy, setOrderBy] = useState('title_DESC');
    const [booksToAdd, setBooksToAdd] = useState([]);
    const [drawerActive, setDrawerActive] = useState(false);

    const { id } = useParams();

    const [inputs, setInputs] = useState({
        name: '',
        usePercentage: true,
        from: moment(),
        to: moment(),
        discountRate: 0,
        discountAmount: 0
    });
    const history = useHistory();
    const isScrolled = useScroll(62);

    const { loading: gettingDiscount, refetch: refetchDiscount } = useQuery(GET_DISCOUNT_BY_ID, {
        onError() {
            message.error("Có lỗi xảy ra khi Lấy dữ liệu");
        },
        onCompleted(data) {
            if (data.getDiscountById) {
                setInputs({
                    name: data.getDiscountById.name,
                    usePercentage: data.getDiscountById.usePercentage,
                    discountAmount: data.getDiscountById.discountAmount,
                    discountRate: data.getDiscountById.discountRate * 100,
                    from: moment(data.getDiscountById.from),
                    to: moment(data.getDiscountById.to),
                })
            }
        },
        variables: {
            id
        }
    });

    const [updateDiscount, { loading: updatingDiscount }] = useMutation(UPDATE_DISCOUNT, {
        onError() {
            message.error("Có lỗi xảy ra khi cập nhật giảm giá");
        },
        onCompleted(data) {
            message.success("Cập nhật thành công");
        }
    });

    const onInputChange = (e) => {
        const { name, value } = e.target;
        setInputs(prev => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

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
                discounts_some: {
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
                <h3>Sửa giảm giá</h3>
                <div className="pull-right">
                    <Button type="primary"
                        loading={updatingDiscount}
                        onClick={async () => {
                            updateDiscount({
                                variables: {
                                    id,
                                    data: {
                                        ...inputs,
                                        discountRate: parseFloat(inputs.discountRate) / 100,
                                        from: new Date(inputs.from).getTime(),
                                        to: new Date(inputs.to).getTime(),
                                    }
                                }
                            })
                        }} ><SaveOutlined className="m-l-2" /> Lưu</Button>
                </div>
            </div>
            <div className="content-body">
                <Collapse defaultActiveKey={['1']}>
                    <Panel header={<span><i className="fa fa-info m-r-12"></i><b>Thông tin giảm giá</b></span>} key="1" showArrow={false}>
                        <div className="">
                            <div className="m-b-8" >
                                <label style={{ minWidth: 200 }}>
                                    Tên
                                </label>
                                <span><Input style={{ maxWidth: 600 }} name="name" value={inputs.name} onChange={onInputChange} /></span>
                            </div>
                            <div className="m-b-8">
                                <label style={{ minWidth: 200 }}>Sử dụng phần trăm</label>
                                <Switch name="usePercentage" checked={inputs.usePercentage} onChange={(val) => setInputs(prev => ({ ...prev, usePercentage: val }))} />
                            </div>
                            {inputs.usePercentage && <div className="m-b-8">
                                <label style={{ minWidth: 200 }}>Phần trăm giảm giá</label>
                                <InputNumber min={0} max={100} step={1} name="discountRate" value={inputs.discountRate} onChange={(val) => setInputs(prev => ({ ...prev, discountRate: val }))} />
                            </div>}
                            {!inputs.usePercentage && <div className="m-b-8">
                                <label style={{ minWidth: 200 }}>Số tiền giảm giá (đ)</label>
                                <InputNumber min={0} step={1000} style={{ minWidth: 200 }} name="discountRate" value={inputs.discountAmount} onChange={(val) => setInputs(prev => ({ ...prev, discountAmount: val }))} />
                            </div>}
                            <div className="m-b-8">
                                <label style={{ minWidth: 200 }}>Khoảng thời gian áp dụng</label>
                                <RangePicker showTime format={DATE_TIME_VN_24H}
                                    value={[inputs.from, inputs.to]}
                                    onChange={(val) => setInputs(prev => ({ ...prev, from: val[0], to: val[1] }))} />
                            </div>
                        </div>
                    </Panel>
                    <Panel header={<span><i className="fa fa-book m-r-12"></i><b>Áp dụng cho các sách</b></span>} key="2" showArrow={false}>
                        <Fragment><div className="actions">
                            <Button type="primary" onClick={() => setDrawerActive(true)}><span><PlusOutlined /> Thêm sách</span></Button>
                            <Button disabled={selectedRowKeys.length === 0}
                                loading={updatingDiscount}
                                onClick={async () => {
                                    await updateDiscount({
                                        variables: {
                                            id,
                                            data: {
                                                appliedTo: {
                                                    disconnect: selectedRowKeys.map(item => ({ id: item }))
                                                }
                                            }
                                        },
                                    });
                                    setSelectedRowKeys([]);
                                    refetchBooks();
                                }}
                                className="m-l-8" type="danger"><span><DeleteOutlined /> Xóa khỏi giảm giá</span></Button>
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
            </div>
            <Drawer
                title="Chọn sách áp dụng giảm giá"
                width={400}
                onClose={() => setDrawerActive(false)}
                visible={drawerActive}
                bodyStyle={{ paddingBottom: 80 }}
            >
                <Form onSubmit={async (e) => {
                    e.preventDefault();
                    await updateDiscount({
                        variables: {
                            id,
                            data: {
                                appliedTo: {
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
                                                discounts_every: {
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
        </div >

    )

}

export default DiscountEdit;
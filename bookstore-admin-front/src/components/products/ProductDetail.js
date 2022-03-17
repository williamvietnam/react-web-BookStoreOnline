import React, { useState, useEffect } from 'react';
import { Collapse, Button, Form, Input, Select, InputNumber, DatePicker, message, } from 'antd';
import useScroll from '../../custom-hooks/useScroll';
import { SaveOutlined } from '@ant-design/icons';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import '@ckeditor/ckeditor5-build-classic/build/translations/vi';
import TextArea from 'antd/lib/input/TextArea';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { GET_PUBLISHERS_BASIC } from '../../api/publisherApi';
import { GET_CATEGORIES_BASIC } from '../../api/categoryApi';
import { GET_AUTHORS_BASIC } from '../../api/authorApi';
import { CREATE_BOOK, UPDATE_BOOK, GET_BOOK, DELETE_BOOKS } from '../../api/bookApi';
import { useHistory, useParams } from 'react-router-dom';
import moment from 'moment';
import { DATE_VN, DATE_US } from '../../constants';
import Uploader from '../shared/Uploader';

const { Option } = Select;
const { Panel } = Collapse;

const ckEditorConfig = {
    language: 'vi',
}

function ProductDetail(props) {

    const { isCreating } = props;
    const isScrolled = useScroll(62);
    const history = useHistory();
    const { id } = useParams();
    const [inputs, setInputs] = useState({
        title: '',
        format: '',
        shortDescription: '',
        description: '',
        sku: '',
        isbn: '',
        categories: [],
        publisher: '',
        authors: [],
        translator: '',
        dimensions: '',
        pages: 0,
        publishedDate: moment(),
        availableCopies: 0,
        basePrice: 0,
        thumbnail: ''
    });

    const [getBook, { loading: gettingBook, refetch: refetchBook }] = useLazyQuery(GET_BOOK, {
        onError() {
            message.error("Có lỗi xảy ra khi lấy dữ liệu");
        },
        fetchPolicy: "cache-and-network",
        onCompleted(data) {
            if (data.getBook) {
                const { title, format, shortDescription, description, sku, isbn, categories,
                    publisher, authors, translator, dimensions, pages, publishedDate, availableCopies, basePrice, thumbnail } = data.getBook;
                setInputs({
                    title,
                    format,
                    shortDescription,
                    description,
                    sku,
                    isbn,
                    categories: categories.map(item => item.id),
                    authors: authors.map(item => item.id),
                    publisher: publisher.id,
                    translator,
                    dimensions,
                    pages,
                    availableCopies,
                    basePrice,
                    thumbnail,
                    publishedDate: moment(publishedDate)
                });
            }
        },
        variables: {
            id
        }
    })

    useEffect(() => {
        if (!isCreating) {
            getBook();
        }
    }, [id]);

    const onInputChange = (e, d) => {
        const { name, value } = e.target;
        setInputs(prev => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    const [createBook, { loading: creatingBook }] = useMutation(CREATE_BOOK, {
        onError() {
            message.error("Có lỗi xảy ra khi tạo mới sách");
        },
        onCompleted(data) {
            message.success("Tạo thành công");
            history.push('/catalog/book/edit/' + data.createBook.id);
        }
    });

    const [updateBook, { loading: updatingBook }] = useMutation(UPDATE_BOOK, {
        onError() {
            message.error("Có lỗi xảy ra khi cập nhật thông tin sách");
        },
        onCompleted() {
            message.success("Cập nhật thông tin sách thành công");
            refetchBook();
        }
    })

    const [getAuthors, { loading: loadingAuthors, data: dataAuthors = { getAuthors: [] } }] = useLazyQuery(GET_AUTHORS_BASIC, {
        onError() {
            message.error("Có lỗi xảy ra khi lấy dữ liệu");
        },
        variables: {
            orderBy: 'pseudonym_DESC'
        }
    });

    const [getCategories, { loading: loadingCategories, data: dataCategories = { getCategories: [] } }] = useLazyQuery(GET_CATEGORIES_BASIC, {
        onError() {
            message.error("Có lỗi xảy ra khi lấy dữ liệu");
        },
        variables: {
            orderBy: 'name_DESC'
        }
    });

    const [getPublishers, { loading: loadingPublishers, data: dataPublishers = { getPublishers: [] } }] = useLazyQuery(GET_PUBLISHERS_BASIC, {
        onError() {
            message.error("Có lỗi xảy ra khi lấy dữ liệu");
        },
        variables: {
            orderBy: 'name_DESC'
        }
    })

    useEffect(() => {
        getAuthors();
        getPublishers();
        getCategories();
    }, [])



    return (
        <div className="content-wrapper">
            <div className={`content-header m-b-20${isScrolled ? ' sticky' : ''}`}>
                <h3>{isCreating ? "Thêm sách mới" : "Cập nhật thông tin sách"}</h3>
                <div className="pull-right">
                    <Button type="primary"
                        loading={isCreating ? creatingBook : updatingBook}
                        onClick={() => {
                            isCreating ?
                                createBook({
                                    variables: {
                                        data: {
                                            ...inputs,
                                            publishedDate: inputs.publishedDate.format(DATE_US)
                                        }
                                    }
                                }) : updateBook({
                                    variables: {
                                        id,
                                        data: {
                                            ...inputs,
                                            publishedDate: inputs.publishedDate.format(DATE_US)
                                        }
                                    }
                                })
                        }} ><SaveOutlined className="m-l-2" /> Lưu</Button>
                </div>
            </div>
            <div className="content-body">
                <Collapse defaultActiveKey={['1']}>
                    <Panel header={<span><i className="fa fa-info m-r-12"></i><b>Thông tin sách</b></span>} key="1" showArrow={false}>
                        <div className="d-grid grid-columns-2">
                            <div className="p-r-8">
                                <Form.Item
                                    label="Tên sách"
                                    name="title"
                                    labelAlign="right"
                                    className="p-r-8"
                                    rules={[{ required: true, message: 'Please input your username!' }]}
                                >
                                    <Input name="title" value={inputs.title} onChange={onInputChange} />
                                </Form.Item>
                            </div>
                            <Form.Item
                                label="Định dạng"
                                name="format"
                                labelAlign="right"
                                rules={[{ required: true, message: 'Please input your username!' }]}
                            >
                                <Select name="format" value={inputs.format} style={{ width: '100%' }} onChange={(value) => setInputs(prev => ({
                                    ...prev,
                                    format: value
                                }))}>
                                    <Option value="HardCover">Bìa cứng</Option>
                                    <Option value="PaperBack">Bìa mềm</Option>
                                </Select>
                            </Form.Item>
                        </div>
                        <Form.Item
                            label="Mô tả ngắn gọn"
                            name="shortDescription"
                            labelAlign="right"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <TextArea name="shortDescription" onChange={onInputChange} value={inputs.shortDescription} />
                        </Form.Item>
                        <Form.Item
                            label="Mô tả đầy đủ"
                            name="description"
                            labelAlign="right"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <CKEditor
                                editor={ClassicEditor}
                                data={inputs.description}
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
                        <div className="d-grid grid-columns-2">
                            <div className="p-r-8">
                                <Form.Item
                                    label="SKU"
                                    name="sku"
                                    labelAlign="right"
                                    rules={[{ required: true, message: 'Please input your username!' }]}
                                >
                                    <Input name="sku" value={inputs.sku} onChange={onInputChange} />
                                </Form.Item>
                            </div>
                            <Form.Item
                                label="ISBN"
                                name="isbn"
                                labelAlign="right"
                                rules={[{ required: true, message: 'Please input your username!' }]}
                            >
                                <Input name="isbn" value={inputs.isbn} onChange={onInputChange} />
                            </Form.Item>
                        </div>
                        <div className="d-grid grid-columns-2">
                            <div className="p-r-8">
                                <Form.Item
                                    label="Thể loại"
                                    name="categories"
                                    labelAlign="right"
                                    rules={[{ required: true, message: 'Please input your username!' }]}
                                >
                                    <Select
                                        mode="multiple"
                                        name="categories"
                                        style={{ width: '100%' }}
                                        placeholder="Please select"
                                        value={inputs.categories}
                                        onChange={(value) => setInputs(prev => ({
                                            ...prev,
                                            categories: value
                                        }))}
                                    >
                                        {dataCategories.getCategories.map(item => {
                                            return (<Option value={item.id} key={item.id}>{item.name}</Option>)
                                        })}
                                    </Select>
                                </Form.Item>
                            </div>
                            <Form.Item
                                label="Nhà xuất bản"
                                name="publisher"
                                labelAlign="right"
                                rules={[{ required: true, message: 'Please input your username!' }]}
                            >
                                <Select
                                    style={{ width: '100%' }}
                                    name="publisher"
                                    value={inputs.publisher}
                                    onChange={(value) => setInputs(prev => ({
                                        ...prev,
                                        publisher: value
                                    }))}
                                >
                                    {dataPublishers.getPublishers.map(item => {
                                        return (<Option value={item.id} key={item.id}>{item.name}</Option>)
                                    })}
                                </Select>
                            </Form.Item>
                        </div>
                        <div className="d-grid grid-columns-2">
                            <div className="p-r-8">
                                <Form.Item
                                    label="Tác giả"
                                    name="auhtors"
                                    labelAlign="right"
                                    rules={[{ required: true, message: 'Please input your username!' }]}
                                >
                                    <Select
                                        mode="multiple"
                                        name="authors"
                                        style={{ width: '100%' }}
                                        placeholder="Chọn tác giả"
                                        value={inputs.authors}
                                        onChange={(value) => setInputs(prev => ({
                                            ...prev,
                                            authors: value
                                        }))}
                                    >
                                        {dataAuthors.getAuthors.map(item => {
                                            return (<Option value={item.id} key={item.id}>{item.pseudonym}</Option>)
                                        })}
                                    </Select>
                                </Form.Item>
                            </div>
                            <Form.Item
                                label="Dịch giả"
                                name="translator"
                                labelAlign="right"
                                rules={[{ required: true, message: 'Please input your username!' }]}
                            >
                                <Input name="translator" value={inputs.translator} onChange={onInputChange} />
                            </Form.Item>
                        </div>
                        <div className="d-grid grid-columns-3">
                            <div className="p-r-8">
                                <Form.Item
                                    label="Kích thước"
                                    name="dimensions"
                                    labelAlign="right"
                                    rules={[{ required: true, message: 'Please input your username!' }]}
                                >
                                    <Input name="dimensions" value={inputs.dimensions} onChange={onInputChange} />
                                </Form.Item>
                            </div>
                            <div className="p-r-8">
                                <Form.Item
                                    label="Số trang"
                                    name="pages"
                                    labelAlign="right"
                                    rules={[{ required: true, message: 'Please input your username!' }]}
                                >
                                    <InputNumber name="pages" value={inputs.pages} style={{ width: '100%' }}
                                        onChange={(value) => setInputs(prev => { return { ...prev, pages: value } })} />
                                </Form.Item>
                            </div>
                            <Form.Item
                                label="Ngày xuất bản"
                                name="publishedDate"
                                labelAlign="right"
                                rules={[{ required: true, message: 'Please input your username!' }]}
                            >
                                <DatePicker name="publishedDate" format={DATE_VN} onChange={(value) => {
                                    setInputs(prev => ({
                                        ...prev,
                                        publishedDate: value
                                    }))
                                }}
                                    value={inputs.publishedDate} style={{ width: '100%' }} />
                            </Form.Item>
                        </div>
                    </Panel>
                    <Panel header={<span><i className="fa fa-dollar m-r-12"></i><b>Giá</b></span>} key="2" showArrow={false}>
                        <Form.Item
                            label="Giá bán"
                            name="basePrice"
                            labelAlign="right"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <InputNumber value={inputs.basePrice} onChange={(value) => setInputs(prev => { return { ...prev, basePrice: value } })}
                                name="basePrice" min={0} style={{ width: '100%' }} />
                        </Form.Item>
                    </Panel>
                    <Panel header={<span><i className="fa fa-archive m-r-12"></i><b>Kho hàng</b></span>} key="3" showArrow={false}>
                        <Form.Item
                            label="Số lượng"
                            name="availableCopies"
                            labelAlign="right"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <InputNumber value={inputs.availableCopies} name="availableCopies"
                                onChange={(value) => setInputs(prev => { return { ...prev, availableCopies: value } })} min={0} style={{ width: '100%' }} />
                        </Form.Item>
                    </Panel>
                    <Panel header={<span><i className="fa fa-photo m-r-12"></i><b>Ảnh</b></span>} key="4" showArrow={false}>
                        <Form.Item
                            label="Nhập đường dẫn ảnh"
                            name="thumbnail"
                            labelAlign="right"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <Input name="thumbnail" value={inputs.thumbnail} style={{ width: '100%' }} onChange={onInputChange} />
                        </Form.Item>
                        <Form.Item
                            label="Hoặc tải ảnh lên: "
                            name="thumbnail"
                            labelAlign="right"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <Uploader imageUrl={inputs.thumbnail} uploadCallback={(imageUrl)=>setInputs(prev=>({
                                ...inputs,
                                thumbnail: imageUrl
                            }))}/>
                        </Form.Item>
                    </Panel>
                </Collapse>
            </div>
        </div >

    )

}

export default ProductDetail;
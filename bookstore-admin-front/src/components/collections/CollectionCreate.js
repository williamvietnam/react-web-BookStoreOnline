import React, { useState, Fragment } from 'react';
import { Collapse, Button, Form, Input, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';
import '@ckeditor/ckeditor5-build-classic/build/translations/vi';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CREATE_COLLECTION } from '../../api/collectionApi';
import useScroll from '../../custom-hooks/useScroll';

const { Panel } = Collapse;

const ckEditorConfig = {
    language: 'vi',
}

function CollectionCreate(props) {

    const [inputs, setInputs] = useState({
        name: '',
        description: '',
        thumbnail: ''
    });
    const history = useHistory();
    const isScrolled = useScroll(62);

    const [createCollection, { loading: creatingCollection }] = useMutation(CREATE_COLLECTION, {
        onError() {
            message.error("Có lỗi xảy ra khi tạo tuyển tập");
        },
        onCompleted(data) {
            message.success("Tạo thành công");
            history.push('/catalog/collection/edit/' + data.createCollection.id);
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

    return (
        <div className="content-wrapper">
            <div className={`content-header m-b-20${isScrolled ? ' sticky' : ''}`}>
                <h3>Thêm tuyển tập</h3>
                <div className="pull-right">
                    <Button type="primary"
                        loading={creatingCollection}
                        onClick={async () => {
                            createCollection({
                                variables: {
                                    data: {
                                        name: inputs.name,
                                        thumbnail: inputs.thumbnail,
                                        description: inputs.description
                                    }
                                }
                            })
                        }} ><SaveOutlined className="m-l-2" /> Lưu</Button>
                </div>
            </div>
            <div className="content-body">
                <Collapse defaultActiveKey={['1']}>
                    <Panel header={<span><i className="fa fa-info m-r-12"></i><b>Thông tin thể loại</b></span>} key="1" showArrow={false}>
                        <div className="d-grid grid-columns-2">
                            <div className="p-r-8">
                                <Form.Item
                                    label="Tên tuyển tập"
                                    name="name"
                                    labelAlign="right"
                                    className="p-r-8"
                                    rules={[{ required: true, message: 'Please input your username!' }]}
                                >
                                    <Input name="name" value={inputs.name} onChange={onInputChange} />
                                </Form.Item>
                            </div>
                            <Form.Item
                                label="Ảnh"
                                name="thumbnail"
                                labelAlign="right"
                                className="p-r-8"
                                rules={[{ required: true, message: 'Please input your username!' }]}
                            >
                                <Input name="thumbnail" value={inputs.thumbnail} onChange={onInputChange} />
                            </Form.Item>
                        </div>
                        <div>
                            <Form.Item>
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
                        </div>
                    </Panel>
                    <Panel header={<span><i className="fa fa-book m-r-12"></i><b>Sách</b></span>} key="2" showArrow={false}>
                        Bạn cần tạo tuyển tập trước khi truy cập chức năng này
                        {/* {isCreating ? "Bạn cần tạo thể loại trước khi truy cập chức năng này" :
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
                                        onShowSizeChange: (current, size) => setRowsPerPage(size),
                                        total: dataGettingBooks.getBooks.totalCount,
                                        onChange: (page) => { setCurrentPage(page) }
                                    }}
                                    dataSource={createDataSource(dataGettingBooks.getBooks.books)} />
                                </Fragment>} */}
                    </Panel>
                </Collapse>
                {/* <Drawer
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
                </Drawer> */}
            </div>
        </div >

    )

}

export default CollectionCreate;
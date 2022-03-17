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
import { CREATE_AUTHOR } from '../../api/authorApi';

const { Panel } = Collapse;

const ckEditorConfig = {
    language: 'vi',
}

function AuthorCreate(props) {

    const [inputs, setInputs] = useState({
        realName: '',
        description: '',
        pseudonym: ''
    });
    const history = useHistory();
    const isScrolled = useScroll(62);

    const [createAuthor, { loading: creatingAuthor }] = useMutation(CREATE_AUTHOR, {
        onError() {
            message.error("Có lỗi xảy ra khi tạo tác giả");
        },
        onCompleted(data) {
            message.success("Tạo thành công");
            history.push('/catalog/author/edit/' + data.createAuthor.id);
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
                <h3>Thêm tác giả</h3>
                <div className="pull-right">
                    <Button type="primary"
                        loading={creatingAuthor}
                        onClick={async () => {
                            createAuthor({
                                variables: {
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
                    <Panel header={<span><i className="fa fa-info m-r-12"></i><b>Thông tin giảm giá</b></span>} key="1" showArrow={false}>
                        <div className="d-grid grid-columns-2">
                            <div className="p-r-8">
                                <Form.Item
                                    label="Tên thật"
                                    name="realName"
                                    labelAlign="right"
                                    className="p-r-8"
                                    rules={[{ required: true, message: 'Please input your username!' }]}
                                >
                                    <Input name="realName" value={inputs.realName} onChange={onInputChange} />
                                </Form.Item>
                            </div>
                            <Form.Item
                                label="Bút danh"
                                name="pseudonym"
                                labelAlign="right"
                                className="p-r-8"
                                rules={[{ required: true, message: 'Please input your username!' }]}
                            >
                                <Input name="pseudonym" value={inputs.pseudonym} onChange={onInputChange} />
                            </Form.Item>
                        </div>
                        <div>
                            <Form.Item label="Mô tả">
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
                    {/* <Panel header={<span><i className="fa fa-book m-r-12"></i>Sách</span>} key="2" showArrow={false}>
                        Bạn cần tạo tác giả trước khi truy cập chức năng này
                    </Panel> */}
                </Collapse>
            </div>
        </div >

    )

}

export default AuthorCreate;
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
import { CREATE_PUBLISHER } from '../../api/publisherApi';

const { Panel } = Collapse;

const ckEditorConfig = {
    language: 'vi',
}

function PublisherCreate(props) {

    const [inputs, setInputs] = useState({
        name: '',
        description: '',
    });
    const history = useHistory();
    const isScrolled = useScroll(62);

    const [createPublisher, { loading: creatingPublisher }] = useMutation(CREATE_PUBLISHER, {
        onError() {
            message.error("Có lỗi xảy ra khi tạo nhà xuất bản");
        },
        onCompleted(data) {
            history.push('/catalog/publisher/edit/' + data.createPublisher.id);
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
                <h3>Thêm nhà xuất bản</h3>
                <div className="pull-right">
                    <Button type="primary"
                        loading={creatingPublisher}
                        onClick={async () => {
                            createPublisher({
                                variables: {
                                    data: {
                                        ...inputs
                                    }
                                }
                            })
                        }} ><SaveOutlined className="m-l-2" /> Tạo</Button>
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
                            <Form.Item 
                                label="Mô tả"
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
                        </div>
                    </Panel>
                </Collapse>
            </div>
        </div >

    )

}

export default PublisherCreate;
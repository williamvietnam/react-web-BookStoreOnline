import React from 'react';
import { Upload, message, Button } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
}

class Uploader extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            imageUrl: props.imageUrl,
            file: null
        };
    }

    handleChange = e => {
        console.log(e.nativeEvent.target.files[0]);
        this.setState({
            file: e.nativeEvent.target.files[0]
        })
        getBase64(e.nativeEvent.target.files[0], imageUrl =>
            this.setState({
                imageUrl,
                loading: false,
            }),
        );

    };

    onUploadImage = async () => {
        const formData = new FormData();
        formData.append('image', this.state.file);
        this.setState({
            loading: true
        });
        try {
            const res = await fetch('http://18.191.134.82:30369/api/image',{
                method: 'post',
                body: formData,
                // headers: {
                //     "Content-type": 'multipart/form-data'
                // }
            });

            const resObj = await res.json();
            this.setState({
                loading: false,
                file: null
            });
            this.props.uploadCallback(resObj.url);
            message.success("Tải ảnh lên thành công")
        } catch (err) {
            this.setState({
                loading: false,
            });
            message.error("Có lỗi xảy ra khi tải ảnh lên")
            console.log(err)
        }
    }

    render() {
        const { imageUrl, loading } = this.state;
        return (
            <div>
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    {imageUrl ? <img style={{cursor: 'pointer'}}
                    onClick={()=>window.open(imageUrl)}
                    src={imageUrl} alt="avatar" style={{ width: 250 }} /> : <img src={'https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132484366.jpg'} alt="avatar" style={{ width: 150 }} />}
                    <input type="file" multiple={false} onChange={this.handleChange}
                        ref={el => this.uploadRef = el} style={{ display: 'none' }} />
                    <Button style={{ marginLeft: 12 }} type="primary" onClick={() => {
                        this.uploadRef.click();
                    }}>Chọn Ảnh</Button>
                </div>
                <Button loading={loading} disabled={this.state.file===null} onClick={this.onUploadImage}
                    color="green">Tải ảnh lên</Button>
                {/* <Upload
                    name="image"
                    listType="picture-card"
                    // className="avatar-uploader"

                    showUploadList={false}
                    method='POST'
                    multiple={false}
                    action="localhost:8080/api/image"
                    beforeUpload={beforeUpload}
                    onChange={this.handleChange}
                >
                    {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: 500 }} /> : uploadButton}
                </Upload> */}
            </div>

        );
    }
}

export default Uploader;
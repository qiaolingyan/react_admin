import React, {Component} from 'react';
import { Upload, Icon, Modal, message } from 'antd';
import { reqDeleteProductImg } from '../../../api'

/*function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}*/

export default class PicturesWall extends Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: this.props.imgs.map((item,index) => {
      return {
        uid: -index,
        name: item,
        status: 'done',
        url: `http://localhost:5000/upload/${item}`,
      }
    })
  };
  
  handleCancel = () => this.setState({ previewVisible: false });
  
  handlePreview = async file => {
    /*if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }*/
    
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };
  handleChange = async ({ file, fileList }) => {
    if (file.status === 'uploading') {
      
    } else if (file.status === 'done') {
      fileList[fileList.length - 1].name = file.response.data.name;   //解决图片初始上传时不能删除的问题
      fileList[fileList.length - 1].url = file.response.data.url;   //解决图片初始上传时不能预览的问题
      message.success('上传图片成功~', 2);
    } else if (file.status === 'error') {
      message.error('上传图片失败！', 2);
    } else {
      const id = this.props.id;
      const name = file.name;
      const result = await reqDeleteProductImg(name, id);
      if (result) {
        message.success('删除图片成功~', 2);
      }
    }
    this.setState({ fileList });
  };

  
  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action="/manage/img/upload"
          listType="picture-card"
          name="image"
          data={{      //对象
            id:this.props.id
          }}
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
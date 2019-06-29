import React, {Component} from 'react';
import {Card, Icon, Form, Input, Button, Cascader, InputNumber} from 'antd'
import './index.less';
import {reqCategories, reqAddProduct,reqUpdateProduct} from '../../../api';
import RichTextEditor from './rich-text-editor'
import draftToHtml from "draftjs-to-html";
import {convertToRaw} from "draft-js";
import PicturesWall from './pictures-wall';

const {Item} = Form;

class SaveUpdate extends Component {
  state = {
    options: []
  };
  
  richTextEditorRef = React.createRef();
  
  getReqCategories = async (id) => {
    const result = await reqCategories(id);
    if (result) {
      if(id === '0'){
        this.setState({
          options: result.map(category => {
            return {
              value: category._id,
              label: category.name,
              isLeaf: false,
            }
          })
        })
      }else {
        this.setState({
          options:this.state.options.map(item => {
            if (item.value === id) {
              item.children = result.map(option => {
                return {
                  label: option.name,
                  value: option._id,
                }
              });
            }
            return item;
          })
        })
      }
      
    }
  };
  
  async componentDidMount() {
    
    this.getReqCategories('0');
    
    const product = this.props.location.state;
    const categoriesId = [];
    if (product) {
      if (product.pCategoryId !== '0') {
        categoriesId.push(product.pCategoryId);
        this.getReqCategories(product.pCategoryId);
      }
      categoriesId.push(product.categoryId)
    }
    this.categoriesId = categoriesId
  }
  
  
  loadData = async (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    const result = await reqCategories(targetOption.value);
    if (result) {
      targetOption.loading = false;
      targetOption.children = result.map(option => {
        return {
          label: option.name,
          value: option._id,
        }
      });
      this.setState({
        options: [...this.state.options],
      });
    }
  };
  
  addProduct = (e) => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        
        const detail = draftToHtml(convertToRaw(this.richTextEditorRef.current.state.editorState.getCurrentContent()));
        const {name, price, desc, categoriesId} = values;
        let categoryId = '';
        let pCategoryId = '0';
        if (categoriesId.length === 1) {
          categoryId = categoriesId[0];
        } else {
          pCategoryId = categoriesId[0];
          categoryId = categoriesId[1];
        }
  
        const product = this.props.location.state;
        let promise = null;
        const options = {name, price, desc, categoryId, pCategoryId, detail};
        if(product){
          options._id = product._id;
          promise = reqUpdateProduct(options);
        }else{
          promise = reqAddProduct(options);
        }
        
        const result = await promise;
        if (result) {
          // message.success('添加商品成功');
          this.props.history.replace('/product/index')
        }
      }
    })
  };
  
  goBack = () => {
    this.props.history.goBack();
  };
  
  
  render() {
    const {getFieldDecorator} = this.props.form;
    const product = this.props.location.state;
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 2},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 10},
      },
    };
    return <Card title={<div className="save_update_title"><Icon type="arrow-left" className="arrow-left"
                                                                 onClick={this.goBack}/><span>添加商品</span></div>}>
      <Form {...formItemLayout} onSubmit={this.addProduct}>
        <Item label="商品名称">
          {
            getFieldDecorator(
              'name', {
                rules: [{required: true, message: '请输入商品名称',},],
                initialValue: product ? product.name : '',
              }
            )(
              <Input placeholder="请输入商品名称"/>
            )
          }
        </Item>
        <Item label="商品描述">
          {
            getFieldDecorator(
              'desc', {
                rules: [{required: true, message: '请输入商品描述',},],
                initialValue: product ? product.desc : '',
              }
            )(
              <Input placeholder="请输入商品描述"/>
            )
          }
        </Item>
        <Item label="选择分类" wrapperCol={{span: 5}}>
          {
            getFieldDecorator(
              'categoriesId', {
                rules: [{required: true, message: '请选择分类',},],
                initialValue:this.categoriesId
              }
            )(
              <Cascader
                options={this.state.options}
                loadData={this.loadData}
                changeOnSelect
                placeholder="请选择分类"
              />
            )
          }
        </Item>
        <Item label="商品价格">
          {
            getFieldDecorator(
              'price', {
                rules: [{required: true, message: '请输入商品价格',},],
                initialValue: product ? product.price : '',
              }
            )(
              <InputNumber
                // defaultValue={1000}
                formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/¥\s?|(,*)/g, '')}
                className="product_price"
              />
            )
          }
        </Item>
        {
          product ? <Item label="商品图片">
            <PicturesWall imgs={product.imgs} id={product._id}/>
          </Item> : null
        }
        <Item label="商品详情" wrapperCol={{span: 20}}>
          {
            getFieldDecorator(
              'detail'
            )(
              <RichTextEditor ref={this.richTextEditorRef} detail={product ? product.detail : ''}/>
            )
          }
        
        </Item>
        <Item wrapperCol={{offset: 2}}>
          <Button type="primary" htmlType="submit">提交</Button>
        </Item>
      </Form>
    </Card>;
  }
}

export default Form.create()(SaveUpdate);
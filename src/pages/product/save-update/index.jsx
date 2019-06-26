import React, { Component } from 'react';
import { Card, Icon, Form, Input, Button, Cascader, InputNumber  } from 'antd'
import './index.less';
import { reqCategories } from '../../../api';
import RichTextEditor from './rich-text-editor'

const { Item } = Form;

class SaveUpdate extends Component {
  state = {
    options:[]
  };
  
  async componentDidMount() {
    const result = await reqCategories('0');
    if(result){
      this.setState({
        options:result.map(category => {
          return {
            value: category._id,
            label: category.name,
            isLeaf: false,
          }
        })
      })
    }
  }
  
  loadData = async (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    const result = await reqCategories(targetOption.value);
    if(result){
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
  };
  
  goBack = () => {
    this.props.history.goBack();
  };
  
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
    };
    return <Card title={<div className="save_update_title" ><Icon type="arrow-left" className="arrow-left" onClick={this.goBack}/><span>添加商品</span></div>}>
      <Form {...formItemLayout} onSubmit={this.addProduct}>
        <Item label="商品名称">
          {
            getFieldDecorator(
              'name',{
                rules: [
                  {
                    required: true,
                    message: '请输入商品名称',
                  },
                ],
              }
            )(
              <Input placeholder="请输入商品名称"/>
            )
          }
          
        </Item>
        <Item label="商品描述">
          <Input placeholder="请输入商品描述"/>
        </Item>
        <Item label="选择分类" wrapperCol={{span:5}}>
          <Cascader
            options={this.state.options}
            loadData={this.loadData}
            changeOnSelect
            placeholder="请选择分类"
          />
        </Item>
        <Item label="商品价格">
          <InputNumber
            // defaultValue={1000}
            formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/￥\s?|(,*)/g, '')}
            className="product_price"
          />
        </Item>
        <Item label="商品详情"  wrapperCol={{span:20}}>
          <RichTextEditor/>
        </Item>
        <Item wrapperCol={{offset:2}}>
          <Button type="primary" htmlType="submit">提交</Button>
        </Item>
      </Form>
    </Card>;
  }
}

export default Form.create()(SaveUpdate);
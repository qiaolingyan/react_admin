import React, { Component } from 'react';
import { Form, Select,Input } from 'antd';
import PropTypes from 'prop-types';
const { Item } = Form;
const { Option } = Select;
class AddCategory extends Component {
  static propTypes = {
    categories:PropTypes.array.isRequired
  };
  validator =(rule,value,callback) => {
    if(!value) return callback('分类名称不能为空');
    const result = this.props.categories.find((category) => category.name === value);
    return result ? callback('分类名称已存在'): callback();
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form>
        <Item label="所属分类">
          {
            getFieldDecorator(
              'parentId',{
                initialValue:'0'
              }
            )(
              <Select onChange={this.handleChange}>
                <Option value="0" key="0">一级分类</Option>
                {
                  this.props.categories.map(category => {
                    return <Option value={category._id} key={category._id}>{category.name}</Option>
                  })
                }
              </Select>
            )
          }
          
        </Item>
        <Item label="分类名称">
          {
            getFieldDecorator(
              'categoryName',{
                rules:[{validator:this.validator}]
              }
            )(
              <Input placeholder="请输入分类名称"/>
            )
          }
          
        </Item>
      </Form>
    )
  }
}

export default Form.create()(AddCategory)
import React, { Component } from 'react';
import { Form, Input } from 'antd';
import PropTypes from 'prop-types';
const { Item } = Form;
class UpdateCategory extends Component {
  static propTypes = {
    categoryName:PropTypes.string.isRequired
  };
  validator =(rule,value,callback) => {
    if(!value) return callback('分类名称不能为空');
    if(value === this.props.categoryName) return callback('分类名称已存在');
    callback();
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form>
        <Item>
          {
            getFieldDecorator(
              'categoryName',{
                initialValue:this.props.categoryName,
                rules:[{validator:this.validator}]
              }
            )(
              <Input/>
            )
          }
          
        </Item>
      </Form>
    )
  }
}

export default Form.create()(UpdateCategory)
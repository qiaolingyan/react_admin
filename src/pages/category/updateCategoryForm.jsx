import React, { Component } from 'react';
import {Form, Input} from "antd";
import PropTypes from 'prop-types';
import { reqCategories } from '../../api';
const { Item } = Form;

class UpdateCategoryForm extends Component {
  static propTypes = {
    category:PropTypes.object.isRequired,
    categories:PropTypes.array.isRequired,
    
  };
  state = {
    categoryData:[]
  };
  
  getcategoryData = async () => {
    const result = await reqCategories(this.props.category.parentId);
    if(result){
      this.setState({
        categoryData:result
      })
    }
  };
  
  validator = (rule, value, callback) => {
    if(!value) return callback('分类名称不能为空');
    if(value ===this.props.category.name) return callback('分类名称不能与之前一样');
    this.getcategoryData();
    const result = this.state.categoryData.find(category => category.name === value);
    if(result) return callback('该分类名称已存在');
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
                initialValue:this.props.category.name,
                rules:[{validator:this.validator}]
              }
            )(
              <Input />
            )
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create()(UpdateCategoryForm)
import React, { Component } from 'react';
import { Form, Input, Select } from 'antd';
import PropTypes from 'prop-types'

const Item = Form.Item;
const Option = Select.Option;

class AddUserForm extends Component {
  static propTypes = {
    roles:PropTypes.array.isRequired
  };
  
  validator = (rule, value, callback) => {
    const name = rule.fullField === 'username' ? '用户名' : '密码';
    if (!value) {
      callback()
    } else if (value.length < 4) {
      callback(`${name}必须大于4位数`)
    } else if (value.length > 10) {
      callback(`${name}必须小于10位数`)
    } else if (!/^\w+$/.test(value)) {
      callback(`${name}为数字，字母，下划线`)
    } else {
      callback();
    }
  };

  render () {
    const {getFieldDecorator} = this.props.form;
    
    return (
      <Form>
        <Item label='用户名' labelCol={{span: 6}}  wrapperCol={{span: 15}}>
          {
            getFieldDecorator(
              'username',{
                rules:[{required:true,message:'请输入用户名'},{validator:this.validator}]
              }
            )(
              <Input placeholder='请输入用户名'/>
            )
          }
        </Item>
        <Item label='密码' labelCol={{span: 6}}  wrapperCol={{span: 15}}>
          {
            getFieldDecorator(
              'password',{
                rules:[{required:true,message:'请输入密码'},{validator:this.validator}]
              }
            )(
              <Input placeholder='请输入密码' type='password'/>
            )
          }
        </Item>
        <Item label='手机号' labelCol={{span: 6}}  wrapperCol={{span: 15}}>
          {
            getFieldDecorator(
              'phone',{
                rules:[{required:true,message:'请输入手机号'},{len:11,message:'长度必须为11位'}]
              }
            )(
              <Input placeholder='请输入手机号'/>
            )
          }
        </Item>
        <Item label='邮箱' labelCol={{span: 6}}  wrapperCol={{span: 15}}>
          {
            getFieldDecorator(
              'email',{
                rules:[{required:true,message:'请输入邮箱'},{pattern:/^([A-Za-z0-9])+@([A-Za-z0-9])+\.([A-Za-z]{2,4})$/,message:'邮箱格式不正确'}]
              }
            )(
              <Input placeholder='请输入邮箱'/>
            )
          }
        </Item>
        <Item label='角色' labelCol={{span: 6}}  wrapperCol={{span: 15}}>
          {
            getFieldDecorator(
              'role_id',{
                rules:[{required:true,message:'请选择分类'}]
              }
            )(
              <Select placeholder='请选择分类'>
                {
                  this.props.roles.map(role => {
                    return <Option value={role._id} key={role._id}>{role.name}</Option>
                  })
                }
              </Select>
            )
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create()(AddUserForm);
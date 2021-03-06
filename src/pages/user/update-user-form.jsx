import React, { Component } from 'react';
import { Form, Input, Select } from 'antd';
import PropTypes from 'prop-types'

const Item = Form.Item;
const Option = Select.Option;

class UpdateUserForm extends Component {
  static propTypes = {
    user:PropTypes.object.isRequired
  };

  render () {
    const { getFieldDecorator } = this.props.form;
    const { username , phone, email, role_id, password } = this.props.user;
    return (
      <Form>
        <Item label='用户名' labelCol={{span: 6}}  wrapperCol={{span: 15}}>
          {
            getFieldDecorator(
              'username',
              {rules:[{required:true,message:'请输入用户名'}],
                initialValue: username}
            )(
              <Input placeholder='请输入用户名'/>
            )
          }
        </Item>
        <Item label='密码' labelCol={{span: 6}}  wrapperCol={{span: 15}}>
          {
            getFieldDecorator(
              'password',{
                rules:[{required:true,message:'请输入密码'}],
                initialValue: password
              }
            )(
              <Input placeholder='请输入密码' type='password'/>
            )
          }
        </Item>
        <Item label='手机号' labelCol={{span: 6}}  wrapperCol={{span: 15}}>
          {
            getFieldDecorator(
              'phone',
              {rules:[{required:true,message:'请输入手机号'}],
                initialValue: phone}
            )(
              <Input placeholder='请输入手机号'/>
            )
          }
        </Item>
        <Item label='邮箱' labelCol={{span: 6}}  wrapperCol={{span: 15}}>
          {
            getFieldDecorator(
              'email',
              {rules:[{required:true,message:'请输入邮箱'}],
                initialValue: email}
            )(
              <Input placeholder='请输入邮箱'/>
            )
          }
        </Item>
        <Item label='角色' labelCol={{span: 6}}  wrapperCol={{span: 15}}>
          {
            getFieldDecorator(
              'role_id',
              {rules:[{required:true,message:'请选择分类'}],
                initialValue: role_id}
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

export default Form.create()(UpdateUserForm);
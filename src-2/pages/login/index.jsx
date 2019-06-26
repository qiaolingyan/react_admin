import React, { Component } from 'react';
import { Form, Icon, Input, Button } from 'antd';
import { reqLogin } from '../../api';
import logo from "../../../src/assets/images/logo.png";
import './index.less'
import { setItem } from '../../utils/storage-tools';

const Item = Form.Item;

class Login extends Component {
  validator = (rule, value, callback) => {
    const name = rule.fullField === 'username' ? '用户名' :'密码';
    if(!value){
      callback(`${name}不能为空`)
    }else if(value.length < 4){
      callback(`${name}的长度不能小于4`)
    }else if(value.length > 15){
      callback(`${name}的长度不能大于15`)
    }else if(!/^\w+$/.test(value)){
      callback(`${name}必须为数字，字母，下划线`)
    }else{
      callback()
    }
  };
  
  login = (e) => {
    e.preventDefault();
    this.props.form.validateFields(async (err,user) => {
      if(!err){
        const { username, password } = user;
        const res = await reqLogin(username, password);
        console.log(res);
        if(res) {
          setItem(res);
          this.props.history.replace('/')
        }else{
          this.props.form.resetFields(['password'])
        }
      }
    })
  };
  
  render() {
    const { getFieldDecorator } = this.props.form;
    return <div className="login">
      <header className="login_header">
        <img src={logo} alt="logo"/>
        <h1>React项目: 后台管理系统</h1>
      </header>
      <section className="login_content">
        <h2>用户登录</h2>
        <Form onSubmit={this.login} className="login-form">
          <Item>
            {
              getFieldDecorator(
                'username',
                {
                  rules: [{validator:this.validator}],
                }
              )(
                <Input className="login_input" prefix={<Icon type="user"/>} placeholder="用户名"/>
              )
            }
          </Item>
          <Item>
            {
              getFieldDecorator(
                'password',
                {
                  rules: [{validator:this.validator}],
                }
              )(
                <Input className="login_input" prefix={<Icon type="lock"/>} placeholder="密码" type="password"/>
              )
            }
          </Item>
          <Item>
            <Button className="login_btn" type="primary" htmlType="submit">登录</Button>
          </Item>
        </Form>
      </section>
    </div>;
  }
}

export default Form.create()(Login);
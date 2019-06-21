import React, { Component } from 'react';
import { Form, Icon, Input, Button } from 'antd';
import './index.less'
import logo from './logo.png'
const Item = Form.Item;

class Login extends Component {
  render() {
    return <div className="login">
      
      <header className="login_header">
        <img src={logo} alt="logo"/>
        <h1>React项目: 后台管理系统</h1>
      </header>
      
      <section className="login_content">
        <h2>用户登录</h2>
        <Form className="login-form">
          <Item>
            <Input prefix={<Icon type="user"/>} placeholder="用户名" className="login_input"/>
          </Item>
          <Item>
            <Input prefix={<Icon type="lock" />} placeholder="密码" className="login_input"/>
          </Item>
          <Item>
            <Button type="primary" className="login_btn">登录</Button>
          </Item>
        </Form>
      
      </section>
      
    </div>;
  }
}

export default Form.create()(Login);

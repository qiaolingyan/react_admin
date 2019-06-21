import React, { Component } from 'react';
import { Form, Icon, Input, Button } from 'antd';
import './index.less'
import logo from './logo.png'
const Item = Form.Item;

class Login extends Component {
  
  
  validator = (key,value,callback) => {
    
    const name =key.fullField === 'username' ? '用户名' : '密码';
    
    if(!value){
      callback(`请输入${name}`)
    }else if(value.length < 4){
      callback(`${name}必须大于4位数`)
    }else if(value.length > 10){
      callback(`${name}必须小于10位数`)
    }else if(!/^\w+$/.test(value)){
      callback(`${name}为数字，字母，下划线`)
    }else{
      callback();
    }
  };
  
  login = (e) => {
    e.preventDefault();
  }
  
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="login">
      
        <header className="login_header">
          <img src={logo} alt="logo"/>
          <h1>React项目: 后台管理系统</h1>
        </header>
        
        <section className="login_content">
          <h2>用户登录</h2>
          <Form className="login-form" onSubmit={this.login}>
            <Item>
              {
                getFieldDecorator(
                  'username',
                  {
                    rules:[{validator:this.validator}]
                  }
                )(
                  <Input prefix={<Icon type="user"/>} placeholder="用户名" className="login_input"/>
                )
              }
            </Item>
            <Item>
              {
                getFieldDecorator(
                  'password',
                  {
                    rules:[{validator:this.validator}]
                  }
                )(
                  <Input prefix={<Icon type="lock" />} placeholder="密码" className="login_input"/>
                )
              }
            </Item>
            <Item>
              <Button type="primary" className="login_btn">登录</Button>
            </Item>
          </Form>
        
        </section>
      
      </div>
    )
  }
}

export default Form.create()(Login);

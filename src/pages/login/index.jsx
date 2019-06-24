// import必须放在最上面，否则会报错
import React from 'react';
import { Form, Icon, Input, Button } from 'antd';
import { setItem } from '../../utils/storage-tools';

import { reLogin } from '../../api';
import './index.less'
import logo from '../../assets/images/logo.png'   //引入图片资源：在react脚手架中图片必须引入才会打包

const Item = Form.Item;  //缓存

function Login(props) {
  //自定义校验规则函数
  const validator = (rule, value, callback) => {
    const name = rule.fullField === 'username' ? '用户名' : '密码';
    if (!value) {
      callback(`请输入${name}`)
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
  const login = (e) => {
    e.preventDefault();
    props.form.validateFields(async (error, values) => {
      // cvalidateFields检验验证是否通过;  error表单校验结果：null - 校验通过，{} - 校验失败
      if (!error) {
        const {username, password} = values;
        
        //发送请求
        const result = await reLogin(username, password);
        if (result){
          setItem(result);
          props.history.replace('/');
        }
        else{
          props.form.resetFields(['password']);
        }   //重置表单项
        
      } else {
        console.log('表单校验失败：', error)
      }
    })
    
  };
  const {getFieldDecorator} = props.form;   //做表单验证使用
  return (
    <div className="login">
      <header className="login_header">
        <img src={logo} alt="logo"/>
        <h1>React项目: 后台管理系统</h1>
      </header>
      <section className="login_content">
        <h2>用户登录</h2>
        <Form className="login-form" onSubmit={login}>
          <Item>
            {
              getFieldDecorator(
                'username',
                {
                  rules: [{validator: validator}]  /*自定义校验规则*/
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
                  rules: [{validator: validator}]
                }
              )(
                <Input prefix={<Icon type="lock"/>} placeholder="密码" className="login_input" type="password"/>
              )
            }
          </Item>
          <Item>
            <Button type="primary" className="login_btn" htmlType="submit">登录</Button>   {/*原生的type用htmlType代替*/}
          </Item>
        </Form>
      </section>
    </div>
  )
}

export default Form.create()(Login);  //给Login组件上添加this.props.form, 为了得到里面的一些方法

import React, { Component } from 'react';
import { Layout } from 'antd';
import { Redirect,Switch,Route } from 'react-router-dom'
import LeftNav from '../../components/left-nav'
import HeaderMain from '../../components/header-main'
import { getItem } from '../../utils/storage-tools';
import { volidateLogin } from '../../api'

import Home from '../home';
import Category from '../category';
import Product from '../product';
import User from '../user';
import Role from '../role';
import Bar from '../charts/bar';
import Line from '../charts/line';
import Pie from '../charts/pie';

const { Header, Content, Footer, Sider } = Layout;
export default class Admin extends Component {
  state = {
    collapsed: false,
  };
  
  onCollapse = collapsed => {
    this.setState({ collapsed });
  };
  
  async componentWillMount() {
    const user = getItem();
    if(user && user._id){
      const res = await volidateLogin(user._id);
      if(res) return;
    }
    this.isLogin = true;
  }
  
  
  render() {
    const { collapsed } = this.state;
    if(this.isLogin){
      return <Redirect to="/login"/>
    }
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
          <LeftNav collapsed={collapsed}/>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 ,minHeight: 100}} >
            <HeaderMain />
          </Header>
          <Content style={{ margin: '30px 16px' }}>
            <Switch>
              <Route path="/home" component={Home}/>
              <Route path="/category" component={Category}/>
              <Route path="/product" component={Product}/>
              <Route path="/user" component={User}/>
              <Route path="/role" component={Role}/>
              <Route path="/charts/bar" component={Bar}/>
              <Route path="/charts/line" component={Line}/>
              <Route path="/charts/pie" component={Pie}/>
              <Redirect to="/home"/>
            </Switch>
          </Content>
          <Footer style={{ textAlign: 'center' }}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
        </Layout>
      </Layout>
    )
  }
}
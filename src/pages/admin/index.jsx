import React, { Component } from 'react';
import { Layout } from 'antd';
import { Route, Redirect, Switch } from 'react-router-dom';
import { getItem } from "../../utils/storage-tools";
import LeftNav from '../../components/left_nav';
import ContentHeader from '../../components/content_header';
import { volidateLogin } from '../../api';

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
    /*isLoading:true,
    success:false*/
  };
  
  onCollapse = collapsed => {
    // console.log(collapsed);
    this.setState({ collapsed });
  };
  
  async componentWillMount() {
    const user = getItem();
  
    /*if(user && user._id){
      const result = await volidateLogin(user._id);
      if(result) {
        return this.setState({
          isLoading:false,
          success:true
        })
      }
    }
    this.setState({
      isLoading:false,
      success:false
    })*/
    
    
    if(user && user._id){
      const result = await volidateLogin(user._id);
      if(result) return;
    }
    this.isLogin = true;   //需要重定向时设置它为true，否则为undefined
    
    // this.props.history.replace('/login')   //虽然跳转了，但是下面的render还是会执行
 
  }
  
  render() {
    const { collapsed } = this.state;
    
    if (this.isLogin) {
      return <Redirect to="/login"/>
    }
    return <Layout style={{ minHeight: '100vh' }}>
      <Sider  collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
        <LeftNav collapsed={collapsed} />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: 0 , minHeight: 100}} >
          <ContentHeader />
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
  
    /*const { collapsed,isLoading,success } = this.state;
    if(isLoading) return null;
    return (
      success ? <Layout style={{ minHeight: '100vh' }}>
        <Sider  collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
          <LeftNav collapsed={collapsed} />
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 , minHeight: 100}} >
            <ContentHeader />
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
      </Layout> : <Redirect to="/login"/>
    );*/
  }
}
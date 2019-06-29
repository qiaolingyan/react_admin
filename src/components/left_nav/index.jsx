import React, {Component} from 'react';
import {Link, withRouter} from "react-router-dom";
import {Icon, Menu} from "antd";
import PropTypes from 'prop-types';
import {getItem} from '../../utils/storage-tools'

import menuList from '../../config/menu-config';
import './index.less';
import logo from "../../assets/images/logo.png";

const {SubMenu, Item} = Menu;

class LeftNav extends Component {
  static propTypes = {
    collapsed: PropTypes.bool.isRequired
  };
  
  createItem = (menu) => {
    return (
      <Item key={menu.key}>
        <Link to={menu.key}>
          <Icon type={menu.icon}/>
          <span>{menu.title}</span>
        </Link>
      </Item>
    )
  };
  //只做一次在生命周期函数做
  //数据初始化渲染必须用，就在componentWillMount，不用就在componentDidMount做，提升初始化渲染速度
  componentWillMount() {
    let {pathname} = this.props.location;
    const reg = /^\/product\//;
    if (reg.test(pathname)) pathname = '/product';
    // let isHome = true;        //此种方法只适用于初始化渲染
    let {role: {menus}, username} = getItem();
    if (username === 'admin') {
      menus = [
        '/home',
        '/products',
        '/category',
        '/product',
        '/user',
        '/role',
        '/charts',
        '/charts/bar',
        '/charts/line',
        '/charts/pie'
      ]
    }
    this.menus = menuList.reduce((pre, cur) => {
      const children = cur.children;
      if (children) {
        let isShowSubmenu = false;
        const subMenu = <SubMenu
          key={cur.key}
          title={
            <span>
                <Icon type={cur.icon}/>
                <span>{cur.title}</span>
              </span>
          }
        >
          {
            children.reduce((prev,current) => {
              const menu = menus.find(menu => menu === current.key);
              if(menu){
                isShowSubmenu = true;
                if (pathname === current.key) {
                  this.OpenKey = cur.key;
                }
                return [...prev,this.createItem(current)]
              }else{
                return prev
              }
            },[])
          }
        </SubMenu>;
        return isShowSubmenu ? [...pre,subMenu] : pre;
      } else {
        const menu = menus.find(menu => menu === cur.key);
        if (menu) {
          return [...pre, this.createItem(cur)]
        } else {
          return pre
        }
      }
    }, []);
    // this.selectedKey = isHome ? '/home' : pathname;
  }
  
  render() {
    const {collapsed} = this.props;
    let {pathname} = this.props.location;   //因为重定向，所以需要在这获取当前的网址，从而设置为menu的选中状态
    const reg = /^\/product\//;
    if (reg.test(pathname)) pathname = '/product';
    return <div>
      <Link className="logo nav_logo" to="/home">
        <img src={logo} alt=""/>
        <h1 style={{display: collapsed ? 'none' : 'block'}}>硅谷后台</h1>
      </Link>
      <Menu theme="dark" selectedKeys={[pathname]} defaultOpenKeys={[this.OpenKey]} mode="inline">  {/*选中网址对应的导航菜单*/}
        {/*<Menu theme="dark" defaultSelectedKeys={[this.selectedKey]} defaultOpenKeys={[this.OpenKey]} mode="inline">*/} {/*点击标题重定向到首页不会选择home，所以不能用*/}
        {this.menus}
      </Menu>
    </div>;
  }
}

export default withRouter(LeftNav);
import React, {Component} from 'react';
import {Link, withRouter} from "react-router-dom";
import {Icon, Menu} from "antd";
import PropTypes from 'prop-types';

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
    const { pathname } = this.props.location;
    this.menus = menuList.map((menu) => {
      const children = menu.children;
      if (children) {
        return (
          <SubMenu
            key={menu.key}
            title={
              <span>
                <Icon type={menu.icon}/>
                <span>{menu.title}</span>
              </span>
            }
          >
            {
              children.map((item) => {
                if (pathname === item.key) this.OpenKey = menu.key;
                return this.createItem(item)
              })
            }
          </SubMenu>
        )
      } else {
        return this.createItem(menu)
      }
    });
    // this.selectedKey = pathname;
  }
  
  render() {
    const {collapsed} = this.props;
    const { pathname } = this.props.location;   //因为重定向，所以需要在这获取当前的网址，从而设置为menu的选中状态
    return <div>
      <Link className="logo nav_logo" to="/home">
        <img src={logo} alt=""/>
        <h1 style={{display: collapsed ? 'none' : 'block'}}>硅谷后台</h1>
      </Link>
      <Menu theme="dark" selectedKeys={[pathname]} defaultOpenKeys={[this.OpenKey]} mode="inline">
        {this.menus}
      </Menu>
    </div>;
  }
}

export default withRouter(LeftNav);
import React, {Component} from 'react';
import {Icon, Menu} from "antd";
import PropTypes from 'prop-types';
import {Link,withRouter} from 'react-router-dom';
import './index.less'
import logo from "../../assets/images/logo.png";
import menuList from '../../config/menu-config';

const {SubMenu,Item} = Menu;
class LeftNav extends Component {
  static proTypes = {
    collapsed: PropTypes.bool.isRequired,
  };
  
  componentWillMount() {
    const { pathname } = this.props.location;
    this.menus = menuList.map(menu => {
      const children = menu.children;
      if (children) {
        return <SubMenu
          key={menu.key}
          title={
            <span>
              <Icon type={menu.icon}/>
              <span>{menu.title}</span>
            </span>
          }
        >
          {
            children.map(item => {
              if(item.key === pathname) this.openKey = menu.key;
              return this.getMenu(item)
            })
          }
        </SubMenu>
      } else {
        return this.getMenu(menu)
      }
    })
  }
  
  getMenu = (menu) => {
    return <Item key={menu.key}>
      <Link to={menu.key}>
        <Icon type={menu.icon}/>
        <span>{menu.title}</span>
      </Link>
    </Item>
  };
  
  
  render() {
    const { collapsed } = this.props;
    const { pathname } = this.props.location;
    return (
      <div>
        <Link className="logo nav_logo" to="/home">
          <img src={logo} alt=""/>
          <h1 style={{display: collapsed ? 'none' : 'block'}}>硅谷后台</h1>
        </Link>
        <Menu theme="dark" selectedKeys={[pathname]} defaultOpenKeys={[this.openKey]} mode="inline">
          {this.menus}
        </Menu>
      </div>
    )
  }
}

export default withRouter(LeftNav);
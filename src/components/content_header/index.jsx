import React, { Component } from 'react';
import MyButton from '../my_button';
import './index.less'
import logo from '../../assets/images/logo.png'

export default class ContentHeader extends Component {
  render() {
    return <div>
      <div className="header_top">
        <span>欢迎, admin</span>
        <MyButton>退出</MyButton>
      </div>
      <div className="header_bottom">
        <span className="header_left">
          首页
        </span>
        <div className="header_right">
          <span>{Date.now()}</span>
          <img src={logo} alt=""/>
          <span>晴</span>
        </div>
      </div>
    </div>;
  }
}
import React, { Component } from 'react';
import { Modal } from 'antd';
import { withRouter } from 'react-router-dom';
import dayjs from 'dayjs'

import MyButton from '../my_button';
import './index.less'
import { getItem, removeItem } from "../../utils/storage-tools";
import { reqWeather } from '../../api';
import menuList from '../../config/menu-config';

const { confirm } = Modal;

class ContentHeader extends Component {
  
  state = {
    sysTime:dayjs().format('YYYY-MM-DD HH:mm:ss'),
    weatherImg:"http://api.map.baidu.com/images/weather/day/qing.png",
    weather:'晴'
  };
  
  componentWillMount() {
    this.username = getItem().username;
    this.title = this.getTitle(this.props);
  }
  
  async componentDidMount() {
    this.timerId = setInterval(()=>{
      this.setState({
        sysTime:dayjs().format('YYYY-MM-DD HH:mm:ss')
      })
    },1000);
    const { promise,cancel } = reqWeather();
    this.cancel = cancel;
    const result = await promise;
    result && this.setState(result);
  }
  
  componentWillReceiveProps(nextProps) {
    this.title = this.getTitle(nextProps);
  }
  
  componentWillUnmount() {
    clearInterval(this.timerId);
    this.cancel();
   /*
    取消jsonp请求，jsonp的返回值就是cancel（）
   */
  }
  
  logout = () => {
    confirm({
      title: '您确认要退出登录吗',
      onOk:() => {
        removeItem();
        this.props.history.replace('/login')
      },
      okText:'确认',
      cancelText:'取消'
    });
  };
  
  getTitle = (nextProps) => {
    let { pathname } = nextProps.location;
    const reg = /^\/product\//;
    if (reg.test(pathname)) pathname = '/product';
    for (let menu of menuList) {
      if(menu.children){
        for (let item of menu.children) {
          if(item.key === pathname)return item.title;
        }
      }else{
        if(menu.key === pathname)return menu.title;
      }
    }
  };
  
  render() {
    const { sysTime, weatherImg, weather } = this.state;
    return <div>
      <div className="header_top">
        <span>欢迎, {this.username}</span>
        <MyButton onClick={this.logout}>退出</MyButton>
      </div>
      <div className="header_bottom">
        <span className="header_left">
          {this.title}
        </span>
        <div className="header_right">
          <span>{sysTime}</span>
          <img src={weatherImg} alt=""/>
          <span>{weather}</span>
        </div>
      </div>
    </div>;
  }
}

export default withRouter(ContentHeader);
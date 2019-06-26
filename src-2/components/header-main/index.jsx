import React, { Component } from 'react';
import dayjs from 'dayjs';
import { Modal } from "antd";
import MyButton from "../../components/my-button";
import { getItem ,removeItem } from '../../utils/storage-tools';
import './index.less'
import  { reqWeather } from '../../api'
import menuList from '../../config/menu-config';
import { withRouter } from 'react-router-dom'

class HeaderMain extends Component {
  
  state = {
    sysTime:dayjs().format('YYYY-MM-DD HH:mm:ss'),
    weatherImg:"http://api.map.baidu.com/images/weather/day/qing.png",
    weather:'晴'
  };
  
  componentWillMount() {
    this.username = getItem().username;
    this.title = this.getTitle(this.props)
  }
  
  componentWillReceiveProps(nextProps, nextContext) {
    this.title = this.getTitle(nextProps)
  }
  
  getTitle = (props) => {
    let { pathname } = props.location;
    const reg = /^\/product\//;
    if(reg.test(pathname)) pathname = '/product';
    for (let menu of menuList) {
      if(menu.children){
        for (let item of menu.children) {
          if(item.key === pathname) return item.title;
        }
      }else{
        if(menu.key === pathname) return menu.title;
      }
    }
  };
  
  async componentDidMount() {
    this.timeId = setInterval(() =>{
      this.setState({
        sysTime:dayjs().format('YYYY-MM-DD HH:mm:ss'),
      })
    },1000);
    const {promise,cancel} = reqWeather();
    this.cancel = cancel;
    const res = await promise;
    res && this.setState(res);
  }
  
  componentWillUnmount() {
    clearInterval(this.timeId);
    this.cancel()
  }
  logout = () => {
    Modal.confirm({
      title: '您确认要退出登录吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        // 清空本地数据
        removeItem();
        // 退出登录
        this.props.history.replace('/login');
      }
    })
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

export default withRouter(HeaderMain)
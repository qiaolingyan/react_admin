import React, { Component } from 'react';
import { Card, Table, Icon } from 'antd'
import { Descriptions } from 'antd';
import './index.less'

export default class Detail extends Component {
  goBack = () => {
    this.props.history.goBack();
  };
  render() {
    return <Card title={<div className="save_update_title" ><Icon type="arrow-left" className="arrow-left" onClick={this.goBack}/><span>添加商品</span></div>}>

</Card>;
}
}
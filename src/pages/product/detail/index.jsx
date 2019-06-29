import React, {Component} from 'react';
import {List, Card, Icon} from 'antd';
import { reqCategories } from '../../../api'
import './index.less'

const Item = List.Item;

export default class Detail extends Component {
  state = {
    pCategoryName: ''
  };
  
  renderItem = (item, index) => {
    switch (index) {
      case 4:
        return <Item>商品图片: {item.map((item, index) => <img className="myImg" key={index} src={'http://localhost:5000/upload/' + item} alt={item}/>)}</Item>;
      case 5:
        return <Item>商品详情: <div dangerouslySetInnerHTML={{__html: item}} className="myDetail"/></Item>
      default:
        return <Item>{item}</Item>;
    }
  };
  
  async componentDidMount() {
    const { pCategoryId } = this.props.location.state;
    if (pCategoryId !== '0') {
      const result = await reqCategories('0');
      const {name} = result.find((item) => item._id === pCategoryId);
      this.setState({
        pCategoryName: name
      })
    }
  }
  
  goBack = () => {
    this.props.history.goBack();
  };

  render() {
    const {name, desc, price, pCategoryId, imgs, detail} = this.props.location.state;
    let category = '';
    const pCategoryName = this.state.pCategoryName;
    if (pCategoryId === '0') {
      category = '商品分类：' + name
    } else {
      category = '商品分类：' + pCategoryName + '/' + name
    }
    
    const data = [
      '商品名称：' + name,
      '商品描述：' + desc,
      '商品价格：' + price + '元',
      category,
      imgs,
      detail
    ];
    return <Card title={<div className="save_update_title"><Icon type="arrow-left" className="arrow-left" onClick={this.goBack}/><span>添加商品</span></div>}>
      <List
        bordered
        size="large"
        dataSource={data}
        renderItem={this.renderItem}
      />
    </Card>;
  }
}



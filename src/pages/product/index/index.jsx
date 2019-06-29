import React, { Component } from 'react';
import { Card, Input, Table, Icon, Select, Button, message } from 'antd'
import './index.less'
import MyButton from '../../../components/my_button'
import {reqProducts, reqUpdateProductStatus, reqSearchProducts} from '../../../api'
const { Option } = Select;
export default class Index extends Component {
  state = {
    products:[],
    isLoading:true,
    searchType:'productName',
    searchValue:'',
    pageNum:1,
    pageSize:3
  };
  
  componentDidMount() {
    this.getReqProducts(1,3)
  }
  
  getReqProducts = async (pageNum,pageSize) => {
    this.setState({
      isLoading:true,
    });
    const { searchType, searchValue } = this.state;
    let promise = null;
    if(this.isSearch && searchValue){  //如果点击过搜索按钮且关键字不为空则搜索，否则展示全部
      promise = reqSearchProducts({searchType, searchValue, pageNum, pageSize});
    }else{
      promise = reqProducts(pageNum,pageSize);
    }
    const result = await promise;
    if(result){
      this.setState({
        products:result.list,
        isLoading:false,
        total:result.total,
      })
    }
  };
  
  showAddProducts = () => {
    this.props.history.push('/product/saveupdate')
  };
  
  showProduct = (path,product) => {
    return async () => {
      this.props.history.push(path,product)
    }
  };
  
  componentWillMount() {
    this.columns = [
      {
        title:'商品名称',
        dataIndex:'name',
      },
      {
        title:'商品描述',
        dataIndex:'desc',
      },
      {
        title:'价格',
        dataIndex:'price',
      },
      {
        title:'状态',
        className:"product_status_operator",
        // dataIndex:'status',
        render:product => {
          return (
            product.status === 2
              ? <div><Button type="primary" onClick={this.updateProductStatus(product)}>下架</Button>&nbsp;&nbsp;在售</div>
              : <div><Button type="primary" onClick={this.updateProductStatus(product)}>上架</Button>&nbsp;&nbsp;已下架</div>
          )
        }
      },
      {
        title:'操作',
        className:"product_status_operator",
        render:product => {
          return <div>
            <MyButton onClick={this.showProduct('/product/detail',product)}>详情</MyButton>
            <MyButton onClick={this.showProduct('/product/saveupdate',product)}>修改</MyButton>
          </div>
        }
      },
    ];
  }
  
  updateProductStatus = (product) => {
    return async () => {
      let { _id,status } = product;
      status = 3-status;
      const result = await reqUpdateProductStatus(_id,status);
      if(result){
        // message.success('更新状态成功~');
        this.setState({
          products: this.state.products.map(item => {
            if (item._id === _id) {
              // item.status = status;
              return {...item,status}
            }
            return item;
            
          })
        })
      }
    }
  };
  
  search = async () => {
    const { searchValue, pageNum, pageSize } = this.state;
    if(searchValue){
      this.isSearch = true;
      this.getReqProducts(pageNum, pageSize)
    }else{
      message.warn('请输入搜索关键字')
    }
  };
  
  handleChange = (stateName) => {
    return e => {
      let value= '';
      if(stateName === 'searchType'){
        value = e
      }else{
        value = e.target.value;
        if(!value) this.isSearch = false;
      }
      this.setState({
        [stateName]:value
      })
    }
  };
  
  render() {
    const { products, isLoading, total } = this.state;
    
    return <Card
      title={
        <div>
          <Select defaultValue="productName" onChange={this.handleChange('searchType')}>
            <Option key={0} value="productName">根据商品名称</Option>
            <Option key={1} value="productDesc">根据商品描述</Option>
          </Select>
          <Input placeholder="关键字" className="productSearch" onChange={this.handleChange('searchValue')}/>
          <Button type="primary" onClick={this.search}>搜索</Button>
        </div>
      }
      extra={<Button type="primary" onClick={this.showAddProducts}><Icon type="plus"/>添加产品</Button>}
    >
      <Table
        columns={this.columns}
        dataSource={products}
        bordered
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ['3', '6', '9', '12'],
          defaultPageSize: 3,
          showQuickJumper: true,
          total:total,
          onChange:this.getReqProducts,
          onShowSizeChange:this.getReqProducts,
        }}
        rowKey="_id"
        loading={isLoading}
      >
      
      </Table>
    </Card>;
  }
}
import React, { Component } from 'react';
import { Card, Input, Table, Icon, Select, Button } from 'antd'
import { Link } from 'react-router-dom'
import './index.less'
import MyButton from '../../../components/my-button'
import { reqProducts } from '../../../api'
const { Option } = Select;
export default class Index extends Component {
  state = {
    products:[],
    isLoading:true,
  };
  
  async componentDidMount() {
    this.setState({
      isLoading:true,
    });
    const result = await reqProducts(1,1);
    if(result){
      this.setState({
        products:result.list,
        isLoading:false,
      })
    }
  }
  
  showAddProducts = () => {
    this.props.history.push('/product/saveupdate')
  };
  
  
  render() {
    const { products, isLoading } = this.state;
    const columns = [
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
        dataIndex:'status',
        render:status => {
          return (
            status === 2
            ? <div><Button type="primary">下架</Button>&nbsp;&nbsp;在售</div>
            : <div><Button type="primary">上架</Button>&nbsp;&nbsp;已下架</div>
          )
        }
      },
      {
        title:'操作',
        className:"product_status_operator",
        render:products => {
          return <div>
            <MyButton>
              <Link to="/product/detail">
                详情
              </Link>
            </MyButton>
            <MyButton>
              <Link to="/product/saveupdate">
                修改
              </Link>
            </MyButton>
          </div>
        }
      },
    ];
    
    return <Card
      title={
        <div>
          <Select defaultValue={0}>
            <Option key={0} value={0}>根据商品名称</Option>
            <Option key={1} value={1}>根据商品描述</Option>
          </Select>
          <Input placeholder="关键字" className="productSearch"/>
          <Button type="primary">搜索</Button>
        </div>
      }
      extra={<Button type="primary" onClick={this.showAddProducts}><Icon type="plus"/>添加产品</Button>}
    >
      <Table
        columns={columns}
        dataSource={products}
        bordered
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ['1', '2', '3', '12'],
          defaultPageSize: 1,
          showQuickJumper: true
        }}
        rowKey="_id"
        loading={isLoading}
      >
      
      </Table>
    </Card>;
  }
}
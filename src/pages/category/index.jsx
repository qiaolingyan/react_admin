import React, { Component } from 'react';
import { Button, Card, Icon, Table} from "antd";
import './index.less'
import MyButton from '../../components/my_button';
import { reqCategories } from '../../api';

export default class Category extends Component {
  
  state = {
    categories :[]
  };
  
  async componentDidMount() {
    const result = await reqCategories('0');
    result && this.setState({
      categories:result
    });
  }
  
  render() {
    const columns = [
      {
        title: '品类名称',
        dataIndex: 'name',
      },
      {
        title: '操作',
        className: 'category_operation',
        render: text => {
          return <div>
            <MyButton>修改名称</MyButton>
            <MyButton>查看其子品类</MyButton>
          </div>
        },
      }
    ];
    const { categories } = this.state;
    return (
      <div>
        <Card title="一级分类列表" extra={<Button type="primary"><Icon type="plus"/>添加品类</Button>}>
          <Table
            columns={columns}
            dataSource={categories}
            bordered
            pagination={{
              showSizeChanger:true,
              pageSizeOptions:['3','6','9','12'],
              defaultPageSize:3,
              showQuickJumper:true
            }}
            rowKey="_id"
          />
        </Card>
      </div>
    )
  }
}
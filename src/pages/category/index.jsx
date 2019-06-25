import React, { Component } from 'react';
import { Card, Button, Icon, Table, Modal, message } from 'antd';

import MyButton from '../../components/my-button';
import { reqCategories, reqAddCategories, reqUpdateCategories } from '../../api';
import './index.less'
import AddCategory from './addCategory';
import UpdateCategory from './updateCategory'


export default class Category extends Component {
  state = {
    categories:[],
    isShowAddCategory:false,
    isShowUpdateCategory:false,
  };
  
  async componentDidMount() {
    const res = await reqCategories('0');
    res &&this.setState({categories:res})
  }
  
  switchDisplay = (stateValue) => {
    return e => {
      this.setState({
        isShowAddCategory:stateValue
      })
    }
  };
  
  AddCategory = () => {
    const { form } = this.addCategoryForm.props;
    form.validateFields(async (err,values) => {
      if(!err){
        const {categoryName,parentId} = values;
        const res = await reqAddCategories(categoryName,parentId);
        if(res){
          message.success('添加品类成功',2);
          form.resetFields(['categoryName','parentId']);
          const stateChange = {isShowAddCategory:false};
          if(parentId === '0'){
            stateChange.categories = [...this.state.categories,res]
          }
          this.setState(stateChange)
        }
      }
    })
  };
  
  confirmUpdate = () => {
    const { form } = this.updateCategoryForm.props;
    form.validateFields(async (err,values) => {
      if(!err){
        const { categoryName } = values;
        const categoryId = this.category._id;
        const res = await reqUpdateCategories(categoryName,categoryId);
        if(res){
          const categories = this.state.categories.map(category => {
            let { _id,name,parentId } = category;
            if(_id === categoryId){
              name = categoryName;
              return {
                _id,name,parentId
              }
            }
            return category;
          });
          this.setState({
            categories,
            isShowUpdateCategory:false,
          });
          form.resetFields(['categoryName']);
        }
      }
    })
  };
  
  
  
  cancelUpdate = () => {
    this.updateCategoryForm.props.form.resetFields(['categoryName']);
    this.setState({
      isShowUpdateCategory:false,
    })
  };
  
  category ={};
  
  saveCategoryName = (category) => {
    return () => {
      this.category = category;
      this.setState({
        isShowUpdateCategory:true,
      })
    }
  };
  
  
  render() {
    const { isShowAddCategory, categories, isShowUpdateCategory } = this.state;
    const columns = [
      {
        title: '分类名称',
        dataIndex: 'name',
      },
      {
        title: '操作',
        className: 'category_operation',
        render: category => <div>
          <MyButton onClick={this.saveCategoryName(category)}>修改名称</MyButton>
          <MyButton>显示其子分类</MyButton>
        </div>
      },
    ];
    
    return (
      
      <Card title="一级分类列表" extra={<Button type="primary" onClick={this.switchDisplay(true)}><Icon type="plus" />添加分类</Button>}>
        <Table
          columns={columns}
          dataSource={categories}
          bordered
          // loading
          pagination={{
            defaultPageSize:3,
            pageSizeOptions:['3','6','9','12'],
            showQuickJumper:true,
            showSizeChanger:true
          }}
          rowKey="_id"
        />,
  
        <Modal
          title="添加分类"
          visible={isShowAddCategory}
          okText="确认"
          cancelText="取消"
          onOk={this.AddCategory}
          onCancel={this.switchDisplay(false)}
        >
          <AddCategory categories={categories} wrappedComponentRef={(form) => this.addCategoryForm = form}/>
        </Modal>
  
        <Modal
          title="更新分类"
          visible={isShowUpdateCategory}
          okText="确认"
          cancelText="取消"
          onOk={this.confirmUpdate}
          onCancel={this.cancelUpdate}
          width={300}
        >
          <UpdateCategory categoryName={this.category.name} wrappedComponentRef={(form) => this.updateCategoryForm = form}/>
        </Modal>
        
      </Card>
    )
  }
}
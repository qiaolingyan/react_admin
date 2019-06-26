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
    subCategories:[],
    isShowSubCategories:false,
    isShowAddCategory:false,
    isShowUpdateCategory:false,
    isLoading:true,
  };
  
  async componentDidMount() {
    this.fetchReqCategories('0');
  }
  
  fetchReqCategories = async (id) => {
    this.setState({
      isLoading:true,
    });
    const res = await reqCategories(id);
    if(res){
      if(id === '0'){
        this.setState({categories:res})
      }else{
        this.setState({
          isShowSubCategories:true,
          subCategories:res
        })
      }
    }
    this.setState({
      isLoading:false,
    });
  };
  
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
          }else if(this.state.isShowSubCategories && parentId === this.parentCategory._id){
            stateChange.subCategories = [...this.state.subCategories,res]
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
          form.resetFields(['categoryName']);
          let categoryData = this.state.categories;
          let stateName = 'categories';
          if(this.category.parentId !== '0'){
            categoryData = this.state.subCategories;
            stateName = 'subCategories';
          }
          
          const categories = categoryData.map(category => {
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
            [stateName]:categories,
            isShowUpdateCategory:false,
          });
          
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
  
  showSubCategories = (category) => {
    return async () => {
      this.parentCategory = category;
      this.fetchReqCategories(category._id);
    }
  };
  
  showCategories = () => {
    this.setState({
      isShowSubCategories:false
    })
  };
  
  
  render() {
    const { isShowAddCategory, categories, isShowUpdateCategory, subCategories, isShowSubCategories } = this.state;
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
          {isShowSubCategories ? null : <MyButton onClick={this.showSubCategories(category)}>显示其子分类</MyButton>}
        </div>
      },
    ];
    
    return (
      
      <Card title={isShowSubCategories ? <div><MyButton onClick={this.showCategories}>一级分类</MyButton><Icon type="arrow-right"/><span>{this.parentCategory.name}</span></div> :"一级分类列表"}
            extra={<Button type="primary" onClick={this.switchDisplay(true)}><Icon type="plus" />添加分类</Button>}>
        <Table
          columns={columns}
          dataSource={isShowSubCategories ? subCategories : categories}
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
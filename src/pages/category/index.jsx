import React, {Component} from 'react';
import {Button, Card, Icon, Table, Modal, message} from "antd";
import './index.less'
import MyButton from '../../components/my_button';
import {reqCategories, reqAddCategories, reqUpdateCategories} from '../../api';
import AddCategoryForm from './addCategoryForm';
import UpdateCategoryForm from './updateCategoryForm';

export default class Category extends Component {
  state = {
    categories: [],
    subCategories:[],
    isShowSubCategories:false,
    isShowAddCategories: false,
    isShowUpdateCategories:false,
    isLoading:true
  };
  
  
  
  async componentDidMount() {
    this.fetchReqCategories('0')
  }
  fetchReqCategories =async (parentId) => {
    this.setState({
      isLoading:true
    });
    const result = await reqCategories(parentId);
    if(result){
      if(parentId === '0'){
        this.setState({
          categories: result
        });
      }else{
        this.setState({
          subCategories:result,
          isShowSubCategories:true
        })
      }
    }
    this.setState({
      isLoading:false
    });
  };
  
  
  switchDisplay = (stateValue) => {
    return (e) => {
      this.setState({
        isShowAddCategories: stateValue
      })
    }
  };
  
  addCategories = () => {
    const { form } = this.addCategoryForm.props;
    form.validateFields(async (err, value) => {
      if (!err) {
        const {categoryName, parentId} = value;
        
        const res = await reqAddCategories(categoryName, parentId);
        if (res) {
          message.success('添加分类成功', 2);
          form.resetFields(['parentId','categoryName']);    //重置表单
          const stateChange = {isShowAddCategories: false};   //隐藏添加分类
          //如果添加的是一级分类，则更新状态展示数据
          if (res.parentId === '0') {
            stateChange.categories = [...this.state.categories, res];
          }else if(this.state.isShowSubCategories && res.parentId === this.parentCategory._id){
            stateChange.subCategories = [...this.state.subCategories, res];
          }
          this.setState(stateChange)
        }
      }
    })
  };
  
  cancelAddCategories = () => {
    this.addCategoryForm.props.form.resetFields(['parentId','categoryName']);
    this.setState({
      isShowAddCategories:false
    });
  };
  
  category = {};
  saveCategoryName = (category) => {
    return () => {
      this.category = category;
      this.setState({
        isShowUpdateCategories:true
      });
    }
  };
  
  cancelUpdateCategoryName = () => {
    this.updateCategoryForm.props.form.resetFields(['categoryName']);
    this.setState({
      isShowUpdateCategories:false
    });
  };
  
  confirmUpdateCategoryName = () => {
    const { form } = this.updateCategoryForm.props;
    form.validateFields(async (err,values) => {
      if(!err){
        const { categoryName } = values;
        const categoryId = this.category._id;
        const res = await reqUpdateCategories(categoryName, categoryId);
        if(res){
          
          let categoryData = this.state.categories;
          let stateName = 'categories';
          if(this.category.parentId !== '0'){
            categoryData = this.state.subCategories;
            stateName = 'subCategories';
          }
          const categories = categoryData.map(category => {
            let { _id, name, parentId } = category;
            if(_id === categoryId){
              name = categoryName;
              return {
                _id, name, parentId
              }
            }
            return category;
          });
          form.resetFields(['categoryName']);
          message.success('修改分类名称成功', 2);
          this.setState({
            isShowUpdateCategories:false,
            [stateName]:categories
          });
        }
      }
    });
    
    
  };
  
  showSubCategories = (category) => {
    return async () => {
      this.parentCategory = category;
      this.fetchReqCategories(category._id)
    }
  };
  
  showCategories = () => {
    this.setState({
      isShowSubCategories:false
    })
  };
  
  render() {
    const {categories, isShowAddCategories, isShowUpdateCategories, isShowSubCategories, subCategories, isLoading } = this.state;
  
    const columns = [
      {
        title: '品类名称',
        dataIndex: 'name',
      },
      {
        title: '操作',
        className: 'category_operation',
        render: category => {
          return <div>
            <MyButton onClick={this.saveCategoryName(category)}>修改名称</MyButton>
            {
              this.state.isShowSubCategories ? null : <MyButton onClick={this.showSubCategories(category)}>查看其子品类</MyButton>
            }
          </div>
        },
      }
    ];
    return (
        <Card title={isShowSubCategories ? <div><MyButton onClick={this.showCategories}>一级分类</MyButton><Icon type="arrow-right"/>&nbsp;&nbsp;<span>{this.parentCategory.name}</span></div>: "一级分类列表"}
            extra={<Button type="primary" onClick={this.switchDisplay(true)}><Icon type="plus"/>添加品类</Button>}>
          <Table
            columns={columns}
            dataSource={isShowSubCategories ? subCategories : categories}
            bordered
            pagination={{
              showSizeChanger: true,
              pageSizeOptions: ['3', '6', '9', '12'],
              defaultPageSize: 3,
              showQuickJumper: true
            }}
            rowKey="_id"     //指定dataSource中的某个字段作为table标签的key值
            loading={isLoading}
          />
          <Modal
            visible={isShowAddCategories}
            title="添加分类"
            okText="确认"
            cancelText="取消"
            onOk={this.addCategories}
            onCancel={this.cancelAddCategories}
          >
            <AddCategoryForm categories={categories} wrappedComponentRef={(form) => this.addCategoryForm = form}/>
          </Modal>
  
          <Modal
            visible={isShowUpdateCategories}
            title="更新分类"
            okText="确认"
            cancelText="取消"
            onOk={this.confirmUpdateCategoryName}
            onCancel={this.cancelUpdateCategoryName}
            width={300}
          >
            <UpdateCategoryForm categories={categories} category={this.category} wrappedComponentRef={(form) => this.updateCategoryForm = form}/>
          </Modal>
        </Card>
    )
  }
}
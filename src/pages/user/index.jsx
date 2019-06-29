import React, { Component } from 'react';
import { Card, Button, Table, Modal, message } from 'antd';
import dayjs from "dayjs";
import { reqUsers, reqAddUser, reqDeleteUser, reqUpdateUser } from '../../api'

import AddUserForm from './add-user-form';
import UpdateUserForm from './update-user-form';
import MyButton from '../../components/my_button';

export default class User extends Component {
  state = {
    users: [], //用户数组
    roles:[],
    isShowAddUserModal: false, //是否展示创建用户的标识
    isShowUpdateUserModal: false, //是否展示更新用户的标识
  };

  //创建用户的回调函数
  addUser = () => {
    const { form } = this.addUserForm.props;
    form.validateFields(async (err,values) => {
      if(!err){
        const result = await reqAddUser(values);
        if(result){
          message.success('添加用户成功',2);
          form.resetFields();
          this.setState({
            users:[...this.state.users,result],
            isShowAddUserModal: false,
          })
        }
      }
    })
  };
  
  updateUser = (user) => {
    return () => {
      this.user = user;
      this.setState({
        isShowUpdateUserModal: true,
      });
    }
  };
  
  updateUserOk = () => {
    const { form } = this.updateUserForm.props;
    form.validateFields(async (err,values) => {
      if(!err){
        const { username, password, phone, email , role_id } = values;
        const { _id } = this.user;
        const result = await reqUpdateUser({ username, password, phone, email, _id , role_id});
        if(result){
          message.success('用户修改成功');
          this.setState({
            isShowUpdateUserModal: false,
            users:this.state.users.map(user => {
              if(user._id === _id){
                return result
              }
              return user
            })
          })
        }
      }
    })
  };
  
  async componentDidMount() {
    const result = await reqUsers();
    if(result){
      // console.log(result)
      this.setState({
        users:result.users,
        roles:result.roles,
      })
    }
  }
  
  toggleDisplay = (stateName, stateValue) => {
    return () => this.setState({[stateName]: stateValue})
  };
  
  deleteUser = (user) => {
    return async () => {
      const result = await reqDeleteUser(user._id);
      if(result){
        message.success('用户删除成功');
        this.setState({
          users:this.state.users.filter(item => item._id !== user._id)
        })
      }
    }
  };
  
  render () {
    const {users, roles, isShowAddUserModal, isShowUpdateUserModal} = this.state;
    const columns = [
      {
        title: '用户名',
        dataIndex: 'username',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
      },
      {
        title: '电话',
        dataIndex: 'phone',
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        render: time => dayjs(time).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        render: (role_id) => {
          const role = roles.find((role) => role._id === role_id);
          return role && role.name;
        }
      },
      {
        title: '操作',
        render: user => {
          return <div>
            <MyButton onClick={this.updateUser(user)}>修改</MyButton>
            <MyButton onClick={this.deleteUser(user)}>删除</MyButton>
          </div>
        }
      }
    ];
    
    return (
      <Card
        title={
          <Button type='primary' onClick={this.toggleDisplay('isShowAddUserModal', true)}>创建用户</Button>
        }
      >
        <Table
          columns={columns}
          dataSource={users}
          bordered
          rowKey='_id'
          pagination={{
            defaultPageSize: 3,
            showSizeChanger: true,
            pageSizeOptions: ['3', '6', '9', '12'],
            showQuickJumper: true,
          }}
        />
  
        <Modal
          title="创建用户"
          visible={isShowAddUserModal}
          onOk={this.addUser}
          onCancel={this.toggleDisplay('isShowAddUserModal', false)}
          okText='确认'
          cancelText='取消'
        >
          <AddUserForm wrappedComponentRef={(form) => this.addUserForm = form} roles={roles}/>
        </Modal>
  
        <Modal
          title="更新用户"
          visible={isShowUpdateUserModal}
          onOk={this.updateUserOk}
          onCancel={this.toggleDisplay('isShowUpdateUserModal', false)}
          okText='确认'
          cancelText='取消'
        >
          <UpdateUserForm wrappedComponentRef={(form) => this.updateUserForm = form} user={this.user} roles={roles}/>
        </Modal>
        
      </Card>
    )
  }
}

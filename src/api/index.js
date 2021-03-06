import ajax from './ajax';
import jsonp from 'jsonp'
import { message } from 'antd'


/*"browserslist": {
  "production": [
    ">0.2%",
    "not dead",
    "not op_mini all"
  ],
    "development": [
    "last 1 chrome version",
    "last 1 firefox version",
    "last 1 safari version"
  ]
},*/

const prefix = (process.env.NODE_ENV === 'development' ? '' : 'http://localhost:3001');
//登录请求
// const prefix ='';
export  const reLogin = (username,password) => ajax(prefix + '/login',{ username, password },'post');

//用户验证请求
export const volidateLogin = (id) => ajax(prefix + '/volidate/login',{ id },'post');

//天气请求
export const reqWeather = () => {
  let cancel = null;
  const promise = new Promise((resolve,reject) => {
    cancel = jsonp('http://api.map.baidu.com/telematics/v3/weather?location=深圳&output=json&ak=3p49MVra6urFRGOT9s8UBWr2',{},(err,data) => {
      try{   //天气请求接口可能关闭导致报错，所以绕过错误
        if(!err){
          const { dayPictureUrl,weather } =  data.results[0].weather_data[0];
          resolve({ weatherImg:dayPictureUrl,weather })
        }else{
          resolve();
          message.error('请求天气失败')
        }
      }catch(e){
        resolve();
        message.error('请求天气失败')
      }
    });
    // cancel();    取消jsonp请求
  });
  return {
    promise,
    cancel
  }
};

//请求分类列表
export const reqCategories = (parentId) => ajax(prefix + '/manage/category/list',{ parentId });

//添加分类
export const reqAddCategories = (categoryName, parentId) => ajax(prefix + '/manage/category/add',{ categoryName, parentId },'POST');

//更改分类名称
export const reqUpdateCategories = (categoryName, categoryId) => ajax(prefix + '/manage/category/update',{ categoryName, categoryId },'POST');

//请求商品列表
export const reqProducts = (pageNum, pageSize) => ajax(prefix + '/manage/product/list',{ pageNum, pageSize });

//请求产品分页列表（搜索)
export const reqSearchProducts = ({searchType, searchValue, pageNum, pageSize}) => ajax(prefix + '/manage/product/search',{ [searchType]:searchValue, pageNum, pageSize });

//添加商品
export const reqAddProduct = ({categoryId,pCategoryId,name,price,desc,detail}) => ajax(prefix + '/manage/product/add',{categoryId,pCategoryId,name,price,desc,detail},'POST');

//更新商品
export const reqUpdateProduct = ({name, desc, price, categoryId, pCategoryId, detail, _id}) => ajax(prefix + '/manage/product/update', {name, desc, price, categoryId, pCategoryId, detail, _id}, 'POST');

//更新商品状态
export const reqUpdateProductStatus = (productId, status) => ajax(prefix + '/manage/product/updateStatus',{ productId, status },'POST');

//上传图片
// export const reqUploadImg = (image) => ajax('/manage/img/upload',{ image },'POST');

//删除图片
export const reqDeleteProductImg = (name, id) => ajax(prefix + '/manage/img/delete', {name, id}, 'POST');

//获取角色列表
export const reqRoles = () => ajax(prefix + '/manage/role/list');

//添加角色列表
export const reqAddRoles = (name) => ajax(prefix + '/manage/role/add',{name},'POST');

//更新角色
export const reqUpdateRole = ({_id, auth_name, menus}) => ajax(prefix + '/manage/role/update', {_id, auth_name, menus}, 'POST');

//获取用户列表
export const reqUsers = () => ajax(prefix + '/manage/user/list');

//添加用户
export const reqAddUser = ({username, password, phone, email, role_id}) => ajax(prefix + '/manage/user/add', {username, password, phone, email, role_id}, 'POST');

//删除用户
export const reqDeleteUser = (userId) => ajax(prefix + '/manage/user/delete',{userId},'POST');

//更新用户
export const reqUpdateUser = ({ username, password, phone, email, _id, role_id }) => ajax(prefix + '/manage/user/update',{ username, password, phone, email, _id, role_id },'POST');
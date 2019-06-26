import ajax from './ajax';
import jsonp from 'jsonp'
import { message } from 'antd'

//登录请求
export  const reLogin = (username,password) => ajax('/login',{ username, password },'post');

//用户验证请求
export const volidateLogin = (id) => ajax('/volidate/login',{ id },'post');

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
export const reqCategories = (parentId) => ajax('/manage/category/list',{ parentId });

//添加分类
export const reqAddCategories = (categoryName, parentId) => ajax('/manage/category/add',{ categoryName, parentId },'POST');

//更改分类名称
export const reqUpdateCategories = (categoryName, categoryId) => ajax('/manage/category/update',{ categoryName, categoryId },'POST');

//请求产品列表
export const reqProducts = (pageNum, pageSize) => ajax('/manage/product/list',{ pageNum, pageSize });

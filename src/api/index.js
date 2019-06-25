import ajax from './ajax';
import jsonp from 'jsonp'
import { message } from 'antd'

//登录请求
export const reLogin = (username,password) => ajax('/login',{ username, password },'post');

//用户验证请求
export const volidateLogin = (id) => ajax('/volidate/login',{ id },'post');

//天气请求
export const reqWeather = () => {
  return new Promise((resolve,reject) => {
    const cancel = jsonp('http://api.map.baidu.com/telematics/v3/weather?location=深圳&output=json&ak=3p49MVra6urFRGOT9s8UBWr2',(err,data) => {
      if(!err){
        const { dayPictureUrl,weather } =  data.results[0].weather_data[0];
        resolve({ weatherImg:dayPictureUrl,weather })
      }else{
        resolve();
        message.error('请求天气失败')
      }
    });
    // cancel();
  })
};

//请求分类列表
export const reqCategories = (parentId) => ajax('/manage/category/list',{ parentId });

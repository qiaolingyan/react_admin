
import Ajax from './ajax';
import jsonp from 'jsonp';
import { message } from 'antd'

export const reqLogin = (username,password) => Ajax('/login',{username,password},'POST');
export const volidateLogin = (id) => Ajax('/volidate/login',{id},'POST');

export const reqWeather = () => {
  let cancel = null;
  const promise =  new Promise((resolve,reject) => {
    cancel = jsonp('http://api.map.baidu.com/telematics/v3/weather?location=深圳&output=json&ak=3p49MVra6urFRGOT9s8UBWr2',{},(err,data) => {
      try{
        if(!err){
          const { dayPictureUrl,weather } = data.results[0].weather_data[0];
          resolve({weather,weatherImg:dayPictureUrl})
        }else{
          resolve();
          message.error('天气信息请求失败')
        }
      }catch(e){
      resolve();
      message.error('天气信息请求失败')
    }
    })
  });
  return {
    cancel,
    promise
  }
};

export const reqCategories = (parentId) => Ajax('/manage/category/list',{parentId});

export const reqAddCategories = (categoryName,parentId) => Ajax('/manage/category/add',{categoryName,parentId},'POST');

export const reqUpdateCategories = (categoryName,categoryId) => Ajax('/manage/category/update',{categoryName,categoryId},'POST');
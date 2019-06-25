
import Ajax from './ajax';
import jsonp from 'jsonp';
import { message } from 'antd'

export const reqLogin = (username,password) => Ajax('/login',{username,password},'POST');
export const volidateLogin = (id) => Ajax('/volidate/login',{id},'POST');

export const reqWeather = () => {
  return new Promise((resolve,reject) => {
    jsonp('http://api.map.baidu.com/telematics/v3/weather?location=深圳&output=json&ak=3p49MVra6urFRGOT9s8UBWr2',(err,data) => {
      if(!err){
        const { dayPictureUrl,weather } = data.results[0].weather_data[0];
        resolve({weather,weatherImg:dayPictureUrl})
      }else{
        resolve();
        message.error('天气信息请求失败')
      }
    })
  })
};
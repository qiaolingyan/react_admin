import axios from "axios";
import {message} from "antd";

export default (url, data = {} , method = 'GET') => {
  method = method.toLowerCase();
  data = method === 'get' ? {params:data} : data;
  return axios[method](url,data)
  .then(res => {
    const { data } = res;
    if(data.status === 0) {
      return data.data || {}
    }else{
      message.error(data.msg,2)
    }
  })
  .catch(err => message.error('您的网络异常，请稍后再试',2));
};


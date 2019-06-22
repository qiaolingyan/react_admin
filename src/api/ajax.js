import axios from "axios";
import {message} from "antd";

export default function ajax(url,data = {},method = 'GET'){
  
  method = method.toLowerCase();
  const reqParams = method === 'GET' ? {params:data} : data ;
  
  return axios[method](url,reqParams)      //method必须为小写，所以要转换为小写
  .then(res => {
    const data = res.data;
    if(!data.status){
      return data.data
    }else{
      message.error(data.msg,2);
    }
  })
  .catch(err => {
    message.error("您的网络异常，请刷新重试",2);
  })
}

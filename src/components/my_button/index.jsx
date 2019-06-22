import React from 'react';
import './index.less';

export default function (props) {
  return <button className="myBtn" {...props}/> //组件内包含的内容会挂载到 props.children 上
}
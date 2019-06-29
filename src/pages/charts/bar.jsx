import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
export default class Bar extends Component {
  
  state = {
    option:{}
  };
  
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        option: {
          title: {
            show:true,
            text: '~~极坐标系下的堆叠柱状图~~',
            top: 'top',
            left: 'left',
          },
          angleAxis: {
            type: 'category',
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            z: 10
          },
          radiusAxis: {
          },
          polar: {
          },
          series: [{
            type: 'bar',
            data: [1, 2, 3, 4, 3, 5, 1],
            coordinateSystem: 'polar',
            name: 'A',
            stack: 'a'
          }, {
            type: 'bar',
            data: [2, 4, 6, 1, 3, 2, 1],
            coordinateSystem: 'polar',
            name: 'B',
            stack: 'a'
          }, {
            type: 'bar',
            data: [1, 2, 3, 4, 1, 2, 5],
            coordinateSystem: 'polar',
            name: 'C',
            stack: 'a'
          }],
          legend: {
            show: true,
            data: ['A', 'B', 'C']
          },
          backgroundColor: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: 'pink' // 0% 处的颜色
            }, {
              offset: 1, color: 'lightblue' // 100% 处的颜色
            }],
            global: false // 缺省为 false
          }
        }
      })
    },1000)
  }
  
  
  render() {
    return <div style={{height:"100%",background:"#fff",position:"relative"}}>
      <ReactEcharts option={this.state.option} style={{width:"100%",position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)"}}/>
    </div>
  }
}
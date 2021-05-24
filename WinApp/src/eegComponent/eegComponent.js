import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './eegComponent.css';
import { Button, Col, Row, Card, Typography , notification} from 'antd';
import { TabletOutlined, MonitorOutlined, LoadingOutlined, ApiOutlined } from '@ant-design/icons';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";


import { createEEG } from "eeg-pipes";
const electron = require('electron')
const ipc = electron.ipcRenderer




am4core.useTheme(am4themes_animated);


// eeg$
//   .pipe(bufferFFT({ bins: 256 }), alphaPower())
//   .subscribe(buffer => console.log(buffer));

class EegComponent extends React.Component {

  // {
  //     trialNumber=0,
  //     sampleNum=0,
  //     electrodesPositions=["A1","B2"],
  //     electrodesValues=[2,3],
  //     subjectId="test",
  //     time="19:00 14.04.2021"
  // }

  //,trial number,sensor position,sample num,sensor value,subject identifier,matching condition,channel,name,time

  state = {
    data: [],
    chartData: [],
    start: false,
    pause: true,
  }



  render() {

    return (
      <>
        <Row align="middle" className="buttonsRow">
          <Col span={6}>
            <Button className="buttonsStyle" onClick={() => {
              ipc.send("start-session", {});
              this.setState({ start: !this.state.start })
              this.setState({ pause: true })
              if(this.state.start){
                this.props.switch(!this.props.enableEeg);
              }
              else{
                this.props.switch(!this.props.enableEeg);
              }
            }}>{this.state.start ? <>Stop</> : <>Start</>}</Button>
          </Col>
          <Col span={6}>
            <Button className="buttonsStyle" disabled={!this.state.start} onClick={() => {
              ipc.send("stop-session", {});
              this.setState({ pause: !this.state.pause })
            }}>{this.state.pause ? <>Pause</> : <>Continue</>}</Button>
          </Col>
          <Col span={6}>
            <Button className="buttonsStyle" disabled={this.state.pause} onClick={() => {
              ipc.send("save-session", {});

            }}>Save</Button>
          </Col>
          <Col span={6}>
            <Button className="buttonsStyle" disabled={this.state.start} onClick={() => {
              ipc.send("open-session", {});

            }}>Open</Button>
          </Col>

        </Row>
        <Row className="buttonsRow">
          <Col span={1}></Col>
          <Col span={22}>
            <div id="chartdiv" className="chart"></div>
          </Col>
          <Col span={1}></Col>
        </Row>


      </>
    );
  }

  // {
  //     sampleNum:element["sample num"],
  //     electrodesPositions:[element["sensor position"]],
  //     electrodesValues:[element["sensor value"]],
  //     subjectId:"Dubinich",
  //     time:"19:00 14.04.2021"
  // }
  createGraph() {
    console.log("updated");
    let chart1 = am4core.create("chartdiv", am4charts.XYChart);

    chart1.data = this.state.chartData;

    // Create axes
    let numAxis = chart1.xAxes.push(new am4charts.DurationAxis());
    // dateAnumAxisxis.renderer.minGridDistance = 30;

    //dateAxis.renderer.minGridDistance = 60;
    numAxis.title.text = "Time, sec";
    let valueAxis = chart1.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "Value, mlV";
    // Create series
    let series = chart1.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "value";
    series.dataFields.valueX = "num";
    series.tooltipText = "{value}"

    series.tooltip.pointerOrientation = "vertical";

    chart1.cursor = new am4charts.XYCursor();
    chart1.cursor.snapToSeries = series;
    chart1.cursor.xAxis = numAxis;

    //chart.scrollbarY = new am4core.Scrollbar();
    chart1.scrollbarX = new am4core.Scrollbar();

    // chart.events.on("beforedatavalidated", function(ev) {
    //     console.log("beforedatavalidated");
    //   });
    ipc.on("eeg-new-data", (event, arg) => {
      if (arg.time == 0) {
        chart1.data = [];
        this.setState({ chartData: [] })
        chart1.data = this.state.chartData;
      }
      console.log(arg);
      let d = this.state.data;
      d.push(arg);
      this.setState({ data: d })
      ///console.log(this.state.chartData);
      let data = [];
      for (var i = 0; i < this.state.data.length; i++) {
        data.push({ num: this.state.data[i].time, value: this.state.data[i].electrodesValues[0] });
        //console.log(data[i]);
      }

      chart1.addData(data[this.state.data.length - 1]);
      console.log(data[this.state.data.length - 1]);
      this.setState({ chartData: data })
    })


    // ipc.on("eeg-new-data", (event, arg) => {
    //   if (arg.time == 0) {
    //     let mas=[]
    //     for(let h=0;h<200;h++)
    //     {
    //       mas.push({ num: 0, value: 0 }) 
    //     }  
    //     this.setState({ chartData: mas})
    //     chart1.data = this.state.chartData;
    //   }
    //   // console.log(arg);
    //   // let d = this.state.data;
    //   // d.push(arg);
    //   // this.setState({ data: d })
    //   // ///console.log(this.state.chartData);
    //   // let data = [];
    //   // for (var i = 0; i < this.state.data.length; i++) {
    //   //   data.push({ num: this.state.data[i].time, value: this.state.data[i].electrodesValues[0] });
    //   //   //console.log(data[i]);
    //   // }

    //   chart1.addData({ num: arg.time, value: arg.electrodesValues[0] },1);
    //   // console.log(data[this.state.data.length - 1]);
    //   // this.setState({ chartData: data })
    // })


    // // ipc.on("eeg-new-data", (event, arg) => {
    // //   if (arg.time == 0) {
    // //     let mas=[]
    // //     for(let h=0;h<1000;h++)
    // //     {
    // //       mas.push({ num: 0, value: 0 }) 
    // //     }  
    // //     this.setState({ chartData: mas})
    // //     chart1.data = this.state.chartData;
    // //   }
    // //   // console.log(arg);
    // //   // let d = this.state.data;
    // //   // d.push(arg);
    // //   // this.setState({ data: d })
    // //   // ///console.log(this.state.chartData);
    // //   // let data = [];
    // //   // for (var i = 0; i < this.state.data.length; i++) {
    // //   //   data.push({ num: this.state.data[i].time, value: this.state.data[i].electrodesValues[0] });
    // //   //   //console.log(data[i]);
    // //   // }

    // //   chart1.addData(arg,1);
    // //   // console.log(data[this.state.data.length - 1]);
    // //   // this.setState({ chartData: data })
    // // })

    // // let indx=0;
    // // let timer=()=>{
    // //   if(indx<1000){
    // //   if ( indx== 0) {
    // //     let mas=[]
    // //     for(let h=0;h<30;h++)
    // //     {
    // //      mas.push({ num: 0, value: 0 }) 
    // //     }
    // //     this.setState({ chartData: mas})
    // //     chart1.data = this.state.chartData;
    // //   }
    // //   chart1.addData({ num: indx*0.05, value: indx*Math.random() },1);
    // //   console.log(chart1.data);
    // //   this.setState({ chartData: chart1.data })
    // //   chart1.scrollbarX.toBack();
    // //   chart1.scrollbarX.thumb.width = 50;
    // //   indx++
    // //   setTimeout(timer, 1000);
    // // }
    // // }
    // // setTimeout(timer, 1000);
  }


  EEGData() {
    // let eeg=createEEG({channels: 2, samplingRate:1});
    // eeg
  }





  componentDidMount() { // When the document is rendered
    this.createGraph();
    this.EEGData();

    //Сохранение сессии
    ipc.on("save-session", (event, arg) => {
      console.log("save")
      notification.open({
        message: 'Session saved',
        description:
            "Session saved in saves folder sucsesfully",
        placement: "bottomLeft",
        onClick: () => {
            console.log('Notification Clicked!');
        },
    });
    })

    //Открыть сохранение
    ipc.on("open-session", (event, arg) => {
      console.log("open")
    })

    //Остановить считывание
    ipc.on("stop-session", (event, arg) => {
      console.log("stop")
    })

    //Начать считывание
    ipc.on("start-session", (event, arg) => {
      console.log("start")
    })
  }

  componentDidUpdate(prevProps) {

  }

}


export default EegComponent;
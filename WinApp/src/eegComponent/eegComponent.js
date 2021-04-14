import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './eegComponent.css';
import { Button,Col,Row,Card,Typography  } from 'antd';
import {TabletOutlined,MonitorOutlined,LoadingOutlined,ApiOutlined} from '@ant-design/icons';

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

state={
    data:[],
    chartData:[]
}



    render() {
       
        return (
            <> 
            <Button onClick={()=>{this.addData();}}>EEG</Button>
            <div id="chartdiv"></div>

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
    createGraph()
    {
        console.log("updated");
        let chart1=am4core.create("chartdiv", am4charts.XYChart);
        
        chart1.data = this.state.chartData;
        
        // Create axes
        let numAxis =  chart1.xAxes.push(new am4charts.ValueAxis());
        //dateAxis.renderer.minGridDistance = 60;
        numAxis.title.text = "Num";
        let valueAxis =  chart1.yAxes.push(new am4charts.ValueAxis());
        valueAxis.title.text = "Value";
        // Create series
        let series =  chart1.series.push(new am4charts.LineSeries());
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
        ipc.on("eeg-new-data",(event, arg) => {
            //console.log(arg);
            let d=this.state.data;
            d.push(arg);
            this.setState({data:d})
            ///console.log(this.state.chartData);
            let data = [];
            for(var i = 0; i < this.state.data.length; i++){
              data.push({num:this.state.data[i].sampleNum, value: this.state.data[i].electrodesValues[0]});
              //console.log(data[i]);
            }
           
            chart1.addData(data[this.state.data.length-1]);
            console.log(data[this.state.data.length-1]);
            this.setState({chartData:data})
        })
    }


    EEGData()
    {
        // let eeg=createEEG({channels: 2, samplingRate:1});
        // eeg
    }

    addData()
    {
        // this.setState({data:this.state.data.push({
        //     name: 'Page Q',
        //     uv: 3490,
        //     pv: 4300,
        //     amt: 2100,
        //   })})
        ipc.send("get-data",{});
    }

    componentDidMount(){ // When the document is rendered
        this.createGraph();
        this.EEGData();
    }

    componentDidUpdate(prevProps) {
        
      }
    
}


export default EegComponent;
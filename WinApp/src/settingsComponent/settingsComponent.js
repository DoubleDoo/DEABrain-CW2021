import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './settingsComponent.css';
import { Button,Col,Row,Card,Typography  } from 'antd';
import {TabletOutlined,MonitorOutlined,LoadingOutlined,ApiOutlined} from '@ant-design/icons';
import { Input, Select,Switch  } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

const { Option } = Select;

const electron = require('electron')
const ipc = electron.ipcRenderer
const { Title } = Typography;


class SettingsComponent extends React.Component {

state={
    netPath:"",
    appPath:"",
    savesPath:"",
    theme:""
}

    render() {
       
        return (
            <div className="settForm">
            <Row align="middle">
            <Col span={1}></Col>
              <Col span={22}>
              <Title level={3}>Нейросеть</Title>
              </Col>
              <Col span={1}></Col>
            </Row>


            <Row align="middle">
            <Col span={1}></Col>
              <Col span={22}>
                <div className="dataBlock">
                  <div className="dataBox">
                    {this.state.netPath}
                  </div>
                  <div className="dataButton" onClick={()=>{ipc.send("net-file-picker",{});}}>
                    <SettingOutlined className="iconSettings"/>
                  </div>
              </div>
              </Col>
              <Col span={1}></Col>
            </Row>

{/* 
            <Row align="middle">
            <Col span={1}></Col>
              <Col span={22}>
              <Title level={3}>Папка приложения</Title>
              </Col>
              <Col span={1}></Col>
            </Row> */}


            {/* <Row align="middle">
            <Col span={1}></Col>
              <Col span={22}>
                <div className="dataBlock">
                  <div className="dataBox">
                    {this.state.appPath}
                  </div>
                  <div className="dataButton" onClick={()=>{ipc.send("data-path-picker",{});}}>
                    <SettingOutlined className="iconSettings"/>
                  </div>
              </div>
              </Col>
              <Col span={1}></Col>
            </Row> */}

            
            <Row align="middle">
            <Col span={1}></Col>
              <Col span={22}>
              <Title level={3}>Папка сохранений</Title>
              </Col>
              <Col span={1}></Col>
            </Row>

            <Row align="middle">
            <Col span={1}></Col>
              <Col span={22}>
                <div className="dataBlock">
                  <div className="dataBox">
                    {this.state.savesPath}
                  </div>
                  <div className="dataButton" onClick={()=>{ipc.send("saves-path-picker",{});}}>
                    <SettingOutlined className="iconSettings"/>
                  </div>
              </div>
              </Col>
              <Col span={1}></Col>
            </Row>
            
            <Row align="middle">
            <Col span={1}></Col>
              <Col span={5}>
              <Title level={3}>Темная тема</Title>
              </Col>
              <Col span={17}>
              <Switch checked={this.state.theme=="dark"?true:false} onChange={this.onChange} />
              </Col>
              <Col span={1}></Col>
            </Row>
           
          </div>
        );
    }

    onChange=(checked)=> {
      if (this.state.theme=="light")
      {
        ipc.send("theme-picker",{theme:"dark"});
      }
      else{
        ipc.send("theme-picker",{theme:"light"});
      }
    }


    /*
     savesPath: "data_samples/appPath",
      appPath: "data_samples/save.txt",
      netPath: "data_samples/netPath",
      theme: "light",
    */
    componentDidMount(){ 
      //ipc.send("saves-path-picker",{});
        //Передача сохраненных параметров
      ipc.send("saved-values",{});
      ipc.on("saved-values", (event, arg) => {
        this.setState({netPath:arg.data.netPath,appPath:arg.data.appPath,savesPath:arg.data.savesPath,theme:arg.data.theme})});   
      ipc.on("net-file-picker",(event, arg) => {
          this.setState({netPath:arg.data});
      })
      ipc.on("data-path-picker",(event, arg) => {
        this.setState({appPath:arg.data});
      })
      ipc.on("saves-path-picker",(event, arg) => {
        this.setState({savesPath:arg.data});
      })
      ipc.on("theme-picker",(event, arg) => {
        this.setState({theme:arg.data});
        console.log(this.state.theme)
      })
  }
    
}


export default SettingsComponent;
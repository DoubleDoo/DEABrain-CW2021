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
    netPath:"1",
    dataPath:"2",
    savesPath:"3"
}

    render() {
       
        return (
            <>
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


            <Row align="middle">
            <Col span={1}></Col>
              <Col span={22}>
              <Title level={3}>Папка приложения</Title>
              </Col>
              <Col span={1}></Col>
            </Row>


            <Row align="middle">
            <Col span={1}></Col>
              <Col span={22}>
                <div className="dataBlock">
                  <div className="dataBox">
                    {this.state.dataPath}
                  </div>
                  <div className="dataButton" onClick={()=>{ipc.send("data-path-picker",{});}}>
                    <SettingOutlined className="iconSettings"/>
                  </div>
              </div>
              </Col>
              <Col span={1}></Col>
            </Row>

            
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
              <Col span={11}>
              <Title level={3}>Папка сохранений</Title>
              </Col>
              <Col span={11}>
              <Switch defaultChecked onChange={this.onChange} />
              </Col>
              <Col span={1}></Col>
            </Row>
  
          </>
        );
    }

    onChange=(checked)=> {
      console.log("switched");
    }
    // "net-file-picker"
    // "data-path-picker"
    // "saves-path-picker"

    componentDidMount(){ 
      //ipc.send("saves-path-picker",{});
      ipc.on("net-file-picker",(event, arg) => {
          this.setState({netPath:arg.data});
      })
      ipc.on("data-path-picker",(event, arg) => {
        this.setState({dataPath:arg.data});
      })
      ipc.on("saves-path-picker",(event, arg) => {
        this.setState({savesPath:arg.data});
      })

  }
    
}


export default SettingsComponent;
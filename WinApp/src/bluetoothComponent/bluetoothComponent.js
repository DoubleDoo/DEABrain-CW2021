import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './bluetoothComponent.css';
import { Button,Col,Row,Card,Typography  } from 'antd';
import {TabletOutlined,MonitorOutlined,LoadingOutlined,ApiOutlined} from '@ant-design/icons';

const electron = require('electron')
const ipc = electron.ipcRenderer




class BluetoothComponent extends React.Component {

    state={
        deviceList:[],
        deviceSelected:null,
        isSearch:false
    }
    
    render() {
        return ( 
            
            <Row className={"BluetoothComponent"} align={"top"}>
                <Col className={"devInfo"} flex={2} >
                <SelectedDevice deviceSelected={this.state.deviceSelected}/>
                </Col>
                <Col className={"devList"} flex={3}>
                <DeviceList deviceList={this.state.deviceList} isSearch={this.state.isSearch}  setDeviceSelected={this.setDeviceSelected} updateDeviceList={this.updateDeviceList}/>
                </Col>
            <Button onClick={()=>this.getDeviceByName(this.state.deviceSelected)}>1</Button>
            </Row>

        );
    }


    setDeviceSelected=(data)=>{
       this.setState({deviceSelected:data});
       this.setState({isSearch:false});
       //console.log("DevSelected")
    }

    getDeviceByName=(data)=>{
        console.log(data.deviceId+"!!!!")
        console.log(data.deviceName+"!!!!")
        ipc.send("next-device-select",{data});
         navigator.bluetooth.requestDevice({
            filters: [{ name: [data.deviceName],
                services: ['battery_service']
            }]
            
         }).then((device)=>{
            console.log(device);
            device.addEventListener('gattserverdisconnected', this.onDisconnected);
            return device.gatt.connect();
         }).then(server => {
            // Getting Battery Service…
            return server.getPrimaryService('battery_service');
          })
          .then(service => {
            // Getting Battery Level Characteristic…
            return service.getCharacteristic('battery_level');

          })
          .then(characteristic => {
            // Reading Battery Level…
            characteristic.addEventListener('characteristicvaluechanged',
            this.handleCharacteristicValueChanged);
console.log('Notifications have been started.');
          })
          .catch(error => { console.error(error); });
    }

    updateDeviceList=()=>{
        this.setState({isSearch:true});
         navigator.bluetooth.requestDevice({
            //acceptAllDevices:true
            filters: [{
                services: ['battery_service']
                }]
         }).then((device)=>{
            console.log(device);
            //this.setDeviceSelected(device);
            this.setState({isSearch:false});
            device.addEventListener('gattserverdisconnected', this.onDisconnected);
            return device.gatt.connect();
         }).then(server => {
            // Getting Battery Service…
            return server.getPrimaryService('battery_service');
          })
          .then(service => {
            // Getting Battery Level Characteristic…
            return service.getCharacteristic('battery_level');

          })
          .then(characteristic => {
            // Reading Battery Level…
            characteristic.addEventListener('characteristicvaluechanged',
            this.handleCharacteristicValueChanged);
console.log('Notifications have been started.');
          })
          .catch(error => { console.error(error); });
    }
    onDisconnected=(event)=> {
        const device = event.target;
        console.log(`Device ${device.name} is disconnected.`);
      }

    handleCharacteristicValueChanged=(event)=> {
        const value = event.target.value;
        console.log('Received ' + value);
        // TODO: Parse Heart Rate Measurement value.
        // See https://github.com/WebBluetoothCG/demos/blob/gh-pages/heart-rate-sensor/heartRateSensor.js
      }

    componentDidMount(){ // When the document is rendered
        ipc.on("bluetooth-list-update",(event, arg) => {
            this.setState({deviceList:arg.data});
        })
    }
}


class DeviceList extends React.Component {
    render() {
        return ( 
            <Card>
                {this.props.deviceList.map((element,i) => {
                    return <DeviceListOption dev={element}  setDeviceSelected={this.props.setDeviceSelected}  key={i+"BD"}/> 
                    })}
                <div onClick={()=>this.props.updateDeviceList()}>
                 {this.props.isSearch?<LoadingOutlined className={"seacrhIcon"}/>:
                 <>
                    <MonitorOutlined  className={"seacrhIcon"}/>
                    <Typography.Paragraph>Search devices</Typography.Paragraph>
                 </>}
                 
                </div>
            </Card>
        );
    }
}

//Отоборажение инфомации о девайсах
class DeviceListOption extends React.Component {

    selectdev=()=>{
        ipc.send("bluetooth-device-select",{id:this.props.dev.deviceId});
        this.props.setDeviceSelected(this.props.dev)
    }


    render() {
        return ( 
            <Card  className="DeviceButton" onClick={this.selectdev}>
                <Row justify="space-around" align="middle"  wrap={false}>
                    <Col span={3}>
                    <TabletOutlined className={"iconStyle"}/>
                    </Col>
                    <Col className="optionData" flex={"auto"}>
                    DeviceName: {this.props.dev.deviceName}
                    <br/>
                    DeviceId: {this.props.dev.deviceId}
                    </Col>
                </Row>
            </Card >
        );
    }
}

//Отоборажение информации о девайсе
class SelectedDevice extends React.Component {
    render() {
        return ( 
            <>
            <Card>
                {
                    this.props.deviceSelected==null?
                    <>
                    <ApiOutlined className="disconectedIcon"/>
                    <Typography.Paragraph>No conected device</Typography.Paragraph>
                    </>:
                    <>{this.props.deviceSelected.name}</>
                }
            </Card >
            </>
        );
    }
}

export default BluetoothComponent;
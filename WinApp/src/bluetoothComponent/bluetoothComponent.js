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
    }
    
    render() {
        return ( 
            
            <Row className={"BluetoothComponent"} align={"top"}>
                <Col className={"devInfo"} flex={2} >
                <SelectedDevice deviceSelected={this.state.deviceSelected}/>
                </Col>
                <Col className={"devList"} flex={3}>
                <DeviceList deviceList={this.state.deviceList} setDeviceSelected={this.setDeviceSelected}/>
                </Col>
            </Row>
        );
    }


    setDeviceSelected=(data)=>{
       this.setState({deviceSelected:data});
    }


    componentDidMount(){ // When the document is rendered
        ipc.on("bluetooth-list-update",(event, arg) => {
           // console.log(arg.data)
            this.setState({deviceList:arg.data});
        })

    }
}


class DeviceList extends React.Component {

state={
    isSearch:false
}

    updateDeviceList() {
        this.setState({isSearch:true})
         navigator.bluetooth.requestDevice({
            filters: [{ services: ['battery_service']}]
         }).then((data)=>{
            console.log(data);
            this.props.setDeviceSelected(data);
            this.setState({isSearch:false});
            return data.gatt.connect();
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
            return characteristic.readValue();
          })
          .then(value => {
            console.log(`Battery percentage is ${value.getUint8(0)}`);
          })
          .catch(error => { console.error(error); });
    }

    render() {
        return ( 
            <Card>
                {this.props.deviceList.map((element,i) => {
                        //console.log(element);
                    return <DeviceListOption dev={element} key={i+"BD"}/> 
                    })}
                <div onClick={()=>this.updateDeviceList()}>
                 {this.state.isSearch?<LoadingOutlined className={"seacrhIcon"}/>:<><MonitorOutlined  className={"seacrhIcon"}/><Typography.Paragraph>Search devices</Typography.Paragraph></>}
                 
                </div>
            </Card>
        );
    }

    componentDidMount(){ 

    }
}

class DeviceListOption extends React.Component {

    selectdev=()=>{
        console.log(this.props.dev.deviceId);
        ipc.send("bluetooth-device-select",{id:this.props.dev.deviceId});
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

class SelectedDevice extends React.Component {
    render() {
        return ( 
            <>
            <Card>
                {this.props.deviceSelected==null?
                <>
                <ApiOutlined className="disconectedIcon"/>
                <Typography.Paragraph>No conected device</Typography.Paragraph>
                </>:<>{this.props.deviceSelected.name}</>}
            </Card >
            </>
        );
    }
}

export default BluetoothComponent;
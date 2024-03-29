import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './menuComponent.css';
import { Menu,notification } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined} from '@ant-design/icons';
import WorkSpaceComponent from "../workSpaceComponent/workSpaceComponent";
import {BluetoothDevice } from '../context/context';

// import {BluetoothDevice } from '../context/context';
// static contextType = BluetoothDevice;
// console.log(this.context.info);
// this.context.upd(data);
const electron = require('electron')
const ipc = electron.ipcRenderer


let bluetoothDeviceInfo = {
  device:null,
  service:null,
};

let updDevice=(value)=>{
  bluetoothDeviceInfo.device=value;
  // MenuComponent.updStatus();
}



class MenuComponent extends React.Component {
  static contextType = BluetoothDevice;
  state = {
    curOption: "Devices",
    theme: "light",
    status:false,

    deviceSelected: null,
    server:null,
    characteristicBatt:null,
    serviceBatt:null,
    notifBatt:null,
    lastBattValue:0,
    characteristicEeg:null,
    serviceEeg:null,
    notifEeg:null,
    lastEegValue:0,
    enablekeyboard: true,
    enableEeg:true,
    enableDev:true,
    enableOpt:true,
    enableTransmitt:false,
    bufData:[],
    enableP300:true
  }
  
  devUpd=(dev,serv)=>{
    this.setState({deviceSelected:dev, server:serv})
  }

  bleEegUpd=(serv,char,not,val)=>{
    this.setState({serviceEeg:serv, characteristicEeg:char, notifEeg:not, lastEegValue:val})
  }

  bleBattUpd=(serv,char,not,val)=>{
    this.setState({serviceBatt:serv, characteristicBatt:char, notifBatt:not, lastBattValue:val})
  }

  
  switchEeg=(val)=>{
    this.setState({enableEeg:val, enableDev:val,enableOpt:val})
  }

  switchKeyboard=(val)=>{
    this.setState({enablekeyboard:val,enableDev:val,enableOpt:val})
  }

  switchBoth=(val)=>{
    switchEeg(val);
    switchKeyboard(val);
  }

  switchTrans=(val)=>{
    this.setState({enableTransmitt:val})
  }

  reset=()=>{
    this.setState({
      deviceSelected: null,
      server:null,
      characteristicBatt:null,
      serviceBatt:null,
      notifBatt:null,
      lastBattValue:0,
      characteristicEeg:null,
      serviceEeg:null,
      notifEeg:null,
      lastEegValue:0,})
  }


  handleNotifications(event) {
    if(this.state.enableTransmitt){
    let value = event.target.value;
    let a = [];
    for (let i = 0; i < value.byteLength; i++) {
        a.push('0x' + ('00' + value.getUint8(i).toString(16)).slice(-2));
    }
    ipc.send("read-data", Number.parseInt(a));
    console.log( Number.parseInt(a));
    // this.bleBattUpd(this.state.serviceBatt,this.state.characteristicBatt,this.state.notifBatt,Number.parseInt(a))

    // let buf=this.state.bufData;
    // buf.push(Number.parseInt(a))
    // this.setState({bufData:buf})

    // if(this.state.bufData.length>9){
    //   ipc.send("read-data", this.state.bufData);
    //   // console.log(this.state.bufData);
    //   this.setState({bufData:[]})

    // }
    
    }
}
//this.state.deviceSelected==null &&

  render() {
    this.handleNotifications = this.handleNotifications.bind(this)
    return <>
      <Menu className="MenuComponent"
        onClick={this.handleClick}
        defaultSelectedKeys={[this.state.curOption]}
        defaultOpenKeys={[this.state.curOption]}
        mode="inline"
        theme={this.state.theme}
      >
        <Menu.ItemGroup key="EEG" title="EEG" className="titlHeaders1">
        <Menu.Item className="titl" key="Devices" onClick={() => this.setState({ curOption: "Devices" })}  disabled={!this.state.enableDev}>Devices</Menu.Item>    
          <Menu.Item className="titl" key="EEG_Data" onClick={() => this.setState({ curOption: "EEG_Data" })}    disabled={this.state.deviceSelected==null || !this.state.enableEeg}>EEG Data</Menu.Item>
          <Menu.Item className="titl" key="P300" onClick={() => this.setState({ curOption: "P300" })} disabled={(this.state.deviceSelected==null || !this.state.enablekeyboard) || !this.state.enableP300}>P300 keyboard demo</Menu.Item>
        </Menu.ItemGroup>
        <Menu.Divider />
        <Menu.ItemGroup key="APP" title="APP" className="titlHeaders2">
          <Menu.Item className="titl" key="Options" onClick={() => this.setState({ curOption: "Options" })} disabled={!this.state.enableOpt}>Options</Menu.Item>
        </Menu.ItemGroup>
        <Menu.Divider />
      </Menu>
      <BluetoothDevice.Provider value={this.structure}>
      <WorkSpaceComponent curOption={this.state.curOption} 
      devUpd={this.devUpd}
      bleEegUpd={this.bleEegUpd} 
      bleBattUpd={this.bleBattUpd}
      reset={this.reset}
      eegStruct={{
        characteristicEeg:this.state.characteristicEeg,
        serviceEeg:this.state.serviceEeg,
        notifEeg:this.state.notifEeg,
        lastEegValue:this.state.lastEegValue,
      }}
      battStruct={
        {
          characteristicBatt:this.state.characteristicBatt,
          serviceBatt:this.state.serviceBatt,
          notifBatt:this.state.notifBatt,
          lastBattValue:this.state.lastBattValue,
        }
      }
      devStruct={
        {
          deviceSelected: this.state.deviceSelected,
          server:this.state.server
        }
      }
      handleNotifications={this.handleNotifications}
      enablekeyboard={this.state.enablekeyboard}
      enableEeg={this.state.enableEeg}
      switchEeg={this.switchEeg}
      switchKeyboard={this.switchKeyboard}
      switchBoth={this.switchBoth}
      switchTrans={this.switchTrans}
      />
      </BluetoothDevice.Provider>
    </>
  }



componentDidMount() {
  this.setState({enableP300:true})
  ipc.on("wrong-net", (event, arg) => {
    if(!arg){
    notification.open({
      message: 'Wrong neural network file',
      description:
          "Modify the neural network file to access the P300 keyboard.",
      placement: "bottomLeft"
  });
  this.setState({enableP300:false})
  }
  else this.setState({enableP300:true})
  })
}
}

export default MenuComponent;

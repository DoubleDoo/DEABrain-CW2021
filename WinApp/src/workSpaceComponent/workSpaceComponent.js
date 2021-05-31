import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './workSpaceComponent.css';
import { AppstoreOutlined, MailOutlined, SettingOutlined,notification } from '@ant-design/icons';
import BluetoothComponent from "../bluetoothComponent/bluetoothComponent";
import EegComponent from "../eegComponent/eegComponent"
import KeyboardComponent from "../keyboardComponent/keyboardComponent"
import SettingsComponent from "../settingsComponent/settingsComponent"
import { Bullet } from '@amcharts/amcharts4/charts';
import {BluetoothDevice } from '../context/context';



class WorkSpaceComponent extends React.Component {



  renderSwitch(param) {
    switch (param) {
      case 'EEG_Data':
        return <EegComponent  
        enable={this.props.enablekeyboard}
        switch={this.props.switchKeyboard}
        switchTrans={this.props.switchTrans}/>;
        
      case 'Devices':
        return <BluetoothComponent    
        devUpd={this.props.devUpd}
        reset={this.props.reset}
        bleEegUpd={this.props.bleEegUpd} 
        bleBattUpd={this.props.bleBattUpd}
        eegStruct={this.props.eegStruct}
        battStruct={this.props.battStruct}
        devStruct={this.props.devStruct}
        handleNotifications={this.props.handleNotifications}
        switch={this.props.switchBoth}
        />;
      case 'P300':
        return <KeyboardComponent 
        enable={this.props.enableEeg}
        switch={this.props.switchEeg}
        switchTrans={this.props.switchTrans}
        />;
      case 'Options':
        return <SettingsComponent />;
      case 'Test':
        return <>Test</>;
      default:
        return <>nothing</>;
    }
  }


  render() {
  return <div className="workSpaceComponent">
      {this.renderSwitch(this.props.curOption)}
    </div>

  }



}

export default WorkSpaceComponent;

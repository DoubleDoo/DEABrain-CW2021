import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './workSpaceComponent.css';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
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
        return <EegComponent />;
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
        />;
      case 'P300':
        return <KeyboardComponent />;
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

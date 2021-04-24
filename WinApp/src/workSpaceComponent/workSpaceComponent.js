import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './workSpaceComponent.css';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import BluetoothComponent from "../bluetoothComponent/bluetoothComponent";
import EegComponent from "../eegComponent/eegComponent"
import KeyboardComponent from "../keyboardComponent/keyboardComponent"
import SettingsComponent from "../settingsComponent/settingsComponent"

class WorkSpaceComponent extends React.Component {



  renderSwitch(param) {
    switch (param) {
      case 'EEG_Data':
        return <EegComponent />;
      case 'Devices':
        return <BluetoothComponent />;
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

import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './WorkSpaceComponent.css';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import BluetoothComponent from "../BluetoothComponent/BluetoothComponent";


class WorkSpaceComponent extends React.Component {

  renderSwitch(param) {
    switch(param) {
      case 'EEG_Data':
        return <>EEG_Data</>;
      case 'Devices':
        return <BluetoothComponent/>;
      case 'P300':
        return <>P300</>;
      case 'APP':
        return <>APP</>;
      case 'Options':
        return <>Options</>;
      case 'Test':
        return <>Test</>;
      default:
        return <>nothing</>;
    }
  }


    render() {
      return <div className="WorkSpaceComponent">
       {this.renderSwitch(this.props.curOption)} 
      </div>
    
    }
  }

export default WorkSpaceComponent;

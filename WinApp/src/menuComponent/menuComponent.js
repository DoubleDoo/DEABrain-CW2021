import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './menuComponent.css';
import { Menu } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import WorkSpaceComponent from "../workSpaceComponent/workSpaceComponent";

class MenuComponent extends React.Component {

  state={
    curOption:"EEG_Data",
    theme:"light"
  }

    render() {
      return  <>
      <Menu className="MenuComponent"
      onClick={this.handleClick}
      defaultSelectedKeys={[this.state.curOption]}
      defaultOpenKeys={[this.state.curOption]}
      mode="inline"
      theme={this.state.theme}
      >
        <Menu.ItemGroup key="EEG" title="EEG">
          <Menu.Item key="EEG_Data" onClick={()=>this.setState({curOption:"EEG_Data"})}>EEG Data</Menu.Item>
          <Menu.Item key="Devices" onClick={()=>this.setState({curOption:"Devices"})}>Devices</Menu.Item>
          <Menu.Item key="P300" onClick={()=>this.setState({curOption:"P300"})}>P300 keyboard demo</Menu.Item>
        </Menu.ItemGroup>
        <Menu.Divider/>
        <Menu.ItemGroup key="APP" title="APP">
          <Menu.Item key="Options" onClick={()=>this.setState({curOption:"Options"})}>Options</Menu.Item>
          <Menu.Item key="Test" onClick={()=>this.setState({curOption:"Test"})}>Test</Menu.Item>
        </Menu.ItemGroup>
        <Menu.Divider/>
        </Menu>
        <WorkSpaceComponent curOption={this.state.curOption}/>
    </>
    }
  }

export default MenuComponent;

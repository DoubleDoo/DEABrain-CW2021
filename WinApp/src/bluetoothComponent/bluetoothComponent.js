import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './bluetoothComponent.css';
import { Menu } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';

const electron = require('electron')
const ipc = electron.ipcRenderer

//const electron = window.require("electron")

electron.ipcRenderer.on("blelist",(event, arg) => {
      console.log("Hiii",arg) // prints "Hiii pong"
})

//target: "electron-renderer",


class BluetoothComponent extends React.Component {


    checkIsEnable() {
        console.log("Send");
        //ipc.send("test",{data:"test1"})
         navigator.bluetooth.requestDevice({
             acceptAllDevices: true
            //  filters: [
            //     {namePrefix: 'LE'},
            //   ]
         }).then((data)=>{
            console.log(data);
         });
        console.log("Test1");
    }

    render() {
        return ( <div>
            <button onClick={()=>this.checkIsEnable()}>search</button>
        </div>
        );
    }
}

export default BluetoothComponent;
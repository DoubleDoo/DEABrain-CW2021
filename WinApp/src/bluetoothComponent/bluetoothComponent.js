import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './bluetoothComponent.css';
import { Menu } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
//import { ipcRenderer } from 'electron';


//const electron = window.require("electron")

// window.ipcRenderer.on("blelist",(event, arg) => {
//     console.log("Hiii",arg) // prints "Hiii pong"
// });

//target: "electron-renderer",


class BluetoothComponent extends React.Component {


    checkIsEnable() {
        console.log("started");
         navigator.bluetooth.requestDevice({
             //acceptAllDevices: true LE-Bose LE-P-Bose QC Earbuds
             filters: [
                {namePrefix: 'LE'},
              ]
         }).then(device => {
             console.log('Got device:', device.name);
             console.log('id:', device.id);
         });
        
    }

    render() {
        return ( <div>
            <button onClick={()=>this.checkIsEnable()}>search</button>
        </div>
        );
    }
}

export default BluetoothComponent;
import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './bluetoothComponent.css';
import { Button, Col, Row, Card, Typography, notification } from 'antd';
import { TabletOutlined, MonitorOutlined, LoadingOutlined, ApiOutlined } from '@ant-design/icons';
import {BluetoothDevice } from '../context/context';

const electron = require('electron')
const ipc = electron.ipcRenderer

// const {Consumer} = React.createContext(BluetoothDevice);
// const color = React.useContext(BluetoothDevice);

class BluetoothComponent extends React.Component {

    static contextType = BluetoothDevice;

    state = {
        deviceList: [],
        isSearch: false,
    }



    // handleNotifications(event) {
    //     let value = event.target.value;
    //     let a = [];
    //     for (let i = 0; i < value.byteLength; i++) {
    //         a.push('0x' + ('00' + value.getUint8(i).toString(16)).slice(-2));
    //     }
    //     this.props.bleBattUpd(this.props.battStruct.serviceBatt,this.props.battStruct.characteristicBatt,this.props.battStruct.notifBatt,Number.parseInt(a))
    // }

 
    render() {
       // console.log(this.props.battStruct)
       // console.log(this.props.devStruct)
        // this.handleNotifications = this.handleNotifications.bind(this)

        navigator.bluetooth.getAvailability()
        .then(isBluetoothAvailable => {
        console.log(`> Bluetooth is ${isBluetoothAvailable ? 'available' : 'unavailable'}`);
        });
        this.onDisconnected = this.onDisconnected.bind(this)
        return (
            <Row className={"BluetoothComponent"} align={"top"}>
                <Col className={"devInfo"} flex={2} >
                    <SelectedDevice disconnect={this.disconnect} curentBataryLevel={this.props.eegStruct.lastEegValue} deviceSelected={this.props.devStruct.deviceSelected} />
                </Col>
                <Col className={"devList"} flex={3}>
                    <DeviceList deviceSelected={this.props.devStruct.deviceSelected} deviceList={this.state.deviceList} isSearch={this.state.isSearch} setDeviceSelected={this.setDeviceSelected} updateDeviceList={this.updateDeviceList} />
                </Col>
            </Row>

        );
    }


    setDeviceSelected = (data) => {
        this.props.devUpd(data,this.props.devStruct.server)
        this.setState({ isSearch: false });
    }


   

    updateDeviceList = async () => {
        if (this.props.devStruct.deviceSelected == null) {
            this.setState({ deviceList: [] })
            this.setState({ isSearch: true });

            navigator.bluetooth.requestDevice({
                filters: [
                    {services: ['heart_rate']},
                    {services: ['battery_service']}
                ]
            }).then((device) => {
                console.log(device);
                this.setDeviceSelected(device);
                device.addEventListener('gattserverdisconnected', this.onDisconnected);
                return device.gatt.connect();
            }).then(server => {
                this.props.devUpd(this.props.devStruct.deviceSelected,server)
                    notification.open({
                        message: 'Device conected',
                        description:
                            "Device "+this.props.devStruct.deviceSelected.name+" is conected",
                        placement: "bottomLeft",
                        onClick: () => {
                            console.log('Notification Clicked!');
                        },
                    });
                return server.getPrimaryService('heart_rate');
                // return server.getPrimaryService('battery_service');
            }) 
                .then(service => {
                    this.props.bleBattUpd(service,this.props.battStruct.characteristicBatt,this.props.battStruct.notifBatt,this.props.battStruct.lastBattValue)
                    return service.getCharacteristic('heart_rate_measurement');
                    // return service.getCharacteristic('battery_level');
                })
                .then(characteristic => {
                    this.props.bleBattUpd(this.props.battStruct.serviceBatt,characteristic,this.props.battStruct.notifBatt,this.props.battStruct.lastBattValue)
                    characteristic.startNotifications().then(_ => {
                        characteristic.addEventListener('characteristicvaluechanged',this.props.handleNotifications);
                    });
                    return characteristic.readValue();
                })
                .then(value => {
                    let batteryLevel = value;
                    let a = [];
                    for (let i = 0; i < batteryLevel.byteLength; i++) {
                        a.push('0x' + ('00' + batteryLevel.getUint8(i).toString(16)).slice(-2));
                    }
                    this.props.bleBattUpd(this.props.battStruct.serviceBatt,this.props.battStruct.characteristicBatt,this.props.battStruct.notifBatt,Number.parseInt(a))
                    // this.setState({ lastBattValue: Number.parseInt(a) })
                    console.log('> eeg Level is ' + Number.parseInt(a) + '%');
                    setTimeout(()=> {
                        this.readBatt();
                      }, 2000);
                })
                .catch(error => { console.error(error);
                    this.props.reset();
                    this.setState({ deviceList: [] })
                    this.setState({ isSearch: false });
                    notification.open({
                        message: 'Bluetooth disabled',
                        description:
                            "It looks like your bluetooth is disabled, turn it on",
                        placement: "bottomLeft",
                        onClick: () => {
                            console.log('Notification Clicked!');
                        },
                    });
                 });

                
        }
    }

    readBatt=async()=>{

        console.log('Connecting to GATT Server...');
        const server = await  this.props.devStruct.deviceSelected.gatt.connect();

        console.log('Getting Battery Service...');
        const service = await server.getPrimaryService('battery_service');
        
        console.log('Getting Battery Level Characteristic...');
        const characteristic = await service.getCharacteristic('battery_level');

        console.log('Read value');
        const value = await characteristic.readValue();

        let batteryLevel = value;
            let a = [];
            for (let i = 0; i < batteryLevel.byteLength; i++) {
                a.push('0x' + ('00' + batteryLevel.getUint8(i).toString(16)).slice(-2));
            }
            // this.props.bleEegUpd(this.props.eegStruct.serviceEeg,this.props.eegStruct.characteristicEeg,this.props.eegStruct.notifEeg,Number.parseInt(a))
            // this.setState({ lastBattValue: Number.parseInt(a) })
            console.log('> battery Level is ' + Number.parseInt(a) + '%');
         this.props.bleEegUpd(service,characteristic,this.props.eegStruct.notifEeg,Number.parseInt(a));
        // // eegStruct={{
        // //     characteristicEeg:this.state.characteristicEeg,
        // //     serviceEeg:this.state.serviceEeg,
        // //     notifEeg:this.state.notifEeg,
        // //     lastEegValue:this.state.lastEegValue,
        // //   }}
        // this.props.devStruct.server.getPrimaryService('battery_service')
        // .then(service => {
        //     this.props.bleEegUpd(service,this.props.eegStruct.characteristicEeg,this.props.eegStruct.notifEeg,this.props.eegStruct.lastEegValue)
        //     return service.getCharacteristic('battery_level');
        //     // return service.getCharacteristic('battery_level');
        // })
        // .then(characteristic => {
        //     this.props.bleEegUpd(this.props.eegStruct.serviceEeg,characteristic,this.props.eegStruct.notifEeg,this.props.eegStruct.lastEegValue)
        //     // characteristic.startNotifications().then(_ => {
        //     //     characteristic.addEventListener('characteristicvaluechanged',this.props.handleNotifications);
        //     // });
        //     return characteristic.readValue();
        // })
        // .then(value => {
        //     let batteryLevel = value;
        //     let a = [];
        //     for (let i = 0; i < batteryLevel.byteLength; i++) {
        //         a.push('0x' + ('00' + batteryLevel.getUint8(i).toString(16)).slice(-2));
        //     }
        //     this.props.bleEegUpd(this.props.eegStruct.serviceEeg,this.props.eegStruct.characteristicEeg,this.props.eegStruct.notifEeg,Number.parseInt(a))
        //     // this.setState({ lastBattValue: Number.parseInt(a) })
        //     console.log('> EEG Level is ' + Number.parseInt(a) + '%');
        // })
        // .catch(error => { console.error(error); });
    }

    onDisconnected(event) {
        const device = event.target;
        console.log(`Device ${device.name} is disconnected.`);
    
        this.props.reset();
        this.setState({ deviceList: [] })
    }


    disconnect = () => {
        console.log('Disconnecting from Bluetooth Device...');
        if (this.props.devStruct.deviceSelected.gatt.connected) {
            console.log('Unsub b');
            if (this.props.battStruct.characteristicBatt) {
                this.props.battStruct.characteristicBatt.stopNotifications()
                .then(_ => {
                    console.log('> Notifications stopped');
                  this.props.battStruct.characteristicBatt.removeEventListener('characteristicvaluechanged',
                  this.props.handleNotifications);
                })
                .catch(error => {
                    console.log('Argh! ' + error);
                });
              }
              
            console.log('Unsub b');
            setTimeout(()=> {
                this.props.devStruct.deviceSelected.gatt.disconnect();
              }, 100);

              notification.open({
                message: 'Device disconected',
                description:
                    "Device "+this.props.devStruct.deviceSelected.name+" is disconected",
                placement: "bottomLeft",
                onClick: () => {
                    console.log('Notification Clicked!');
                },
            });
            // this.props.devStruct.deviceSelected.gatt.disconnect();
        } else {
            console.log('> Bluetooth Device is already disconnected');
        }
    }


    componentDidMount() {
        if(this.props.devStruct.deviceSelected!=null){
        setTimeout(()=> {
            this.readBatt();
          }, 2000);
        }
        ipc.on("bluetooth-list-update", (event, arg) => {
            this.setState({ deviceList: arg.data });
        })
    }
}


class DeviceList extends React.Component {
    render() {
        return (
            <Card>
                {this.props.deviceList.map((element, i) => {
                    return <DeviceListOption dev={element} deviceSelected={this.props.deviceSelected} setDeviceSelected={this.props.setDeviceSelected} key={i + "BD"} />
                })}
                <div onClick={() => this.props.updateDeviceList()}>
                    {this.props.isSearch ? <LoadingOutlined className={"seacrhIcon"} /> :
                        <>
                            <MonitorOutlined className={"seacrhIcon"} />
                            <Typography.Paragraph>Search devices</Typography.Paragraph>
                        </>}

                </div>
            </Card>
        );
    }
}

//Отоборажение инфомации о девайсах
class DeviceListOption extends React.Component {

    selectdev = () => {

        if (this.props.deviceSelected == null) {
            ipc.send("bluetooth-device-select", { id: this.props.dev.deviceId });
            this.props.setDeviceSelected(this.props.dev)
        }
    }


    render() {
        return (

            <Card className="DeviceButton" onClick={this.selectdev} hoverable={this.props.deviceSelected == null}>
                <Row justify="space-around" align="middle" wrap={false}>
                    <Col span={3}>
                        <TabletOutlined className={"iconStyle"} />
                    </Col>
                    <Col className="optionData" flex={"auto"}>
                        DeviceName: {this.props.dev.deviceName}
                        <br />
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
       // console.log(this.props.deviceSelected);
        return (
            <>
                <Card>
                    {
                        this.props.deviceSelected == null ?
                            <>
                                <ApiOutlined className="disconectedIcon" />
                                <Typography.Paragraph>No conected device</Typography.Paragraph>
                            </> :
                            <>
                                <div>{this.props.deviceSelected.name}</div>
                                <div>Curent battary lvl: {this.props.curentBataryLevel} % </div>
                                <Button onClick={this.props.disconnect}>Disconnect</Button>
                            </>
                    }
                </Card >
            </>
        );
    }
}

export default BluetoothComponent;
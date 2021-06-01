import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './keyboardComponent.css';
import { Button, Col, Row, Card, Typography } from 'antd';
import { TabletOutlined, MonitorOutlined, LoadingOutlined, ApiOutlined } from '@ant-design/icons';

const electron = require('electron')
const ipc = electron.ipcRenderer
// var brain = require("brain.js");
class KeyboardComponent extends React.Component {

    state = {
        str: "",
        inProcess: false,
        letters: [["A", "B", "C", "D", "E", "F"],
        ["G", "H", "I", "J", "K", "L"],
        ["M", "N", "O", "P", "Q", "R"],
        ["S", "T", "U", "V", "W", "X"],
        ["Y", "Z", "1", "2", "3", "4"],
        ["5", "6", "7", "8", "9", "0"]]

    }



    componentDidMount() { // When the document is rendered
        ipc.on("enter-row", (event, arg) => {
            this.state.letters[arg.id].map(element => {
                document.getElementById(element).setAttribute("style", "background-color: black; color: white;")
                setTimeout(() => { document.getElementById(element).setAttribute("style", "background-color: white; color: black;") }, arg.timeout);
            })
        })
        ipc.on("enter-col", (event, arg) => {
            this.state.letters.map(element => {
                document.getElementById(element[arg.id]).setAttribute("style", "background-color: black; color: white;")
                setTimeout(() => { document.getElementById(element[arg.id]).setAttribute("style", "background-color: white; color: black;") }, arg.timeout);
            })
        })
        ipc.on("enter-cell", (event, arg) => {
            this.setState({ str: this.state.str + this.state.letters[arg.row][arg.col] })
        })
    }


    generateRow(index) {
        return <Row key={index + "r"}>
            {this.state.letters[index].map(element => {
                return <Col key={element + "col"} span={4}><div key={element} id={element} className="P300Cell" onClick={() => {
                    this.setState({ str: this.state.str + element })
                }}>{element}</div></Col>
            })}
        </Row>
    }


    generateMatrix() {
        return <>
            <Row align="middle" className="P300Grid">
                <Col span={2}></Col>
                <Col span={20}>
                    <Row>

                        <Col span={24}>
                            <div className="strInput">{this.state.str}</div>
                        </Col>

                    </Row>
                    {this.state.letters.map((element, i) => {
                        return this.generateRow(i)
                    })}
                    <Row>

                        <Col span={24}>
                            <Button className="butInput" onClick={() => {
                                ipc.send("enter-start", {})
                                if (!this.state.inProcess) { this.setState({ str: "" }); this.setState({ inProcess: true });

                                    this.props.switch(false);
                                    this.props.switchTrans(true);
                                }
                                else {
                                    this.setState({ inProcess: false });
                                    this.props.switch(true);
                                    this.props.switchTrans(false);
                                }
                            }}>{!this.state.inProcess ? <>Start</> : <>Stop</>}</Button>
                        </Col>


                    </Row>
                </Col>
                <Col span={2}></Col>
            </Row>
        </>
    }


    render() {

        return (
            this.generateMatrix()
        );
    }

    componentWillUnmount(){

        ipc.removeAllListeners("enter-cell")
        ipc.removeAllListeners("enter-col")
        ipc.removeAllListeners("enter-row")
        console.log("unmount")
    
      }
}


export default KeyboardComponent;
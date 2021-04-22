import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './keyboardComponent.css';
import { Button,Col,Row,Card,Typography  } from 'antd';
import {TabletOutlined,MonitorOutlined,LoadingOutlined,ApiOutlined} from '@ant-design/icons';

const electron = require('electron')
const ipc = electron.ipcRenderer

class KeyboardComponent extends React.Component {

state={
    str:"",
    letters: [["A","B","C","D","E","F"],
             ["G","H","I","J","K","L"],
             ["M","N","O","P","Q","R"],
             ["S","T","U","V","W","X"],
             ["Y","Z","1","2","3","4"],
             ["5","6","7","8","9","0"]]
    
}



componentDidMount(){ // When the document is rendered
    ipc.on("enter-row",(event, arg) => {
        this.state.letters[arg.id].map(element => {
            document.getElementById(element).setAttribute("style", "background-color: black;")
            setTimeout(()=>{document.getElementById(element).setAttribute("style", "background-color: white;")}, arg.timeout);
        })
    })
    ipc.on("enter-col",(event, arg) => {
        this.state.letters.map(element => {
            document.getElementById(element[arg.id]).setAttribute("style", "background-color: black;")
            setTimeout(()=>{document.getElementById(element[arg.id]).setAttribute("style", "background-color: white;")}, arg.timeout);
        })
    })
    ipc.on("enter-cell",(event, arg) => {
        this.setState({str:this.state.str+this.state.letters[arg.row][arg.col]})
    })
}


generateRow(index)
{ 
    return <Row>
    { this.state.letters[index].map(element => {
        return  <Col  span={4}><div key={element} id={element} className="P300Cell" onClick={()=>{
            this.setState({str:this.state.str+element})
        }}>{element}</div></Col>
    })}
   </Row>
}


generateMatrix(){ 
    return <>
    <Row align="middle" className="P300Grid">
    <Col  span={2}></Col>
    <Col  span={20}>
    <Row>

        <Col span={24}>
        <div className="strInput">{this.state.str}</div>
        </Col>

    </Row>
    { this.state.letters.map((element,i) => {
        return  this.generateRow(i)
    })}
   <Row>

<Col span={24}>
<Button className="butInput" onClick={()=>{ ipc.send("enter-start",{})}}>Start</Button>
</Col>


</Row>
</Col>
<Col  span={2}></Col>
</Row>
</>
}


    render() {
       
        return (
            this.generateMatrix()
        );
    }    
}


export default KeyboardComponent;
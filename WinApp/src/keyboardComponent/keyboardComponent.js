import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './keyboardComponent.css';
import { Button,Col,Row,Card,Typography  } from 'antd';
import {TabletOutlined,MonitorOutlined,LoadingOutlined,ApiOutlined} from '@ant-design/icons';



class KeyboardComponent extends React.Component {

state={
    data:[],
    chartData:[]
}

    render() {
       
        return (
            <> 
            <Button onClick={()=>{}}>Start</Button>
            <div className={"P300Grid"}>
            <Row gutter={[24, 24]}>
                <Col  className={"P300Cell"} span={4}>A</Col>
                <Col  className={"P300Cell"} span={4}>B</Col>
                <Col  className={"P300Cell"} span={4}>C</Col>
                <Col  className={"P300Cell"} span={4}>D</Col>
                <Col  className={"P300Cell"} span={4}>E</Col>
                <Col  className={"P300Cell"} span={4}>F</Col>
            </Row>
            <Row gutter={[24, 24]}>
                <Col  className={"P300Cell"} span={4}>G</Col>
                <Col  className={"P300Cell"} span={4}>H</Col>
                <Col  className={"P300Cell"} span={4}>I</Col>
                <Col  className={"P300Cell"} span={4}>J</Col>
                <Col className={"P300Cell"} span={4}>K</Col>
                <Col className={"P300Cell"}  span={4}>L</Col>
            </Row>
            <Row gutter={[24, 24]}>
                <Col  className={"P300Cell"} span={4}>M</Col>
                <Col  className={"P300Cell"} span={4}>N</Col>
                <Col  className={"P300Cell"} span={4}>O</Col>
                <Col  className={"P300Cell"} span={4}>P</Col>
                <Col className={"P300Cell"}  span={4}>Q</Col>
                <Col className={"P300Cell"} span={4}>R</Col>
            </Row>
            <Row gutter={[24, 24]}>
                <Col  className={"P300Cell"} span={4}>S</Col>
                <Col  className={"P300Cell"} span={4}>T</Col>
                <Col  className={"P300Cell"} span={4}>U</Col>
                <Col  className={"P300Cell"} span={4}>V</Col>
                <Col  className={"P300Cell"} span={4}>W</Col>
                <Col  className={"P300Cell"} span={4}>X</Col>
            </Row>
            <Row gutter={[24, 24]}>
                <Col className={"P300Cell"}  span={4}>Y</Col>
                <Col  className={"P300Cell"} span={4}>Z</Col>
                <Col  className={"P300Cell"} span={4}>0</Col>
                <Col  className={"P300Cell"} span={4}>1</Col>
                <Col  className={"P300Cell"} span={4}>2</Col>
                <Col  className={"P300Cell"} span={4}>3</Col>
            </Row>
            <Row gutter={[24, 24]}>
                <Col className={"P300Cell"}  span={4}>4</Col>
                <Col  className={"P300Cell"} span={4}>5</Col>
                <Col  className={"P300Cell"} span={4}>6</Col>
                <Col className={"P300Cell"}  span={4}>7</Col>
                <Col className={"P300Cell"}  span={4}>8</Col>
                <Col className={"P300Cell"}  span={4}>9</Col>
            </Row>
            </div>

          </>
        );
    }    
}


export default KeyboardComponent;
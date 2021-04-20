import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './keyboardComponent.css';
import { Button,Col,Row,Card,Typography  } from 'antd';
import {TabletOutlined,MonitorOutlined,LoadingOutlined,ApiOutlined} from '@ant-design/icons';



class KeyboardComponent extends React.Component {

state={
    str:""
}

    render() {
       
        return (
            <> 

            <Row align="middle" className="P300Grid">
            <Col  span={2}></Col>
            <Col  span={20}>
            <Row>

                <Col span={24}>
                <div className="strInput">{this.state.str}</div>
                </Col>
   
            </Row>
            <Row>
                <Col   span={4}><div className="P300Cell" onClick={()=>this.setState({str:this.state.str+"A"})}>A</div></Col>
                <Col  span={4}><div className="P300Cell" onClick={()=>this.setState({str:this.state.str+"B"})}>B</div></Col>
                <Col   span={4}><div className="P300Cell">C</div></Col>
                <Col   span={4}><div className="P300Cell">D</div></Col>
                <Col   span={4}><div className="P300Cell">E</div></Col>
                <Col   span={4}><div className="P300Cell">F</div></Col>
            </Row>
            <Row>
                <Col   span={4}><div className="P300Cell">G</div></Col>
                <Col   span={4}><div className="P300Cell">H</div></Col>
                <Col   span={4}><div className="P300Cell">I</div></Col>
                <Col   span={4}><div className="P300Cell">J</div></Col>
                <Col  span={4}><div className="P300Cell">K</div></Col>
                <Col   span={4}><div className="P300Cell">L</div></Col>
            </Row>
            <Row>
                <Col   span={4}><div className="P300Cell">M</div></Col>
                <Col   span={4}><div className="P300Cell">N</div></Col>
                <Col   span={4}><div className="P300Cell">O</div></Col>
                <Col   span={4}><div className="P300Cell">P</div></Col>
                <Col  span={4}><div className="P300Cell">Q</div></Col>
                <Col  span={4}><div className="P300Cell">R</div></Col>
            </Row>
            <Row>
                <Col   span={4}><div className="P300Cell">S</div></Col>
                <Col   span={4}><div className="P300Cell">T</div></Col>
                <Col   span={4}><div className="P300Cell">U</div></Col>
                <Col  span={4}><div className="P300Cell">V</div></Col>
                <Col   span={4}><div className="P300Cell">W</div></Col>
                <Col   span={4}><div className="P300Cell">X</div></Col>
            </Row>
            <Row>
                <Col   span={4}><div className="P300Cell">Y</div></Col>
                <Col   span={4}><div className="P300Cell">Z</div></Col>
                <Col   span={4}><div className="P300Cell">0</div></Col>
                <Col  span={4}><div className="P300Cell">1</div></Col>
                <Col   span={4}><div className="P300Cell">2</div></Col>
                <Col   span={4}><div className="P300Cell">3</div></Col>
            </Row>
            <Row>
                <Col   span={4}><div className="P300Cell">4</div></Col>
                <Col   span={4}><div className="P300Cell">5</div></Col>
                <Col  span={4}><div className="P300Cell">6</div></Col>
                <Col   span={4}><div className="P300Cell">7</div></Col>
                <Col   span={4}><div className="P300Cell">8</div></Col>
                <Col   span={4}><div className="P300Cell">9</div></Col>
            </Row>
            <Row>

                <Col span={24}>
                <Button className="butInput" onClick={()=>{}}>Start</Button>
                </Col>
 
               
            </Row>
            </Col>
            <Col  span={2}></Col>
            </Row>
          </>
        );
    }    
}


export default KeyboardComponent;
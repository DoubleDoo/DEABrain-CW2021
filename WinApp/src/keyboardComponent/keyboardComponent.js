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
            <Button onClick={()=>{}}>EEG</Button>
            <div id="chartdiv"></div>

          </>
        );
    }    
}


export default KeyboardComponent;
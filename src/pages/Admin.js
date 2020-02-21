import React, { useState } from 'react';
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import {Container, Row, Col, Form, Button} from 'react-bootstrap'
import CompanyBoardContainer from '../containers/CompanyBoardContainer';
import ApiServerBoardContainer from '../containers/ApiServerBoardContainer';


const Admin = () => {
    const [key, setKey] = useState('company');

    return (
        <div className="main-contents" >
            <p className="main-contents-title"><b>관리페이지</b></p>
            <Tabs id="controlled-tab-example" activeKey={key} onSelect={k => setKey(k)}>
                <Tab eventKey="company" title="회사">
                    <CompanyBoardContainer />
                </Tab>
                <Tab eventKey="apiServer" title="Api서버">
                    <ApiServerBoardContainer />
                </Tab>
                <Tab eventKey="user" title="사용자">
                {/* <Sonnet /> */}
                </Tab>
                <Tab eventKey="contact" title="Contact" disabled>
                {/* <Sonnet /> */}
                </Tab>
            </Tabs>
        </div>
    );
};

export default Admin;
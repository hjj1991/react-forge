import React, { useState } from 'react';
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import CompanyBoardContainer from '../containers/CompanyBoardContainer';


const Admin = () => {
    const [key, setKey] = useState('company');

    return (
      <Tabs id="controlled-tab-example" activeKey={key} onSelect={k => setKey(k)}>
        <Tab eventKey="company" title="회사">
          <CompanyBoardContainer />
        </Tab>
        <Tab eventKey="user" title="사용자">
          {/* <Sonnet /> */}
        </Tab>
        <Tab eventKey="contact" title="Contact" disabled>
          {/* <Sonnet /> */}
        </Tab>
      </Tabs>
    );
};

export default Admin;
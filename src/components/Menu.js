import React from 'react';
import { useSelector } from "react-redux";
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import { NavLink } from 'react-router-dom';
import logo from '../logo.png' //실제 로고파일 경로

const Menu = () => {

    const userInfo = useSelector(state => state.userLogin.data); //리덕스 스토어의 로그인 유저 데이터 가져오기

    return (
        <section>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <NavLink className="navbar-brand" to="/"><img alt="" src={logo} width="30"  className="d-inline-block align-top"/>{' EonIT'}</NavLink>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                <Nav.Link href="/dashboard">Dashboard</Nav.Link>
                {/* <Link className="nav-link" to="/Dashboard" >Dashboard</Link> */}
                <Nav.Link href="/workloads">Workloads</Nav.Link>
                {/* <Link className="nav-link" to="/Workloads" onClick={() => window.location.reload()} >Workloads</Link> */}
                {/* <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
                    <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                </NavDropdown> */}
                </Nav>
                <Nav>
                    <Navbar.Text id="user-bar">환영합니다.{userInfo.name}님</Navbar.Text>
                    <NavLink className="nav-link" to="/myinfo" >MyInfo</NavLink>
                </Nav>
            </Navbar.Collapse>
            </Navbar>
            {/* <div>
                <ul>
                    <li><NavLink exact to="/" activeStyle={activeStyle}>Dashboard</NavLink></li>
                    <li><NavLink exact to="/about" activeStyle={activeStyle}>Workloads</NavLink></li>
                    <li><NavLink to="/about/foo" activeStyle={activeStyle}>Targets</NavLink></li>
                    <li><NavLink to="/posts" activeStyle={activeStyle}>Tasks</NavLink></li>
                </ul>
                <hr/>
            </div> */}
        </section>
    );
};

export default Menu;
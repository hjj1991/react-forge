import React from 'react';
import { useSelector } from "react-redux";
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import { NavLink } from 'react-router-dom';
import logo from '../logo.png' //실제 로고파일 경로

const Menu = ({match}) => {
    let isDashboard, isWorkloads, isAdmin = false;

    if(match.url === "/dashboard"){
        isDashboard = true;
    }else if(match.url === "/workloads"){
        isWorkloads = true;
    }else if(match.url ==="/admin"){
        isAdmin = true;
    }
    const userInfo = useSelector(state => state.userLogin.data); //리덕스 스토어의 로그인 유저 데이터 가져오기

    return (
        <section>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <NavLink className="navbar-brand" to="/"><img alt="" src={logo} width="30"  className="d-inline-block align-top"/>{' EonIT'}</NavLink>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                <Nav.Link active={isDashboard} href="/dashboard">Dashboard</Nav.Link>
                <Nav.Link active={isWorkloads} href="/workloads">Workloads</Nav.Link>
                {userInfo.userRole === "전체 관리자" ?
                    <Nav.Link active={isAdmin} href="/admin">Admin</Nav.Link>
                    : null
                }                
                </Nav>
                <Nav>
                    <Navbar.Text id="user-bar">환영합니다.{userInfo.name}님</Navbar.Text>
                    <NavLink  className="nav-link" to="/myinfo" >MyInfo</NavLink>
                </Nav>
            </Navbar.Collapse>
            </Navbar>
        </section>
    );
};

export default Menu;
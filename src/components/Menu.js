import React from 'react';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import { NavLink } from 'react-router-dom';
import logo from '../logo.png' //실제 로고파일 경로

const Menu = () => {

    return (
        <section>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <NavLink className="navbar-brand" to="/"><img alt="" src={logo} width="30"  className="d-inline-block align-top"/>{' EonIT'}</NavLink>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                <NavLink className="nav-link" to="/Dashboard" >Dashboard</NavLink>
                <NavLink className="nav-link" to="/Workloads" >Workloads</NavLink>
                {/* <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
                    <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                </NavDropdown> */}
                </Nav>
                <Nav>
                <Nav.Link href="#deets">More deets</Nav.Link>
                <Nav.Link eventKey={2} href="#memes">
                    Dank memes
                </Nav.Link>
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
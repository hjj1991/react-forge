import React from 'react';
import {Container, Row, Col, Form, Button} from 'react-bootstrap'
import { Redirect } from 'react-router-dom';
import 'css/signIn.css'




const SighIn = ({ onClickSubmit, msg, success }) => {

    console.log(success);

    if (success){ //로딩이 완료되었고, 로그인이 성공적으로 됐다면
        // window.location.href = '/';
        return(
            <Redirect to="/"/>
            
        );
    }

    return (

        <Container className="login-form">
            <div className="logo"></div>
            <Form onSubmit={onClickSubmit}>
            <div className="login-block">
            
                <h1>Login</h1>
                <input type="text"  placeholder="ID" id="userId" />
                <input type="password"  placeholder="Password" id="userPw" />
                <button>로그인</button>
                
            </div>
            </Form>
        </Container>
)
};

export default SighIn;
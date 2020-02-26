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

        <Container>
            <div className="logo"></div>
            <Form onSubmit={onClickSubmit}>
            <div className="login-block">
            
                <h1>Login</h1>
                <input type="text"  placeholder="ID" id="userId" />
                <input type="password"  placeholder="Password" id="userPw" />
                <button>로그인</button>
                
            </div>
            </Form>
            {/* <Form onSubmit={onClickSubmit}>
                <Form.Group controlId="userId"  >
                    <Form.Label>아이디</Form.Label>
                    <Form.Control type="text" placeholder="아이디를 입력하세요" />
                </Form.Group>
                <Form.Group controlId="userPw" >
                    <Form.Label>비밀번호</Form.Label>
                    <Form.Control type="password" placeholder="비밀번호를 입력하세요."/>
                </Form.Group>
                <div style={{"color": "red"}}>
                    {msg}
                </div>
                <Button variant="outline-secondary" type="submit" size="lg" block>
                    로그인
                </Button>
            </Form> */}
        </Container>
)
};

export default SighIn;
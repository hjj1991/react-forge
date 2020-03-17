import React from 'react';
import {Container, Row, Col, Form, Button, ListGroup} from 'react-bootstrap'
import { Redirect } from 'react-router-dom';
import LoadingOverlay from 'react-loading-overlay';




const MyInfo = ({userInfo, isLoading, onClickLogout}) => {

    return (
        isLoading?(
        <Container>
            <Row id="title">
                <Col>
                    <h1>내정보</h1>
                </Col>
            </Row>
            <Row>
                <Col>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <Row>
                                <div className="col-3 info-title">아이디</div>
                                <div className="col-6 info-contents">{userInfo.userId}</div>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <div className="col-3 info-title">이름</div>
                                <div className="col-6 info-contents">{userInfo.name}</div>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <div className="col-3 info-title">소속</div>
                                <div className="col-6 info-contents">{userInfo.companyName}</div>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <div className="col-3 info-title">권한</div>
                                <div className="col-6 info-contents">{userInfo.userRole}</div>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <div className="col-3 info-title">이메일주소</div>
                                <div className="col-6 info-contents">{userInfo.userEmail}</div>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <div className="col-3 info-title">전화번호</div>
                                <div className="col-6 info-contents">{userInfo.userTel}</div>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <div className="col-3 info-title">휴대폰번호</div>
                                <div className="col-6 info-contents">{userInfo.userPhone}</div>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <div className="col-3 info-title">가입일</div>
                                <div className="col-6 info-contents">{userInfo.createdDate}</div>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item></ListGroup.Item>
                    </ListGroup>
                </Col>
            </Row>
            <Row className="info-footer">
                <Col><Button variant="outline-secondary" onClick={onClickLogout}>로그아웃</Button></Col>
            </Row>
        </Container>
        ):(
            <LoadingOverlay
            active={true}
            spinner
            text='잠시만 기다려주세요...'
            styles={{
                overlay: (base) => ({
                  ...base,
                  "position": "fixed",
                  "width": "100%",
                  "height": "100%",
                  "left": "0",
                  "z-index": "10"
                })
              }}
            >
        </LoadingOverlay>
        )
)
};

export default MyInfo;
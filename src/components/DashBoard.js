import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import runningImg from 'images/running.png';
import complete from 'images/complete2.png';
import replicatingImg from 'images/replicating.png'
import cancelImg from 'images/cancel.png'
import Card from 'react-bootstrap/Card'
import WindowImage from 'images/windowsWorkload.png';
import LinuxImage from 'images/linuxWorkload.png';

const DashBoardItem = ({ CurrentState, Name, OperatingSystem, bgColor, itemIndex}) => {



    return (
        <Col xs={4} md={4} lg={3} xl={2} >
            <Card bg={bgColor} text="white" style={{ "margin": "10px auto 10px auto", "textAlign": "center", "font-size": "9px" }}>
                <Card.Header style={{"textOverflow":"ellipsis",  "overflow":"hidden", "whiteSpace":"nowrap", "padding": "2px"}}>{OperatingSystem.substring(0, 6) === 'Window' ? <img  alt={OperatingSystem} src={WindowImage} /> : <img  alt={OperatingSystem} width="16px" src={LinuxImage} />} {Name}</Card.Header>
                <Card.Body>
                    <Card.Text style={{"textOverflow":"ellipsis", "overflow":"hidden", "whiteSpace":"nowrap", "padding": "0px"}}>{CurrentState}</Card.Text>
                </Card.Body>
            </Card>
        </Col>
    )

}


const DashBoard = ({ workloadList }) => {
    var idle = 0;
    var runningIncremental = 0;
    var replicating = 0;
    var runningIncrementalAndTestFailover = 0;
    var waitingForCancelTestFailover = 0;
    var runningTestFailover = 0;
    var cancellingFailover = 0;
    var unknown = 0;
    
    // for(let workload of post) {
    //     if(workload.CurrentState === "Idle"){
    //         idle = idle + 1;
    //     }else if(workload.CurrentState === "RunningIncremental"){
    //         runningIncremental = runningIncremental + 1;
    //     }else if(workload.CurrentState === "Replicating"){
    //         replicating = replicating + 1;
    //     }else if(workload.CurrentState === "RunningIncrementalAndTestFailover"){
    //         runningIncrementalAndTestFailover = runningIncrementalAndTestFailover + 1;
    //     }else if(workload.CurrentState === "WaitingForCancelTestFailover"){
    //         waitingForCancelTestFailover = waitingForCancelTestFailover + 1;
    //     }else if(workload.CurrentState === "RunningTestFailover"){
    //         runningTestFailover = runningTestFailover + 1;
    //     }else if(workload.CurrentState === "CancellingFailover"){
    //         cancellingFailover = cancellingFailover + 1;
    //     }else{
    //         unknown = unknown + 1;
    //     }
    // }

    const DashBoardItems = workloadList.map((workload, index) => {
        var bgColor;
        if(workload.CurrentState === "Idle"){
            idle = idle + 1;
            bgColor = "success";
        }else if(workload.CurrentState === "RunningIncremental"){
            runningIncremental = runningIncremental + 1;
            bgColor = "warning";
        }else if(workload.CurrentState === "Replicating"){
            replicating = replicating + 1;
            bgColor = "warning";
        }else if(workload.CurrentState === "RunningIncrementalAndTestFailover"){
            runningIncrementalAndTestFailover = runningIncrementalAndTestFailover + 1;
            bgColor = "warning";
        }else if(workload.CurrentState === "WaitingForCancelTestFailover"){
            waitingForCancelTestFailover = waitingForCancelTestFailover + 1;
            bgColor = "danger";
        }else if(workload.CurrentState === "RunningTestFailover"){
            runningTestFailover = runningTestFailover + 1;
            bgColor = "danger";
        }else if(workload.CurrentState === "CancellingFailover"){
            cancellingFailover = cancellingFailover + 1;
            bgColor = "danger";
        }else{
            unknown = unknown + 1;
        }

        return(
                <DashBoardItem
                    itemIndex={index}
                    CurrentState={workload.CurrentState}
                    Name={workload.Name}
                    OperatingSystem={workload.OperatingSystem}
                    bgColor={bgColor}
                />
             

        )

    });


    return (
        <div className="dashboard" style={{"margin": "10px auto 0px auto", "width": "80%"}}>
            
            <Row >
                <Col xs={12} md={4} style={{"marginBottom": "20px"}}>
                <p style={{"fontSize": "40px"}}><b>대시보드</b></p>
                    <Row>
                        <Col>
                            <ListGroup>
                                {/* <ListGroup.Item variant="danger"><img alt="run" width="24px" src={cancelImg} /> {waitingForCancelTestFailover} Waiting For CancelTestFailover</ListGroup.Item>
                                <ListGroup.Item variant="danger"><img alt="run" width="24px" src={cancelImg} /> {cancellingFailover} Cancelling Failover</ListGroup.Item>
                                <ListGroup.Item variant="warning"><img alt="run" width="24px" src={runningImg} /> {runningIncremental} Running Incremental</ListGroup.Item>
                                <ListGroup.Item variant="warning"><img alt="run" width="24px" src={runningImg} /> {runningTestFailover} Running TestFailover</ListGroup.Item>
                                <ListGroup.Item variant="warning"><img alt="run" width="24px" src={runningImg} /> {runningIncrementalAndTestFailover} Running Incremental And TestFailover</ListGroup.Item>
                                <ListGroup.Item variant="warning"><img alt="run" width="24px" src={replicatingImg} /> {replicating} Replicating</ListGroup.Item>
                                <ListGroup.Item variant="success"><img alt="run" width="24px" src={complete} /> {idle} Idle</ListGroup.Item> */}
                                <ListGroup.Item variant="danger"><img alt="run" width="24px" src={cancelImg} /> {waitingForCancelTestFailover} 테스트 대기</ListGroup.Item>
                                <ListGroup.Item variant="danger"><img alt="run" width="24px" src={cancelImg} /> {cancellingFailover} 테스트 취소</ListGroup.Item>
                                <ListGroup.Item variant="warning"><img alt="run" width="24px" src={runningImg} /> {runningIncremental} 증분 복제</ListGroup.Item>
                                <ListGroup.Item variant="warning"><img alt="run" width="24px" src={runningImg} /> {runningTestFailover} 페일오버</ListGroup.Item>
                                <ListGroup.Item variant="warning"><img alt="run" width="24px" src={runningImg} /> {runningIncrementalAndTestFailover} 증분복제후 기동</ListGroup.Item>
                                <ListGroup.Item variant="warning"><img alt="run" width="24px" src={replicatingImg} /> {replicating} 전체 복제</ListGroup.Item>
                                <ListGroup.Item variant="success"><img alt="run" width="24px" src={complete} /> {idle} 대기</ListGroup.Item>
                            </ListGroup>
                        </Col>
                    </Row>
                </Col>
                <Col xs={12} md={8} >
                <p style={{"fontSize": "40px"}}><b>서버상태 현황</b></p>   
                    <Row style={{"border": "1px solid #7a7a7a", "borderRadius": "5px", "height": "79%"}}>
                        <Col>

                                <Row >
                                            {DashBoardItems}
                                </Row>

                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}
export default DashBoard;
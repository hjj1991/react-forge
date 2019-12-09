import React from 'react';
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import './workload.css'
import WindowImage from 'images/windowsWorkload.png';
import LinuxImage from 'images/linuxWorkload.png';




function getTimeStamp(tempDate) {
    var d = new Date(tempDate);
  
    var s =
      leadingZeros(d.getFullYear(), 4) + '-' +
      leadingZeros(d.getMonth() + 1, 2) + '-' +
      leadingZeros(d.getDate(), 2) + ' ' +
  
      leadingZeros(d.getHours(), 2) + ':' +
      leadingZeros(d.getMinutes(), 2) + ':' +
      leadingZeros(d.getSeconds(), 2);
  
    return s;
  }
  
  
  
  function leadingZeros(n, digits) {
    var zero = '';
    n = n.toString();
  
    if (n.length < digits) {
      for (var i = 0; i < digits - n.length; i++)
        zero += '0';
    }
    return zero + n;
  }
  


const WorkloadItem = ({ checkboxList, currentState, Name, OperatingSystem , ScheduleActive, Tag, Online, lastReplication, NextIncrementalOn, LastTestedFailoverOn, AvailableTransitions, onChange }) => {
    var fontColor = "white"

    if(currentState === "Idle"){
        fontColor = "#05ff05";
    }else if(currentState === "RunningIncremental"){
        currentState = "Running Incremental"
        fontColor = "Orange";
    }else if(currentState === "Replicating"){
        fontColor = "Orange";
    }else if(currentState === "RunningIncrementalAndTestFailover"){
        currentState = "Running Incremental And TestFailover";
        fontColor = "Orange";
    }else if(currentState === "RunningTestFailover"){
        currentState = "Running Test Failover";
        fontColor = "Orange"; 
    }else{
        fontColor = "red";
    }

    return (
        <tr>
            <td><input type="checkbox" name="workloadBox" value={AvailableTransitions} onChange={onChange} checked={checkboxList} /></td>
            <td></td>
            <td>{Online}</td>
            <td title={OperatingSystem}>{OperatingSystem.substring(0, 6) === 'Window' ? <img  alt={OperatingSystem} src={WindowImage} /> : <img  alt={OperatingSystem} width="16px" src={LinuxImage} />} {Name}</td>
            <td></td>
            <td>{Tag}</td>
            <td>{ScheduleActive}</td>
            <td style={{"color": fontColor}}>{currentState}</td>
            <td>{lastReplication}</td>
            <td>{NextIncrementalOn}</td>
            <td>{LastTestedFailoverOn}</td>
    </tr>
    );
  };


const Workload = ({ post, isChecked, onChange, onClickButton, checkboxList, isRunReplication, isRunTestFailover }) => {

    function convertDate(oldDate){
        var convertedDate;
        // if (workload.detail.Parameters[15].Value )
        // console.log(workload.detail.Parameters[12].Value.substring(11,13))
        if (oldDate.substring(11, 13) === "오후"){
            if(oldDate[15] === ":"){
                // console.log(Number(oldDate.substring(14, 15)) + 12)
                // console.log(oldDate.substring(0, 11) + String(Number(oldDate.substring(14, 15)) + 12) + oldDate.substring(15))
                convertedDate = new Date(oldDate.substring(0, 11) + String(Number(oldDate.substring(14, 15)) + 12) + oldDate.substring(15))
                convertedDate.setHours(convertedDate.getHours()+9);
                convertedDate = getTimeStamp(convertedDate);
            }else{
                console.log(oldDate.substring(14, 16))
                convertedDate = new Date(oldDate.substring(0, 11) + String(Number(oldDate.substring(14, 16)) + 12) + oldDate.substring(15))
                convertedDate.setHours(convertedDate.getHours()+9);
                convertedDate = getTimeStamp(convertedDate);
            }
            console.log(oldDate.substring(14, 21))
        }else {
            if(oldDate[15] === ":"){
                // console.log(Number(oldDate.substring(14, 15)) + 12)
                // console.log(oldDate.substring(0, 11) + String(Number(oldDate.substring(14, 15)) + 12) + oldDate.substring(15))
                convertedDate = new Date(oldDate.substring(0, 11) + oldDate.substring(14, 15) + oldDate.substring(15))
                convertedDate.setHours(convertedDate.getHours()+9);
                convertedDate = getTimeStamp(convertedDate);
            }else{
                console.log(oldDate.substring(14, 16))
                convertedDate = new Date(oldDate.substring(0, 11) + oldDate.substring(14, 16) + oldDate.substring(15))
                convertedDate.setHours(convertedDate.getHours()+9);
                convertedDate = getTimeStamp(convertedDate);
            }
            console.log(oldDate.substring(14, 21))   
        }
        return convertedDate.substring(0, 16);
    }

    const workloadItems = post.map((workload, index) => {
        var lastReplication;
        var AvailableTransitions = JSON.stringify(workload.detail.AvailableTransitions);
        var currentState;
        var lastTestedFailoverOn = convertDate(workload.detail.Parameters[12].Value); 
        var nextIncrementalOn = convertDate(workload.detail.Parameters[16].Value);


        if (workload.detail.Parameters[10].Value >= workload.detail.Parameters[11].Value){
            lastReplication = convertDate(workload.detail.Parameters[10].Value);
        }else{
            lastReplication = convertDate(workload.detail.Parameters[11].Value);
        }
        if (workload.detail.Parameters[25].Value === "Aborting"){
            currentState = "Aborting";
        } else {
            currentState = workload.CurrentState;
        }



        return (
        
        <WorkloadItem
            isChecked={isChecked}
            key={index}
            itemNum={index}
            currentState = {currentState}
            Name = {workload.Name}
            OperatingSystem = {workload.OperatingSystem}
            ScheduleActive = {workload.ScheduleActive}
            Tag = {workload.detail.Tag}
            Online = {workload.detail.Online}
            NextIncrementalOn = {nextIncrementalOn}
            lastReplication = {lastReplication}
            LastTestedFailoverOn = {lastTestedFailoverOn}
            AvailableTransitions = {AvailableTransitions}
            onChange = {onChange}
            checkboxList = {checkboxList[index]}
        />
    )}
    );

    return (
        <div className="workloads" style={{"margin": "10px auto 0px auto", "width": "80%"}}>
            <p style={{"fontSize": "40px"}}><b>서버</b></p>
            <div className="table-responsive">
                <Table id="workloadTable" striped bordered hover variant="dark">
                    <thead>
                        <tr>
                            <th width="2%"></th>
                            <th>작업</th>
                            <th>온라인</th>
                            <th>서버</th>
                            <th>타겟</th>
                            <th>태그</th>
                            <th>스케줄</th>
                            <th>상태</th>
                            <th>마지막복제</th>
                            <th>복제예정</th>
                            <th>마지막테스트</th>
                        </tr>
                    </thead>
                    <tbody> 
                        { workloadItems }
                    </tbody>
                </Table>
            </div>
            <div className="workloadSelection">
                <Row style={{"marginBottom": "20px"}}>
                    <Col xs={12} md={3} style={{"textAlign": "center"}}>
                        <Button name="configuration" variant="secondary" size="lg"   block disabled>Configuration</Button>
                    </Col>
                    <Col xs={12} md={3} style={{"textAlign": "center"}}>
                        <Button name="runReplication" variant="secondary" size="lg"   block disabled={isRunReplication} onClick={onClickButton} value="Replication">Run Replication</Button>
                    </Col>
                    <Col xs={12} md={3} style={{"textAlign": "center"}}>
                        <Button name="testFailover" variant="secondary" size="lg"   block disabled={isRunTestFailover} onClick={onClickButton} value="TestFailover">Test Failover</Button>
                    </Col>
                    <Col xs={12} md={3} style={{"textAlign": "center"}}>
                        <Button name="pauseSchedule" variant="secondary" size="lg"   block disabled>Pause Schedule</Button>
                    </Col>  
                </Row>
                <Row>
                    <Col xs={12} md={3} style={{"textAlign": "center"}}>
                        <Button name="prepareMigration" variant="secondary" size="lg"   block disabled>Prepare Migration</Button>
                    </Col>
                    <Col xs={12} md={3} style={{"textAlign": "center"}}>
                        <Button name="runFailover" variant="secondary" size="lg"   block disabled>Run Failover</Button>
                    </Col>
                    <Col xs={12} md={3} style={{"textAlign": "center"}}>
                        <Button name="removeWorkload" variant="secondary" size="lg"   block disabled>Remove Workload</Button>
                    </Col>
                    <Col xs={12} md={3} style={{"textAlign": "center"}}>
                        <Button name="resumeSchedule" variant="secondary" size="lg"   block disabled>Resume Schedule</Button>
                    </Col>  
                </Row>
            </div>
        </div>
    )
}
// export default connect(
//     (state) => ({
//         post: state.post.data,
//         loading: state.post.pending,
//         error: state.post.error,
//     }),
//     (dispatch) => ({
//         PostActions: bindActionCreators(postActions, dispatch)
//     })
// )(Workload);

export default Workload;
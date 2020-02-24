import React, { useRef } from 'react'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import paginationFactory, { PaginationProvider, PaginationListStandalone, SizePerPageDropdownStandalone, PaginationTotalStandalone   } from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import './workload.css'
import WindowImage from 'images/windowsWorkload.png';
import LinuxImage from 'images/linuxWorkload.png';




function getTimeStamp(tempDate) {   //시간 변환함수
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
  


// const WorkloadItem = ({ itemNum, currentState, workloadServerHost, companyName, availableTransitions, name, operatingSystem , scheduleActive, tag, online, lastReplication, nextIncrementalOn, lastTestedFailoverOn, onChangeCheckBox, onClickButton }) => {
//     var fontColor = "white"

//     if(currentState === "Idle"){
//         fontColor = "#05ff05";
//     }else if(currentState === "RunningIncremental"){
//         currentState = "Running Incremental"
//         fontColor = "Orange";
//     }else if(currentState === "Replicating"){
//         fontColor = "Orange";
//     }else if(currentState === "RunningIncrementalAndTestFailover"){
//         currentState = "Running Incremental And TestFailover";
//         fontColor = "Orange";
//     }else if(currentState === "RunningTestFailover"){
//         currentState = "Running Test Failover";
//         fontColor = "Orange"; 
//     }else{
//         fontColor = "red";
//     }

//     availableTransitions.serverHost = workloadServerHost;
//     // console.log(availableTransitions);
//     // console.log(itemNum);
//     return (
//         <tr>
//             <td><input type="checkbox" name="workloadBox" onChange={(e) => onChangeCheckBox(e, availableTransitions)} value={availableTransitions} /></td>
//             <td></td>
//             <td>{online}</td>
//             <td title={operatingSystem}>{operatingSystem.substring(0, 6) === 'Window' ? <img  alt={operatingSystem} src={WindowImage} /> : <img  alt={operatingSystem} width="16px" src={LinuxImage} />} {name}</td>
//             <td></td>
//             <td>{tag}</td>
//             <td>{scheduleActive}</td>
//             <td style={{"color": fontColor}}>{currentState}</td>
//             <td>{lastReplication}</td>
//             <td>{nextIncrementalOn}</td>
//             <td>{lastTestedFailoverOn}</td>
//     </tr>
//     );
//   };


const Workload = ({ workloadList, onClickButton, onChangeCheckBox, isRunReplication, isRunIncremental, isRunIncrementalAndTestFailover, isTestFailover, isAbort }) => {


    const inputEl = useRef(null);
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
            // console.log(oldDate.substring(14, 21))
        }else {
            if(oldDate[15] === ":"){
                // console.log(Number(oldDate.substring(14, 15)) + 12)
                // console.log(oldDate.substring(0, 11) + String(Number(oldDate.substring(14, 15)) + 12) + oldDate.substring(15))
                convertedDate = new Date(oldDate.substring(0, 11) + oldDate.substring(14, 15) + oldDate.substring(15))
                convertedDate.setHours(convertedDate.getHours()+9);
                convertedDate = getTimeStamp(convertedDate);
            }else{
                // console.log(oldDate.substring(14, 16))
                convertedDate = new Date(oldDate.substring(0, 11) + oldDate.substring(14, 16) + oldDate.substring(15))
                convertedDate.setHours(convertedDate.getHours()+9);
                convertedDate = getTimeStamp(convertedDate);
            }
            // console.log(oldDate.substring(14, 21))   
        }
        return convertedDate.substring(0, 16);
    }

    // const workloadItems = workloadList.map((workload, index) => {
    //     // console.log(workload.AvailableTransitions);
    //     var lastReplication;

    //     var currentState;
    //     var lastTestedFailoverOn = convertDate(workload.Parameters[12].Value); 
    //     var nextIncrementalOn = convertDate(workload.Parameters[16].Value);


    //     if (workload.Parameters[10].Value >= workload.Parameters[11].Value){
    //         lastReplication = convertDate(workload.Parameters[10].Value);
    //     }else{
    //         lastReplication = convertDate(workload.Parameters[11].Value);
    //     }
    //     if (workload.Parameters[25].Value === "Aborting"){
    //         currentState = "Aborting";
    //     } else {
    //         currentState = workload.CurrentState;
    //     }

        workloadList.map((workload, index) => {
        // console.log(workload.AvailableTransitions);
            var lastReplication;

            var currentState;
            workload.lastTestedFailoverOn = convertDate(workload.Parameters[12].Value); 
            workload.nextIncrementalOn = convertDate(workload.Parameters[16].Value);


            if (workload.Parameters[10].Value >= workload.Parameters[11].Value){
                workload.lastReplication = convertDate(workload.Parameters[10].Value);
            }else{
                workload.lastReplication = convertDate(workload.Parameters[11].Value);
            }
            if (workload.Parameters[25].Value === "Aborting"){
                workload.CurrentState = "Aborting";
            }

        });
    //     return (
        
    //     <WorkloadItem
    //         key={index}
    //         itemNum={index}
    //         availableTransitions={workload.AvailableTransitions}
    //         workloadServerHost={workload.workloadServerHost}
    //         companyName={workload.companyName}
    //         currentState={currentState}
    //         name={workload.Name}
    //         operatingSystem={workload.OperatingSystem}
    //         scheduleActive={workload.ScheduleActive}
    //         Tag={workload.Tag}
    //         online={workload.Online}
    //         nextIncrementalOn={nextIncrementalOn}
    //         lastReplication={lastReplication}
    //         lastTestedFailoverOn={lastTestedFailoverOn}
    //         onChangeCheckBox={onChangeCheckBox}
    //         onClickButton={onClickButton}
    //     />
    // )}
    // );
    console.log(workloadList);
    const products = workloadList;
    const columns = [
        {
            dataField: '',
            text: '작업',
            sort: true,
        }, 
        {
            dataField: 'Online',
            text: '온라인',
            sort: true
        }, 
        {
            dataField: 'Name',
            text: '서버',
            sort: true,
        }, 
        {
            dataField: '',
            text: '타켓',
            sort: true,
        }, 
        {
            dataField: '',
            text: '태그',
            sort: true,
        }, 
        {
            dataField: '',
            text: '스케줄',
            sort: true,
            searchable: false,
        }, 
        {
            dataField: 'CurrentState',
            text: '상태',
            sort: true,
            searchable: true,
        },
        {
            dataField: 'lastReplication',
            text: '마지막복제',
            sort: true,
            searchable: false,
        },
        {
            dataField: 'nextIncrementalOn',
            text: '복제예정',
            sort: true,
            searchable: false,
        },
        {
            dataField: 'lastTestedFailoverOn',
            text: '마지막테스트',
            sort: true,
            searchable: false,
        },
    ];

    const selectRow = {
        mode: 'checkbox',
        clickToSelect: true,
        onSelect: onChangeCheckBox
      };

    const customTotal = (from, to, size) => (
        <span className="react-bootstrap-table-pagination-total">
          Showing { from } to { to } of { size } Results
        </span>
      );


    const paginationOptions = {
        custom: true,
        paginationSize: 5,
        pageStartIndex: 1,
        withFirstAndLast: false,
        // alwaysShowAllBtns: true, // Always show next and previous button
        // withFirstAndLast: false, // Hide the going to First and Last page button
        // hideSizePerPage: true, // Hide the sizePerPage dropdown always
        // hidePageListOnlyOnePage: true, // Hide the pagination list when only one page
        firstPageText: 'First',
        prePageText: 'Back',
        nextPageText: 'Next',
        lastPageText: 'Last',
        nextPageTitle: 'First page',
        prePageTitle: 'Pre page',
        firstPageTitle: 'Next page',
        lastPageTitle: 'Last page',
        showTotal: true,
        paginationTotalRenderer: customTotal,
        sizePerPageList: [{
          text: '5', value: 5
        }, {
          text: '10', value: 10
        }, {
          text: 'All', value: products.length
        }] // A numeric array is also available. the purpose of above example is custom the text
      };

    const MySearch = (props) => {
        let input;
        const handleChange = () => {
          props.onSearch(input.value);
        };
        return (
            <input
              className="form-control"
              placeholder="검색어를 입력해주세요."
              size="15"
            //   style={ { backgroundColor: 'pink' } }
              ref={ n => input = n }
              type="text"
              onChange={handleChange}
            />
        );
      };
      
    return (
        <div className="main-contents" >
            <p className="main-contents-title"><b>서버</b></p>
            <div className="table-responsive">
                {/* <Table id="workloadTable" striped bordered hover variant="dark">
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
                </Table> */}
                    <div>
          <PaginationProvider
            pagination={
              paginationFactory(paginationOptions)
            }
          >
              {
                  ({
                      paginationProps,
                      paginationTableProps
                  }) => (
                    <div>
                    <ToolkitProvider
                      keyField="Uri"
                      columns={ columns }
                      data={ products }
                     
                      search
                    >
                      {
                        toolkitprops => (
                          <div>
                              <hr />
                            
                              <hr />
                              <div>
                            <MySearch { ...toolkitprops.searchProps } />
                            </div>
                            <hr />
                            <SizePerPageDropdownStandalone { ...paginationProps } />
                            <BootstrapTable classes="company-table"
                                ref={inputEl}
                                bordered={false}
                                selectRow={ selectRow }
                                { ...toolkitprops.baseProps }
                                { ...paginationTableProps }
                            />
                            <PaginationTotalStandalone { ...paginationProps }/>
                            
                            <PaginationListStandalone { ...paginationProps } />
                          </div>
                        )
                      }
                    </ToolkitProvider>
                    
                  </div>
                  )
              }
          </PaginationProvider>
        </div >
            </div>
            <div className="workloadSelection">
                <Row style={{"marginBottom": "20px"}}>
                    <Col xs={12} md={3} style={{"textAlign": "center"}}>
                        <Button name="configuration" variant="secondary" size="lg"  block disabled={!isRunReplication} onClick={onClickButton} value="runReplication">Run Replication</Button>
                    </Col>
                    <Col xs={12} md={3} style={{"textAlign": "center"}}>
                        <Button name="runReplication" variant="secondary" size="lg"   block disabled={!isRunIncremental} onClick={onClickButton} value="runIncremental">RunIncremental</Button>
                    </Col>
                    <Col xs={12} md={3} style={{"textAlign": "center"}}>
                        <Button name="testFailover" variant="secondary" size="lg"   block disabled={!isRunIncrementalAndTestFailover} onClick={onClickButton} value="runIncrementalAndTestFailover">RunIncrementalAndTestFailover</Button>
                    </Col>
                    <Col xs={12} md={3} style={{"textAlign": "center"}}>
                        <Button name="pauseSchedule" variant="secondary" size="lg"   block disabled={!isTestFailover} onClick={onClickButton} value="testFailover">TestFailover</Button>
                    </Col>  
                </Row>
                <Row>
                    <Col xs={12} md={3} style={{"textAlign": "center"}}>
                        <Button name="prepareMigration" variant="secondary" size="lg"   block disabled={!isAbort} onClick={onClickButton} value="abort">Abort</Button>
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
export default Workload;
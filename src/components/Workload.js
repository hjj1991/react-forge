import React, { useRef, Fragment } from 'react'
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


const Workload = ({ workloadList, onClickButton, onChangeCheckBox, isRunReplication, isRunIncremental, isRunIncrementalAndTestFailover, isTestFailover, isAbort, node }) => {


    const inputEl = useRef(null);
    function convertDate(oldDate){
        var convertedDate;
        console.log(oldDate);
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

        workloadList.forEach(workload => {
        console.log(workload);
            workload.lastTestedFailoverOn = workload.lastTestedFailoverOn; 
            workload.nextIncrementalOn = workload.lastIncrementalOn;

            console.log(workload.lastFullOn);
            console.log(new Date(workload.lastFullOn));


            if (workload.lastFullOn >= workload.lastIncrementalOn){
                workload.lastReplication = getTimeStamp(new Date(workload.lastFullOn));
                console.log(workload.lastReplication);
            }else{
                workload.lastReplication = getTimeStamp(new Date(workload.lastIncrementalOn));
                console.log(workload.lastReplication);
            }
            if (workload.protectionState === "Aborting"){
                workload.currentState = "Aborting";
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
    const products = workloadList;
    const columns = [
        {
            dataField: 'companyIdx.companyName',
            text: '소속',
            sort: true,
        },
        {
            dataField: 'online',
            text: '온라인',
            sort: true
        }, 
        {
            dataField: 'name',
            text: '서버',
            sort: true,
            formatter: (cell, row, index, extraData) => {
                console.log(row.operatingSystem);
                if(row.operatingSystem.substring(0, 6) === 'Window'){
                    return (
                        <Fragment>
                            <img alt={row.operatingSystem} src={WindowImage} /> {cell}
                        </Fragment>
                        );
                }else{
                    return (
                        <Fragment>
                            <img width="16px" alt={row.operatingSystem} src={LinuxImage} /> {cell}
                        </Fragment>
                    );      
                }
                // operatingSystem.substring(0, 6) === 'Window' ? <img  alt={operatingSystem} src={WindowImage} /> : <img  alt={operatingSystem} width="16px" src={LinuxImage} />
                // return row.operatingSystem.substring(0, 6) === 'Window' ? <img  alt={operatingSystem} src={WindowImage} /> : <img  alt={operatingSystem} width="16px" src={LinuxImage} />
                
            }
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
            dataField: 'currentState',
            text: '상태',
            sort: true,
            searchable: true,
            formatter: (cell, row, index, extraData) => {
                    if(cell === "Idle"){
                        return <span style={{"color": "#28a745"}}>{cell}</span>
                    }else if(cell === "RunningIncremental"){
                        return <span style={{"color": "Orange"}}>Running Incremental</span>
                    }else if(cell === "Replicating"){
                        return <span style={{"color": "Orange"}}>{cell}</span>
                    }else if(cell === "RunningIncrementalAndTestFailover"){
                        return <span style={{"color": "Orange"}}>Running Incremental And TestFailover</span>
                    }else if(cell === "RunningTestFailover"){
                        return <span style={{"color": "Orange"}}>Running Test Failover</span>
                    }else{
                        return <span style={{"color": "red"}}>{cell}</span>
                    }
            }
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
            formatter: (cell, row, index, extraData) => (
                getTimeStamp(new Date(cell))
            )
        },
        {
            dataField: 'lastTestedFailoverOn',
            text: '마지막테스트',
            sort: true,
            searchable: false,
            formatter: (cell, row, index, extraData) => (
                getTimeStamp(new Date(cell))
            )
        },
    ];

    const selectRow = {
        mode: 'checkbox',
        clickToSelect: false,
        onSelect: onChangeCheckBox,
        hideSelectAll: true
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
                        keyField="workloadId"
                        columns={ columns }
                        data={ products }
                        search
                    >
                      {
                        toolkitprops => (
                            <Fragment>
                              <hr />
                            
                              <hr />
                            <div>
                            <MySearch { ...toolkitprops.searchProps } />
                            </div>
                            <hr />
                            <SizePerPageDropdownStandalone { ...paginationProps } />
                            <BootstrapTable classes="workload-table"
                                { ...toolkitprops.baseProps }
                                { ...paginationTableProps }
                                ref={node}
                                bordered={false}
                                selectRow={ selectRow }
                            />
                            <PaginationTotalStandalone { ...paginationProps }/>
                            
                            <PaginationListStandalone { ...paginationProps } />
                            </Fragment>
                        )
                      }
                    </ToolkitProvider>
                    
                  </div>
                  )
              }
          </PaginationProvider>
            </div>
            <div className="workloadSelection">
                <Row style={{"marginBottom": "20px"}}>
                    <Col xs={12} md={3} style={{"textAlign": "center"}}>
                        <Button name="configuration" variant="secondary" size="lg"  block disabled={!isRunReplication} onClick={onClickButton} value="RunReplication">Run Replication</Button>
                    </Col>
                    <Col xs={12} md={3} style={{"textAlign": "center"}}>
                        <Button name="runReplication" variant="secondary" size="lg"   block disabled={!isRunIncremental} onClick={onClickButton} value="RunIncremental">RunIncremental</Button>
                    </Col>
                    <Col xs={12} md={3} style={{"textAlign": "center"}}>
                        <Button name="testFailover" variant="secondary" size="lg"   block disabled={!isRunIncrementalAndTestFailover} onClick={onClickButton} value="RunIncrementalAndTestFailover">RunIncrementalAndTestFailover</Button>
                    </Col>
                    <Col xs={12} md={3} style={{"textAlign": "center"}}>
                        <Button name="pauseSchedule" variant="secondary" size="lg"   block disabled={!isTestFailover} onClick={onClickButton} value="TestFailover">TestFailover</Button>
                    </Col>  
                </Row>
                <Row>
                    <Col xs={12} md={3} style={{"textAlign": "center"}}>
                        <Button name="prepareMigration" variant="secondary" size="lg"   block disabled={!isAbort} onClick={onClickButton} value="Abort">Abort</Button>
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
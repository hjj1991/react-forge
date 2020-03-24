import React, { useRef, Fragment } from 'react'
import {Container, Row, Col, Form, Button, ListGroup} from 'react-bootstrap'
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import paginationFactory, { PaginationProvider, PaginationListStandalone, SizePerPageDropdownStandalone, PaginationTotalStandalone   } from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import './workload.css'
import WindowImage from 'images/windowsWorkload.png';
import LinuxImage from 'images/linuxWorkload.png';
import DatePicker from "react-datepicker";
 
import "react-datepicker/dist/react-datepicker.css";



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
  



const Workload = ({ workloadList, onClickButton, onChangeCheckBox, onChangeDatePicker, replicateDate, incrementalDate, isRunReplication, isRunIncremental, isRunIncrementalAndTestFailover, isTestFailover, isAbort, node }) => {


    const inputEl = useRef(null);
    function convertDate(oldDate){
        var convertedDate;
        if (oldDate.substring(11, 13) === "오후"){
            if(oldDate[15] === ":"){
                convertedDate = new Date(oldDate.substring(0, 11) + String(Number(oldDate.substring(14, 15)) + 12) + oldDate.substring(15))
                convertedDate.setHours(convertedDate.getHours()+9);
                convertedDate = getTimeStamp(convertedDate);
            }else{
                convertedDate = new Date(oldDate.substring(0, 11) + String(Number(oldDate.substring(14, 16)) + 12) + oldDate.substring(15))
                convertedDate.setHours(convertedDate.getHours()+9);
                convertedDate = getTimeStamp(convertedDate);
            }
        }else {
            if(oldDate[15] === ":"){
                convertedDate = new Date(oldDate.substring(0, 11) + oldDate.substring(14, 15) + oldDate.substring(15))
                convertedDate.setHours(convertedDate.getHours()+9);
                convertedDate = getTimeStamp(convertedDate);
            }else{
                convertedDate = new Date(oldDate.substring(0, 11) + oldDate.substring(14, 16) + oldDate.substring(15))
                convertedDate.setHours(convertedDate.getHours()+9);
                convertedDate = getTimeStamp(convertedDate);
            }
        }
        return convertedDate.substring(0, 16);
    }

        workloadList.forEach(workload => {
            workload.lastTestedFailoverOn = workload.lastTestedFailoverOn; 
            workload.nextIncrementalOn = workload.lastIncrementalOn;


            if (workload.lastFullOn >= workload.lastIncrementalOn){
                workload.lastReplication = workload.lastFullOn;
            }else{
                workload.lastReplication = workload.lastIncrementalOn;
            }
            if (workload.protectionState === "Aborting"){
                workload.currentState = "Aborting";
            }

        });
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
                    if(row.workflowStep === "Aborting"){
                        return <span style={{"color": "red"}}>취소중</span>
                    }
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
                cell
            )
        },
        {
            dataField: 'lastTestedFailoverOn',
            text: '마지막테스트',
            sort: true,
            searchable: false,
            formatter: (cell, row, index, extraData) => (
                cell
            )
        },
    ];

    const selectRow = {
        mode: 'checkbox',
        clickToSelect: false,
        onSelect: onChangeCheckBox,
        hideSelectAll: true,
        clickToExpand: true
      };

      const expandRow = {
        onlyOneExpanding: true,
        showExpandColumn: false,
        renderer: row => (
            <Container>
                <Form>
                    <Row>
                        <div className="col-5 col-md-3 col-lg-2 info-title">다음 전체복제시간</div>
                        <div className="col-7 col-md-9 col-lg-10 info-contents">{row.scheduleList[0].nextFullReplicationDate.replace("T", " ").substring(0, 19)}</div>  
                        <div className="col-5 col-md-3 col-lg-2 info-title">주기</div>
                        <div className="col-7 col-md-9 col-lg-10 info-contents">{row.scheduleList[0].fullReplicationInterval}분</div>  
                        <div className="col-5 col-md-3 col-lg-2 info-title">마지막 전체복제시간</div>
                        <div className="col-7 col-md-9 col-lg-10 info-contents">{row.scheduleList[0].fullReplicationStartDate.replace("T", " ").substring(0, 19)}</div>  
                    </Row>
                    <Row>
                        <div className="col-5 col-md-3 col-lg-2 info-title">다음 증분복제시간</div>
                        <div className="col-7 col-md-9 col-lg-10 info-contents">{row.scheduleList[0].nextIncrementalReplicationDate.replace("T", " ").substring(0, 19)}</div>  
                        <div className="col-5 col-md-3 col-lg-2 info-title">주기</div>
                        <div className="col-7 col-md-9 col-lg-10 info-contents">{row.scheduleList[0].incrementalReplicationInterval}분</div>  
                        <div className="col-5 col-md-3 col-lg-2 info-title">마지막 증분복제시간</div>
                        <div className="col-7 col-md-9 col-lg-10 info-contents">{row.scheduleList[0].incrementalReplicationStartDate.replace("T", " ").substring(0, 19)}</div>  
                    </Row>  
                    <Row>
                        <div className="info-title">스케줄 설정</div>
                        <DatePicker
                            id="repleDate"
                            selected={replicateDate}
                            onChange={(date, e) => onChangeDatePicker(date, e)}
                        />
                        <DatePicker
                            id="increDate"
                            selected={incrementalDate}
                            onChange={onChangeDatePicker}                            
                        />
                    </Row> 
                    <Button variant="outline-secondary" type="submit" size="lg" block>수정</Button>
                </Form>
            </Container>
        )
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
                                selectRow={selectRow}
                                expandRow={expandRow}
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
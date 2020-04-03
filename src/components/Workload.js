import React, { useRef, Fragment } from 'react'
import {Container, Row, Col, Form, Button, ListGroup} from 'react-bootstrap'
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import paginationFactory, { PaginationProvider, PaginationListStandalone, SizePerPageDropdownStandalone, PaginationTotalStandalone   } from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import './workload.css'
import ScheduleIcon from 'images/schedule_icon.png';
import ConfIcon from 'images/conf_icon.png'
import InfoIcon from 'images/info_icon.png';
import WindowImage from 'images/windowsWorkload.png';
import LinuxImage from 'images/linuxWorkload.png';
import { registerLocale, setDefaultLocale } from "react-datepicker";
import DatePicker from "react-datepicker";
import ko from 'date-fns/locale/ko';
import "react-datepicker/dist/react-datepicker.css";
registerLocale('ko', ko)



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
  



const Workload = ({ workloadList, onClickButton, onChangeCheckBox, onChangeCheckBoxAll, onChangeDatePicker, onChangeScheduleDate, onSubmitScheduleDate, scheduleDateList, isRunReplication, isRunIncremental, isRunIncrementalAndTestFailover, isTestFailover, isCancelFailover, isAbort, node }) => {


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
            dataField: 'scheduleList[0].nextFullReplicationDate',
            text: '전체복제예정',
            sort: true,
            searchable: false,
            formatter: (cell, row, index, extraData) => {
                if(cell === "" || cell === null){
                    return ""
                }
                return (
                    cell.replace("T", " ").substring(0, 19)
                )
                
            }
        },
        {
            dataField: 'scheduleList[0].nextIncrementalReplicationDate',
            text: '증분복제예정',
            sort: true,
            searchable: false,
            formatter: (cell, row, index, extraData) => {
                if(cell === "" || cell === null){
                    return ""
                }
                return (
                    cell.replace("T", " ").substring(0, 19)
                )
                
            }
        },
    ];

    const selectRow = {
        mode: 'checkbox',
        clickToSelect: false,
        onSelect: onChangeCheckBox,
        // onSelect: (row, isSelect, rowIndex, e) => {
        //     console.log(row);
        //     console.log(isSelect);
        //     console.log(rowIndex);
        //     console.log(e);
        // },
        onSelectAll: onChangeCheckBoxAll,
        clickToExpand: true
      };

      const expandRow = {
        onlyOneExpanding: true,
        showExpandColumn: false,
        renderer: row => {
            const repliInterval = row.scheduleList[0].fullReplicationInterval;
            const increInterval = row.scheduleList[0].incrementalReplicationInterval;

            // console.log(row.scheduleList[0].nextFullReplicationDate.replace("T", " ").substring(0, 16));

            let replicateDate, incrementalDate, nextFullDays, nextFullHours, nextFullMinute, nextIncreDays, nextIncreHours, nextIncreMinute, replicationDeletedYn, incrementalDeletedYn;
            scheduleDateList.map((element) => {
                if(element.workloadId === row.workloadId){
                    replicateDate = element.nextFullReplicationDate;
                    incrementalDate = element.nextIncrementalReplicationDate;
                    // replicateDate = new Date();
                    // incrementalDate = new Date();
                    nextFullDays = element.nextFullDays;
                    nextFullHours = element.nextFullHours;
                    nextFullMinute = element.nextFullMinute;
                    nextIncreDays = element.nextIncreDays;
                    nextIncreHours = element.nextIncreHours;
                    nextIncreMinute = element.nextIncreMinute;
                    replicationDeletedYn = element.replicationDeletedYn;
                    incrementalDeletedYn = element.incrementalDeletedYn;
                }

            })

            return(
            <Container>
                    <Row>
                        <div className="col-12 workload-subtitle"><img width="30px" src={InfoIcon} /> 워크로드 정보</div>
                        <Col sm={12} lg={6}>
                            <Row>
                                <div className="col-6 col-md-6 col-lg-5 info-title">현재 상태</div>
                                <div className="col-6 col-md-6 col-lg-7 info-contents">{row.currentState}</div>  
                                <div className="col-6 col-md-6 col-lg-5 info-title">이름</div>
                                <div className="col-6 col-md-6 col-lg-7 info-contents">{row.name}</div>  
                                <div className="col-6 col-md-6 col-lg-5 info-title">OS</div>
                                <div className="col-6 col-md-6 col-lg-7 info-contents">{row.operatingSystem}</div> 
                                <div className="col-6 col-md-6 col-lg-5 info-title">OS버전</div>
                                <div className="col-6 col-md-6 col-lg-7 info-contents">{row.operatingSystemVersion}</div>  
                                <div className="col-6 col-md-6 col-lg-5 info-title">마지막 증분복제</div>
                                <div className="col-6 col-md-6 col-lg-7 info-contents">{row.lastIncrementalOn}</div>   
                                
                            </Row>
                        </Col>
                        <Col sm={12} lg={6}>
                            <Row>
                                <div className="col-6 col-md-6 col-lg-5 info-title">계정</div>
                                <div className="col-6 col-md-6 col-lg-7 info-contents">{row.userName}</div>  
                                <div className="col-6 col-md-6 col-lg-5 info-title">IP주소</div>
                                <div className="col-6 col-md-6 col-lg-7 info-contents">{row.discoveryAddress}</div>  
                                <div className="col-6 col-md-6 col-lg-5 info-title">소속</div>
                                <div className="col-6 col-md-6 col-lg-7 info-contents">{row.companyIdx.companyName}</div>    
                                <div className="col-6 col-md-6 col-lg-5 info-title">마지막 전체복제</div>
                                <div className="col-6 col-md-6 col-lg-7 info-contents">{row.lastFullOn}</div>   
                                <div className="col-6 col-md-6 col-lg-5 info-title">마지막 TestFailOver</div>
                                <div className="col-6 col-md-6 col-lg-7 info-contents">{row.lastTestedFailoverOn}</div> 
                            </Row>
                        </Col>
                        <div className="col-12 workload-subtitle"><img width="30px" src={ScheduleIcon} /> 스케줄 복제정보</div>
                        <Col sm={12} lg={6}>
                            <Row>
                                <div className="col-12 workload-subtitle">전체 복제정보</div>
                                <div className="col-6 col-md-6 col-lg-5 info-title">다음 복제시간</div>
                                <div className="col-6 col-md-6 col-lg-7 info-contents">{row.scheduleList[0].nextFullReplicationDate == null ? "" : row.scheduleList[0].nextFullReplicationDate.replace("T", " ").substring(0, 19)}</div>  
                                <div className="col-6 col-md-6 col-lg-5 info-title">마지막 복제시작시간</div>
                                <div className="col-6 col-md-6 col-lg-7 info-contents">{row.scheduleList[0].fullReplicationStartDate == null ? "" : row.scheduleList[0].fullReplicationStartDate.replace("T", " ").substring(0, 19)}</div>  
                                <div className="col-6 col-md-6 col-lg-5 info-title">마지막 복제종료시간</div>
                                <div className="col-6 col-md-6 col-lg-7 info-contents">{row.scheduleList[0].fullReplicationFinishedDate == null ? "" : row.scheduleList[0].fullReplicationFinishedDate.replace("T", " ").substring(0, 19)}</div> 
                                <div className="col-6 col-md-6 col-lg-5 info-title">주기</div>
                                <div className="col-6 col-md-6 col-lg-7 info-contents">{parseInt(repliInterval/1440)}일 {parseInt(repliInterval%1440/60)}시간 {repliInterval%1440%60}분</div>  
                                
                            </Row>
                        </Col>
                        <Col sm={12} lg={6}>
                            <Row>
                                <div className="col-12 workload-subtitle">증분 복제정보</div>
                                <div className="col-6 col-md-6 col-lg-5 info-title">다음 복제시간</div>
                                <div className="col-6 col-md-6 col-lg-7 info-contents">{row.scheduleList[0].nextIncrementalReplicationDate == null ? "" : row.scheduleList[0].nextIncrementalReplicationDate.replace("T", " ").substring(0, 19)}</div>  
                                <div className="col-6 col-md-6 col-lg-5 info-title">마지막 복제시작시간</div>
                                <div className="col-6 col-md-6 col-lg-7 info-contents">{row.scheduleList[0].incrementalReplicationStartDate == null ? "" : row.scheduleList[0].incrementalReplicationStartDate.replace("T", " ").substring(0, 19)}</div>  
                                <div className="col-6 col-md-6 col-lg-5 info-title">마지막 복제완료시간</div>
                                <div className="col-6 col-md-6 col-lg-7 info-contents">{row.scheduleList[0].incrementalReplicationFinishedDate == null ? "" : row.scheduleList[0].incrementalReplicationFinishedDate.replace("T", " ").substring(0, 19)}</div>  
                                <div className="col-6 col-md-6 col-lg-5 info-title">주기</div>
                                <div className="col-6 col-md-6 col-lg-7 info-contents">{parseInt(increInterval/1440)}일 {parseInt(increInterval%1440/60)}시간 {parseInt(increInterval%1440%60)}분</div>  
                            </Row>
                        </Col>
                    </Row>  
                    <Form onSubmit={(e) => {onSubmitScheduleDate(e, row.workloadId)}}>
                    <Row>
                    <div className="col-12 workload-subtitle"><img width="30px" src={ConfIcon} /> 스케줄 설정</div>
                        <Col sm={12} lg={6}>
                            <Row>
                                <div className="col-12 workload-subtitle">전체 복제</div>
                                <div className="col-6 col-md-6 col-lg-5 info-title">시작시간</div>
                                <div className="col-6 col-md-6 col-lg-7 info-contents">
                                    <DatePicker
                                        className="form-control form-control-sm"
                                        locale="ko"
                                        dateFormat="yyyy-MM-dd HH:mm"
                                        selected={replicateDate}
                                        name="replicateDate"
                                        onChange={date => onChangeDatePicker(date, "repliDate", scheduleDateList, row.workloadId)}
                                        minDate={new Date()}
                                        showTimeSelect
                                        showMonthDropdown
                                        showYearDropdown
                                    />
                                </div> 
                                <div className="col-6 col-md-6 col-lg-5 info-title">주기설정</div>
                                <div className="col-6 col-md-6 col-lg-7 info-contents">
                                    <input className="schedule-input" name="nextFullDays" type="text" maxLength="3" onChange={(e) => onChangeScheduleDate(e, scheduleDateList, row.workloadId)} value={nextFullDays} />일
                                    <input className="schedule-input" name="nextFullHours" type="text" maxLength="2" onChange={(e) => onChangeScheduleDate(e, scheduleDateList, row.workloadId)} value={nextFullHours} />시간
                                    <input className="schedule-input" name="nextFullMinute" type="text" maxLength="2" onChange={(e) => onChangeScheduleDate(e, scheduleDateList, row.workloadId)} value={nextFullMinute} />분                       
                                </div>
                                <div className="col-6 col-md-6 col-lg-5 info-title">사용여부</div>
                                <div className="col-6 col-md-6 col-lg-7 info-contents">
                                    {row.scheduleList[0].fullReplicationDeletedYn === "N"?
                                    <Form.Check 
                                    // onChange={(e) => {checkUserValue(e, true)}}
                                    defaultChecked
                                    style={{"color": "red"}}
                                    type="switch"
                                    id="fullReplicationDeletedYn"
                                    name="fullReplicationDeletedYn"
                                    label="사용하려면 체크"
                                />:
                                    <Form.Check 
                                        // onChange={(e) => {checkUserValue(e, true)}}
                                        style={{"color": "red"}}
                                        type="switch"
                                        id="fullReplicationDeletedYn"
                                        name="fullReplicationDeletedYn"
                                        label="사용하려면 체크"
                                    />
                                    }
                                </div>
                            </Row>
                        </Col>
                        <Col sm={12} lg={6}>                    
                            <Row>
                                <div className="col-12 workload-subtitle">증분 복제</div>
                                <div className="col-6 col-md-6 col-lg-5 info-title">시작시간</div>
                                <div className="col-6 col-md-6 col-lg-7 info-contents">
                                    <DatePicker
                                        className="form-control form-control-sm"
                                        locale="ko"
                                        dateFormat="yyyy-MM-dd HH:mm"
                                        selected={incrementalDate}
                                        name="incrementalDate"
                                        onChange={date => onChangeDatePicker(date, "increDate", scheduleDateList, row.workloadId)}        
                                        minDate={new Date()}
                                        showTimeSelect
                                        showMonthDropdown
                                        showYearDropdown                   
                                    />
                                </div>  
                                <div className="col-6 col-md-6 col-lg-5 info-title">주기설정</div>
                                <div className="col-6 col-md-6 col-lg-7 info-contents">
                                    <input className="schedule-input" name="nextIncreDays" type="text" maxLength="3" onChange={(e) => onChangeScheduleDate(e, scheduleDateList, row.workloadId)} value={nextIncreDays} />일
                                    <input className="schedule-input" name="nextIncreHours" type="text" maxLength="2" onChange={(e) => onChangeScheduleDate(e, scheduleDateList, row.workloadId)} value={nextIncreHours} />시간
                                    <input className="schedule-input" name="nextIncreMinute" type="text" maxLength="2" onChange={(e) => onChangeScheduleDate(e, scheduleDateList, row.workloadId)} value={nextIncreMinute} />분
                                </div>
                                <div className="col-6 col-md-6 col-lg-5 info-title">사용여부</div>
                                <div className="col-6 col-md-6 col-lg-7 info-contents">
                                    {row.scheduleList[0].incrementalReplicationDeletedYn === "N"?
                                    <Form.Check 
                                    // onChange={(e) => {checkUserValue(e, true)}}
                                    defaultChecked
                                    style={{"color": "red"}}
                                    type="switch"
                                    id="incrementalReplicationDeletedYn"
                                    name="incrementalReplicationDeletedYn"
                                    label="사용하려면 체크"
                                />:
                                    <Form.Check 
                                        // onChange={(e) => {checkUserValue(e, true)}}
                                        style={{"color": "red"}}
                                        type="switch"
                                        id="incrementalReplicationDeletedYn"
                                        name="incrementalReplicationDeletedYn"
                                        label="사용하려면 체크"
                                    />
                                    }
                                </div>
                            </Row>
                        </Col>
                        
                    </Row>
                    <Button variant="outline-secondary" type="submit" size="lg" block>스케줄 등록</Button>
                    </Form>
            </Container>
        )
    }

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
        totalSize:  products.length,
        paginationTotalRenderer: customTotal,
        sizePerPageList: [
        {
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
            <Fragment>
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
                    <Fragment>
                    <ToolkitProvider
                        keyField='workloadId'
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
                                bordered={false}
                                { ...toolkitprops.baseProps }
                                { ...paginationTableProps }
                                ref={node}
                                selectRow={selectRow}
                                expandRow={expandRow}
                            />
                            <PaginationTotalStandalone 
                                
                            { ...paginationProps }/>
                            
                            <PaginationListStandalone { ...paginationProps } />
                            </Fragment>
                        )
                      }
                    </ToolkitProvider>
                    
                    </Fragment>
                  )
              }
          </PaginationProvider>
          </Fragment>
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
                        <Button name="removeWorkload" variant="secondary" size="lg" block disabled={!isCancelFailover} onClick={onClickButton} value="CancelFailover">CancelFailover</Button>
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
import React from 'react';
import Workload from '../components/Workload';
import * as service from 'services/posts'
import { connect } from 'react-redux';
import { withAlert } from 'react-alert'
import { confirmAlert } from 'react-confirm-alert'; // Import
import mypic from '../images/ajax-loader.gif';
import LoadingOverlay from 'react-loading-overlay';


class WorkloadContainer extends React.Component {
    constructor(props) {
        super(props);
        this.nodeRef = React.createRef();
        this.state = {
            pending: false,
            isActionLoading: false,
            isOk: false,
            isRunReplication: false,
            isRunIncremental: false,
            isRunIncrementalAndTestFailover: false,
            isTestFailover: false,
            isAbort: false,
            isCancelFailover: false,
            scheduleDateList: [],
            actionResult:{
                actionSuccessCount:0,
                actionFailCount:0
            }
        };
    }

    node = null;
    componentDidMount() {
        const interval = setInterval(this.getWorkloadList, 1000 * 60 * 6); //1000 * 60 = 분입니다.
        this.getWorkloadList(); //workload 리스트 콜
        
    }

    componentWillUnmount(){
        clearInterval(this.interval);
    }   

    componentDidUpdate(prevProps, prevState) {                  //props 변화에 따라 기존 컴포넌트의 업데이트 진행 함수
    }


    getWorkloadList = async () => {  
        try {
            this.setState({
                pending: true,
                isOk: false
            })
            const workloadList = await service.getWorkloadList(this.props.userInfo.X_AUTH_TOKEN);
            let scheduleDateList = [];
            workloadList.data.data.content.forEach(element => {
                let tempReple = {}
                tempReple.workloadId = element.workloadId;
                if(typeof element.scheduleList[0] == "undefined" || element.scheduleList[0] == null || element.scheduleList[0] == ""){
                    let tempSchedule = {
                        scheduleIdx: "",
                        workloadId: "",
                        fullReplicationStartDate: "",
                        fullReplicationFinishedDate: "",
                        incrementalReplicationStartDate: "",
                        incrementalReplicationFinishedDate: "",
                        scheduleStatus: "",
                        schedulePriority: "",
                        nextFullReplicationDate: "",
                        nextIncrementalReplicationDate: "",
                        incrementalReplicationInterval: "",
                        fullReplicationInterval: "",
                        replicationDeletedYn: "Y",
                        incrementalReplicationDeletedYn: "Y",
                        operationUri: ""
                    };
                    
                    element.scheduleList.push(tempSchedule);
                    tempReple.nextFullReplicationDate = new Date();
                    tempReple.nextIncrementalReplicationDate = new Date();
                    tempReple.nextFullDays = 0;
                    tempReple.nextFullHours = 0;
                    tempReple.nextFullMinute = 0;
                    tempReple.nextIncreDays = 0;
                    tempReple.nextIncreHours = 0;
                    tempReple.nextIncreMinute = 0;
                    tempReple.replicationDeletedYn ="Y"
                    tempReple.incrementalReplicationDeletedYn = "Y"
                }else{
                    
                    
                    const repliInterval = element.scheduleList[0].fullReplicationInterval;
                    const increInterval = element.scheduleList[0].incrementalReplicationInterval;
                    //IE도 사용가능하게 datetime2를 변환해야함....
                    if(element.scheduleList[0].nextFullReplicationDate == null){
                        tempReple.nextFullReplicationDate = new Date();
                    }else{
                        const repliDotNumber = element.scheduleList[0].nextFullReplicationDate.indexOf(".");
                        tempReple.nextFullReplicationDate = new Date(element.scheduleList[0].nextFullReplicationDate.substring(0, repliDotNumber).concat(element.scheduleList[0].nextFullReplicationDate.substring(repliDotNumber + 4)).replace("0900", "09:00"));
                    }
                    if(element.scheduleList[0].nextIncrementalReplicationDate == null){
                        tempReple.nextIncrementalReplicationDate = new Date();
                    }else{
                        const increDotNumber = element.scheduleList[0].nextIncrementalReplicationDate.indexOf(".");
                        tempReple.nextIncrementalReplicationDate = new Date(element.scheduleList[0].nextIncrementalReplicationDate.substring(0, increDotNumber).concat(element.scheduleList[0].nextIncrementalReplicationDate.substring(increDotNumber + 4)).replace("0900", "09:00"));
                    }                                        
                    tempReple.nextFullDays = parseInt(repliInterval/1440);
                    tempReple.nextFullHours = parseInt(repliInterval%1440/60);
                    tempReple.nextFullMinute = repliInterval%1440%60;
                    tempReple.nextIncreDays = parseInt(increInterval/1440);
                    tempReple.nextIncreHours = parseInt(increInterval%1440/60);
                    tempReple.nextIncreMinute = increInterval%1440%60;
                    tempReple.fullReplicationDeletedYn = element.scheduleList[0].fullReplicationDeletedYn;
                    tempReple.incrementalReplicationDeletedYn = element.scheduleList[0].incrementalReplicationDeletedYn;
                }
                
                scheduleDateList.push(tempReple);
                // replicateDate.push(new Date(element.scheduleList[0].nextFullReplicationDate));
                // incrementalDate.push(new Date(element.scheduleList[0].nextIncrementalReplicationDate));
            });
            this.setState({
                workloadList: workloadList.data.data.content,
                scheduleDateList: scheduleDateList,
                isOk: true
            })
        } catch(e) {
        }
    }

    postWorkloadAction  = async (serverHost, actionUrl, workloadId) => {  
        try {

            const postResult = await service.postWorkloadAction(this.props.userInfo.X_AUTH_TOKEN, serverHost, actionUrl, workloadId);
            if(postResult.data.success){
                this.setState({
                    actionResult:{
                        ...this.state.actionResult,
                        actionSuccessCount: this.state.actionResult.actionSuccessCount + 1
                    }
                })
            }else{
                this.setState({
                    actionResult:{
                        ...this.state.actionResult,
                        actionFailCount: this.state.actionResult.actionFailCount + 1
                    }
                })       
            }
        } catch(e) {
        }
    }

    postWorkloadSchedule = async (data) => {
        try {
            const postResult = await service.postWorkloadSchedule(data, this.props.userInfo.X_AUTH_TOKEN);
            if(postResult.data.success){
                this.props.alert.show('정상처리 되었습니다.', {type: 'success'});
            }else{
                this.props.alert.show('처리되지 않았습니다.', {type: 'error'});     
            }
        } catch(e) {
        }
        
    }

    //체크박스 전체선택 클릭시 이벤트
    handleCheckBoxAllClick = (isSelect, rows, e) => {

        let runReplicationCount = 0, runIncrementalCount = 0, runIncrementalAndTestFailoverCount = 0, testFailoverCount = 0, abortCount = 0, cancelFailoverCount = 0;
        let isRunIncremental = false, isRunReplication = false, isRunIncrementalAndTestFailover = false, isTestFailover = false, isAbort = false, isCancelFailover = false;
        let checkboxCheckedCount = 0;

        if(isSelect === false){
            rows.forEach(rowValue => {
                rowValue.checked = false;
            });
        }else {
            rows.forEach(rowValue =>{
                rowValue.checked = true;
                checkboxCheckedCount++;
                rowValue.availableActionList.forEach(rowAvailableAction => {
                    if(rowAvailableAction.name ===  "RunReplication"){
                        runReplicationCount++;
                    }
                    if(rowAvailableAction.name === "RunIncremental"){
                        runIncrementalCount++;
                    }
                    if(rowAvailableAction.name === "RunIncrementalAndTestFailover"){
                        runIncrementalAndTestFailoverCount++;
                    }
                    if(rowAvailableAction.name === "TestFailover"){
                        testFailoverCount++;
                    }
                    if(rowAvailableAction.name === "Abort"){
                        abortCount++;
                    }
                    if(rowAvailableAction.name === "CancelFailover"){
                        cancelFailoverCount++;
                    }
                })
            });
    
            if(runReplicationCount === checkboxCheckedCount){
                isRunReplication = true;
            }else{
                isRunReplication = false;
            }
            if(runIncrementalCount === checkboxCheckedCount){
                isRunIncremental = true;
            }else{
                isRunIncremental = false;
            }
            if(runIncrementalAndTestFailoverCount === checkboxCheckedCount){
                isRunIncrementalAndTestFailover = true;
            }else{
                isRunIncrementalAndTestFailover = false;
            }
            if(testFailoverCount === checkboxCheckedCount){
                isTestFailover = true;
            }else{
                isTestFailover = false;
            }
            if(abortCount === checkboxCheckedCount){
                isAbort = true;
            }else{
                isAbort = false;
            }
            if(cancelFailoverCount === checkboxCheckedCount){
                isCancelFailover = true;
            }else{
                isCancelFailover = false;
            }
    
            if(checkboxCheckedCount === 0){
                isRunReplication = false;
                isRunIncremental = false;
                isRunIncrementalAndTestFailover = false;
                isTestFailover = false;
                isAbort = false;
                isCancelFailover = false;
            }
        }

        this.setState({ 
            isRunReplication: isRunReplication,
            isRunIncremental: isRunIncremental,
            isRunIncrementalAndTestFailover: isRunIncrementalAndTestFailover,
            isTestFailover: isTestFailover,
            isAbort: isAbort,
            isCancelFailover: isCancelFailover
        })
    }


    //체크 박스 클릭시 이벤트
    handleCheckBoxClick = (row, isSelect, rowIndex, e) => {

        let runReplicationCount = 0, runIncrementalCount = 0, runIncrementalAndTestFailoverCount = 0, testFailoverCount = 0, abortCount = 0, cancelFailoverCount = 0;
        let isRunIncremental = false, isRunReplication = false, isRunIncrementalAndTestFailover = false, isTestFailover = false, isAbort = false, isCancelFailover = false;
        let checkboxCheckedCount = 0;
        if(row.checked === true){
            row.checked = false;
        }else{
            row.checked = true;
        }
        const rows = this.nodeRef.current.table.props.data;


        rows.forEach(rowValue =>{
            if(rowValue.checked === true){
                checkboxCheckedCount++;
                rowValue.availableActionList.forEach(rowAvailableAction => {
                    if(rowAvailableAction.name ===  "RunReplication"){
                        runReplicationCount++;
                    }
                    if(rowAvailableAction.name === "RunIncremental"){
                        runIncrementalCount++;
                    }
                    if(rowAvailableAction.name === "RunIncrementalAndTestFailover"){
                        runIncrementalAndTestFailoverCount++;
                    }
                    if(rowAvailableAction.name === "TestFailover"){
                        testFailoverCount++;
                    }
                    if(rowAvailableAction.name === "Abort"){
                        abortCount++;
                    }
                    if(rowAvailableAction.name === "CancelFailover"){
                        cancelFailoverCount++;
                    }
                })
            }
        });

        if(runReplicationCount === checkboxCheckedCount){
            isRunReplication = true;
        }else{
            isRunReplication = false;
        }
        if(runIncrementalCount === checkboxCheckedCount){
            isRunIncremental = true;
        }else{
            isRunIncremental = false;
        }
        if(runIncrementalAndTestFailoverCount === checkboxCheckedCount){
            isRunIncrementalAndTestFailover = true;
        }else{
            isRunIncrementalAndTestFailover = false;
        }
        if(testFailoverCount === checkboxCheckedCount){
            isTestFailover = true;
        }else{
            isTestFailover = false;
        }
        if(abortCount === checkboxCheckedCount){
            isAbort = true;
        }else{
            isAbort = false;
        }
        if(cancelFailoverCount === checkboxCheckedCount){
            isCancelFailover = true;
        }else{
            isCancelFailover = false;
        }

        if(checkboxCheckedCount === 0){
            isRunReplication = false;
            isRunIncremental = false;
            isRunIncrementalAndTestFailover = false;
            isTestFailover = false;
            isAbort = false;
            isCancelFailover = false;
        }


        this.setState({ 
            isRunReplication: isRunReplication,
            isRunIncremental: isRunIncremental,
            isRunIncrementalAndTestFailover: isRunIncrementalAndTestFailover,
            isTestFailover: isTestFailover,
            isAbort: isAbort,
            isCancelFailover: isCancelFailover
        })


    }


    //스케줄 주기 설정 변경 이벤트
    handleChangeScheduleDate = (e, scheduleDateList, workloadId) => {
        const re = /[^0-9]/g;
        
        if(re.test(e.target.value))
            return;

        if(e.target.value.charAt(0)==="0" && e.target.value.length >= 2){
            e.target.value = e.target.value.substring(1, e.target.value.length);
        }


        scheduleDateList.forEach(element => {
            if(element.workloadId === workloadId){
                if(e.target.name === "nextFullDays"){
                    element.nextFullDays = e.target.value;
                }else if(e.target.name === "nextFullHours"){
                    element.nextFullHours = e.target.value;
                }else if(e.target.name === "nextFullMinute"){
                    element.nextFullMinute = e.target.value;
                }else if(e.target.name === "nextIncreDays"){
                    element.nextIncreDays = e.target.value;
                }else if(e.target.name === "nextIncreHours"){
                    element.nextIncreHours = e.target.value;
                }else if(e.target.name === "nextIncreMinute"){
                    element.nextIncreMinute = e.target.value;
                }
            }
        });
        this.setState({
            scheduleDateList: scheduleDateList
        });

    }
    
    //스케줄 변경 Submit 버튼 클릭시 이벤트
    handleSubmitScheduleDate = (e, workloadId) => {
        e.preventDefault();
        let data = {};
        let formData = e.target;
        //전체 복제 사용 체크시 검증
        if(formData.fullReplicationDeletedYn.checked === true){
            if(formData.nextFullDays.value === "0" && formData.nextFullHours.value === "0" && formData.nextFullMinute.value === "0"){
                formData.nextFullDays.focus();
                this.props.alert.show('주기를 설정해주세요.', {type: 'error'});  
                return;
            }
            data.nextFullReplicationDate = formData.replicateDate.value;
            data.fullReplicationDeletedYn = "N"
            data.fullReplicationInterval = parseInt(formData.nextFullDays.value) * 1440 + parseInt(formData.nextFullHours.value) * 60 + parseInt(formData.nextFullMinute.value);
        }else{
            data.fullReplicationDeletedYn = "Y"
        }

        //증분 복제 사용 체크시 검증
        if(formData.incrementalReplicationDeletedYn.checked === true){
            if(formData.nextIncreDays.value === "0" && formData.nextIncreHours.value === "0" && formData.nextIncreMinute.value === "0"){
                formData.nextIncreDays.focus();
                this.props.alert.show('주기를 설정해주세요.', {type: 'error'});  
                return;
            }
            data.nextIncrementalReplicationDate = formData.incrementalDate.value;
            data.incrementalReplicationDeletedYn = "N"
            data.incrementalReplicationInterval = parseInt(formData.nextIncreDays.value) * 1440 + parseInt(formData.nextIncreHours.value) * 60 + parseInt(formData.nextIncreMinute.value);
        }else{
            data.incrementalReplicationDeletedYn = "Y"
        }

        data.workloadId = workloadId;


        confirmAlert({
            // title: '작업하시겠습니까?',
            message: '진행하시려면 예를 클릭하세요.',
            buttons: [
              {
                label: '예',
                onClick: async () => {
                    this.setState({
                        pending: true,
                        isActionLoading: true
                    });

                    await this.postWorkloadSchedule(data);
                    this.setState({
                        pending: false,
                        isActionLoading: false
                    })
                }
              },
              {
                label: '아니오',
                onClick: () => {}
              }
            ]
        });

    };

    handleChangeDatePicker = (date, dateType, scheduleDateList, workloadId) => {
        if(dateType === "repliDate"){
            scheduleDateList.forEach(element => {
                if(element.workloadId === workloadId){
                    element.nextFullReplicationDate = date;
                }
            });
            this.setState({
                scheduleDateList: scheduleDateList
            });
        }else if(dateType === "increDate"){
            scheduleDateList.forEach(element => {
                if(element.workloadId === workloadId){
                    element.nextIncrementalReplicationDate = date;
                }
            });
            this.setState({
                scheduleDateList: scheduleDateList
            });
        }
        
    }

    handleButtonClick = async (e) => {  //버튼 선택에따른 이벤트

        const rows = this.nodeRef.current.table.props.data;
        const checkedList = []
        var targetValue = e.target.value;
        rows.forEach(row => {
            if(row.checked === true){
                checkedList.push(row);
            }
        })


        confirmAlert({
            // title: '작업하시겠습니까?',
            message: '진행하시려면 예를 클릭하세요.',
            buttons: [
              {
                label: '예',
                onClick: async () => {
                    this.setState({
                        pending: true,
                        isActionLoading: true
                    });

                    const lastPromise = checkedList.map( async (checkedValue) => {
                        const promises = checkedValue.availableActionList.map( async (availableAction) =>  {
                            if(availableAction.name === targetValue){
                                const actionUrl = availableAction.uri;
                                const serverHost = checkedValue.serverHost;
                                const workloadId = checkedValue.workloadId;
                                await this.postWorkloadAction(serverHost, actionUrl, workloadId);
                            }
                        })
                        await Promise.all(promises);
                        
                        
                    })

                    await Promise.all(lastPromise);
                    this.props.alert.show('성공:' + this.state.actionResult.actionSuccessCount + '실패:' + this.state.actionResult.actionFailCount, {type: 'info'});
                    await this.getWorkloadList();
                    this.setState({
                        actionResult: {
                            actionSuccessCount: 0,
                            actionFailCount: 0
                        },
                        pending: false,
                        isActionLoading: false
                    })
                }
              },
              {
                label: '아니오',
                onClick: () => {}
              }
            ]
        });


        this.setState({ 
            isRunReplication: false,
            isRunIncremental: false,
            isRunIncrementalAndTestFailover: false,
            isTestFailover: false,
            isCancelFailover: false,
            isAbort: false
        })


    };

    render(){
        if( this.state.isOk ){
            return (
                <LoadingOverlay
                    active={this.state.isActionLoading}
                    spinner
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
                    text='잠시만 기다려주세요...'
                    >
                    <Workload 
                        workloadList={this.state.workloadList} 
                        checkboxes={this.state.checkboxes}
                        onChangeCheckBox={this.handleCheckBoxClick}
                        onChangeCheckBoxAll={this.handleCheckBoxAllClick}
                        onClickButton={this.handleButtonClick}
                        onChangeDatePicker={this.handleChangeDatePicker}
                        onChangeScheduleDate={this.handleChangeScheduleDate}
                        onSubmitScheduleDate={this.handleSubmitScheduleDate}
                        isRunReplication={this.state.isRunReplication}
                        isRunIncremental={this.state.isRunIncremental}
                        isRunIncrementalAndTestFailover={this.state.isRunIncrementalAndTestFailover}
                        isTestFailover={this.state.isTestFailover}
                        isCancelFailover={this.state.isCancelFailover}
                        isAbort={this.state.isAbort}
                        scheduleDateList={this.state.scheduleDateList}
                        node={this.nodeRef} />
                </LoadingOverlay>
            )
        }else{
            return (
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
            );
        }
    }


}

let mapStateToProps = (state) => {
    return {
        userInfo: state.userLogin.data
    };
}

export default connect(mapStateToProps)(withAlert()(WorkloadContainer));
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
            replicateDate: new Date(),
            incrementalDate: new Date(),
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
            this.setState({
                workloadList: workloadList.data.data.content,
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

    handleCheckBoxClick = (row, isSelect, rowIndex, e) => {

        let runReplicationCount = 0, runIncrementalCount = 0, runIncrementalAndTestFailoverCount = 0, testFailoverCount = 0, abortCount = 0;
        let isRunIncremental = false, isRunReplication = false, isRunIncrementalAndTestFailover = false, isTestFailover = false, isAbort = false;
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

        if(checkboxCheckedCount === 0){
            isRunReplication = false;
            isRunIncremental = false;
            isRunIncrementalAndTestFailover = false;
            isTestFailover = false;
            isAbort = false;
        }


        this.setState({ 
            isRunReplication: isRunReplication,
            isRunIncremental: isRunIncremental,
            isRunIncrementalAndTestFailover: isRunIncrementalAndTestFailover,
            isTestFailover: isTestFailover,
            isAbort: isAbort
        })


    }
    handleChangeDatePicker = (date, e) => {
        console.log(date);

        this.setState({
            replicateDate: date
        });
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
            isTestFailover: false
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
                        onClickButton={this.handleButtonClick}
                        onChangeDatePicker={this.handleChangeDatePicker}
                        isRunReplication={this.state.isRunReplication}
                        isRunIncremental={this.state.isRunIncremental}
                        isRunIncrementalAndTestFailover={this.state.isRunIncrementalAndTestFailover}
                        isTestFailover={this.state.isTestFailover}
                        isAbort={this.state.isAbort}
                        replicateDate={this.state.replicateDate}
                        incrementalDate={this.state.incrementalDate}
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
import React from 'react';
import Workload from '../components/Workload';
import * as service from 'services/posts'
import { connect } from 'react-redux';
import { withAlert } from 'react-alert'
import { confirmAlert } from 'react-confirm-alert'; // Import
import mypic from '../images/ajax-loader.gif';


class WorkloadContainer extends React.Component {
    constructor(props) {
        super(props);
        this.nodeRef = React.createRef();
        this.state = {
            pending: false,
            isOk: false,
            isRunReplication: false,
            isRunIncremental: false,
            isRunIncrementalAndTestFailover: false,
            isTestFailover: false,
            isAbort: false,
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
        // console.log(this.props.userInfo.X_AUTH_TOKEN);
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
            console.log('요청이 완료 된 다음에 실행됨')
        } catch(e) {
            console.log('에러가 발생!');
        }
    }

    postWorkloadAction  = async (serverHost, actionUrl) => {  
        console.log(actionUrl);
        try {

            const postResult = await service.postWorkloadAction(this.props.userInfo.X_AUTH_TOKEN, serverHost, actionUrl);
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

            console.log('요청이 완료 된 다음에 실행됨')
        } catch(e) {
            console.log('에러가 발생!');
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
                    console.log(checkedList);
                    this.setState({
                        pending: true,
                        isOk: false
                    });

                    const lastPromise = checkedList.map( async (checkedValue) => {
                        const promises = checkedValue.availableActionList.map( async (availableAction) =>  {
                            if(availableAction.name === targetValue){
                                const actionUrl = availableAction.uri;
                                const serverHost = checkedValue.serverHost;
                                await this.postWorkloadAction(serverHost, actionUrl);
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
                        isOk: true
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
        // console.log(post[0].detail);
        // console.log(this.handleCheckboxClick);
        if( this.state.isOk ){
            return (
                    <Workload 
                        workloadList={this.state.workloadList} 
                        checkboxes={this.state.checkboxes}
                        onChangeCheckBox={this.handleCheckBoxClick}
                        onClickButton={this.handleButtonClick}
                        isRunReplication={this.state.isRunReplication}
                        isRunIncremental={this.state.isRunIncremental}
                        isRunIncrementalAndTestFailover={this.state.isRunIncrementalAndTestFailover}
                        isTestFailover={this.state.isTestFailover}
                        isAbort={this.state.isAbort}
                        node={this.nodeRef} />
            )
        }else{
            return (
                    <div className="loding-div">
                        <img  alt="로딩중" src={mypic}/>
                    </div>
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
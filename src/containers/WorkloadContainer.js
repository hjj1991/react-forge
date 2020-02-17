import React from 'react';
import Workload from '../components/Workload';
import * as service from 'services/posts'
import { connect } from 'react-redux';
import mypic from '../images/ajax-loader.gif';


class WorkloadContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pending: false,
            isOk: false,
            checkboxes: [],
            isRunReplication: false,
            isRunIncremental: false,
            isRunIncrementalAndTestFailover: false,
            isTestFailover: false,
            isAbort: false
        };
    }
    componentDidMount() {
        const interval = setInterval(this.getWorkloadList, 1000 * 60 * 6); //1000 * 60 = 분입니다.
        this.getWorkloadList(); //workload 리스트 콜
        
    }

    componentWillUnmount(){
        clearInterval(this.interval);
    }   

    componentDidUpdate(prevProps, prevState) {                  //props 변화에 따라 기존 컴포넌트의 업데이트 진행 함수
        // console.log(this.state.checkboxes !== prevState.checkboxes)
        // console.log(prevState);
        console.log(prevState);
        console.log(this.state);
        if(this.state.checkboxes !== prevState.checkboxes){
            this.getWorkloadList();
        }
        // if (this.props.page !== prevProps.page || this.props.searchTarget !== prevProps.searchTarget || this.props.searchKeyword !== prevProps.searchKeyword){
        //     this.getWorkloadList();
        // }
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
                workloadList: workloadList.data.data.Workloads,
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
            this.setState({
                pending: true,
                isOk: false
            })
            await service.postWorkloadAction(this.props.userInfo.X_AUTH_TOKEN, serverHost, actionUrl);
            this.setState({
                isOk: true
            })
            console.log('요청이 완료 된 다음에 실행됨')
        } catch(e) {
            console.log('에러가 발생!');
        }
    }


    
    handleCheckBoxClick = (e, availableTransitions) => {  //체크박스 선택에따른 이벤트
        const checkboxes = this.state.checkboxes;
        let index;
        let runReplicationCount = 0;
        let runIncrementalCount = 0;
        let runIncrementalAndTestFailoverCount = 0;
        let testFailoverCount = 0;
        let abortCount = 0;
        let isRunIncremental, isRunReplication, isRunIncrementalAndTestFailover, isTestFailover, isAbort = false;


        if(e.target.checked){      //체크 된 값
            checkboxes.push(availableTransitions);
        }else{  //체크 해제된 값
            // index = checkboxes.indexOf(e.target.value); //타겟값으로 배열의 index값을 구한다.
            index = checkboxes.indexOf(availableTransitions); //타겟값으로 배열의 index값을 구한다.
            checkboxes.splice(index, 1);                //해당 index값으로 체크박스 배열의 해당 값을 삭제
        }

        checkboxes.forEach(checkbox => { 
            checkbox.forEach(jsonValue => {
                if(jsonValue.Name ==  "RunReplication"){
                    runReplicationCount++;
                }
                if(jsonValue.Name == "RunIncremental"){
                    runIncrementalCount++;
                }
                if(jsonValue.Name == "RunIncrementalAndTestFailover"){
                    runIncrementalAndTestFailoverCount++;
                }
                if(jsonValue.Name == "TestFailover"){
                    testFailoverCount++;
                }
                if(jsonValue.Name == "Abort"){
                    abortCount++;
                }
            });

            if(runReplicationCount == checkboxes.length){
                isRunReplication = true;
            }else{
                isRunReplication = false;
            }
            if(runIncrementalCount == checkboxes.length){
                isRunIncremental = true;
            }else{
                isRunIncremental = false;
            }
            if(runIncrementalAndTestFailoverCount == checkboxes.length){
                isRunIncrementalAndTestFailover = true;
            }else{
                isRunIncrementalAndTestFailover = false;
            }
            if(testFailoverCount == checkboxes.length){
                isTestFailover = true;
            }else{
                isTestFailover = false;
            }
            if(abortCount == checkboxes.length){
                isAbort = true;
            }else{
                isAbort = false;
            }
        });

        this.setState({ 
            checkboxes: checkboxes,
            isRunReplication: isRunReplication,
            isRunIncremental: isRunIncremental,
            isRunIncrementalAndTestFailover: isRunIncrementalAndTestFailover,
            isTestFailover: isTestFailover,
            isAbort: isAbort
        })

        console.log(checkboxes);
        // console.log(e.target);
        // console.log(e.workloadBox);
    };

    handleButtonClick = (e) => {  //버튼 선택에따른 이벤트

        const checkedList = this.state.checkboxes;
        console.log(e.target.value);
        if(e.target.value == "runReplication"){
            checkedList.forEach(checkbox => {
                checkbox.forEach(jsonValue => {
                    if(jsonValue.Name == "RunReplication"){
                        // jsonValue.Uri
                        const actionUrl = jsonValue.Uri;        //액션 URL VALUE 값
                        const serverHost = checkbox.serverHost; //워크로드가 해당되어있는 api 서버 URL            
                        this.postWorkloadAction(serverHost, actionUrl);
                        
                    }
                })

            })
        }else if(e.target.value == "runIncremental"){
            checkedList.forEach(checkbox => {
                checkbox.forEach(jsonValue => {
                    if(jsonValue.Name == "RunIncremental"){
                        // jsonValue.Uri
                        const actionUrl = jsonValue.Uri;        //액션 URL VALUE 값
                        const serverHost = checkbox.serverHost; //워크로드가 해당되어있는 api 서버 URL            
                        this.postWorkloadAction(serverHost, actionUrl);
                        
                    }
                })

            })
        }else if(e.target.value == "runIncrementalAndTestFailover"){
            checkedList.forEach(checkbox => {
                checkbox.forEach(jsonValue => {
                    if(jsonValue.Name == "RunIncrementalAndTestFailover"){
                        // jsonValue.Uri
                        const actionUrl = jsonValue.Uri;        //액션 URL VALUE 값
                        const serverHost = checkbox.serverHost; //워크로드가 해당되어있는 api 서버 URL            
                        this.postWorkloadAction(serverHost, actionUrl);
                        
                    }
                })

            })
        }else if(e.target.value == "testFailover"){
            checkedList.forEach(checkbox => {
                checkbox.forEach(jsonValue => {
                    if(jsonValue.Name == "TestFailover"){
                        // jsonValue.Uri
                        const actionUrl = jsonValue.Uri;        //액션 URL VALUE 값
                        const serverHost = checkbox.serverHost; //워크로드가 해당되어있는 api 서버 URL            
                        this.postWorkloadAction(serverHost, actionUrl);
                        
                    }
                })

            })
        }else if(e.target.value == "abort"){
            checkedList.forEach(checkbox => {
                checkbox.forEach(jsonValue => {
                    if(jsonValue.Name == "Abort"){
                        // jsonValue.Uri
                        const actionUrl = jsonValue.Uri;        //액션 URL VALUE 값
                        const serverHost = checkbox.serverHost; //워크로드가 해당되어있는 api 서버 URL            
                        this.postWorkloadAction(serverHost, actionUrl);
                        
                    }
                })

            })
        }


        this.setState({ 
            checkboxes: [],
            isRunReplication: false,
            isRunIncremental: false,
            isRunIncrementalAndTestFailover: false,
            isTestFailover: false
        })

        console.log("훠이후이");
        // const { ButtonActions } = this.props;
        // ButtonActions.buttonItem(e);
        // console.log(this.props.checkedListValue);
        // window.location.assign('/workloadReplication');
        // this.setState({referrer: '/workloadReplication', clickE: e.target.value});


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
                        isAbort={this.state.isAbort} />
            )
        }else{
            return (
                    <div style={{"textAlign": "center"}}>
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

export default connect(
    mapStateToProps,     
)(WorkloadContainer);;
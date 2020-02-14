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
            isTestFailover: false
        };
    }
    componentDidMount() {
        this.getPost(); //workload 리스트 콜
        
    }

    getPost = async () => {  
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


    
    handleCheckBoxClick = (e, availableTransitions) => {  //체크박스 선택에따른 이벤트
        const checkboxes = this.state.checkboxes;
        let index;
        let runReplicationCount = 0;
        let runIncrementalCount = 0;
        let runIncrementalAndTestFailoverCount = 0;
        let testFailoverCount = 0;
        let isRunIncremental, isRunReplication, isRunIncrementalAndTestFailover, isTestFailover = false;


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
            });

            if(runReplicationCount == checkboxes.length){
                isRunReplication = true;
            }
            if(runIncrementalCount == checkboxes.length){
                isRunIncremental = true;
            }
            if(runIncrementalAndTestFailoverCount == checkboxes.length){
                isRunIncrementalAndTestFailover = true;
            }
            if(testFailoverCount == checkboxes.length){
                isTestFailover = true;
            }
        });

        this.setState({ 
            checkboxes: checkboxes,
            isRunReplication: isRunReplication,
            isRunIncremental: isRunIncremental,
            isRunIncrementalAndTestFailover: isRunIncrementalAndTestFailover,
            isTestFailover: isTestFailover
        })

        console.log(checkboxes);
        // console.log(e.target);
        // console.log(e.workloadBox);
    };

    handleButtonClick = (e) => {  //버튼 선택에따른 이벤트

        const checkedList = this.state.checkboxes;

        if(e.target.value == "runReplication"){
            checkedList.forEach(checkbox => {
                checkbox.forEach(jsonValue => {
                    if(jsonValue.Name == "runReplication"){
                        // jsonValue.Uri
                    }
                })

            })
        }else if(e.target.value == "runIncremental"){

        }else if(e.target.value == "runIncrementalAndTestFailover"){

        }else if(e.target.value == "testFailover"){

        }


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
                        isTestFailover={this.state.isTestFailover} />
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
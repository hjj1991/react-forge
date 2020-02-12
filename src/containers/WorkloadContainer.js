import React from 'react';
import Workload from '../components/Workload';
import * as service from 'services/posts'
import mypic from '../images/ajax-loader.gif';


class WorkloadContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pending: false,
            isOk: false,
        };
    }
    componentDidMount() {
        this.getPost(); //workload 리스트 콜
        
    }

    getPost = async () => {  
        try {
            const workloadList = await service.getWorkloadList();
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
        console.log(availableTransitions);
    };

    handleButtonClick = (e) => {  //버튼 선택에따른 이벤트
        console.log("훠이후이");
        // const { ButtonActions } = this.props;
        // ButtonActions.buttonItem(e);
        // console.log(this.props.checkedListValue);
        // window.location.assign('/workloadReplication');
        // this.setState({referrer: '/workloadReplication', clickE: e.target.value});


    };

    render(){
        // console.log(post[0].detail);
        console.log(this.handleCheckboxClick);
        if( this.state.isOk ){
            return (
                    <Workload 
                        workloadList={this.state.workloadList} 
                        onClickCheckBox={this.handleCheckBoxClick}
                        onClickButton={this.handleButtonClick} />
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


export default WorkloadContainer;
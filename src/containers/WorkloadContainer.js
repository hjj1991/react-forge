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
        // this.getWorkloadList();
        // test();
        // const { PostActions } = this.props;
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


      render(){
        // console.log(post[0].detail);
          if( this.state.isOk ){
            return (
              <Workload 
                workloadList = {this.state.workloadList} 
                onChange={this.handleCheckboxClick}
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

      handleCheckboxClick = (e) => {  //체크박스 선택에따른 이벤트
        const { CheckboxActions } = this.props;
        CheckboxActions.checkedItem(e);
      };

      handleButtonClick = (e) => {  //버튼 선택에따른 이벤트
        // const { ButtonActions } = this.props;
        // ButtonActions.buttonItem(e);
        // console.log(this.props.checkedListValue);
        // window.location.assign('/workloadReplication');
        // this.setState({referrer: '/workloadReplication', clickE: e.target.value});


      };

}


export default WorkloadContainer;
// export default Workloads;
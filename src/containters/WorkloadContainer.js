import React from 'react';
import Workload from '../components/Workload';
import { Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as postActions from '../store/modules/post';
import * as checkboxActions from '../store/modules/checkbox';
import * as buttonActions from '../store/modules/button';
import mypic from '../images/ajax-loader.gif';


class Workloads extends React.Component {

      constructor(props) {
          super(props);
          this.state = {
              referrer: null
          };
      }
      componentDidMount() {
        // this.getWorkloadList();
        // test();
        // const { PostActions } = this.props;
        this.getPost('/protectionservices/Workloads/'); //workload 리스트 콜
        
      }

      getPost = async (postId) => {
        const { PostActions } = this.props;

        try {
            await PostActions.getPost(postId);
            console.log('요청이 완료 된 다음에 실행됨')
        } catch(e) {
            console.log('에러가 발생!');
        }
    }


      render(){
        const { post, error, loading, isLoading, checkedListValue, isRunReplication, isRunTestFailover, checkboxList } = this.props;
        console.log("팬딩여부:" + loading);
        console.log("로딩여부:" + isLoading);
        console.log("에러여부:" + error);
        // console.log(post[0].detail);

        const {referrer, clickE} = this.state;
        if (referrer){
          return <Redirect to={{
                            pathname: referrer,
                            state: {
                              checkedListValue: checkedListValue, 
                              clickE: clickE
                            }
          }} />;
        } 

          if( isLoading ){
            return (
              <Workload 
                post = {post} 
                onChange={this.handleCheckboxClick}
                onClickButton={this.handleButtonClick}
                checkedListValue={checkedListValue}
                isRunReplication={isRunReplication}
                isRunTestFailover={isRunTestFailover}
                checkboxList={checkboxList}  />
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
        this.setState({referrer: '/workloadReplication', clickE: e.target.value});


      };

}


export default connect(
    (state) => ({
        post: state.post.data,
        loading: state.post.pending,
        error: state.post.error,
        isLoading: state.post.isLoading,
        checkedListValue: state.checkbox.checkedListValue,
        checkboxList: state.checkbox.checkboxList,
        isRunReplication: state.checkbox.isRunReplication,
        isRunTestFailover: state.checkbox.isRunTestFailover
    }),
    (dispatch) => ({
        PostActions: bindActionCreators(postActions, dispatch),
        CheckboxActions: bindActionCreators(checkboxActions, dispatch),
        ButtonActions: bindActionCreators(buttonActions, dispatch)
    })
)(Workloads);
// export default Workloads;
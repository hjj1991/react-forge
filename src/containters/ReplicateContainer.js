import React from 'react';
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Modal from '../components/Modal/Modal';
import Col from 'react-bootstrap/Col'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as postRepleActions from '../store/modules/postReple';
import mypic from '../images/ajax-loader.gif';


class ReplicateContainer extends React.Component {

    componentDidMount() {
          
    }

    getPost = async (postId, replType) => {
        const { PostRepleActions } = this.props;

        try {
            await PostRepleActions.getPost(postId, replType);
            console.log('요청이 완료 된 다음에 실행됨')
        } catch(e) {
            console.log('에러가 발생!');
        }
    }

    handleButtonClick = (e) => {  //버튼 선택에따른 이벤트
        console.log("하위하위");
        console.log(this.props.checkedListValue);
        console.log(e.target.value);
        // window.location.assign('/workloadReplication');
        this.getPost(this.props.checkedListValue.checkedListValue, e.target.value); //workload 리스트 콜


    };

    handleRepleOk = (e) => {
        window.location.assign('/Workloads');
    };
        
    render(){
        console.log(this.props);
        const { error, pending, isLoadingReple} = this.props;
        var isModalOpen = false;
        
        console.log("팬딩여부:" + pending);
        console.log("로딩여부:" + isLoadingReple);
        console.log("에러여부:" + error);
        // console.log(post[0].detail);

        if(isLoadingReple === true){
            isModalOpen = true;
            //window.location.assign('/Workloads');
        }
        if(pending === true){
            return (
                <div style={{"textAlign": "center"}}>
                <img  alt="로딩중" src={mypic}/>
              </div>
            )
        }

        if(this.props.checkedListValue.clickE === 'Replication'){
            return (
                <div style={{"margin": "10px auto 0px auto", "width": "80%"}}>
                    <p style={{"fontSize": "40px"}}><b>Run Replication</b></p>
                        <Row style={{"margin-bottom": "20px"}}>
                            <Col style={{"text-align": "center"}}>
                                <Button name="configuration" variant="outline-secondary" size="lg" style={{ "margin": "0 auto 0 auto"}} value="RunReplication" onClick={this.handleButtonClick} block >Run Replication</Button>
                            </Col>
                        </Row>
                        <Row style={{"margin-bottom": "20px"}}>
                            <Col style={{"text-align": "center"}}>
                                <Button name="runReplication" variant="outline-secondary" size="lg" style={{ "margin": "0 auto 0 auto"}} value="RunIncremental" onClick={this.handleButtonClick} block >Run Incremental</Button>
                            </Col>
                        </Row>
                        <Row style={{"margin-bottom": "20px"}}>
                            <Col style={{"text-align": "center"}}>
                                <Button name="testFailover" variant="outline-secondary" size="lg" style={{ "margin": "0 auto 0 auto"}} value="RunIncrementalAndTestFailover" onClick={this.handleButtonClick} block>Run IncrementalAndTestFailover</Button>
                            </Col> 
                        </Row>
                        <Modal isOpen={isModalOpen} isOk={this.handleRepleOk}/>
                </div>
                );
        }
        else{
            return (
                <div style={{"margin": "10px auto 0px auto", "width": "80%"}}>
                    <p style={{"fontSize": "40px"}}><b>Run Test Failover</b></p>
                        <Row style={{"margin-bottom": "20px"}}>
                            <Col style={{"text-align": "center"}}>
                                <Button name="configuration" variant="outline-secondary" size="lg" style={{ "margin": "0 auto 0 auto"}} value="TestFailover" onClick={this.handleButtonClick} block >Run TestFailover</Button>
                            </Col>
                        </Row>
                        <Modal isOpen={isModalOpen} isOk={this.handleRepleOk}/>
                </div>
                );
        }


      }


}


export default connect(
    (state) => ({
        post: state.postReple.data,
        pending: state.postReple.pending,
        error: state.postReple.error,
        isLoadingReple: state.postReple.isLoadingReple,
    }),
    (dispatch) => ({
        PostRepleActions: bindActionCreators(postRepleActions, dispatch),
    })
)(ReplicateContainer);
// export default Workloads;
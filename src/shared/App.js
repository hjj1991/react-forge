import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import storage from 'lib/storage';
import * as loginOkActions from '../store/modules/userLogin';
import { DashBoard, Workloads, WorkloadReplication, SignIn, MyInfo, Admin } from 'pages';
import PrivateRoute from "lib/PrivateRoute";
import axios from 'axios';
import * as service from 'services/posts'
import loding from 'images/ajax-loader.gif';
import 'css/style.css'
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css



class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loadUserInfo: false,
            loading: false
        };
    }



    initializeUserInfo = async () => {
        var today = new Date();
        const loggedInfo = storage.get('userLogin'); // 로그인 정보를 로컬스토리지에서 가져옵니다.
        if(!loggedInfo){ 
            this.setState({
                loading: true
            })
        }else{ //로그인 정보가 로컬 스토리지에 존재할때
            const { LoginOkActions } = this.props;
            await LoginOkActions.setLoggedInfo(loggedInfo);
            if(this.props.userInfo.exAuthToken < today.getTime()){//액세스토큰 만료시간을 비교하여 만료되었으면 refresh토큰을 이용하여 갱신함
                await LoginOkActions.setRefreshAccessToken(this.props.userInfo);
                storage.set('userLogin', this.props.userInfo);
            }
            this.setState({
                loading: true
            })
        }
    }
    
    componentDidMount() {
        this.initializeUserInfo();
    }

    componentWillUnmount() {

    }
    

    componentDidUpdate(prevProps, prevState) {                  //props 변화에 따라 기존 컴포넌트의 업데이트 진행 함수
        // console.log("하이하이0");
        // console.log(this.props);
        // console.log(this.state);
        // console.log(prevProps.userInfo.length);
        // console.log(prevState);
        if(this.props !== prevProps){
                // this.props = prevProps;
                this.setState({
                    loginCheck: true
            })
        }

      }
      

    render(){
        console.log(this.props.userInfo.userRole === "전체 관리자");
            return (
                this.state.loading?(
                    <div>
                        {/* <Menu/> */}
                        <PrivateRoute exact path="/" component={DashBoard} />
                        <Route exact path="/signin" component={SignIn} />
                        <PrivateRoute exact path="/dashboard" component={DashBoard} />
                        <PrivateRoute exact path="/workloads" component={Workloads}/>
                        <PrivateRoute exact path="/workloadreplication" component={WorkloadReplication}/>
                        {this.props.userInfo.userRole === "전체 관리자"
                            ? (<PrivateRoute exact path="/admin" component={Admin} />)
                            :  null
                        }
                        <Route exact path="/myinfo" component={MyInfo} />
                        {/* <Switch>
                            <Route path="/about/:name" component={About}/>
                            <Route path="/about" component={About}/>
                        </Switch> */}
                    </div>
            ):(
                <img style={{"width": "100%"}} src={loding} />
            )
        );
            }
}

let mapStateToProps = (state) => {
    return {
        userInfo: state.userLogin.data
    };
}
export default connect(
    (mapStateToProps),
    (dispatch) => ({
        LoginOkActions: bindActionCreators(loginOkActions, dispatch)
    })
)(App);
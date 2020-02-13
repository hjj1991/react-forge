import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import storage from 'lib/storage';
import * as loginOkActions from '../store/modules/userLogin';
import { DashBoard, Workloads, WorkloadReplication, SignIn, MyInfo } from 'pages';
import PrivateRoute from "lib/PrivateRoute";
import axios from 'axios';
import * as service from 'services/posts'
import loding from 'images/ajax-loader.gif';
import 'css/style.css'



class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
    }



    initializeUserInfo = async () => {
        var today = new Date();
        console.log("ㅎㅇㅎㅇ");
        const loggedInfo = storage.get('userLogin'); // 로그인 정보를 로컬스토리지에서 가져옵니다.
        console.log(loggedInfo);
        if(!loggedInfo){ 
            this.setState({
                loading: true
            })
        }else{
            const { LoginOkActions } = this.props;
            LoginOkActions.setLoggedInfo(loggedInfo);

            console.log(this.props);
            console.log(today.getTime());
            // if(this.props.userInfo.exAuthToken < today.getTime()){ //액세스토큰 만료시간을 비교하여 만료되었으면 refresh토큰을 이용하여 갱신함
            //     console.log("하이하이");
            //     const result2 = await service.postTokenReissue(this.props.userInfo.X_REFRESH_TOKEN);
            //     if(result2.data.code === "1"){
            //         LoginOkActions.refreshAccessToken(result2.data.X_AUTH_TOKEN, result2.data.exAuthToken);
            //     }else{  //리프레쉬토큰도 만료되면 새로 로그인해야함
            //         storage.remove('userLogin');
            //         // this.setState({
            //         //     isModalOpen: true
            //         // })
            //     }
            // }

            this.setState({
                loading: true
            })
        }


        // try {
        //     await UserActions.checkStatus();
        // } catch (e) {
        //     storage.remove('loggedInfo');
        //     window.location.href = '/auth/login?expired';
        // }

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
            return (
                this.state.loading?(
                    <div>
                        {/* <Menu/> */}
                        <PrivateRoute exact path="/" component={DashBoard} />
                        <Route exact path="/signin" component={SignIn} />
                        <PrivateRoute exact path="/dashboard" component={DashBoard} />
                        <PrivateRoute exact path="/workloads" component={Workloads}/>
                        <PrivateRoute exact path="/workloadreplication" component={WorkloadReplication}/>
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
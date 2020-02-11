import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import storage from 'lib/storage';
import * as loginOkActions from '../store/modules/userLogin';
import { DashBoard, Workloads, WorkloadReplication, SignIn, MyInfo } from 'pages';
import Menu from 'components/Menu';
import 'css/style.css'

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loginCheck: false
        };
    }

    initializeUserInfo = async () => {
        const loggedInfo = storage.get('userLogin'); // 로그인 정보를 로컬스토리지에서 가져옵니다.
        if(!loggedInfo){ 
        }else{
            const { LoginOkActions } = this.props;
            LoginOkActions.setLoggedInfo(loggedInfo);
            this.setState({
                loginCheck: true
            });
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

    componentDidUpdate(prevProps, prevState) {                  //props 변화에 따라 기존 컴포넌트의 업데이트 진행 함수
        // console.log("하이하이0");
        // console.log(this.props);
        // console.log(this.state);
        // console.log(prevProps.userInfo.length);
        // console.log(prevState);
        if(this.state.loginCheck === false){
            if(this.props !== prevProps && prevProps.userInfo.length == 0){
                // this.props = prevProps;
                this.setState({
                    loginCheck: true
                })
            }
        }
      }

    render() {

        console.log(this.state.loginCheck);

        if(this.state.loginCheck === false){
            return (
                <div>
                    <Route path="/" component={SignIn} />
                </div>
            )
        }else{
        return (
            <div>
                <Menu/>
                <Route exact path="/" component={Workloads}/>
                <Route exact path="/signin" component={SignIn} />
                <Route exact path="/dashboard" component={DashBoard}/>
                <Route exact path="/workloads" component={Workloads}/>
                <Route exact path="/workloadreplication" component={WorkloadReplication}/>
                <Route exact path="/myinfo" component={MyInfo} />
                {/* <Switch>
                    <Route path="/about/:name" component={About}/>
                    <Route path="/about" component={About}/>
                </Switch> */}
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
    (mapStateToProps),
    (dispatch) => ({
        LoginOkActions: bindActionCreators(loginOkActions, dispatch)
    })
)(App);
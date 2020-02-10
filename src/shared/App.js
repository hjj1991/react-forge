import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import storage from 'lib/storage';
import * as loginOkActions from '../store/modules/userLogin';
import { DashBoard, Workloads, WorkloadReplication } from 'pages';
import Menu from 'components/Menu';

class App extends Component {

    initializeUserInfo = async () => {
        const loggedInfo = storage.get('userLogin'); // 로그인 정보를 로컬스토리지에서 가져옵니다.
        if(!loggedInfo) return; // 로그인 정보가 없다면 여기서 멈춥니다.

        const { LoginOkActions } = this.props;
        LoginOkActions.setLoggedInfo(loggedInfo);
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

    render() {
        return (
            <div>
                <Menu/>
                <Route exact path="/" component={Workloads}/>
                <Route exact path="/DashBoard" component={DashBoard}/>
                <Route exact path="/workloads" component={Workloads}/>
                <Route exact path="/workloadReplication" component={WorkloadReplication}/>
                {/* <Switch>
                    <Route path="/about/:name" component={About}/>
                    <Route path="/about" component={About}/>
                </Switch> */}
            </div>
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
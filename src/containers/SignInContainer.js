import React from 'react';
import SignIn from 'components/SignIn';
import { bindActionCreators } from 'redux';
import * as service from 'services/posts'
import { connect } from 'react-redux';
import * as loginOkActions from '../store/modules/userLogin';
import loding from 'images/ajax-loader.gif';
import storage from 'lib/storage';

// import { bindActionCreators } from 'redux';
// import { connect } from 'react-redux';
// import * as checkUserIdActions from '../store/modules/checkUserId';



class SignInContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: [],
            msg:"",
            success: false
        };
    }

    componentDidMount() {
    
    }

    getPost = async (signInData) => {
        const { LoginOkActions } = this.props;

        // try {
        //     await AbcActions.postLogin(signUpData);
        //     console.log('요청이 완료 된 다음에 실행됨')
        // } catch(e) {
        //     console.log('에러가 발생!');
        // }
        try {
            this.setState({
                loading: true
            })
            const data = await service.postSignIn(signInData);
            console.log(data);
            if(data.data.success){
                LoginOkActions.setLoggedInfo(data.data.data);
                storage.set('userLogin', data.data.data);

            }
            this.setState({
                data: data,
                loading: false,
                msg: data.data.msg,
                success: data.data.success
            });
            
            
        } catch(e) {
            console.log('에러가 발생!');
        }
    }

    hanldeLoginClick = (e) => {
        e.preventDefault(); 
        console.log(e.target);
        const signInData ={
            userId: e.target.userId.value,
            userPw: e.target.userPw.value,
        }
        console.log(signInData);
        this.getPost(signInData);
        
    }

    render(){
        // const { PostActions, data, loading, error, isLoading } = this.props;
        const { data, loading, msg, success } = this.state;
        return(
            loading?
            (<img style={{"width": "100%"}} src={loding} />):
            (
            <SignIn
            onClickSubmit={this.hanldeLoginClick}
            data={data}
            msg={msg}
            success={success}
            loading={loading}
            />
            )
        )
    }

}





export default connect(
    (state) => ({
        // success: state.userLogin.data.success,
        // loading: state.userLogin.pending,
        // error: state.userLogin.error,
        // isLoading: state.userLogin.isLoading
    }),
    (dispatch) => ({
        LoginOkActions: bindActionCreators(loginOkActions, dispatch)
    })
)(SignInContainer);
// export default SignInContainer;
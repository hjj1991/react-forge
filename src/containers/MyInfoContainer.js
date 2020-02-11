import React from 'react';
import MyInfo from 'components/MyInfo';
import { bindActionCreators } from 'redux';
import * as service from 'services/posts'
import { connect } from 'react-redux';
import * as userInfoActions from 'store/modules/userLogin';
import storage from 'lib/storage';
import Modal from '../components/Modal/Modal';


class MyInfoContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            pending: false

        };
    }

    componentDidMount() {
        console.log("하이");
        console.log(this.props.userInfo);
        // if(typeof this.props.userInfo.X_REFRESH_TOKEN != "undefined"){
            this.getData();
        // }
      }

    getData = async () => {
        try {
            this.setState({
                pending: true
            })
            var today = new Date();
            const { UserInfoActions } = this.props;
            if(this.props.userInfo.exAuthToken < today.getTime()){ //액세스토큰 만료시간을 비교하여 만료되었으면 refresh토큰을 이용하여 갱신함
                const result2 = await service.postTokenReissue(this.props.userInfo.X_REFRESH_TOKEN);
                if(result2.data.code === "1"){
                    UserInfoActions.refreshAccessToken(result2.data.X_AUTH_TOKEN, result2.data.exAuthToken);
                }else{  //리프레쉬토큰도 만료되면 새로 로그인해야함
                    storage.remove('userLogin');
                    this.setState({
                        isModalOpen: true
                    })
                }
            }
            const data = await service.getUserDetail(this.props.userInfo.X_AUTH_TOKEN);
            console.log(data);
            if(data.data.success){
                this.setState({
                    userInfo: data.data.data,
                    isLoading: true
                })
            }else if(data.data.code === "999"){
                storage.remove('userLogin');
                UserInfoActions.deleteLoggedInfo();
                this.setState({
                    isModalOpen: true,
                    contents: "로그인이 필요합니다.",
                    page: "/signin"
                })
            }
            
            
        } catch(e) {
            console.log('에러가 발생!');
        }
    }

    postLogout = async () =>{
        try {
            this.setState({
                pending: true
            })
            const data = await service.postSignOut(this.props.userInfo.X_REFRESH_TOKEN);
            const { UserInfoActions } = this.props;
            if(data.data.success){
                storage.remove('userLogin');
                UserInfoActions.deleteLoggedInfo();
                this.setState({
                    isModalOpen: true,
                    contents: "로그아웃 되었습니다.",
                    page: "/"
                })
            }else{
                storage.remove('userLogin');
                UserInfoActions.deleteLoggedInfo();
                this.setState({
                    isModalOpen: true,
                    contents: "잘못된 접근입니다.",
                    page: "/"
                })
            }
        } catch(e) {
            console.log("에러가 발생!2");
        }
    }

    handleLogoutClick = () => {
        this.postLogout();
    }


    render(){
        console.log(this.state.isLoading);
        return(
            this.state.isModalOpen?(
                <Modal isOpen="true" contents={this.state.contents} page={this.state.page}/>
            ):(
            <MyInfo 
                userInfo={this.state.userInfo}
                isLoading={this.state.isLoading}
                onClickLogout={this.handleLogoutClick}
            />
            )
        )
    }

}

let mapStateToProps = (state) => {
    return {
        userInfo: state.userLogin.data
    };
}
const mapDispatchToProps = dispatch => ({
    UserInfoActions: bindActionCreators(userInfoActions, dispatch),
    // AnotherActions: bindActionCreators(anotherActions, dispatch)
  });



export default connect(
    mapStateToProps,     
    mapDispatchToProps
)(MyInfoContainer);
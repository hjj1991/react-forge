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
            pending: false,
            isModalOpen: false

        };
    }

    componentDidMount() {
        this.getData();
    }

    getData = async () => {
        try {
            this.setState({
                pending: true
            })
            var today = new Date();
            const { UserInfoActions } = this.props;
            const data = await service.getUserDetail(this.props.userInfo.X_AUTH_TOKEN);
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
            this.setState({
                isModalOpen: true,
                contents: "로그인이 필요합니다.",
                page: "/signin"
            })
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
        }
    }

    handleLogoutClick = () => {
        this.postLogout();
    }


    render(){
        if(typeof this.props.userInfo == "undefined"){
            return <Modal isOpen="true" contents="잘못된 접근입니다." page="/" />
        }
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
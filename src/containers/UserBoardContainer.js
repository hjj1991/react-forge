import React from 'react';
import { withAlert } from 'react-alert'
import { useAlert } from 'react-alert'
import * as service from 'services/posts'
import { connect } from 'react-redux';
import mypic from '../images/ajax-loader.gif';
import { confirmAlert } from 'react-confirm-alert'; // Import
import UserBoard from '../components/UserBoard';



class UserBoardContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userList: [],
            addRows:[],
            pending: false,
            isOk: false,
            editMode: false,
            newUserFormView: false,
            signUpCheckValues: {
                idCheckMessage: "5~20자의 영문 소문자, 숫자만 사용 가능합니다.",
                idCheck: false,
                idFontColor: "red",
                pwCheckMessage: "비밀번호는 영문 숫자 조합 7 ~ 14자리 이상입니다.",
                pwCheck: false,
                pwFontColor: "red",
                pw2Check: false,
                nameCheck: false,
                nameCheckMessage: "공백제외 한글, 영문, 숫자 2 ~ 10자로 입력해주세요.",
                nameFontColor: "red"
            },
            modifyCheckValues: {
                pwCheckMessage: "비밀번호는 영문 숫자 조합 7 ~ 14자리 이상입니다.",
                pwCheck: true,
                pwFontColor: "red",
                pw2Check: true,
                nameCheck: true,
                nameCheckMessage: "공백제외 한글, 영문, 숫자 2 ~ 10자로 입력해주세요.",
                nameFontColor: "red"            
            }   
        };
    }

    
    componentDidMount() {
        this.getUserList();
        // this.props.companyList = this.state.companyList;
        
    }
    componentWillUnmount(){

    }
    
    componentDidUpdate(prevProps, prevState) {                  //props 변화에 따라 기존 컴포넌트의 업데이트 진행 함수
    }

    //수정버튼 클릭시 이벤트
    handleActionClick = (e, row) => {
        this.updateApiServer(row);

    }

    //회사 추가버튼 클릭시 Row추가
    handleNewUserFormClick = () => {
        if(this.state.newUserFormView === false){
            this.getCompanyList();
        }
        this.setState({
            newUserFormView: !this.state.newUserFormView
        });
    }


    //추가된 Row 등록버튼 클릭시
    handleSubmitValue = (e) => {
        this.insertApiServer(this.state.addRows);
    }
    
    //회사추가 프로세스
    insertApiServer = async (data) => { 
        confirmAlert({
            title: '추가하시겠습니까?',
            message: '총 ' + data.length + '개의 회사를 추가하시려면 예를 클릭하세요.',
            buttons: [
              {
                label: '예',
                onClick: async () => {
                           
                    try {
                        this.setState({
                            pending: true,
                            isOk: false
                        })
                        const insertResult = await service.insertApiServer(this.props.userInfo.X_AUTH_TOKEN, data);
                        let failNameList = "";
                        insertResult.data.data.failNameList.forEach(element => {
                            failNameList = failNameList + ',' + element;
                        })
                        
                        if(insertResult.data.success){
                            this.setState({
                                pending: false,
                                isOk: true
                            })
                            this.props.alert.show(  <div>
                                                        정상 추가되었습니다.<br/>
                                                        성공 건수: {insertResult.data.data.successInsertCount} <br />
                                                        실패 건수: {insertResult.data.data.failInsertCount} <br />
                                                        실패 목록: {failNameList}
                                                    </div>, {type: 'success'});
                            this.getApiServerList();
                        }else{
                            this.props.alert.show(  <div>
                                                        실패하였습니다.<br/>
                                                        실패 건수: {insertResult.data.data.failInsertCount} <br/>
                                                        실패 목록: {failNameList} <br />
                                                    </div>, {type: 'error'})
                            this.setState({
                                pending: false,
                                isOk: true
                            })
                            this.getApiServerList();        
                        }
                        console.log('요청이 완료 된 다음에 실행됨')
                    } catch(e) {
                        this.props.alert.show('실패하였습니다.', {type: 'error'})
                        this.setState({
                            pending: false,
                            isOk: true
                        })
                        this.getApiServerList();
                    }
                    
                }
              },
              {
                label: '아니오',
                onClick: () => {}
              }
            ]
        });
    }
    //회원가입 양식 체크부분
    handleCheckValue = (e, modifyFlag) => {

        let re = /^[a-z0-9]{5,20}$/     // 아이디와 패스워드가 적합한지 검사할 정규식
        let targetId = e.target.id;
        
        if(modifyFlag !== true){
            if(targetId === "userPw"){      //패스워드 유효성 검증
                var reg1 = /^[a-z0-9~!@#$%^&*()_+|<>?:{}]{7,14}$/;    // a-z 0-9 중에 7자리 부터 14자리만 허용 한다는 뜻이구요
                var reg2 = /[a-z]/g;    
                var reg3 = /[0-9]/g; 
                let pw = e.target.value;
    
                if(reg1.test(pw) && reg2.test(pw) && reg3.test(pw)){
                    this.setState({
                        signUpCheckValues: {
                            ...this.state.signUpCheckValues,
                            pwCheckMessage: "사용가능한 비밀번호입니다.",      
                            pwFontColor: "green",
                            pwCheck: true
                        }
                    })
                }else{
                    this.setState({
                        signUpCheckValues: {
                            ...this.state.signUpCheckValues,
                            pwCheckMessage: "비밀번호는 영문 숫자 조합 7 ~ 14자리 이상입니다.",   
                            pwFontColor: "red",
                            pwCheck: false         
                        }
                    })  
                }
            }
            if(targetId === "userPw2"){
                if(document.getElementById("userPw").value === document.getElementById("userPw2").value){
                    this.setState({
                        signUpCheckValues: {
                            ...this.state.signUpCheckValues,
                            pw2CheckMessage: "비밀번호가 일치합니다.",
                            pw2FontColor: "green",
                            pw2Check: true
                        }
                    })
                }else{
                    this.setState({
                        signUpCheckValues: {
                            ...this.state.signUpCheckValues,
                            pw2CheckMessage: "비밀번호가 일치하지 않습니다.",
                            pw2FontColor: "red",
                            pw2Check: false
                        }
                    })
                }
            }
            if(targetId === "userId"){      //아이디 유효성 검증
                let id = e.target.value;
                if(re.test(id)){
                    this.getCheckUserId(id);
                }else{
                    this.setState({
                        signUpCheckValues: {
                            ...this.state.signUpCheckValues,
                            idCheckMessage: "5~20자의 영문 소문자, 숫자만 사용 가능합니다.",
                            idFontColor: "red",
                            idCheck: false
                        }
                    })
                }
            }
            if(targetId === "name"){
                let pattern = /([^가-힣\x20^a-z^A-Z^0-9])/i;
                let blank_pattern = /[\s]/g;
                let name = e.target.value;
    
                if((!pattern.test(name)) && name.length >= 2 && name.length <= 10 && (!blank_pattern.test(name))){
                    this.setState({
                        signUpCheckValues: {
                            ...this.state.signUpCheckValues,
                            nameCheck: true,
                            nameFontColor: "green",
                            nameCheckMessage: "사용가능합니다.",
                        }
                    })
                }else{
                    this.setState({
                        signUpCheckValues: {
                            ...this.state.signUpCheckValues,
                            nameCheck: false,
                            nameFontColor: "red",
                            nameCheckMessage: "공백제외 한글, 영문, 숫자 2 ~ 10자로 입력해주세요.",
                        }
                    })
                }
            }
        }else{      //회원가입이 아닌 수정시 유효성검증
            /*
                패스워드 유효성 검증
            */
            if(targetId === "userPw" && (targetId.value !=="")){      
                var reg1 = /^[a-z0-9~!@#$%^&*()_+|<>?:{}]{7,14}$/;    // a-z 0-9 중에 7자리 부터 14자리만 허용 한다는 뜻이구요
                var reg2 = /[a-z]/g;    
                var reg3 = /[0-9]/g; 
                let pw = e.target.value;
    
                if(reg1.test(pw) && reg2.test(pw) && reg3.test(pw)){
                    this.setState({
                        modifyCheckValues: {
                            ...this.state.modifyCheckValues,
                            pwCheckMessage: "사용가능한 비밀번호입니다.",      
                            pwFontColor: "green",
                            pwCheck: true
                        }
                    })
                }else{
                    this.setState({
                        modifyCheckValues: {
                            ...this.state.modifyCheckValues,
                            pwCheckMessage: "비밀번호는 영문 숫자 조합 7 ~ 14자리 이상입니다.",   
                            pwFontColor: "red",
                            pwCheck: false         
                        }
                    })  
                }
            }
            if(targetId === "userPw2" && (targetId.value !=="")){
                if(document.getElementById("userPw").value === document.getElementById("userPw2").value){
                    this.setState({
                        modifyCheckValues: {
                            ...this.state.modifyCheckValues,
                            pw2CheckMessage: "비밀번호가 일치합니다.",
                            pw2FontColor: "green",
                            pw2Check: true
                        }
                    })
                }else{
                    this.setState({
                        modifyCheckValues: {
                            ...this.state.modifyCheckValues,
                            pw2CheckMessage: "비밀번호가 일치하지 않습니다.",
                            pw2FontColor: "red",
                            pw2Check: false
                        }
                    })
                }
            }
            /*
                이름 유효성검증
            */
            if(targetId === "name" && (targetId.value !=="")){
                let pattern = /([^가-힣\x20^a-z^A-Z^0-9])/i;
                let blank_pattern = /[\s]/g;
                let name = e.target.value;
    
                if((!pattern.test(name)) && name.length >= 2 && name.length <= 10 && (!blank_pattern.test(name))){
                    this.setState({
                        modifyCheckValues: {
                            ...this.state.modifyCheckValues,
                            nameCheck: true,
                            nameFontColor: "green",
                            nameCheckMessage: "사용가능합니다.",
                        }
                    })
                }else{
                    this.setState({
                        modifyCheckValues: {
                            ...this.state.modifyCheckValues,
                            nameCheck: false,
                            nameFontColor: "red",
                            nameCheckMessage: "공백제외 한글, 영문, 숫자 2 ~ 10자로 입력해주세요.",
                        }
                    })
                }
            }
        }


    }

    //회원가입 프로세스
    handleOnSignUpSubmit = (e) => {
        e.preventDefault(); 

        const signUpData = {
            userId: e.target.userId.value,
                        userPw: e.target.userPw.value,
                        name: e.target.name.value,
                        userTel: e.target.userTel.value,
                        userEmail: e.target.userEmail.value,
                        userPhone: e.target.userPhone.value,
                        companyIdx: e.target.companyIdx.value,
                        userRole: e.target.userRole.value
        }

        let checkData = this.state.signUpCheckValues;

        console.log(signUpData);
        if(checkData.idCheck && checkData.pwCheck && checkData.pw2Check && checkData.nameCheck){
            this.postSignUp(signUpData)
        }
    }
    
    //회원수정 프로세스
    handleOnModifySubmit = (e, userId) => {
        e.preventDefault(); 
        let deletedYn = "N"
        if(e.target.deletedYn.checked === true){
            deletedYn = "Y"
        }

        console.log(e.target.deletedYn.value);
        const modifyUserData = {
                        userId: userId,
                        userPw: e.target.userPw.value,
                        name: e.target.name.value,
                        userTel: e.target.userTel.value,
                        userEmail: e.target.userEmail.value,
                        userPhone: e.target.userPhone.value,
                        companyIdx: e.target.companyIdx.value,
                        userRole: e.target.userRole.value,
                        deletedYn: deletedYn
                };
        console.log(modifyUserData);
      
        let checkData = this.state.modifyCheckValues;

        if((typeof modifyUserData.userPw === "undefined") || modifyUserData.userPw === "" ){
            if(checkData.nameCheck){
                this.postModifyUser(modifyUserData);
            }   
        }else{
            if(checkData.pwCheck && checkData.pw2Check && checkData.nameCheck){
                this.postModifyUser(modifyUserData);
            }
        }     
    }


    //사용자수정 프로세스
    postModifyUser = async (data) => {
        try {
                const post = await service.postModifyUser(data, this.props.userInfo.X_AUTH_TOKEN);
    
                if(post.data.success === true){
                    this.props.alert.show('정상 수정되었습니다.', {type: 'success'});
                    this.setState({
                        newUserFormView: false,
                        signUpCheckValues: {
                            idCheckMessage: "5~20자의 영문 소문자, 숫자만 사용 가능합니다.",
                            idCheck: false,
                            idFontColor: "red",
                            pwCheckMessage: "비밀번호는 영문 숫자 조합 7 ~ 14자리 이상입니다.",
                            pwCheck: false,
                            pwFontColor: "red",
                            pw2Check: false,
                            nameCheck: false,
                            nameCheckMessage: "공백제외 한글, 영문, 숫자 2 ~ 10자로 입력해주세요.",
                            nameFontColor: "red"
                        }
                    })
                    this.getUserList();
                }else{
                    this.props.alert.show('실패하였습니다.', {type: 'error'})
                }
             } catch(e) {
                console.log('에러가 발생!');
                this.props.alert.show('실패하였습니다.', {type: 'error'})
         }
    }
    

    //회원가입 프로세스
    postSignUp = async (data) => {
        try {
            const post = await service.postSignUp(data);

            if(post.data.success === true){
                this.props.alert.show('정상 가입되었습니다.', {type: 'success'});
                this.setState({
                    newUserFormView: false,
                    signUpCheckValues: {
                        idCheckMessage: "5~20자의 영문 소문자, 숫자만 사용 가능합니다.",
                        idCheck: false,
                        idFontColor: "red",
                        pwCheckMessage: "비밀번호는 영문 숫자 조합 7 ~ 14자리 이상입니다.",
                        pwCheck: false,
                        pwFontColor: "red",
                        pw2Check: false,
                        nameCheck: false,
                        nameCheckMessage: "공백제외 한글, 영문, 숫자 2 ~ 10자로 입력해주세요.",
                        nameFontColor: "red"
                    }
                })
                this.getUserList();
            }else{
                this.props.alert.show('실패하였습니다.', {type: 'error'})
            }
         } catch(e) {
            console.log('에러가 발생!');
            this.props.alert.show('실패하였습니다.', {type: 'error'})
         }
    }


    //API서버 수정 프로세스
    updateApiServer = async (row) => { 
        confirmAlert({
            // title: '수정하시겠습니까?',
            message: '수정하시려면 예를 클릭하세요.',
            buttons: [
              {
                label: '예',
                onClick: async () => {
                           
                    try {
                        this.setState({
                            pending: true,
                            isOk: false
                        })
                        const updateResult = await service.updateApiServer(this.props.userInfo.X_AUTH_TOKEN, row);
                        
                        if(updateResult.data.success){
                            this.setState({
                                pending: false,
                                isOk: true
                            })
                            this.props.alert.show('정상 수정되었습니다.', {type: 'success'});
                            this.getApiServerList();
                        }
                        console.log('요청이 완료 된 다음에 실행됨')
                    } catch(e) {
                        this.props.alert.show('실패하였습니다.', {type: 'error'})
                        this.setState({
                            pending: false,
                            isOk: true
                        })
                        this.getApiServerList();
                    }
                    
                }
              },
              {
                label: '아니오',
                onClick: () => {}
              }
            ]
        });
    }

    //아이디 중복체크
    getCheckUserId = async (userId) => {

        this.setState({
            pending: false,
            isCheckId: undefined,
           
        });
        try {
            const post = await service.getCheckId(userId)
            console.log(post);

            if(post.data.data === true){
                this.setState({
                    signUpCheckValues: {
                        ...this.state.signUpCheckValues,
                        idCheckMessage : "이미 사용중이거나 탈퇴한 아이디입니다.",
                        idFontColor: "red",
                        idCheck: false
                    }
                })
            }else{
                this.setState({
                    signUpCheckValues: {
                        ...this.state.signUpCheckValues,
                        idCheckMessage : "사용가능한 아이디입니다.",
                        idFontColor: "green",
                        idCheck: true
                    }
                })
            }
        } catch(e) {
            console.log('에러가 발생!');
        }
    }

    //API사용자목록 호출 프로세스
    getUserList = async () => {  
        try {
            this.setState({
                pending: true,
                isOk: false
            })
            const userList = await service.getUserList(this.props.userInfo.X_AUTH_TOKEN);
            if(userList.data.success){
                this.setState({
                    userList: userList.data.data,
                    pending: false,
                    isOk: true
                })
            }

            console.log('요청이 완료 된 다음에 실행됨')
        } catch(e) {
            console.log('에러가 발생!');
        }
    }

    //간단회사목록 호출 프로세스
    getCompanyList = async () => {  
        try {
            this.setState({
                pending: true,
                isOk: false
            })
            const companyList = await service.getSimpleCompanyList(this.props.userInfo.X_AUTH_TOKEN);
            if(companyList.data.success){
                this.setState({
                    companyList: companyList.data.data,
                    pending: false,
                    isOk: true
                })
            }

            console.log('요청이 완료 된 다음에 실행됨')
        } catch(e) {
            console.log('에러가 발생!');
        }
    }


    render(){
        if( this.state.isOk ){
            return(
                <UserBoard 
                userList={this.state.userList} 
                companyList={this.state.companyList}
                checkUserValue={this.handleCheckValue}
                signUpCheckValues={this.state.signUpCheckValues}
                modifyCheckValues={this.state.modifyCheckValues}
                onClickAciton={this.handleActionClick}
                onClickNewUserForm={this.handleNewUserFormClick}
                newUserFormView={this.state.newUserFormView}
                onClickRemove={this.handleRemoveRowButtonClick}
                onClickRowSubmit={this.handleSubmitValue}
                onClickSignUp={this.handleOnSignUpSubmit}
                onClickModify={this.handleOnModifySubmit}  />
                
            )
        }else{
            return(
                <div className="loding-div">
                    <img  alt="로딩중" src={mypic}/>
                </div>
            )
        }
    }


}


let mapStateToProps = (state) => {
  return {
      userInfo: state.userLogin.data
  };
}


export default connect(mapStateToProps)(withAlert()(UserBoardContainer));
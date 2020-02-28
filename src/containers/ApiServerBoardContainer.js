import React from 'react';
import { withAlert } from 'react-alert'
import { useAlert } from 'react-alert'
import * as service from 'services/posts'
import { connect } from 'react-redux';
import mypic from '../images/ajax-loader.gif';
import { confirmAlert } from 'react-confirm-alert'; // Import
import ApiServerBoard from '../components/ApiServerBoard';



class ApiServerBoardContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            apiServerList: [],
            addRows:[],
            pending: false,
            isOk: false,
            editMode: false
        };
    }

    
    componentDidMount() {
        this.getApiServerList();
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
    //추가된 Row 삭제
    handleRemoveRowButtonClick = (indx) => {
        const addRows = [...this.state.addRows];
        addRows.splice(indx, 1);
        this.setState({addRows})
    }
    //회사 추가버튼 클릭시 Row추가
    handleAddRowClick = () => {
        const item = {
            companyId: "",
            companyName: ""
        };
        this.setState({
            addRows: [...this.state.addRows, item]
        });
    }

    //추가된 Row의 값 추가
    handleChageValue = (e, indx) => {
        const {name, value} = e.target
        const addRows = [...this.state.addRows];
        addRows[indx] ={
            ...this.state.addRows[indx],
            [name]: value
        };
        
        this.setState({
            addRows: addRows
        })
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

    //API서버목록 호출 프로세스
    getApiServerList = async () => {  
        const data = this.props.userInfo;
        try {
            this.setState({
                pending: true,
                isOk: false
            })
            const apiServerList = await service.getApiServerList(this.props.userInfo.X_AUTH_TOKEN, data);
            if(apiServerList.data.success){
                // console.log(apiServerList.data.data);
                apiServerList.data.data.data.content.forEach(element => {
                    // console.log(element.companyIdx);
                    if(element.companyIdx !== null){
                        element.companyName = element.companyIdx.companyName;
                        delete element.companyIdx;
                    }else{
                        element.companyName ="";
                        delete element.companyIdx;
                    }
                    
                });
                this.setState({
                    apiServerList: apiServerList.data.data,
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
                <ApiServerBoard 
                apiServerList={this.state.apiServerList} 
                onClickAciton={this.handleActionClick}
                onClickAddRow={this.handleAddRowClick}
                addRows={this.state.addRows}
                onChangeAddRow={this.handleChageValue}
                onClickRemove={this.handleRemoveRowButtonClick}
                onClickRowSubmit={this.handleSubmitValue}  />
                
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


export default connect(mapStateToProps)(withAlert()(ApiServerBoardContainer));
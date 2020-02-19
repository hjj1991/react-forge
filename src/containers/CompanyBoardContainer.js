import React from 'react';
import { withAlert } from 'react-alert'
import { useAlert } from 'react-alert'
import CompanyBoard from '../components/CompanyBoard';
import * as service from 'services/posts'
import { connect } from 'react-redux';
import mypic from '../images/ajax-loader.gif';
import { confirmAlert } from 'react-confirm-alert'; // Import



class CompanyBoardContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            companyList: [],
            addRows:[],
            pending: false,
            isOk: false,
            editMode: false
        };
    }

    
    componentDidMount() {
        this.getCompanyList();
        console.log(this.props);
        // this.props.companyList = this.state.companyList;
        
    }
    componentWillUnmount(){

    }
    
    componentDidUpdate(prevProps, prevState) {                  //props 변화에 따라 기존 컴포넌트의 업데이트 진행 함수
        console.log(prevProps);
        console.log(this.state);
    }

    //수정버튼 클릭시 이벤트
    handleActionClick = (e, row) => {
        // console.log(row);
        this.updateCompany(row);

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
        console.log(e.target);
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
    

    updateCompany = async (row) => { 

        

        console.log(this.props);

        confirmAlert({
            title: '수정하시겠습니까?',
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
                        const updateResult = await service.updateCompany(this.props.userInfo.X_AUTH_TOKEN, row);
                        
                        if(updateResult.data.success){
                            this.setState({
                                pending: false,
                                isOk: true
                            })
                            this.props.alert.show('정상 수정되었습니다.', {type: 'success'});
                            this.getCompanyList();
                        }
                        console.log('요청이 완료 된 다음에 실행됨')
                    } catch(e) {
                        this.props.alert.show('실패하였습니다.', {type: 'error'})
                        this.setState({
                            pending: false,
                            isOk: true
                        })
                        this.getCompanyList();
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
  

    getCompanyList = async () => {  
        try {
            this.setState({
                pending: true,
                isOk: false
            })
            const companyList = await service.getCompanyList(this.props.userInfo.X_AUTH_TOKEN);
            if(companyList.data.success){
                this.setState({
                    companyList: companyList.data.data.content,
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
                <CompanyBoard 
                companyList={this.state.companyList} 
                onClickAciton={this.handleActionClick}
                onClickAddRow={this.handleAddRowClick}
                addRows={this.state.addRows}
                onChangeAddRow={this.handleChageValue}
                onClickRemoveButton={this.handleRemoveRowButtonClick}  />
                
            )
        }else{
            return(
                <div style={{"textAlign": "center"}}>
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


export default connect(mapStateToProps)(withAlert()(CompanyBoardContainer));
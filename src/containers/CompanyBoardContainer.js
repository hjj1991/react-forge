import React from 'react';
import CompanyBoard from '../components/CompanyBoard';
import * as service from 'services/posts'
import { connect } from 'react-redux';
import mypic from '../images/ajax-loader.gif';


class CompanyBoardContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pending: false,
            isOk: false
        };
    }
    componentDidMount() {
        this.getPost();
        
    }
    componentWillUnmount(){

    }

    getPost = async () => {  
      console.log(this.props.userInfo);
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
                companyList = {this.state.companyList}   />
                
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

export default connect(
  mapStateToProps,     
)(CompanyBoardContainer);;
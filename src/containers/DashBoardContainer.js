import React from 'react';
import DashBoard from '../components/DashBoard';
import * as service from 'services/posts'
import { connect } from 'react-redux';
import mypic from '../images/ajax-loader.gif';


class DashBoardContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pending: false,
            isOk: false,
        };
    }
    componentDidMount() {
        const interval = setInterval(this.getPost, 1000 * 60 * 5); //1000 * 60 = 분입니다.
        this.getPost();
        
        
    }
    componentWillUnmount(){
        clearInterval(this.interval);
    }

    getPost = async () => {  
      console.log(this.props.userInfo);
        // try {
            this.setState({
                pending: true,
                isOk: false
            })
            const workloadList = await service.getWorkloadList(this.props.userInfo.X_AUTH_TOKEN);
            console.log(workloadList.data.data.content);
            this.setState({
                workloadList: workloadList.data.data.content,
                pending: false,
                isOk: true
            })
        //     console.log('요청이 완료 된 다음에 실행됨')
        // } catch(e) {
        //     console.log('에러가 발생!');
        // }
    }


      render(){
        // function compare(a, b) {
        //   return parseInt(a.detail.ImportantStat) < parseInt(b.detail.ImportantStat) ? -1 : parseInt(a.detail.ImportantStat) > parseInt(b.detail.ImportantStat) ? 1 : 0;
        // }
        
    
          if( this.state.isOk && (this.state.pending === false)){
            console.log(this.state.workloadList);
            // post.sort(compare);
            return (
              <DashBoard 
              workloadList = {this.state.workloadList}   />
          )
          }else{
            return (
                <div className="loding-div">
                    <img  alt="로딩중" src={mypic}/>
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
  mapStateToProps,     
)(DashBoardContainer);;
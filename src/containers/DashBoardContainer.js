import React from 'react';
import DashBoard from '../components/DashBoard';
import * as service from 'services/posts'
import { connect } from 'react-redux';
import mypic from '../images/ajax-loader.gif';
import LoadingOverlay from 'react-loading-overlay';


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
        // try {
            this.setState({
                pending: true,
                isOk: false
            })
            const workloadList = await service.getWorkloadList(this.props.userInfo.X_AUTH_TOKEN);
            this.setState({
                workloadList: workloadList.data.data.content,
                pending: false,
                isOk: true
            })
    }


      render(){
          if( this.state.isOk && (this.state.pending === false)){
            return (
              <DashBoard 
              workloadList = {this.state.workloadList}   />
          )
          }else{
            return (
                <LoadingOverlay
                    active={true}
                    spinner
                    text='잠시만 기다려주세요...'
                    styles={{
                        overlay: (base) => ({
                          ...base,
                          "position": "fixed",
                          "width": "100%",
                          "height": "100%",
                          "left": "0",
                          "z-index": "10"
                        })
                      }}
                    >
                </LoadingOverlay>
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
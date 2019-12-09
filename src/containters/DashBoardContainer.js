import React from 'react';
import DashBoard from '../components/DashBoard';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as postActions from '../store/modules/post';
import mypic from '../images/ajax-loader.gif';


class DashBoardContainer extends React.Component {

    //   constructor(props) {
    //       super(props);
    //       this.state = {
    //           referrer: null
    //       };
    //   }
      componentDidMount() {
        // this.getWorkloadList();
        // test();
        // const { PostActions } = this.props;
        this.getPost('/protectionservices/Workloads/'); //workload 리스트 콜
        
      }

      getPost = async (postId) => {
        const { PostActions } = this.props;

        try {
            await PostActions.getPost(postId);
            console.log('요청이 완료 된 다음에 실행됨')
        } catch(e) {
            console.log('에러가 발생!');
        }
    }


      render(){
        const { post, error, loading, isLoading } = this.props;
        console.log("팬딩여부:" + loading);
        console.log("로딩여부:" + isLoading);
        console.log("에러여부:" + error);
        // console.log(post[0].detail);

        function compare(a, b) {
          return parseInt(a.detail.ImportantStat) < parseInt(b.detail.ImportantStat) ? -1 : parseInt(a.detail.ImportantStat) > parseInt(b.detail.ImportantStat) ? 1 : 0;
        }
        
    
          if( isLoading ){
            console.log(post);
            post.sort(compare);
            return (
              <DashBoard 
                post = {post}   />
          )
          }else{
            return (
              <div style={{"textAlign": "center"}}>
                <img  alt="로딩중" src={mypic}/>
              </div>
            );
          }
      }


}


export default connect(
    (state) => ({
        post: state.post.data,
        loading: state.post.pending,
        error: state.post.error,
        isLoading: state.post.isLoading
    }),
    (dispatch) => ({
        PostActions: bindActionCreators(postActions, dispatch)
    })
)(DashBoardContainer);
// export default Workloads;
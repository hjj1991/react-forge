import React from 'react';
import Workload from '../components/Workload';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as postActions from '../store/modules/post';


class Workloads extends React.Component {
      componentDidMount() {
        // this.getWorkloadList();
        // test();
        // const { PostActions } = this.props;
        this.getPost('/protectionservices/Workloads/');
        
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

          if( isLoading ){
            return (
              <Workload post = {post} />
          )
          }else{
            return <h2>로딩중</h2>
          }
          // return (
          //     <div>
          //         { loading && <h2>11...</h2> }
          //         { isLoading
          //           ?  : <h2>로딩중...</h2> }
          //     </div>
          // );
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
)(Workloads);
// export default Workloads;
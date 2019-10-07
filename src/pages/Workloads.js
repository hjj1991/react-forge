import React from 'react';
import Table from 'react-bootstrap/Table'
import Workload from '../components/Workload';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as postActions from '../store/modules/post';


class Workloads extends React.Component {
      componentDidMount() {
        // this.getWorkloadList();
        // test();
        const { PostActions } = this.props;
        PostActions.getPost('/protectionservices/Workloads/');
        
      }

      render(){
        const { post, error, loading } = this.props;
        // console.log(post);

          return (
              <div>
                  { loading && <h2>로딩중...</h2> }
                  { error
                    ? <h1>에러발생!</h1>
                    :  (
                        <div className="workloads">
                        <Table striped bordered hover variant="dark">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Tasks</th>
                                <th>Online</th>
                                <th>Workload</th>
                                <th>Target</th>
                                <th>Tag</th>
                                <th>Schedule</th>
                                <th>Migration Status</th>
                                <th>Last Replication</th>
                                <th>Next Replication</th>
                                <th>Last Test Cutover</th>
                            </tr>
                        </thead>
                        <tbody> 
                        {post.map(workload => (
                            <Workload 
                                key={workload.index}
                                CurrentState = {workload.CurrentState}
                                Name = {workload.Name}
                                OperatingSystem = {workload.OperatingSystem}
                                ScheduleActive = {workload.ScheduleActive}
                                Uri = {workload.Uri}
                            />
                        ))}
                        </tbody>
                        </Table>
                    </div>
                    )}
              </div>
          );
      }

}


export default connect(
    (state) => ({
        post: state.post.data,
        loading: state.post.pending,
        error: state.post.error
    }),
    (dispatch) => ({
        PostActions: bindActionCreators(postActions, dispatch)
    })
)(Workloads);
// export default Workloads;
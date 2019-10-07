import React from 'react';
import Table from 'react-bootstrap/Table'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as postActions from '../store/modules/post';



const Workload = ({ CurrentState, Name, OperatingSystem, ScheduleActive, Tag, LastFullOn, Online}) => {
    console.log(Tag);
    return (
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
                <tr>
                    <td>{CurrentState}</td>
                    <td>Online</td>
                    <td>{Online}</td>
                    <td>{Name}}</td>
                    <td>Tag</td>
                    <td>Schedule</td>
                    <td>Migration Status</td>
                    <td>{LastFullOn}</td>
                    <td>Next Replication</td>
                    <td>Last Test Cutover</td>
                </tr>
            </tbody>
        </Table>
        </div>
    )
}
export default connect(
    (state) => ({
        post: state.post.data,
        loading: state.post.pending,
        error: state.post.error,
    }),
    (dispatch) => ({
        PostActions: bindActionCreators(postActions, dispatch)
    })
)(Workload);

// export default Workload;
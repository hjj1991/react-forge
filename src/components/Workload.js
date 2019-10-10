import React from 'react';
import Table from 'react-bootstrap/Table'


const WorkloadItem = ({isChecked, itemNum, CurrentState, Name, OperatingSystem , ScheduleActive, Tag, Online, LastFullOn, NextFullOn, LastTestedFailoverOn }) => {
    console.log(isChecked);
    return (
        <tr>
            <td><input type="checkbox" name={"box" + itemNum} checked={isChecked}  /></td>
            <td></td>
            <td>{Online}</td>
            <td>({OperatingSystem}){Name}</td>
            <td></td>
            <td>{Tag}</td>
            <td>{ScheduleActive}</td>
            <td>{CurrentState}</td>
            <td>{LastFullOn}</td>
            <td>{NextFullOn}</td>
            <td>{LastTestedFailoverOn}</td>
    </tr>
    );
  };


const Workload = ({ post, isChecked, onChange }) => {
    console.log("하히요");
    console.log(post[0]);
    console.log(post[1]);
    const workloadItems = post.map((workload, index) => (
        <WorkloadItem
            isChecked={isChecked}
            key={index}
            itemNum={index}
            CurrentState = {workload.CurrentState}
            Name = {workload.Name}
            OperatingSystem = {workload.OperatingSystem}
            ScheduleActive = {workload.ScheduleActive}
            Tag = {workload.detail.Tag}
            Online = {workload.detail.Online}
            NextFullOn = {workload.detail.Parameters[15].Value}
            LastFullOn = {workload.detail.Parameters[10].Value}
            LastTestedFailoverOn = {workload.detail.Parameters[12].Value}
        />
    ));

    return (
        <div className="workloads" style={{"margin-top": "10px"}}>
            <div className="table-responsive">
                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                            <th><input type="checkbox" name="allCheck" onChange={onChange}/></th>
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
                        { workloadItems }
                    </tbody>
                </Table>
            </div>
        </div>
    )
}
// export default connect(
//     (state) => ({
//         post: state.post.data,
//         loading: state.post.pending,
//         error: state.post.error,
//     }),
//     (dispatch) => ({
//         PostActions: bindActionCreators(postActions, dispatch)
//     })
// )(Workload);

export default Workload;
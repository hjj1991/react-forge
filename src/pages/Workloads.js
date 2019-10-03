import React from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table'
import Workload from '../components/Workload';


class Workloads extends React.Component {
    state = {
        isLoading: true,
        workloads: []
      };



getWorkloadList = async () => {
    const result = await axios.get('http://10.131.109.122/protectionservices/Workloads/', {
    

    withCredentials: true,
    headers: {
        "Content-Type" : "application/vnd.netiq.platespin.protect.WorkloadsDetails+json",
        "Accept" : "application/json",
        // "Authorization" : "Basic",
        // "Access-Control-Allow-Methods" : "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        
  },
//   auth: {
//     username: 'administrator',
//     password: 'vortmasp12#$'
//         }
    });
    const workloads = result.data.Workloads;
    //console.log(workloads);
    this.setState({ workloads, isLoading: false });
}

componentDidMount() {
    this.getWorkloadList();
    // test();
  }
    render(){
        const { isLoading, workloads } = this.state;
        return (
            <section className="container">
                { isLoading ? (
                    <div className="loader">
                        <span className="loader__text">Loading...</span>
                    </div>
                ) : (
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
                        {workloads.map(workload => (
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
            </section>
        )
    }
}

export default Workloads;
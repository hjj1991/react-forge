import React from 'react';
import axios from 'axios';



class Workload extends React.Component {

    state = {
        isLoading: true,
        workloadDetail: []
      };

    getWorkloadDetail = async () => {
        const workloadDetail = await axios.get('http://10.131.109.122' + this.props.Uri, {
        
    
        withCredentials: true,
        headers: {
            "Content-Type" : "application/vnd.netiq.platespin.protect.WorkloadsDetails+json",
            "Accept" : "application/json",
            // "Authorization" : "Basic",
            // "Access-Control-Allow-Methods" : "GET,PUT,POST,DELETE,PATCH,OPTIONS",
            
      },
        });
        console.log(workloadDetail);
        this.setState({ workloadDetail, isLoading: false });
    }


      componentDidMount() {
        this.getWorkloadDetail();
        // test();
      }

    render(){
        const { isLoading, workloadDetail } = this.state;

    if (isLoading) {
        return <Loading1 />
    } else {
        return <Comple1 CurrentState={this.props.CurrentState} Name={this.props.Name} ScheduleActive={this.props.ScheduleActive} Uri={this.props.Uri} OperatingSystem={this.props.OperatingSystem} workloadDetail={workloadDetail} />
    }


    }
}

function Loading1() {
    return (
        <tr>
            <td>0</td>
        </tr>
    )
}

function Comple1({CurrentState, Name, ScheduleActive, Uri, OperatingSystem, workloadDetail}) {
    workloadDetail = workloadDetail.data;
    var onlineStatus;
    
    
    if (workloadDetail.Online){
        onlineStatus = "O";
    }else{
        onlineStatus = "X";
    }
    console.log(workloadDetail.Parameters[10]);
    return (
        
        <tr>
        <td>0</td>
        <td>{CurrentState}</td>
        <td>{onlineStatus}</td>
        <td>{Name}</td>
        <td>{ScheduleActive}</td>
        <td>{workloadDetail.Tag}</td>
        <td>{OperatingSystem}</td>
        <td>@mdo</td>
        <td>{workloadDetail.Parameters[10].Value}</td>
        <td>{workloadDetail.Parameters[15].Value}</td>
        <td>{workloadDetail.Parameters[12].Value}</td>
    </tr>
    )
}

export default Workload;
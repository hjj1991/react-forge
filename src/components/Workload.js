import React from 'react';
import axios from 'axios';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as postActions from '../store/modules/post';



class Workload extends React.Component {

    componentDidMount() {
        // this.getWorkloadList();
        // test();
        const { PostActions } = this.props;
        PostActions.getDetail(this.props.Uri);
        
      }




    render(){
        const { post2, error2, loading2 } = this.props;
        
        if(loading2){
            return <h2>로딩중...</h2> 
        }
        else if ( error2){
            return <h1>에러발생!</h1>
        } else {
            if (post2.Parameters) {
                console.log(post2);
                console.log(post2);
            
                return (
                    <tr>
                    <td>0</td>
                    <td>{this.props.CurrentState}</td>
                    <td>{this.props.onlineStatus}</td>
                    <td>{this.props.Name}</td>
                    <td>{this.props.ScheduleActive}</td>
                    <td>{post2.Tag}</td>
                    <td>{this.props.OperatingSystem}</td>
                    <td>Replicated</td>
                    <td>{post2.Parameters[10].Value}</td>
                    <td>{post2.Parameters[15].Value}</td>
                    <td>{post2.Parameters[12].Value}</td>
                </tr>
                )
            }
            else{
                return <h1>에러발생2!</h1>
            }
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


export default connect(
    (state) => ({
        post2: state.post.data2,
        loading2: state.post.pending2,
        error2: state.post.error2,
    }),
    (dispatch) => ({
        PostActions: bindActionCreators(postActions, dispatch)
    })
)(Workload);

// export default Workload;
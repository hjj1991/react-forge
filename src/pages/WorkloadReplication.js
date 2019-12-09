import React from 'react';
import ReplicateContainer from '../containters/ReplicateContainer';


class WorkloadReplication extends React.Component {


      render(){
          return(
            <ReplicateContainer checkedListValue={this.props.location.state} />
          )
      }
    }

export default WorkloadReplication;
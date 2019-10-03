import React from 'react';
import axios from 'axios';
import PropTypes from "prop-types";

function getWorkLoad(detailUrl) {

    //console.log('http://10.131.109.122' + detailUrl.Uri);
    const getWorkloadList = async () => {
        const result = await axios.get('http://10.131.109.122' + detailUrl.Uri, {
        
    
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
        //console.log(result);
        return result;
    }
    return getWorkloadList();

}

function Workload ({CurrentState, Name, OperatingSystem, ScheduleActive, Uri }){
    const result = getWorkLoad({Uri});
    console.log(result);
    return (

            <tr>
                <td>0</td>
                <td>{CurrentState}</td>
                <td>{result.data.Online}</td>
                <td>{Name}</td>
                <td>{ScheduleActive}</td>
                <td>{Uri}</td>
                <td>{OperatingSystem}</td>
                <td>@mdo</td>
                <td>1</td>
                <td>Mark</td>
                <td>Otto</td>
            </tr>

    );
}

Workload.propTypes = {
    CurrentState: PropTypes.string.isRequired,
    Name: PropTypes.string.isRequired,
    OperatingSystem: PropTypes.string.isRequired,
    ScheduleActive: PropTypes.bool.isRequired,
    Uri: PropTypes.string.isRequired,
  };

export default Workload;
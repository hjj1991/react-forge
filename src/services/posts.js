import axios from 'axios';

var siteUrl = "http://localhost:8080";

export function getWorkloadList(){
    return axios.get(siteUrl + '/v1/workload');
}
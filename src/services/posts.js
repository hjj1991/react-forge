import axios from 'axios';

var siteUrl = "http://localhost:8080";


export function getUserDetail(token){
    console.log(token);
    return axios(
        {
            url:siteUrl + '/v1/user',
            method: 'get',
            headers: {
                "X_AUTH_TOKEN": token
            }
        }
    )
}
export function getWorkloadList(){
    return axios.get(siteUrl + '/v1/workload');
}

export function postSignIn(data){
    return axios.post(siteUrl + '/v1/signin',{
        userId: data.userId,
        userPw: data.userPw
    });
}

export function postSignOut(token){
    return axios(
        {
            url:siteUrl + '/v1/signout',
                method: 'post',
                headers: {
                    "X_REFRESH_TOKEN": token
                },
            
        }
    )
}

export function postTokenReissue(data){
    return axios.post(siteUrl + '/v1/tokenreissue',{
        refreshToken: data
    });
}
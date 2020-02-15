import axios from 'axios';

var siteUrl = "http://localhost:8080";

/*
사용자 정보 호출 API
*/
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

/*
워크로드리스트 호출 API
*/
export function getWorkloadList(token){
    return axios(
        {
            url:siteUrl + '/v1/workload',
            method: 'get',
            headers: {
                "X_AUTH_TOKEN": token
            }
        }
    )
}

/*
사용자 로그인 호출 API
*/
export function postSignIn(data){
    return axios.post(siteUrl + '/v1/signin',{
        userId: data.userId,
        userPw: data.userPw
    });
}

/*
사용자 로그아웃 호출 API
*/
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

/*
워크로드 액션 호출 API
*/
export function postWorkloadAction(token, serverHost, actionUrl){
    return axios(
        {
            url:siteUrl + '/v1/workload/action',
                method: 'post',
                data: {
                    serverHost: serverHost,
                    actionUrl: actionUrl
                },
                headers: {
                    "X_AUTH_TOKEN": token
                },
            
        }
    )
}

/*
사용자 토큰 갱신 호출 API
*/
export function postTokenReissue(data){
    console.log("엥");
    return axios.post(siteUrl + '/v1/tokenreissue',{
        refreshToken: data
    });
}
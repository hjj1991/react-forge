import axios from 'axios';
import storage from 'lib/storage';


// axios.interceptors.request.use(
//     function (config) {
//         if(storage.get('userLogin') !== null){
//             let userInfo = storage.get('userLogin');
//             let today = new Date();
//             if(userInfo.exAuthToken < today.getTime()){
//                 postTokenReissue(userInfo.X_REFRESH_TOKEN).then(
//                     result => {
//                         if(result.data.success === true){
//                             userInfo.X_AUTH_TOKEN = result.data.data.X_AUTH_TOKEN;
//                             userInfo.exAuthToken = result.data.data.exAuthToken;
//                             storage.set('userLogin', userInfo);
//                             config.headers.X_AUTH_TOKEN = userInfo.X_AUTH_TOKEN;
//                         }
//                     });
//             }
//         }
//         return config
//     }
// );

axios.interceptors.response.use( response => {
    // console.log(response);
    // console.log(storage.get('userLogin'));
    return response;
}, async error => {
    if(typeof error.response !== 'undefined'){
        if(error.response.status === 401 && storage.get('userLogin') !== null){         //authToken 검증 실패시 refresh토큰을 이용하여 갱신
            let userInfo = storage.get('userLogin');
            const result = await postTokenReissue(userInfo.X_REFRESH_TOKEN);
            if(result.data.success === true){
                userInfo.X_AUTH_TOKEN = result.data.data.X_AUTH_TOKEN;
                userInfo.exAuthToken = result.data.data.exAuthToken;
                storage.set('userLogin', userInfo);
                error.response.config.headers.X_AUTH_TOKEN = result.data.data.X_AUTH_TOKEN;
                return await axios(error.response.config);

            }else{
                return Promise.reject(error);
            }
        }
    }
        return Promise.reject(error);
    
});

var siteUrl = "http://10.131.109.51:8080";



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

/*
    회사목록 호출 API
*/
export function getCompanyList(token){
    return axios(
        {
            url:siteUrl + '/v1/company',
            method: 'get',
            headers:{
                "X_AUTH_TOKEN": token
            }
        }
    )
}

/*
    회사수정 호출 API
*/

export function updateCompany(token, data){
    return axios(
        {
            url:siteUrl + '/v1/company',
            method: 'PUT',
            data: data,
            headers:{
                "X_AUTH_TOKEN": token
            }
        }
    )
}
/*
    회사 등록 호출 API
*/
export function insertCompany(token, data){
    return axios(
        {
            url:siteUrl + '/v1/company',
            method: 'POST',
            data: data,
            headers:{
                "X_AUTH_TOKEN": token
            }
        }
    )
}
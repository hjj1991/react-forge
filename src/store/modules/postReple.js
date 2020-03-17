import { handleActions } from 'redux-actions';

import axios from 'axios';
// import { listenerCount } from 'cluster';


const GET_REPLEPOST_PENDING = 'GET_REPLEPOST_PENDING';
const GET_REPLEPOST_SUCCESS = 'GET_REPLEPOST_SUCCESS';
const GET_REPLEPOST_FAILURE = 'GET_REPLEPOST_FAILURE';

function getPostAPI(postId) {

    // var base64Credentials = window.btoa("domain\credentials:password");
    if (typeof postId == "undefined"){
        postId = '';
    }

    return axios.post(`http://migrate.eonit.co.kr${postId}`, {

    withCredentials: true,
    headers: {
        "Content-Type" : "application/vnd.netiq.platespin.protect.WorkloadsDetails+json",
        "Accept" : "application/json",
        //"Origin": 'http://10.131.109.56:3000'
        // 'Access-Control-Allow-Origin': '*',
        // 'Authorization': 'NTLM'
        // "Authorization" : "Basic",
        // "Access-Control-Allow-Methods" : "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        
  },
//   auth: {
//     username: 'administrator',
//     password: 'vortmasp12#$'
//         }
    });
}

export const getPost = (postId, replType) => dispatch => {

    var count = 0;
    var postResult = [] //결과값 저장 배열
    // 먼저, 요청이 시작했다는것을 알립니다
    dispatch({type: GET_REPLEPOST_PENDING});

    postId.forEach(element => {
        
        var postUrl = element[element.findIndex(x => x.Name === replType)].Uri
  
        // 요청을 시작합니다
        // 여기서 만든 promise 를 return 해줘야, 나중에 컴포넌트에서 호출 할 때 getPost().then(...) 을 할 수 있습니다
        getPostAPI(postUrl).then(
            (response) => {
                // 요청이 성공했을경우, 서버 응답내용을 payload 로 설정하여 GET_POST_SUCCESS 액션을 디스패치합니다.
                postResult.push(response.data);
                count = count + 1;

                if(count === postId.length){
                    dispatch({
                        type: GET_REPLEPOST_SUCCESS,
                        payload: postResult
                    })
                }
            }
        ).catch(error => {
            // 에러가 발생했을 경우, 에로 내용을 payload 로 설정하여 GET_POST_FAILURE 액션을 디스패치합니다.
            dispatch({
                type: GET_REPLEPOST_FAILURE,
                payload: error
            });
        })
    });

}

const initialState = {
    pending: false,
    error: false,
    isLoadingReple: false,
    data: [],

}

export default handleActions({
    [GET_REPLEPOST_PENDING]: (state, action) => {
        return {
            ...state,
            pending: true,
            error: false
        };
    },
    [GET_REPLEPOST_SUCCESS]: (state, action) => {
        return {
            ...state,
            pending: false,
            isLoadingReple: true,
            data: action.payload
        };
    },
    [GET_REPLEPOST_FAILURE]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: true
        }
    }


}, initialState);
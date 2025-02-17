import { handleActions } from 'redux-actions';

import axios from 'axios';
// import { listenerCount } from 'cluster';


const GET_POST_PENDING = 'GET_POST_PENDING';
const GET_POST_SUCCESS = 'GET_POST_SUCCESS';
const GET_POST_FAILURE = 'GET_POST_FAILURE';

function getPostAPI(postId) {
    if (typeof postId == "undefined"){
        postId = '';
    }
    return axios.get(`http://migrate.eonit.co.kr${postId}`, {

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
}


export const getPost = (postId) => dispatch => {
    // 먼저, 요청이 시작했다는것을 알립니다
    dispatch({type: GET_POST_PENDING});

    // 요청을 시작합니다
    // 여기서 만든 promise 를 return 해줘야, 나중에 컴포넌트에서 호출 할 때 getPost().then(...) 을 할 수 있습니다
    return getPostAPI(postId).then(
        (response) => {
            // 요청이 성공했을경우, 서버 응답내용을 payload 로 설정하여 GET_POST_SUCCESS 액션을 디스패치합니다.
            
            var resp = response.data;
            var count = 0;
            resp.Workloads.forEach(workload => {
                getPostAPI(workload.Uri).then(
                    (response) => {
                        if(response.data.CurrentState === "Idle"){
                            response.data.ImportantStat = "5";
                        }else if(response.data.CurrentState === "RunningIncremental"){
                            response.data.ImportantStat = "3";
                        }else if(response.data.CurrentState === "Replicating"){
                            response.data.ImportantStat = "4";
                        }else if(response.data.CurrentState === "RunningIncremental"){
                            response.data.ImportantStat = "2";
                        }else if(response.data.CurrentState === "RunningIncrementalAndTestFailover"){
                            response.data.ImportantStat = "2";
                        }else if(response.data.CurrentState === "RunningTestFailover"){
                            response.data.ImportantStat = "2";
                        }else if(response.data.CurrentState === "WaitingForCancelTestFailover"){
                            response.data.ImportantStat = "1";
                        }else if(response.data.CurrentState === "CancellingFailover"){
                            response.data.ImportantStat = "1";
                        }else{
                            response.data.ImportantStat = "1";
                        }

                        workload.detail = response.data;
                        count = count + 1;
                        if (count === resp.Workloads.length){
                            dispatch({
                                type: GET_POST_SUCCESS,
                                payload: resp
                            })
                        }
                    }
                ).catch(error => {
                    // 에러가 발생했을 경우, 에로 내용을 payload 로 설정하여 GET_POST_FAILURE 액션을 디스패치합니다.
                    dispatch({
                        type: GET_POST_FAILURE,
                        payload: error
                    });
                })

            // dispatch({
            //     type: GET_POST_SUCCESS,
            //     payload: resp
            // })
            })

        }
    ).catch(error => {
        // 에러가 발생했을 경우, 에로 내용을 payload 로 설정하여 GET_POST_FAILURE 액션을 디스패치합니다.
        dispatch({
            type: GET_POST_FAILURE,
            payload: error
        });
    })

}

const initialState = {
    pending: false,
    error: false,
    isLoading: false,
    data: [],

}

export default handleActions({
    [GET_POST_PENDING]: (state, action) => {
        return {
            ...state,
            pending: true,
            error: false
        };
    },
    [GET_POST_SUCCESS]: (state, action) => {
        return {
            ...state,
            pending: false,
            isLoading: true,
            data: action.payload.Workloads
        };
    },
    [GET_POST_FAILURE]: (state, action) => {
        return {
            ...state,
            pending: false,
            error: true
        }
    }


}, initialState);
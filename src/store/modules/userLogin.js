import { createAction, handleActions } from 'redux-actions';
import * as service from 'services/posts';
import { Map } from 'immutable';
// import { listenerCount } from 'cluster';

function postTokenReissue(data){
    console.log(data.X_REFRESH_TOKEN);
    let result = await service.postTokenReissue(data.X_REFRESH_TOKEN);

    console.log(result.data.data.X_AUTH_TOKEN);

    data.X_AUTH_TOKEN = result.data.data.X_AUTH_TOKEN;

    return data;
}

const GET_POST_PENDING = 'GET_POST_PENDING';
const GET_POST_SUCCESS = 'GET_POST_SUCCESS';
const GET_POST_FAILURE = 'GET_POST_FAILURE';
const SET_LOGGED_INFO = 'userLogin/SET_LOGGED_INFO';
const REFRESH_ACCESS_TOKEN = 'userLogin/REFRESH_ACCESS_TOKEN';
const DELTE_LOGGED_INFO = 'userLogin/DELTE_LOGGED_INFO';


export const setLoggedInfo = createAction(SET_LOGGED_INFO, postTokenReissue);
export const refreshAccessToken = createAction(REFRESH_ACCESS_TOKEN,  (authToken, exAuthToken) => ({authToken: authToken, exAuthToken: exAuthToken}));
export const deleteLoggedInfo = createAction(DELTE_LOGGED_INFO);
export const postTokenReissue = (postId) => dispatch => {
    // 먼저, 요청이 시작했다는것을 알립니다
    dispatch({type: GET_POST_PENDING});

    // 요청을 시작합니다
    // 여기서 만든 promise 를 return 해줘야, 나중에 컴포넌트에서 호출 할 때 getPost().then(...) 을 할 수 있습니다
    return getPostAPI(postId).then(
        (response) => {
            // 요청이 성공했을경우, 서버 응답내용을 payload 로 설정하여 GET_POST_SUCCESS 액션을 디스패치합니다.
            dispatch({
                type: GET_POST_SUCCESS,
                payload: response
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
    data: [],

}

export default handleActions({

    [SET_LOGGED_INFO]: (state, action) => {

        console.log(state);
        console.log(action);
        return{
            data: action.payload
        }
    },
    [REFRESH_ACCESS_TOKEN]: (state, action) => {
        var result = state.data;
        console.log(action);
        result.X_AUTH_TOKEN = action.payload.authToken;
        result.exAuthToken = action.payload.exAuthToken;
        
        return{
            data: result
        }
    },
    [DELTE_LOGGED_INFO]: (state, action) => {
        return {
            data: ""
        }
    }


}, initialState);
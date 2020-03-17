import { createAction, handleActions } from 'redux-actions';
import * as service from 'services/posts';
import { pender } from 'redux-pender';
import { Map } from 'immutable';
import axios from 'axios';

function authUserWorkAPI(userInfo){
    return service.postTokenReissue(userInfo.X_REFRESH_TOKEN);
}


const SET_LOGGED_INFO = 'userLogin/SET_LOGGED_INFO';
const SET_REFRESH_ACCESS_TOKEN = 'userLogin/SET_REFRESH_ACCESS_TOKEN';
const REFRESH_ACCESS_TOKEN = 'userLogin/REFRESH_ACCESS_TOKEN';
const DELTE_LOGGED_INFO = 'userLogin/DELTE_LOGGED_INFO';


export const refreshAccessToken = createAction(REFRESH_ACCESS_TOKEN,  (authToken, exAuthToken) => ({authToken: authToken, exAuthToken: exAuthToken}));
export const deleteLoggedInfo = createAction(DELTE_LOGGED_INFO);
export const setLoggedInfo = createAction(SET_LOGGED_INFO);
export const setRefreshAccessToken = createAction(SET_REFRESH_ACCESS_TOKEN, authUserWorkAPI);


const initialState = {
    data: [],

}

export default handleActions({
    ...pender({
        type: SET_REFRESH_ACCESS_TOKEN, // type 이 주어지면, 이 type 에 접미사를 붙인 액션핸들러들이 담긴 객체를 생성합니다.
        /*
            요청중 / 실패 했을 때 추가적으로 해야 할 작업이 있다면 이렇게 onPending 과 onFailure 를 추가해주면됩니다.
            onPending: (state, action) => state,
            onFailure: (state, action) => state
        */
        onSuccess: (state, action) => { // 성공했을때 해야 할 작업이 따로 없으면 이 함수 또한 생략해도 됩니다.
            var result = state.data;
            result.X_AUTH_TOKEN = action.payload.data.data.X_AUTH_TOKEN;
            result.exAuthToken = action.payload.data.data.exAuthToken;
            return {
                data: result
            }
        }
        // 함수가 생략됐을때 기본 값으론 (state, action) => state 가 설정됩니다 (state 를 그대로 반환한다는 것이죠)
    }),


    [SET_LOGGED_INFO]: (state, action) => {
        return{
            data: action.payload
        }
    },
    [REFRESH_ACCESS_TOKEN]: (state, action) => {
        var result = state.data;
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
import { createAction, handleActions } from 'redux-actions';
import * as service from 'services/posts';
import { Map } from 'immutable';
// import { listenerCount } from 'cluster';


const SET_LOGGED_INFO = 'userLogin/SET_LOGGED_INFO';
const REFRESH_ACCESS_TOKEN = 'userLogin/REFRESH_ACCESS_TOKEN';


export const setLoggedInfo = createAction(SET_LOGGED_INFO);
export const refreshAccessToken = createAction(REFRESH_ACCESS_TOKEN,  (authToken, exAuthToken) => ({authToken: authToken, exAuthToken: exAuthToken}));


const initialState = {
    data: [],

}

export default handleActions({

    [SET_LOGGED_INFO]: (state, action) => {
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
    }


}, initialState);
import { combineReducers } from 'redux';
import userLogin from './userLogin';
import { penderReducer } from 'redux-pender';



export default combineReducers({
// 다른 리듀서를 만들게되면 여기에 넣어줌..
    userLogin,
    pender: penderReducer //펜더 리듀서 이거 미들웨어 추가한거임.
});
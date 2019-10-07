import { combineReducers } from 'redux';
import post from './post';


export default combineReducers({
  post,
  // 다른 리듀서를 만들게되면 여기에 넣어줌..
});
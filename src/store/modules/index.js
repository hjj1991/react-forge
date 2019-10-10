import { combineReducers } from 'redux';
import post from './post';
import checkbox from './checkbox';


export default combineReducers({
  post,
  checkbox
  // 다른 리듀서를 만들게되면 여기에 넣어줌..
});
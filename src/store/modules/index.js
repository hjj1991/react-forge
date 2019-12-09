import { combineReducers } from 'redux';
import post from './post';
import checkbox from './checkbox';
import button from './button';
import postReple from './postReple';


export default combineReducers({
  post,
  checkbox,
  button,
  postReple
  // 다른 리듀서를 만들게되면 여기에 넣어줌..
});
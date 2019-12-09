import { createAction, handleActions } from 'redux-actions';

// import { listenerCount } from 'cluster';

// 액션 타입을 정의
const BUTTON_ITEM = 'button/BUTTON_ITEM';

// 액션 생성 함수를 생성
export const buttonItem = createAction(BUTTON_ITEM);

// 모듈의 초기 상태 정의
const initialState = {

}

export default handleActions({
    [BUTTON_ITEM]: (state, action) => {
    }

}, initialState);
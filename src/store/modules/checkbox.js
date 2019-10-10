import { createAction, handleActions } from 'redux-actions';

// import { listenerCount } from 'cluster';

// 액션 타입을 정의
const CHECK_ALL_ITEM = 'checkbox/CHECK_ALL_ITEM';

// 액션 생성 함수를 생성
export const checkAllItem = createAction(CHECK_ALL_ITEM);

// 모듈의 초기 상태 정의
const initialState = {
    isChecked: false
}

export default handleActions({
    [CHECK_ALL_ITEM]: (state, action) => {
        var isChecked;
        if (state.isChecked === false){
            isChecked = true;
        } else {
            isChecked = false;
        }

        return {
            isChecked
        };
    }

}, initialState);
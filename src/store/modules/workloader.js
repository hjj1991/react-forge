import { createAction, handleActions } from 'redux-actions';

//액션 타입 정의

const GET_WORKLOADLIST = 'workloader/GET_WORKLOADLIST';

// **** 액션생성함수 정의 
export const getWorkLoadList = createAction(GET_WORKLOADLIST);


// **** 초기상태 정의
const initialState = {
    color: 'red',
};


// **** handleActions 로 리듀서 함수 작성
export default handleActions(
    {
      [GET_WORKLOADLIST]: (state, action) => ({
        ...state,
        input: action.payload,
      }),
    },
    initialState
  );
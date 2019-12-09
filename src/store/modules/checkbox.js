import { createAction, handleActions } from 'redux-actions';

// import { listenerCount } from 'cluster';

// 액션 타입을 정의
const CHECKED_ITEM = 'checkbox/CHECKED_ITEM';

// 액션 생성 함수를 생성
export const checkedItem = createAction(CHECKED_ITEM);

// 모듈의 초기 상태 정의
const initialState = {
    checkedListValue: [],
    isRunReplication: true,
    isRunTestFailover: true,
    checkboxList: []
}

export default handleActions({
    [CHECKED_ITEM]: (state, action) => {
        var checkboxList = []
        var checkedList = []
        var trueCount = 0;
        var failoverCount = 0;
        var isRepleTrue;
        var isRunTestFailover;
        
        // for(var j = 0; j < document.getElementsByName("workloadBox").length; j++){  //체크박스 갯수 계산
        //     checkboxList.push(document.getElementsByName("workloadBox")[j].checked);
        // }

        for(var i = 0; i < document.getElementsByName("workloadBox").length; i++){
            checkboxList.push(document.getElementsByName("workloadBox")[i].checked);    //체크박스 체크상태 확인
            if(document.getElementsByName("workloadBox")[i].checked){
                checkedList.push(JSON.parse(document.getElementsByName("workloadBox")[i].value));
            }
        }
        
        checkedList.forEach(function(element){
            element.forEach(function(a){
                if(a.Name === 'RunReplication'){
                    trueCount = trueCount + 1;
                }
                if(a.Name === 'TestFailover'){
                    failoverCount = failoverCount + 1;
                }
            });
        });
        
        if(checkedList.length === 0 ){
            isRepleTrue = true;
        }else if (trueCount === checkedList.length){
            isRepleTrue = false;
        }else {
            isRepleTrue = true;
        }

        if(checkedList.length === 0 ){
            isRunTestFailover = true;
        }else if (trueCount === checkedList.length){
            isRunTestFailover = false;
        }else {
            isRunTestFailover = true;
        }


        console.log(checkedList);

        return {
            checkedListValue: checkedList,
            isRunReplication: isRepleTrue,
            isRunTestFailover: isRunTestFailover,
            checkboxList: checkboxList
        };
    }

}, initialState);
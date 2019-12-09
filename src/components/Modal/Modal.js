import React from 'react';
import './Modal.css';

const Modal = ({ isOpen, isOk }) => {
    //console.log(isOk);
    return (
        <React.Fragment>
        {
        isOpen ?
        <React.Fragment>
            <div className="Modal-overlay" />
            <div className="Modal">
            <p className="title"></p>
            <div className="content">
                <p>
                작업이 정상적으로 시작되었습니다.
                </p>
            </div>
            <div className="button-wrap">
                <button onClick={isOk}>확인</button>
            </div>
            </div>
        </React.Fragment>
        :
        null
    
}
</React.Fragment>
)
}
export default Modal;
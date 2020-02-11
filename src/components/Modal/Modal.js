import React from 'react';
import { Link } from 'react-router-dom';
import './Modal.css';

const Modal = ({ isOpen, contents, page }) => {
    //console.log(isOk);
    var locationPage;
    if(typeof page == "undefined"){
        locationPage = "/";
    }else{
        locationPage = page;
    }

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
                {contents}
                </p>
            </div>
            <div className="button-wrap">
                <Link to={locationPage}><button>확인</button></Link>
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
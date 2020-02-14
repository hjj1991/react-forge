import React, { Fragment } from 'react';
import MyInfoContainer from 'containers/MyInfoContainer';
import Menu from 'components/Menu';

const MyInfo = () => {
    return (
        <Fragment>
            <Menu/>
            <MyInfoContainer />
        </Fragment>
    );
};

export default MyInfo;
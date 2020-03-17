import React, { Fragment } from 'react';
import MyInfoContainer from 'containers/MyInfoContainer';
import Menu from 'components/Menu';

const MyInfo = (match) => {
    return (
        <Fragment>
            <Menu match={match} />
            <MyInfoContainer />
        </Fragment>
    );
};

export default MyInfo;
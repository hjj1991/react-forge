import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import * as loginOkActions from '../store/modules/userLogin';
import PropTypes from "prop-types";
import Menu from 'components/Menu';
 
const PrivateRoute = ({ component: Component, userInfo, ...rest}) => (

        
    <Route
        {...rest}
        render={props => {
            if (typeof userInfo.name == "undefined"){
                return <Redirect to ="/signin" />
            }else{
                return (
                    <React.Fragment>
                        <Menu {...props} />
                        <Component {...props} />
                    </React.Fragment>
                )
            }
            
        }}
    />
);    
 
const mapStateToProps = state => ({
    userInfo: state.userLogin.data
});
 
export default connect(mapStateToProps)(PrivateRoute);
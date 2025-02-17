import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
// 유저 alert
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'
// **** (1) createStore 와 루트 리듀서 불러오기
import { createStore, applyMiddleware, compose  } from 'redux';
import rootReducer from './store/modules';
// **** (1) Provider 불러오기
import { Provider } from 'react-redux';
import { createLogger } from 'redux-logger';
import ReduxThunk from 'redux-thunk';
import penderMiddleware from 'redux-pender';
import Root from './client/Root';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as serviceWorker from './serviceWorker';


// optional cofiguration
const options = {
    // you can also just use 'bottom center'
    position: positions.BOTTOM_CENTER,
    timeout: 5000,
    offset: '30px',
    // you can also just use 'scale'
    transition: transitions.SCALE
  }

// **** 리덕스 개발자도구 적용
// const devTools =
//   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose;

const logger = createLogger();

// const store = createStore(rootReducer,  composeEnhancers(applyMiddleware(logger, ReduxThunk, penderMiddleware())));
const store = createStore(rootReducer);


// **** (2) Provider 렌더링해서 기존의 App 감싸주기
ReactDOM.render(
    <AlertProvider template={AlertTemplate} {...options}>
    <Provider store={store}>
      <Root />
    </Provider>
    </AlertProvider>,
    document.getElementById('root')
  );
  //registerServiceWorker();

// ReactDOM.render(<Root />, document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

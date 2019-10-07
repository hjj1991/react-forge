import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
// **** (1) createStore 와 루트 리듀서 불러오기
import { createStore, applyMiddleware  } from 'redux';
import rootReducer from './store/modules';
// **** (1) Provider 불러오기
import { Provider } from 'react-redux';
import { createLogger } from 'redux-logger';
import ReduxThunk from 'redux-thunk';
import Root from './client/Root';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as serviceWorker from './serviceWorker';

// **** 리덕스 개발자도구 적용
// const devTools =
//   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

const logger = createLogger();

const store = createStore(rootReducer, applyMiddleware(logger, ReduxThunk));

// **** (2) Provider 렌더링해서 기존의 App 감싸주기
ReactDOM.render(
    <Provider store={store}>
      <Root />
    </Provider>,
    document.getElementById('root')
  );
  //registerServiceWorker();

// ReactDOM.render(<Root />, document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

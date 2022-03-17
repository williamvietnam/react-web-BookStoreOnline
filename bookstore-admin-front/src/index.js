import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { ApolloProvider } from '@apollo/react-hooks';
import client from './apollo-client/index';
import { LocaleProvider, ConfigProvider } from 'antd';
import viVN from 'antd/lib/locale-provider/vi_VN';
import { Router } from 'react-router-dom';
import history from './utils/history';
import moment from 'moment';
import 'moment/locale/vi';
import thunk from 'redux-thunk';
import rootReducer from './redux/reducers';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

const composeEnhancers = composeWithDevTools({
    // Specify here name, actionsBlacklist, actionsCreators and other options
});
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));
moment.locale('vi');

ReactDOM.render(<ApolloProvider client={client}>
    <Provider store={store}>
        <ConfigProvider locale={viVN}>
            <Router history={history}>
                <App />
            </Router>
        </ConfigProvider>
    </Provider>
</ApolloProvider>, document.getElementById('main-content'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

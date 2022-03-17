import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import thunk from 'redux-thunk';
import rootReducer from './redux/reducers';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { ApolloProvider } from '@apollo/react-hooks';
import client from './apollo-client';
import history from './utils/history';
import { Router } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/vi';

const composeEnhancers = composeWithDevTools({
  // Specify here name, actionsBlacklist, actionsCreators and other options
});
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));
moment.locale('vi');

ReactDOM.render(<ApolloProvider client={client}>
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider></ApolloProvider>, document.getElementById('wrapper'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

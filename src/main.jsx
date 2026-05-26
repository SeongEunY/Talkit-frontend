import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Provider } from 'react-redux';
import store from './store';
import { initializeStore } from './api/axiosInstance';
import { logout } from './slices/loginSlice';

// store 초기화
initializeStore(store, logout);

const root = document.getElementById('root');

ReactDOM.createRoot(root).render(
  <Provider store={store}>
    <App />
  </Provider>,
);

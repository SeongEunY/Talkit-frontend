import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './slices/loginSlice.js';

export default configureStore({
  reducer: {
    login: loginReducer, 
  },
});
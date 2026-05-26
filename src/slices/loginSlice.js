import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance';

const hasAccessToken = () => {
  return document.cookie.split('; ').some((row) => row.startsWith('accessToken='));
};

const hasRefreshToken = () => {
  return document.cookie.split('; ').some((row) => row.startsWith('refreshToken='));
};

export const fetchUserStatus = createAsyncThunk(
  'login/fetchUserStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/auth/status');
      
      return response.data.data || response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Logged out status');
    }
  }
);

const loadState = () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  return { isLoggedIn: isLoggedIn === 'true' };
};

const initialState = {
  ...loadState(),
  userId: '',
  email: '',
  nickname: '',
  status: 'idle',
  error: null,
  isInitialized: false,
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  
  reducers: {
    loginSuccess: (state, action) => {
      state.userId = action.payload.userId;
      state.email = action.payload.email;
      state.nickname = action.payload.nickname;
      state.isLoggedIn = true;
      state.status = 'succeeded';
      state.isInitialized = true;
      localStorage.setItem('isLoggedIn', 'true');
    },
    logout: (state) => {
      state.userId = '';
      state.email = '';
      state.nickname = '';
      state.isLoggedIn = false;
      state.status = 'idle';
      state.error = null;
      state.isInitialized = true;
      localStorage.removeItem('isLoggedIn');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserStatus.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUserStatus.fulfilled, (state, action) => {
        state.userId = action.payload.userId;
        state.email = action.payload.email;
        state.nickname = action.payload.nickname;
        state.isLoggedIn = true;
        state.status = 'succeeded';
        state.isInitialized = true;
        localStorage.setItem('isLoggedIn', 'true');
      })
      .addCase(fetchUserStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.isInitialized = true;
        state.isLoggedIn = false;
        localStorage.removeItem('isLoggedIn');
      });
  },
});

export const { loginSuccess, logout } = loginSlice.actions;
export default loginSlice.reducer;
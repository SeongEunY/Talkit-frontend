import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'; 
import { fetchUserStatus } from './slices/loginSlice.js';
import { RouterProvider } from 'react-router-dom';
import router from '../src/routes/Router.jsx';

function App() {
  const dispatch = useDispatch();
  
  // 🚩 store.js에 등록된 리듀서 키 이름이 'loginSlice'가 맞는지 꼭 확인하세요!
  // 만약 store에서 login: loginReducer 라고 했다면 state.login 으로 바꿔야 합니다.
  const loginState = useSelector((state) => state.login || state.loginSlice);
  const isInitialized = loginState?.isInitialized;

  useEffect(() => {
    console.log('App mounted, dispatching fetchUserStatus...');
    dispatch(fetchUserStatus())
      .then((result) => {
        console.log('FetchUserStatus result:', result);
      })
      .catch((error) => {
        console.error('FetchUserStatus error:', error);
      });
  }, [dispatch]);

  // 서버로부터 정보를 받아올 때까지(isInitialized가 true가 될 때까지) 가드!
  if (!isInitialized) {
    return (
      <div className="flex justify-center items-center h-screen font-bold">
        잠시만 기다려주세요...
      </div>
    ); 
  }

  return <RouterProvider router={router} />;
}

export default App;
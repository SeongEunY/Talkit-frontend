import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../slices/loginSlice';
import axiosInstance from '../../api/axiosInstance';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    
    if (!formData.email || !formData.password) {
      alert("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axiosInstance.post('/api/users/login', formData);
      const responseBody = response.data; 
      const userData = responseBody.data?.user;

      if (userData) {
        dispatch(loginSuccess(userData));
        alert("로그인에 성공했습니다!");
        navigate('/home'); 
      }
    } catch (error) {
      setFormData(prev => ({ ...prev, password: '' }));

      if (error.response) {
        const serverMsg = error.response.data?.message;
        if (serverMsg === "사용자를 찾을 수 없습니다.") {
          alert("이메일 또는 비밀번호가 일치하지 않습니다.");
        } else if (serverMsg === "회원탈퇴 요청이 된 사용자입니다.") {
          if (window.confirm("회원 탈퇴 요청이 된 계정입니다. 지금 복구하여 다시 로그인하시겠습니까?")) {
            handleRestoreAccount(formData.email);
          }
        }else {
          alert(serverMsg || "로그인 정보를 확인해주세요.");
        }
      } else {
        alert("서버 연결에 실패했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestoreAccount = async (email) => {
  try {
    await axiosInstance.patch('/api/users/restore', { email });
    alert("계정이 복구되었습니다. 다시 로그인해주세요.");
    setFormData(prev => ({ ...prev, password: '' }));
  } catch (error) {
    alert(error.response?.data?.message || "계정 복구 중 오류가 발생했습니다.");
  }
};

  const handleSocialLogin = (provider) => {
    alert(`${provider} 로그인 연동 준비중입니다!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            말잇기
          </h1>
          <p className="text-gray-600">당신의 이야기를 이어가세요</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="이메일을 입력하세요"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">비밀번호</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="비밀번호를 입력하세요"
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-medium shadow-lg transition-all transform ${
              isLoading ? "opacity-70 cursor-not-allowed" : "hover:from-purple-700 hover:to-pink-700 hover:scale-[1.02] active:scale-95"
            }`}
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-4 text-sm text-gray-400">간편 로그인</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        {/* 소셜 로그인 버튼 유지 */}
        <div className="space-y-3">
          <button
            onClick={() => handleSocialLogin('카카오')}
            className="w-full bg-[#FEE500] text-[#191919] py-3 rounded-xl font-medium hover:bg-[#FADA0A] transition-all flex items-center justify-center gap-2"
          >
            <div className="w-5 h-5 bg-[#191919] rounded-full flex items-center justify-center">
              <span className="text-[10px] text-[#FEE500]">K</span>
            </div>
            카카오로 로그인하기
          </button>
          
          <button
            onClick={() => handleSocialLogin('구글')}
            className="w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            구글로 로그인하기
          </button>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            아직 계정이 없으신가요?{" "}
            <button
              onClick={() => navigate('/signup')}
              className="text-purple-600 font-bold hover:underline ml-1"
            >
              회원가입
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ChevronDown, Eye, EyeOff } from 'lucide-react';
import axiosInstance from "../../api/axiosInstance";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '', password: '', nickname: '', gender: '', birthYear: '', agreeTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSignup = async () => {
    if (!formData.agreeTerms) {
      alert('이용약관에 동의해주세요.');
      return;
    }
    try {
      const response = await axiosInstance.post('/api/users/signup', {
        email: formData.email,
        password: formData.password,
        nickname: formData.nickname,
        gender: formData.gender,
        birthYear: parseInt(formData.birthYear)
      });

      if (response.status === 200 || response.status === 201) {
        alert('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
        navigate('/login');
      }
    } catch (error) {
      console.error('회원가입 에러:', error);
      const message = error.response?.data?.message || '회원가입 실패';
      alert(message);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - 14 - i);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            사이사이
          </h1>
          <p className="text-gray-600">새로운 계정을 만들어보세요</p>
        </div>

        <div className="space-y-6">
          {/* 이메일 */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">이메일 *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="이메일을 입력하세요"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
          </div>

          {/* 비밀번호 */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">비밀번호 *</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="비밀번호를 입력하세요"
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                required
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

          {/* 닉네임 */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">닉네임 *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="nickname"
                value={formData.nickname}
                onChange={handleInputChange}
                placeholder="사용할 닉네임을 입력하세요"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
          </div>

          {/* 성별 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">성별 *</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, gender: '남성' }))}
                className={`py-3 px-4 rounded-xl border-2 transition-all duration-200 ${
                  formData.gender === '남성'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                남성
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, gender: '여성' }))}
                className={`py-3 px-4 rounded-xl border-2 transition-all duration-200 ${
                  formData.gender === '여성'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                여성
              </button>
            </div>
          </div>

          {/* 출생년도 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">출생년도</label>
            <div className="relative">
              <select
                name="birthYear"
                value={formData.birthYear}
                onChange={handleInputChange}
                className="w-full py-3 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
              >
                <option value="">선택하세요</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}년</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
          </div>

          {/* 약관 동의 */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleInputChange}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <label className="text-sm text-gray-700">
              <span className="text-purple-600 underline cursor-pointer">이용약관</span> 및 <span className="text-purple-600 underline cursor-pointer">개인정보처리방침</span>에 동의합니다 *
            </label>
          </div>

          {/* 회원가입 버튼 */}
          <button
            type="button"
            onClick={handleSignup}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!formData.email || !formData.password || !formData.nickname || !formData.gender || !formData.agreeTerms}
          >
            회원가입
          </button>
        </div>

        {/* 소셜 회원가입 및 로그인 링크 */}
        <div className="flex flex-col items-center mt-6 space-y-3">
          <div className="flex items-center my-6 w-full">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">또는</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <button
            onClick={() => handleSocialLogin('카카오')}
            className="w-full bg-yellow-400 text-black py-3 rounded-xl font-medium hover:bg-yellow-500 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <div className="w-5 h-5 bg-black rounded-full"></div>
            <span>카카오로 간편가입</span>
          </button>
          <button
            onClick={() => handleSocialLogin('구글')}
            className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <div className="w-5 h-5 bg-gradient-to-r from-red-500 to-blue-500 rounded-full"></div>
            <span>구글로 간편가입</span>
          </button>

          <div className="text-center mt-4">
            <span className="text-gray-600">이미 계정이 있으신가요? </span>
            <button
              onClick={() => navigate('/login')}
              className="text-purple-600 font-medium hover:text-purple-700 transition-colors duration-200"
            >
              로그인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;

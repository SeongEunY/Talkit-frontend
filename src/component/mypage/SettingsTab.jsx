// 닉네임 수정 및 환경 설정
import React, { useState } from 'react';
import axiosInstance from "../../api/axiosInstance";
import NicknameEditModal from '../modal/NicknameEditModal';
import PasswordEditModal from '../modal/PasswordEditModal';

const SettingsTab = ({
  user,
  handleUpdateNickname,
}) => {
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');

  const handleVerifyPassword = async () => {
    if (!currentPassword.trim()) {
      alert("현재 비밀번호를 입력해주세요.");
      return;
    }

    try {
      const response = await axiosInstance.post('/api/users/verify-password', {
        currentPassword: currentPassword
      });
      if (response.status === 200 || response.data.data === true) {
        setIsPasswordModalOpen(true);
      } else {
        alert("비밀번호 확인에 실패했습니다.");
      }

    } catch (error) {
      const errorMessage = error.response?.data?.message || "비밀번호가 일치하지 않습니다.";
      alert(errorMessage);
      setIsPasswordModalOpen(false);
    }
  };

  const handleUpdatePassword = async ({ newPassword }) => {
    try {
      await axiosInstance.patch('/api/users/update-password', {
        currentPassword,
        newPassword
      });
      alert('비밀번호가 성공적으로 변경되었습니다.');
      setIsPasswordModalOpen(false);
      setCurrentPassword('');
    } catch (error) {
      alert(error.response?.data?.message || '변경 실패');
    }
  };

  const handleWithdraw = async () => {
    if (!window.confirm("정말로 탈퇴하시겠습니까?\n한 달 이내 로그인할 시 계정이 복구되며 아닐 시 모든 정보가 영구 삭제됩니다.")) {
      return;
    }
    try {
      await axiosInstance.patch('/api/users/withdraw');
      alert("회원 탈퇴 요청이 완료되었습니다.");
      localStorage.clear(); 
      window.location.href = "/"; 
    } catch (error) {
      const errorMessage = error.response?.data?.message || "탈퇴 처리 중 오류가 발생했습니다.";
      alert(errorMessage);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* 프로필 설정 */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">프로필 설정</h2>

        <div className="space-y-4">
          {/* 닉네임 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              닉네임
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={user.nickname}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
              />
              <button
                onClick={() => setIsNicknameModalOpen(true)}
                className="px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 whitespace-nowrap"
              >
                수정
              </button>
            </div>
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              현재 비밀번호 확인
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                placeholder="현재 비밀번호를 먼저 입력하세요"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
              <button
                onClick={handleVerifyPassword}
                className="px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 whitespace-nowrap"
              >
                변경
              </button>
            </div>
          </div>

          {/* 이메일 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이메일
            </label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>
        </div>
        <div className="text-right mt-2">
    <button
      onClick={handleWithdraw}
      className="text-xs text-gray-400 hover:text-red-500 underline transition-colors"
    >
      회원 탈퇴
    </button>
  </div>
      </div>

    

      <NicknameEditModal
        isOpen={isNicknameModalOpen}
        onClose={() => setIsNicknameModalOpen(false)}
        currentNickname={user.nickname}
        onSubmit={(nickname) => {
          handleUpdateNickname(nickname);
          setIsNicknameModalOpen(false);
        }}
      />

      <PasswordEditModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSubmit={handleUpdatePassword}
      />
    </div>
  );
};

export default SettingsTab;

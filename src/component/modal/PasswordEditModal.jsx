import React, { useState } from 'react';
import Modal from '../common/Modal';
import { Lock, Eye, EyeOff } from 'lucide-react';

const PasswordEditModal = ({ isOpen, onClose, onSubmit }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newPassword.trim() || !confirmPassword.trim()) {
      alert("비밀번호를 입력해주세요.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("새 비밀번호가 일치하지 않습니다.");
      return;
    }
    onSubmit({ newPassword });
    setNewPassword('');
    setConfirmPassword('');
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="비밀번호 변경">
      <div className="space-y-4 py-2">
        
        {/* 새 비밀번호 섹션 */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">새 비밀번호</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="새 비밀번호 입력"
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* 새 비밀번호 확인 섹션 */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">새 비밀번호 확인</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="새 비밀번호 확인"
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {/* 비밀번호 불일치 안내 문구 (선택 사항) */}
          {confirmPassword && newPassword !== confirmPassword && (
            <p className="text-xs text-red-500 mt-1 ml-1">비밀번호가 일치하지 않습니다.</p>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!newPassword.trim() || newPassword !== confirmPassword}
          className={`w-full mt-4 py-3 text-white rounded-xl font-bold transition-colors ${
            (!newPassword.trim() || newPassword !== confirmPassword) 
            ? 'bg-gray-300 cursor-not-allowed' 
            : 'bg-purple-600 hover:bg-purple-700'
          }`}
        >
          비밀번호 변경하기
        </button>
      </div>
    </Modal>
  );
};

export default PasswordEditModal;
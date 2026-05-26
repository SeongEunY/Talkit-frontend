import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';

const NicknameEditModal = ({
  isOpen,
  onClose,
  currentNickname,
  onSubmit,
}) => {
  const [newNickname, setNewNickname] = useState('');

  useEffect(() => {
    if (isOpen) {
      setNewNickname('');
    }
  }, [isOpen]);

 
  const isInvalid = !newNickname.trim() || newNickname === currentNickname;

  const handleNicknameSubmit = () => {
    if (!isInvalid) {
      onSubmit(newNickname);
      setNewNickname('');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="닉네임 수정"
    >
      <label className="text-sm text-gray-600">현재 닉네임</label>
      <input
        value={currentNickname}
        disabled
        className="w-full px-4 py-3 mt-1 mb-4 bg-gray-50 border rounded-lg text-gray-400"
      />

      <label className="text-sm text-gray-600">새로운 닉네임</label>
      <input
        value={newNickname}
        onChange={(e) => setNewNickname(e.target.value)}
        placeholder="변경할 닉네임을 입력하세요"
        className="w-full px-4 py-3 mt-1 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all"
      />

      <button
        onClick={handleNicknameSubmit}
        disabled={isInvalid}
        className={`w-full mt-6 py-3 rounded-lg font-bold transition-colors ${
          isInvalid 
            ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
            : 'bg-purple-600 hover:bg-purple-700 text-white shadow-md'
        }`}
      >
        닉네임 변경하기
      </button>
    </Modal>
  );
};

export default NicknameEditModal;
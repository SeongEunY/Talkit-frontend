import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';

const CommunitySearchBar = ({ onSearch }) => {
  const [searchType, setSearchType] = useState('');
  const [keyword, setKeyword] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const options = [
    { value: '', label: '전체' },
    { value: 'TITLE', label: '제목' },
    { value: 'CONTENT', label: '내용' },
    { value: 'WRITER', label: '작성자' },
    { value: 'TAG', label: '태그' },
  ];

  const currentLabel = options.find(opt => opt.value === searchType)?.label;

  const handleSelect = (value) => {
    setSearchType(value);
    setIsOpen(false);

    if (value === '') {
      setKeyword('');
      onSearch({ searchType: '', keyword: '' });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({ searchType, keyword });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <form 
      onSubmit={handleSearch} 
      className="max-w-3xl mx-auto mb-8 px-4 bg-white rounded-2xl"
    >
      <div className="relative flex gap-2 p-1.5 bg-white border-2 border-green-100 rounded-2xl shadow-sm focus-within:border-green-400 transition-all">
        
        {/* 드롭다운 부모 태그 */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-between gap-2 px-4 py-2 bg-white rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors min-w-[100px]"
          >
            {currentLabel}
            <ChevronDown size={18} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* 드롭다운 메뉴 */}
          {isOpen && (
            <div className="absolute top-full left-0 mt-2 w-full min-w-[120px] bg-white border border-green-50 rounded-2xl shadow-xl z-50 overflow-hidden py-1 animate-in fade-in slide-in-from-top-1">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors
                    ${searchType === option.value ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-green-50 hover:text-green-600'}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 입력창 */}
        <div className="flex-1 flex items-center px-2">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="궁금한 이야기를 찾아보세요"
            className="w-full border-none text-gray-700 placeholder:text-gray-400 focus:ring-0 focus:outline-none"
          />
        </div>

        {/* 검색 버튼 */}
        <button
          type="submit"
          className="p-3 bg-green-400 text-white rounded-xl hover:bg-green-500 transition-colors"
        >
          <Search size={20} />
        </button>
      </div>
    </form>
  );
};

export default CommunitySearchBar;
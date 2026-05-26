import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

const PageHeader = ({ title, subtitle }) => (
  <div className="text-center mb-10">
    <h1 className="text-3xl font-bold text-gray-800 mb-3">{title}</h1>
    <p className="text-gray-600 leading-relaxed">{subtitle}</p>
  </div>
);

const CharacterCount = ({ current, max }) => (
  <div className="text-right text-sm text-gray-500 mt-2">
    {current} / {max}
  </div>
);

const Tag = ({ children, onRemove }) => (
  <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-black rounded-full text-sm font-medium">
    <span>{children}</span>
    <button
      onClick={onRemove}
      className="hover:text-blue-900 transition-colors ml-1"
      aria-label="태그 삭제"
    >
      ×
    </button>
  </div>
);

export default function StoryForm() {
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const maxTitle = 50;
  const maxContent = 1000;
  const maxTags = 5;

  const categories = [
    { id: 1, value: '대화후기', icon: '💬' },
    { id: 2, value: '일상공유', icon: '🌿' },
    { id: 3, value: '질문하기', icon: '❓' },
    { id: 4, value: '꿀팁공유', icon: '💡' },
    { id: 5, value: '감사인사', icon: '🙏' },
  ];

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && tags.length < maxTags && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleCancel = () => {
    if (window.confirm('작성 중인 내용이 있습니다. 정말 취소하시겠습니까?')) {
      setCategory('');
      setTitle('');
      setContent('');
      setTags([]);
      setTagInput('');
    }
  };

  const handleSubmit = async () => {
    if (!category || !title.trim() || !content.trim()) {
      alert('카테고리, 제목, 내용을 모두 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const requestData = {
        title: title,
        content: content,
        category: category,
        tags: tags
      };

      const response = await axiosInstance.post('/api/community/create',requestData);
      
      if(response.status === 200 || response.status===201) {
        alert('게시글이 성공적으로 등록되었습니다!');

        const createdPost = response.data.data;
        navigate('/community',{state:{newPost: createdPost}});

        setCategory('');
        setTitle('');
        setContent('');
        setTags([]);
      }

    }catch (error) {
        console.error("게시글 등록 에러:", error);
        const errorMsg = error.response?.data?.message || '등록 중 오류가 발생했습니다.';
        alert(errorMsg);
      }finally {
        setIsSubmitting(false);
      }
      
    
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <PageHeader
          title="📝 함께 나누는 이야기"
          subtitle={
            <>
              대화 후기부터 일상의 소소한 이야기까지, 따뜻하게 공유해보세요<br />
              여러분의 경험이 누군가에게 큰 힘이 될 수 있어요
            </>
          }
        />

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* 카테고리 선택 */}
          <div className="mb-8">
            <label className="block font-semibold mb-3">카테고리</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {categories.map(cat => (
                <div
                  key={cat.id}
                  onClick={() => setCategory(cat.value)}
                  className={`
                    flex items-center justify-center p-4 rounded-xl cursor-pointer
                    transition-all duration-300 font-medium
                    ${category === cat.value
                      ? 'border-2 border-blue-400 bg-blue-50'
                      : 'border-2 border-gray-200 bg-white hover:border-blue-200'
                    }
                  `}
                >
                  {cat.icon} {cat.value}
                </div>
              ))}
            </div>
          </div>

          {/* 제목 입력 */}
          <div className="mb-8">
            <label className="block font-semibold mb-3">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력해주세요"
              maxLength={maxTitle}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl 
                       focus:border-blue-400 focus:outline-none transition-colors"
            />
            <CharacterCount current={title.length} max={maxTitle} />
          </div>

          {/* 내용 입력 */}
          <div className="mb-8">
            <label className="block font-semibold mb-3">내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="따뜻했던 대화 경험이나 기억에 남는 말을 자유롭게 공유해주세요."
              maxLength={maxContent}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl 
                       focus:border-blue-400 focus:outline-none transition-colors
                       min-h-[150px] resize-y leading-relaxed"
            />
            <CharacterCount current={content.length} max={maxContent} />
          </div>

          {/* 키워드 태그 */}
          <div className="mb-8">
            <label className="block font-semibold mb-3">키워드 태그</label>
            <div className="flex flex-wrap gap-2 border-2 border-gray-200 rounded-xl p-3 bg-white mb-2">
              {tags.map(tag => (
                <Tag key={tag} onRemove={() => handleRemoveTag(tag)}>
                  {tag}
                </Tag>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleTagKeyPress}
                onBlur={handleAddTag}
                placeholder="키워드를 입력하고 Enter를 눌러주세요"
                disabled={tags.length >= maxTags}
                className="border-none outline-none flex-1 min-w-[100px] text-sm
                         disabled:bg-transparent disabled:cursor-not-allowed"
              />
            </div>
            <div className="text-sm text-gray-500">
              최대 5개까지 추가할 수 있어요 (예: 위로, 공감, 따뜻한말)
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex justify-center gap-4 mt-10">
            <button
              onClick={handleCancel}
              className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold
                       hover:bg-gray-200 transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`
                px-8 py-3 rounded-xl font-semibold transition-colors
                ${isSubmitting
                  ? 'bg-blue-300 cursor-not-allowed'
                  : 'bg-blue-400 hover:bg-blue-500 text-white'
                }
              `}
            >
              {isSubmitting ? '등록중...' : '게시글 등록'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
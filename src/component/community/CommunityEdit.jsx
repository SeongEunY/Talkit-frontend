import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

const PageHeader = ({ title, subtitle }) => (
  <div className="text-center mb-10">
    <h1 className="text-3xl font-bold text-gray-800 mb-3">{title}</h1>
    <p className="text-gray-600 leading-relaxed">{subtitle}</p>
  </div>
);

const CharacterCount = ({ current, max }) => (
  <div className="text-right text-sm text-gray-500 mt-2">{current} / {max}</div>
);

const Tag = ({ children, onRemove }) => (
  <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/20 text-green rounded-full text-sm font-medium">
    <span>{children}</span>
    <button onClick={onRemove} className="hover:text-blue-900 transition-colors ml-1">×</button>
  </div>
);

export default function CommunityEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axiosInstance.get(`/api/community/edit/${id}`);
        const postData = response.data.data;
        
        setCategory(postData.category);
        setTitle(postData.title);
        setContent(postData.content);
        setTags(postData.tags);
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
        alert('게시글을 불러오는데 실패했습니다.');
        navigate('/community');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [id, navigate]);

  const handleRemoveTag = (tagToRemove) => setTags(tags.filter(tag => tag !== tagToRemove));
  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && tags.length < maxTags && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const handleCancel = () => {
    if (window.confirm('수정을 취소하시겠습니까? 변경사항이 저장되지 않습니다.')) {
      navigate(-1);
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

      await axiosInstance.put(`/api/community/${id}`, requestData);
      
      alert('게시글이 성공적으로 수정되었습니다!');
      navigate(`/community/detail/${id}`); 
    } catch (error) {
      console.error("수정 중 에러:", error);
      alert('수정 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
    };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg font-medium text-gray-500 animate-pulse">게시글을 불러오는 중입니다...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEF6FF] to-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <PageHeader title="✏️ 이야기 수정하기" subtitle="작성하셨던 소중한 이야기를 다듬어보세요." />

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* 카테고리 선택 */}
          <div className="mb-8">
            <label className="block font-semibold mb-3 text-gray-700">카테고리</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {categories.map(cat => (
                <div
                  key={cat.id}
                  onClick={() => setCategory(cat.value)}
                  className={`flex items-center justify-center p-4 rounded-xl cursor-pointer transition-all duration-300 font-medium
                    ${category === cat.value 
                      ? 'border-2 border-primary bg-primary/10 text-gray-800' 
                      : 'border-2 border-gray-100 bg-white text-gray-500 hover:border-primary/50'}`}
                >
                  <span className="mr-2">{cat.icon}</span> {cat.value}
                </div>
              ))}
            </div>
          </div>

          {/* 제목 입력 */}
          <div className="mb-8">
            <label className="block font-semibold mb-3 text-gray-700">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력해주세요"
              maxLength={maxTitle}
              className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-primary focus:outline-none transition-colors"
            />
            <CharacterCount current={title.length} max={maxTitle} />
          </div>

          {/* 내용 입력 */}
          <div className="mb-8">
            <label className="block font-semibold mb-3 text-gray-700">내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력해주세요."
              maxLength={maxContent}
              className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-primary focus:outline-none transition-colors min-h-[250px] resize-y leading-relaxed"
            />
            <CharacterCount current={content.length} max={maxContent} />
          </div>

          {/* 키워드 태그 */}
          <div className="mb-8">
            <label className="block font-semibold mb-3 text-gray-700">키워드 태그</label>
            <div className="flex flex-wrap gap-2 border-2 border-gray-100 rounded-xl p-3 bg-white mb-2">
              {tags.map(tag => (
                <Tag key={tag} onRemove={() => handleRemoveTag(tag)}>{tag}</Tag>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder={tags.length < maxTags ? "태그 입력 후 Enter" : "태그는 최대 5개까지 가능합니다"}
                disabled={tags.length >= maxTags}
                className="border-none outline-none flex-1 min-w-[120px] text-sm disabled:bg-transparent"
              />
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className="flex justify-center gap-4 mt-10">
            <button
              onClick={handleCancel}
              className="px-8 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-10 py-3 rounded-xl font-bold transition-all shadow-md
                ${isSubmitting 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-primary hover:opacity-90 text-gray-800'}`}
            >
              {isSubmitting ? '수정 중...' : '수정 완료'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
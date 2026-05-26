import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, User, Grid, List, Loader2 } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance'; 
import TopButton from '../button/TopButton';
import CreateButton from '../button/CreateButton';
import CommunitySearchBar from './CommunitySearchBar';

const CommunityListPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalPostCount: 0,
    totalCommentCount: 0,
    activeUserCount: 0
  });

  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [viewMode, setViewMode] = useState('grid');
  const [isTopButtonVisible, setIsTopButtonVisible] = useState(false);
  const [searchCondition, setSearchCondition] = useState({ searchType: 'TITLE', keyword: '' });
  
  const navigate = useNavigate();

  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get('/api/community/stats');
      if (response.data && response.data.data) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("통계 데이터 로드 실패:", error);
    }
  }

  const fetchCommunityPosts = useCallback(async (condition) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/community/list', {
        params: { 
          pageNo: 0,
          pageSize: 10,
          searchType: condition?.searchType || 'TITLE',
          keyword: condition?.keyword || ''
        }
      });

      if (response.data && response.data.data) {
        setPosts(response.data.data.content || []);
      }
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearchSubmit = (newCondition) => {
    setSearchCondition(newCondition);
    fetchCommunityPosts(newCondition);
  };

  useEffect(() => {
    fetchCommunityPosts(searchCondition);
    fetchStats();

    const handleScroll = () => setIsTopButtonVisible(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchCommunityPosts, searchCondition]);
  

  const categories = ['전체', '대화후기', '일상공유', '질문하기', '꿀팁공유', '감사인사'];
  const filteredPosts = posts.filter(post => {
    if (selectedCategory === '전체') return true;
    if (selectedCategory === '인기글') return post.likeCount >= 20;
    return post.category === selectedCategory;
  });

return (
    <div className="min-h-screen bg-gray-50 relative pb-20">

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-purple-50 to-white pt-12 sm:pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-4">
            <span className="text-5xl">🌿</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">함께 나누는 이야기</h1>
          <p className="text-gray-600 mb-8">대화 후기부터 일상의 소소한 이야기까지, 마음껏 공유해보세요</p>
          
          {/* 통계 수치 영역 */}
          <div className="flex flex-wrap justify-center gap-8 sm:gap-16 mb-12">
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-green-400">
                {(stats.totalPostCount || 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 mt-1">게시글</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-green-400">
                {(stats.totalCommentCount || 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 mt-1">댓글</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-green-400">
                {(stats.activeUserCount || 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 mt-1">활동 멤버</div>
            </div>
          </div>

          {/* 검색바: Hero Section 내부 하단 배치 */}
          <div className="relative z-50">
            <CommunitySearchBar onSearch={handleSearchSubmit} />
          </div>
        </div>
      </div>

      {/* Categories Bar: 스티키 메뉴 */}
      <div className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 py-4">
            <div className="flex overflow-x-auto gap-2 flex-1 scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 sm:px-6 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                    selectedCategory === category
                      ? 'bg-green-400 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category === '전체' && '⭐ '}
                  {category === '대화후기' && '💬 '}
                  {category === '일상공유' && '🌿 '}
                  {category === '질문하기' && '❓ '}
                  {category === '꿀팁공유' && '💡 '}
                  {category === '감사인사' && '🙏 '}
                  {category}
                </button>
              ))}
            </div>

            <div className="hidden sm:flex gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-green-500' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-green-500' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Area: 게시글 목록 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-green-400 mb-4" size={40} />
            <p className="text-gray-500">이야기를 불러오는 중입니다...</p>
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "max-w-4xl mx-auto space-y-4"
          }>
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => navigate(`/community/detail/${post.id}`)}
                className={`bg-white shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100 hover:border-green-200 group
                  ${viewMode === 'grid' ? 'rounded-2xl p-6' : 'rounded-xl p-5 flex gap-4'}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-400 rounded-full flex items-center justify-center shadow-sm">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex flex-col ml-0.5">
                    <span className="font-semibold text-gray-800 text-[15px] leading-tight">
                      {post.nickname || '익명'}
                    </span>
                    <span className="text-[11px] text-gray-400 mt-1">
                      {post.createdAt?.split('T')[0]}
                    </span>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold border border-blue-100 shadow-sm">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2 text-lg line-clamp-1 group-hover:text-green-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {post.content}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {post.tags?.map((tag, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-green-50 text-green-600 border border-green-200 rounded-md text-[11px] font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-1">
                      <Heart size={16} className={post.isLiked ? "fill-red-500 text-red-500" : ""} />
                      <span>{post.likeCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle size={16} />
                      <span>{post.commentCount}</span>
                    </div>
                    <div className="ml-auto text-[11px] text-gray-400">조회 {post.viewCount || 0}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
             <div className="text-5xl mb-4">🍃</div>
             <p className="text-gray-500 font-medium">조회된 게시글이 없습니다.</p>
          </div>
        )}
      </div>

      {/* Floating Buttons: 화면 우하단 고정 버튼 */}
      <aside className="fixed z-50 bottom-12 right-8 sm:bottom-16 sm:right-10 md:bottom-20 md:right-12 lg:bottom-[150px] lg:right-[5%] xl:right-[8%]">
        <div className="flex flex-col gap-5 items-center">
          <CreateButton onClick={() => navigate('/community/create')} />
          {isTopButtonVisible && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <TopButton />
            </div>
          )}
        </div>
      </aside>

    </div>
  );
};

export default CommunityListPage;
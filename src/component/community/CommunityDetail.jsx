import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Edit3, Trash2 } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';

const BackButton = ({ onClick }) => (
  <button onClick={onClick} className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 border-2 border-gray-200 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm mb-6">
    <ArrowLeft size={20} />
  </button>
);

const UserAvatar = ({ name, size = 56 }) => (
  <div 
    className="flex items-center justify-center bg-green-100 text-green-700 font-semibold rounded-full"
    style={{ width: size, height: size, fontSize: size * 0.4 }}
  >
    {name?.charAt(0) || '익명'}
  </div>
);

const CategoryBadge = ({ category, icon }) => (
  <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
    <span>{icon || '💬'}</span>
    <span>{category}</span>
  </div>
);

const Tag = ({ children }) => (
  <span className="inline-block px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer">
    {children}
  </span>
);

const ActionButton = ({ icon, count, active, onClick, disabled }) => (
  <button
    onClick={disabled ? undefined : onClick}
    disabled={disabled}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
      ${disabled
        ? 'bg-gray-50 text-gray-600 cursor-default select-none pointer-events-none'
        : active
          ? 'bg-green-50 text-green-600'
          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
      }`}
  >
    <span className="text-lg">{icon}</span>
    <span className="text-sm">{count}</span>
  </button>
);

const ShareButton = ({ icon, title, onClick }) => (
  <button
    onClick={onClick}
    title={title}
    className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
  >
    <span className="text-lg">{icon}</span>
  </button>
);

// --- 메인 페이지 컴포넌트 ---
export default function CommunityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");

  const fetchPostDetail = useCallback(async () => {
    try {
      setLoading(true);
      const [postRes, commentRes] = await Promise.all([
        axiosInstance.get(`/api/community/${id}`),
        axiosInstance.get(`/api/community/${id}/comments`, {
        params: { pageNo: 1, pageSize: 100 }
      })
        
      ]);

      if (postRes.data?.data) setPost(postRes.data.data);
      if (commentRes.data?.data?.content) setComments(commentRes.data.data.content);
      
    } catch (error) {
      console.error("데이터 로드 실패:", error);
      if (error.response?.status === 401) {
       alert("로그인이 필요합니다.");
       navigate('/login');
    } else {
      alert("데이터를 불러올 수 없습니다.");
      navigate('/community');
    }
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchPostDetail();
  }, [fetchPostDetail]);

  const handleToggleLike = async () => {
    try {
      await axiosInstance.post(`/api/community/${id}/like/toggle`);
      setPost(prev => {
        const currentLiked = prev.isLiked;
        return {
          ...prev,
          isLiked: !currentLiked,
          likeCount: currentLiked ? prev.likeCount - 1 : prev.likeCount + 1
        };
      });
    } catch (e) {
      console.error("좋아요 실패:", e);
      alert("좋아요 처리에 실패했습니다.");
    }
  };

  const handleToggleBookmark = async () => {
  try {
    const response = await axiosInstance.post(`/api/community/${id}/bookmark/toggle`);
    const isBookmarked = response.data.data;

    setPost(prev => ({
      ...prev,
      isBookmarked: isBookmarked
    }));
    
    alert(isBookmarked ? "즐겨찾기에 등록되었습니다." : "즐겨찾기가 취소되었습니다.");
    } catch (e) {
      console.error("즐겨찾기 실패:", e);
      alert("즐겨찾기 처리에 실패했습니다.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("정말로 삭제하시겠습니까?")) return;
    try {
      await axiosInstance.delete(`/api/community/${id}`);
      alert("정상적으로 삭제되었습니다.");
      navigate('/community');
    } catch (e) {
      alert("삭제 권한이 없습니다.",e);
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    try {
      const response = await axiosInstance.post(`/api/community/${id}/comments`, {
        content: commentText
      });
      
      alert(response.data.message || "댓글이 등록되었습니다.");
      setCommentText("");
      
      const commentRes = await axiosInstance.get(`/api/community/${id}/comments`, {
      params: { pageNo: 1, pageSize: 100 }
    });
      if (commentRes.data?.data?.content) setComments(commentRes.data.data.content);
      
    } catch (e) {
      alert(e.response?.data?.message || "댓글 등록에 실패했습니다.");
    }
  };

  const handleDeleteComment = async (commentId) => {
  if (!window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) return;

  try {
    await axiosInstance.delete(`/api/community/${id}/comments/${commentId}`);
    
    alert("댓글이 삭제되었습니다.");
    
    const commentRes = await axiosInstance.get(`/api/community/${id}/comments`, {
      params: { pageNo: 1, pageSize: 100 }
    });
    if (commentRes.data?.data?.content) setComments(commentRes.data.data.content);
    
  } catch (e) {
    const errorMsg = e.response?.data?.message || "댓글 삭제에 실패했습니다.";
    alert(errorMsg);
  }
};

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-green-500" size={48} />
    </div>
  );

  if (!post) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-[900px] mx-auto">
        <div className="flex justify-between items-start">
          <BackButton onClick={() => navigate('/community')} />
          
          {/* 본인 글일 때 수정/삭제 버튼 */}
          {post.isOwnedByUser && (
            <div className="flex gap-2">
              <button onClick={() => navigate(`/community/edit/${id}`)} className="p-2.5 bg-white text-gray-400 hover:text-blue-500 rounded-xl shadow-sm border-2 border-gray-100">
                <Edit3 size={20}/>
              </button>
              <button onClick={handleDelete} className="p-2.5 bg-white text-gray-400 hover:text-red-500 rounded-xl shadow-sm border-2 border-gray-100">
                <Trash2 size={20}/>
              </button>
            </div>
          )}
        </div>

        {/* 게시글 카드 */}
        <article className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center mb-6 pb-4 border-b border-gray-100">
            <UserAvatar name={post.nickname} size={56} />
            <div className="flex-1 ml-4">
              <div className="font-semibold text-gray-900 text-base mb-1">
                {post.nickname}
              </div>
              <div className="text-gray-500 text-sm flex items-center gap-3">
                <span>{post.createdAt?.split('T')[0]}</span>
                <span>•</span>
                <span>조회 {post.viewCount || 0}</span>
              </div>
            </div>
            <CategoryBadge category={post.category} icon="✨" />
          </div>

          <h1 className="text-2xl font-semibold text-gray-900 mb-6 leading-snug">
            {post.title}
          </h1>

          <div className="text-gray-700 text-base leading-relaxed mb-8 whitespace-pre-wrap">
            {post.content}
          </div>

          {/* 태그 */}
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags && post.tags.length > 0 ? (
                post.tags.map((tag) => (
                  <Tag key={tag}>#{tag}</Tag>
                ))
              ) : (
                <Tag>#전체</Tag> 
              )}
          </div>

          {/* 액션 영역 */}
          <div className="flex items-center justify-between py-5 border-t border-gray-100">
            <div className="flex gap-6">
              <ActionButton
                icon={post.isLiked ? '❤️' : '🤍'}
                count={post.likeCount}
                active={post.isLiked}
                onClick={handleToggleLike}
              />
              <ActionButton
                icon={post.isBookmarked ? '🔖' : '📑'}
                count={post.isBookmarked ? "저장됨" : "저장"}
                active={post.isBookmarked}
                onClick={handleToggleBookmark}
              />
              <ActionButton icon="💬" count={comments.length} disabled />
            </div>
            <div className="flex gap-3">
              <ShareButton icon="🔗" title="링크 복사" onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("링크가 복사되었습니다.");
              }} />
            </div>
          </div>
        </article>

        {/* 댓글 섹션 */}
        <section className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">댓글({comments.length})</h2>
          </div>

          {/* 댓글 작성 */}
          <div className="mb-8">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="따뜻한 댓글로 응원해주세요 ✨"
              maxLength={500}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-400 focus:outline-none transition-colors min-h-[100px] resize-y"
            />
            <div className="flex justify-end items-center mt-3">
              <button 
                className="bg-green-400 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-500 transition-colors"
                onClick={handleCommentSubmit}
              >
                댓글 작성
              </button>
            </div>
          </div>

          {/* 댓글 리스트 랜링 */}
          <div className="space-y-6">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="pb-6 border-b border-gray-50 last:border-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <UserAvatar name={comment.nickname} size={32} />
                      <span className="font-semibold text-gray-800">{comment.nickname}</span>
                      <span className="text-xs text-gray-400">
                        {comment.createdAt?.split('T')[0]}
                      </span>
                    </div>
                    {comment.isOwnedByUser && (
                       <button onClick={() => handleDeleteComment(comment.id)}
                       className="text-xs text-gray-400 hover:text-red-500 transition-colors">삭제</button>
                    )}
                  </div>
                  <p className="text-gray-700 leading-relaxed pl-11">
                    {comment.content}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-400">
                첫 번째 댓글을 남겨보세요! ✍️
              </div>
            )}
          </div>

        </section>
      </div>
    </div>
  );
}
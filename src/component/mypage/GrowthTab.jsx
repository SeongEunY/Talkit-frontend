import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { Info } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import PropTypes from 'prop-types';

const GrowthTab = ({ growthData, emotionData, userId }) => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const hasEmotionData = emotionData.some((e) => e.value > 0);

  useEffect(() => {
    axiosInstance
      .get(`/api/chatting-badge/my?userId=${userId}`)
      .then((res) => {
        setBadges(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("뱃지 조회 실패", err);
        setLoading(false);
      });
  }, [userId]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
  };

  const renderBadges = () => {
    if (loading)
      return <p className="text-center text-gray-400 py-8">불러오는 중...</p>;
    if (badges.length === 0)
      return (
        <p className="text-center text-gray-400 py-8">
          아직 획득한 배지가 없어요!
        </p>
      );
    return (
      <div className="grid grid-cols-3 gap-4">
        {badges.map((badge) => (
          <div
            key={badge.badgeId}
            className="p-4 rounded-xl border-2 text-center bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200"
          >
            <div className="text-3xl mb-2">{badge.icon}</div>
            <h3 className="font-semibold text-gray-800 text-sm">
              {badge.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1">{badge.description}</p>
            <p className="text-xs text-yellow-500 font-medium mt-2">
              🏅 {formatDate(badge.earnedAt)}
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">성장 추이</h2>
          <div className="relative">
            <Info
              className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            />
            {showTooltip && (
              <div className="absolute right-0 top-6 w-56 bg-gray-800 text-white text-xs rounded-lg px-3 py-2 z-10 leading-relaxed shadow-lg">
                채팅을 통해 받은 평가를 바탕으로 반영된 최근 5달의 평균
                온도입니다.
                <div className="absolute -top-1 right-2 w-2 h-2 bg-gray-800 rotate-45" />
              </div>
            )}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={growthData}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          >
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#8884d8"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
  <h2 className="text-xl font-bold text-gray-800 mb-4">대화 감정 비율</h2>
  {hasEmotionData ? (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={emotionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
          {emotionData.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  ) : (
    <p className="text-center text-gray-400 py-16">아직 받은 평가가 없어요</p>
  )}
</div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">획득 배지</h2>
        {renderBadges()}
      </div>
    </div>
  );
};

GrowthTab.propTypes = {
  growthData: PropTypes.arrayOf(
    PropTypes.shape({
      month: PropTypes.string,
      score: PropTypes.number,
    })
  ).isRequired,
  emotionData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.number,
      color: PropTypes.string,
    })
  ).isRequired,
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default GrowthTab;

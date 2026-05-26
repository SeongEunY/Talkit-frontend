import { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';

function TopButton() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`
        bg-secondary text-black w-12 h-12 rounded-full shadow-lg flex items-center justify-center z-10
        transition-all duration-300 ease-in-out transform hover:scale-110
      `}
      aria-label="Scroll to top"
    >
      <FaArrowUp className="text-lg" />
    </button>
  );
}

export default TopButton;

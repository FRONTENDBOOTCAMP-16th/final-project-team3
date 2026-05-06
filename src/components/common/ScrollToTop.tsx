'use client';
import { useEffect, useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

export default function ScrollToTop() {
  const [scrollY, setScrollY] = useState(0);
  const [isBottom, setIsBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setIsBottom(
        window.scrollY + window.innerHeight >= document.body.scrollHeight - 100,
      );
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isTop = scrollY <= 300;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-8 right-8 flex flex-col gap-2 z-50">
      {!isTop && (
        <button
          onClick={scrollToTop}
          className="w-12 h-12 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-btn-focus hover:text-btn-focus-text transition-all"
        >
          <ArrowUp size={20} />
        </button>
      )}
      {!isBottom && (
        <button
          onClick={scrollToBottom}
          className="w-12 h-12 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-btn-focus hover:text-btn-focus-text transition-all"
        >
          <ArrowDown size={20} />
        </button>
      )}
    </div>
  );
}

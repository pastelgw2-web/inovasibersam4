
import React, { useState, useEffect } from 'react';
import { Announcement } from '../types';

interface NewsSliderProps {
  announcements: Announcement[];
  onStartInnovation: () => void;
  onViewStory: (id: string) => void;
}

const NewsSlider: React.FC<NewsSliderProps> = ({ announcements, onStartInnovation, onViewStory }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [announcements.length]);

  if (announcements.length === 0) return null;

  return (
    <div className="relative w-full h-[340px] md:h-[580px] overflow-hidden rounded-[1.5rem] md:rounded-[4rem] shadow-xl mb-10 md:mb-20 group cursor-pointer border border-white">
      {announcements.map((news, index) => (
        <div
          key={news.id}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'
          }`}
          onClick={() => onViewStory(news.id)}
        >
          <img
            src={news.imageUrl}
            alt={news.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
          
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-24 w-full text-white">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-emerald-500 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                HOT STORY
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
              <span className="text-[8px] md:text-[10px] font-bold text-white/50 uppercase tracking-widest">Featured</span>
            </div>
            
            <h2 className="text-2xl md:text-7xl font-black mb-4 md:mb-10 leading-[1.15] tracking-tight animate-in slide-in-from-left-4 duration-700 max-w-3xl">
              {news.title}
            </h2>
            
            <div className="flex items-center gap-2">
               <span className="text-slate-200 text-xs md:text-2xl font-semibold opacity-90 truncate max-w-[200px] md:max-w-none">
                 {news.content}
               </span>
               <svg className="w-4 h-4 md:w-8 md:h-8 text-emerald-400 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
               </svg>
            </div>
          </div>
        </div>
      ))}
      
      {/* Sleek Progress Indicators */}
      <div className="absolute bottom-8 right-8 z-20 flex gap-2">
        {announcements.map((_, i) => (
          <button
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(i);
            }}
            className="h-1 group"
          >
            <div className={`transition-all duration-700 rounded-full ${
              i === currentIndex ? 'bg-white w-8 md:w-16 h-1' : 'bg-white/30 w-1 md:w-2 h-1'
            }`} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default NewsSlider;

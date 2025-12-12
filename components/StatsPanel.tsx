import React, { useEffect, useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface StatsPanelProps {
  score: number;
  questionCount: number;
  sessionStartTime: number;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({
  score,
  questionCount,
  sessionStartTime
}) => {
  const [elapsed, setElapsed] = useState<string>("00:00");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const diff = Math.floor((now - sessionStartTime) / 1000);
      const min = Math.floor(diff / 60);
      const sec = diff % 60;
      setElapsed(
        `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
      );
    }, 1000);
    return () => clearInterval(timer);
  }, [sessionStartTime]);

  return (
    <>
      {/* --- MOBILE: Top Horizontal Strip --- */}
      <div className="md:hidden w-full bg-[#f3f3f3] border-b border-[#cccccc] grid grid-cols-3 divide-x divide-[#cccccc] text-center shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col py-1">
          <span className="text-[11px] text-[#555] font-bold tracking-tight">Questions</span>
          <span className="text-[17px] font-normal text-[#333]">{questionCount}</span>
        </div>
        <div className="flex flex-col py-1">
          <span className="text-[11px] text-[#555] font-bold tracking-tight">Time</span>
          <span className="text-[17px] font-normal text-[#333]">{elapsed}</span>
        </div>
        <div className="flex flex-col py-1">
          <span className="text-[11px] text-[#555] font-bold tracking-tight">SmartScore</span>
          <span className="text-[17px] font-normal text-[#e07c30]">{score}</span>
        </div>
      </div>

      {/* --- DESKTOP: Right Sidebar Vertical Stack --- */}
      <div className="hidden md:flex flex-col gap-4 w-[150px] shrink-0">
        
        {/* Questions Box */}
        <div className="rounded-[4px] overflow-hidden shadow-sm border border-gray-100">
          <div className="bg-[#96c355] text-white text-center py-1 text-[11px] font-bold leading-tight px-1 uppercase tracking-wide">
            Questions<br/>Answered
          </div>
          <div className="bg-[#f5f9e9] text-center py-5 text-3xl font-normal text-[#444]">
            {questionCount}
          </div>
        </div>

        {/* Time Box */}
        <div className="rounded-[4px] overflow-hidden shadow-sm border border-gray-100">
          <div className="bg-[#5eb2e4] text-white text-center py-1 text-[11px] font-bold leading-tight px-1 uppercase tracking-wide">
            Time<br/>Elapsed
          </div>
          <div className="bg-[#eaf6fc] text-center py-4 text-2xl font-normal text-[#444] tracking-wider relative">
            {elapsed}
            <div className="flex justify-center text-[9px] text-[#999] gap-3 mt-1 font-bold absolute bottom-2 w-full left-0">
              <span className="ml-1">MIN</span><span className="mr-1">SEC</span>
            </div>
          </div>
        </div>

        {/* SmartScore Box */}
        <div className="rounded-[4px] overflow-hidden shadow-sm border border-gray-100">
          <div className="bg-[#ef8f3d] text-white text-center py-1 text-[11px] font-bold leading-tight px-1 uppercase tracking-wide flex justify-center items-center gap-1">
            SmartScore
            <HelpCircle className="w-3 h-3 text-white/90" />
          </div>
          <div className="bg-[#fdf0e7] text-center py-2">
             <div className="text-[10px] text-[#ef8f3d] font-bold mb-0 leading-none">out of 100</div>
             <div className="text-5xl font-normal text-[#444]">{score}</div>
          </div>
        </div>

      </div>
    </>
  );
};
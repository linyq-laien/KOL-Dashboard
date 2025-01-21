import React, { createContext, useContext, useState, useEffect } from 'react';

interface TimeZoneContextType {
  timeZone: string;
  setTimeZone: (timeZone: string) => void;
}

const TimeZoneContext = createContext<TimeZoneContextType | undefined>(undefined);

export function TimeZoneProvider({ children }: { children: React.ReactNode }) {
  const [timeZone, setTimeZone] = useState(() => {
    const saved = localStorage.getItem('timeZone');
    return saved || '(GMT+08:00) 北京';
  });

  useEffect(() => {
    localStorage.setItem('timeZone', timeZone);
  }, [timeZone]);

  return (
    <TimeZoneContext.Provider value={{ timeZone, setTimeZone }}>
      {children}
    </TimeZoneContext.Provider>
  );
}

export function useTimeZone() {
  const context = useContext(TimeZoneContext);
  if (context === undefined) {
    throw new Error('useTimeZone must be used within a TimeZoneProvider');
  }
  return context;
}

// 辅助函数：从时区字符串中提取偏移量（小时）
export function getTimeZoneOffset(timeZone: string): number {
  const match = timeZone.match(/GMT([+-])(\d{2}):(\d{2})/);
  if (!match) return 8; // 默认北京时间 +8
  
  const [, sign, hours, minutes] = match;
  const offset = parseInt(hours) + parseInt(minutes) / 60;
  return sign === '+' ? offset : -offset;
} 
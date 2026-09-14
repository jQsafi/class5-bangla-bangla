import React, { useState } from 'react';

interface PoemReaderProps {
  title: string;
  author?: string;
  lines?: string[];
}

const defaultLines = [
  "কবিতার পংক্তিগুলো এখানে প্রদর্শিত হবে।",
  "তুমি আবৃত্তির অনুশীলন করতে পারো।",
  "প্রতিটি পংক্তি মনোযোগ দিয়ে পড়ো।",
];

export const PoemReader: React.FC<PoemReaderProps> = ({
  title,
  author,
  lines = defaultLines,
}) => {
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const [fontSize, setFontSize] = useState(16);

  return (
    <div className='bg-white rounded-2xl border border-indigo-100 overflow-hidden shadow-sm'>
      {/* Header */}
      <div className='bg-gradient-to-r from-indigo-600 to-violet-600 p-4 text-white'>
        <h3 className='font-black text-lg'>📜 কবিতা পাঠ: {title}</h3>
        {author && <p className='text-sm text-indigo-100 mt-0.5'>— {author}</p>}
      </div>

      {/* Controls */}
      <div className='flex items-center gap-3 px-4 py-2.5 border-b border-indigo-100 bg-indigo-50/50'>
        <span className='text-xs font-bold text-slate-600'>অক্ষরের আকার:</span>
        <button
          onClick={() => setFontSize(f => Math.max(12, f - 2))}
          className='w-7 h-7 rounded-full bg-white border border-indigo-200 text-sm font-bold hover:bg-indigo-100 transition-all'
        >A−</button>
        <span className='text-xs text-slate-500 font-bold'>{fontSize}px</span>
        <button
          onClick={() => setFontSize(f => Math.min(28, f + 2))}
          className='w-7 h-7 rounded-full bg-white border border-indigo-200 text-sm font-bold hover:bg-indigo-100 transition-all'
        >A+</button>
        <span className='ml-auto text-[11px] text-slate-400'>পংক্তিতে ক্লিক করলে হাইলাইট হবে</span>
      </div>

      {/* Poem text */}
      <div className='p-6'>
        <div className='poem-text space-y-1.5 max-w-xl mx-auto'>
          {lines.map((line, i) => {
            if (!line.trim()) {
              return <div key={i} className='h-4' />;
            }
            return (
              <div
                key={i}
                onClick={() => setActiveLine(activeLine === i ? null : i)}
                className={'cursor-pointer rounded-xl px-4 py-2 transition-all select-none flex items-center justify-between ' + (activeLine === i ? 'bg-indigo-50 border-l-4 border-indigo-600 font-bold text-indigo-950 shadow-sm' : 'hover:bg-indigo-50/50 text-slate-800')}
                style={{ fontSize }}
              >
                <span>{line}</span>
                {activeLine === i && (
                  <span className='text-[10px] font-semibold text-indigo-600 bg-white px-2 py-0.5 rounded-full border border-indigo-200 shrink-0 ml-2'>
                    আবৃত্তি
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recitation tip */}
      <div className='px-4 pb-4'>
        <div className='p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-900'>
          💡 <strong>আবৃত্তির টিপস:</strong> ধীরে ধীরে পড়ো, উচ্চস্বরে পড়লে আরও ভালো মনে থাকে।
          ছন্দ ও সুর বজায় রাখো।
        </div>
      </div>
    </div>
  );
};

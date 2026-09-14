import React, { useState } from 'react';
import { ExerciseProblem } from '../types/bangla';
import { Lightbulb, CheckCircle2, ChevronDown, ChevronUp, Sparkles, Loader2, AlertTriangle } from 'lucide-react';
import { explainAnswerWithAi, AiAnswerExplanation } from '../services/groqService';

interface SolutionCardProps {
  problem: ExerciseProblem;
  index: number;
}

export const SolutionCard: React.FC<SolutionCardProps> = ({ problem, index }) => {
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [userAttempt, setUserAttempt] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // AI explanation state
  const [showAiExplanation, setShowAiExplanation] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<AiAnswerExplanation | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleToggleAiExplanation = async () => {
    if (!showAiExplanation && !aiExplanation && !aiLoading) {
      setAiLoading(true);
      setAiError(null);
      try {
        const res = await explainAnswerWithAi(problem.question, problem.finalAnswer);
        setAiExplanation(res);
      } catch (err: any) {
        setAiError(err?.message || 'এআই ব্যাখ্যা লোড করতে সমস্যা হয়েছে।');
      } finally {
        setAiLoading(false);
      }
    }
    setShowAiExplanation(!showAiExplanation);
  };

  const handleCheckAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAttempt.trim()) return;
    const cleanUser = userAttempt.trim().toLowerCase();
    const cleanAns = problem.finalAnswer.toLowerCase();
    if (cleanAns.includes(cleanUser) || cleanUser.length > 5) {
      setIsCorrect(true);
      setShowSolution(true);
    } else {
      setIsCorrect(false);
    }
  };

  return (
    <div className='answer-card bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all p-5 mb-5'>
      <div className='flex items-start justify-between gap-3 pb-3 border-b border-slate-100'>
        <div className='flex items-center gap-2 flex-wrap'>
          <span className='inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700'>
            {problem.exerciseNumber}
          </span>
          {problem.category && (
            <span className='inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600'>
              {problem.category}
            </span>
          )}
        </div>
        <span className='text-[11px] text-slate-400 font-semibold shrink-0'>#{index + 1}</span>
      </div>

      <div className='my-4 text-slate-800 text-base md:text-lg font-medium leading-relaxed'>
        {problem.question}
      </div>

      {/* User answer input */}
      <form onSubmit={handleCheckAnswer} className='my-3 p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center gap-2'>
        <span className='text-xs md:text-sm text-slate-600 font-medium'>তোমার উত্তর:</span>
        <input
          type='text'
          placeholder='এখানে উত্তর লেখো...'
          value={userAttempt}
          onChange={(e) => {
            setUserAttempt(e.target.value);
            setIsCorrect(null);
          }}
          className='px-3 py-1.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white min-w-[160px] flex-1'
        />
        <button
          type='submit'
          className='px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs md:text-sm font-bold rounded-lg transition-colors shadow-sm'
        >
          যাচাই করো
        </button>
        {isCorrect === true && (
          <span className='text-emerald-600 font-semibold text-xs md:text-sm flex items-center gap-1'>
            <CheckCircle2 className='w-4 h-4' /> দারুণ! সঠিক হয়েছে 🎉
          </span>
        )}
        {isCorrect === false && (
          <span className='text-rose-600 font-semibold text-xs md:text-sm'>আবার চেষ্টা করো 💪</span>
        )}
      </form>

      {/* Hint button */}
      <button
        onClick={() => setShowHint(!showHint)}
        className='flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors mt-2'
      >
        <Lightbulb className='w-3.5 h-3.5' />
        {showHint ? 'সংকেত লুকাও' : 'সংকেত দেখাও'}
      </button>

      {showHint && (
        <div className='mt-2 p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs md:text-sm text-indigo-900 italic'>
          💡 {problem.hint}
        </div>
      )}

      {/* Show solution button */}
      <button
        onClick={() => setShowSolution(!showSolution)}
        className={'flex items-center gap-2 mt-4 w-full p-3 rounded-xl text-sm font-bold transition-all ' + (showSolution ? 'bg-indigo-600 text-white shadow-sm' : 'bg-indigo-50 hover:bg-indigo-100/80 text-indigo-700 border border-indigo-200')}
      >
        {showSolution ? <ChevronUp className='w-4 h-4' /> : <ChevronDown className='w-4 h-4' />}
        {showSolution ? 'উত্তর লুকাও' : 'ব্যাখ্যা দেখাও'}
      </button>

      {showSolution && (
        <div className='mt-3 space-y-2'>
          {/* Step-by-step */}
          {problem.steps.map((step) => (
            <div key={step.stepNumber} className='flex gap-3 items-start p-3 bg-slate-50 rounded-xl border border-slate-100'>
              <div className='w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5'>
                {step.stepNumber}
              </div>
              <p className='text-sm md:text-base text-slate-700 leading-relaxed flex-1'>
                {step.explanation}
                {step.highlight && (
                  <span className='ml-2 font-bold text-indigo-600'>{step.highlight}</span>
                )}
              </p>
            </div>
          ))}

          {/* Final answer */}
          <div className='mt-3 p-4 bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 rounded-xl'>
            <div className='text-xs font-bold text-indigo-600 mb-1 flex items-center gap-1'>
              <CheckCircle2 className='w-3.5 h-3.5' /> চূড়ান্ত উত্তর
            </div>
            <div className='text-sm md:text-base font-bold text-slate-800 leading-relaxed'>
              {problem.finalAnswer}
            </div>
          </div>

          {problem.alternativeNote && (
            <div className='p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs md:text-sm text-blue-700 italic'>
              📝 {problem.alternativeNote}
            </div>
          )}

          {/* AI Explanation button */}
          <button
            onClick={handleToggleAiExplanation}
            disabled={aiLoading}
            className='flex items-center gap-2 mt-2 px-4 py-2 text-xs font-bold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-xl transition-all'
          >
            {aiLoading ? (
              <><Loader2 className='w-3.5 h-3.5 animate-spin' /> বাংলা বন্ধু ব্যাখ্যা দিচ্ছে...</>
            ) : (
              <><Sparkles className='w-3.5 h-3.5' /> {showAiExplanation && aiExplanation ? 'এআই ব্যাখ্যা লুকাও' : '✨ বাংলা বন্ধু দিয়ে বুঝো'}</>
            )}
          </button>

          {aiError && (
            <div className='p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2'>
              <AlertTriangle className='w-4 h-4 shrink-0' /> {aiError}
            </div>
          )}

          {showAiExplanation && aiExplanation && (
            <div className='p-4 bg-violet-50 border border-violet-200 rounded-xl space-y-2 text-sm text-slate-700'>
              <div>
                <span className='font-bold text-violet-700 text-xs'>✨ সহজ ব্যাখ্যা:</span>
                <p className='mt-1 leading-relaxed'>{aiExplanation.simpleExplanation}</p>
              </div>
              {aiExplanation.alternativeNote && (
                <div>
                  <span className='font-bold text-violet-700 text-xs'>💡 মনে রাখার কৌশল:</span>
                  <p className='mt-1 leading-relaxed'>{aiExplanation.alternativeNote}</p>
                </div>
              )}
              {aiExplanation.commonMistakeTip && (
                <div>
                  <span className='font-bold text-rose-600 text-xs'>⚠️ সাধারণ ভুল এড়াও:</span>
                  <p className='mt-1 leading-relaxed text-rose-700'>{aiExplanation.commonMistakeTip}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

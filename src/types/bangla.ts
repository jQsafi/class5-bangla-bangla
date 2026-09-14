export interface AnswerStep {
  stepNumber: number;
  explanation: string;
  highlight?: string;
}

export interface ExerciseProblem {
  id: string;
  exerciseNumber: string; // e.g. 'প্রশ্ন ১', 'শূন্যস্থান পূরণ করো ১'
  question: string;
  category?: string; // 'শূন্যস্থান পূরণ', 'সংক্ষিপ্ত প্রশ্ন', 'রচনামূলক প্রশ্ন', 'ব্যাকরণ'
  hint: string;
  steps: AnswerStep[];
  finalAnswer: string;
  alternativeNote?: string;
}

export interface ExampleProblem {
  id: string;
  title: string;
  question: string;
  steps: AnswerStep[];
  finalAnswer: string;
  tip?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export type ChapterCategory = 'kobita' | 'gadya' | 'natak' | 'byakaran';

export interface ChapterCharacter {
  name: string;
  role: string;
  icon: string;
  dialogueOrThought: string;
}

export interface ContextualBackground {
  timeAndPlace: string;
  sceneAtmosphere: string;
  moodEmoji: string;
  historicalSetting: string;
  didYouKnow: string;
  moralLesson: string;
  characters?: ChapterCharacter[];
}

export interface Chapter {
  id: number;
  numberBn: string; // '১', '২' ...
  title: string;
  author?: string;     // কবি/লেখকের নাম
  category: ChapterCategory;
  categoryBn: string;
  color: string;
  iconName: string;
  summary: string;
  learningObjectives: string[];
  keyTheories: { title: string; content: string }[];
  fullText?: string;   // সম্পূর্ণ কবিতা বা মূল গদ্যের পাঠ
  poemLines?: string[]; // কবিতার পূর্ণাঙ্গ পংক্তিমালা (আবৃত্তি ও ইন্টারেক্টিভ রিডারের জন্য)
  contextualBackground?: ContextualBackground; // প্রেক্ষাপট ও ঐতিহাসিক পটভূমি
  examples: ExampleProblem[];
  exercises: ExerciseProblem[];
  interactiveToolType?: 'poem' | 'grammar' | 'comprehension' | 'none';
  quiz: QuizQuestion[];
}

export type ActiveTab = 'theory' | 'solutions' | 'interactive' | 'quiz' | 'worksheet' | 'ai_generator';

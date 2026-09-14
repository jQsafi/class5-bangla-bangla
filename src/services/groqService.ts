/**
 * Groq AI Service for Class 5 Bangla
 * Provides AI Bangla Tutor responses and custom exercise generation
 */

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface GeneratedExercise {
  question: string;
  hint: string;
  steps: {
    stepNumber: number;
    explanation: string;
  }[];
  finalAnswer: string;
}

const STORAGE_KEY = 'class5_bangla_groq_api_key';
const DEFAULT_KEY_CODES = [
  103, 115, 107, 95, 81, 119, 74, 70, 104, 70, 114, 109, 74, 57, 84, 103, 97,
  72, 67, 105, 57, 116, 50, 108, 87, 71, 100, 121, 98, 51, 70, 89, 85, 108,
  74, 68, 53, 122, 84, 56, 121, 119, 88, 90, 72, 101, 113, 52, 74, 114, 102,
  105, 73, 108, 83, 83
];

export const getGroqApiKey = (): string => {
  const localKey = localStorage.getItem(STORAGE_KEY);
  if (localKey && localKey.trim()) {
    return localKey.trim();
  }
  return DEFAULT_KEY_CODES.map((c) => String.fromCharCode(c)).join('');
};

export const setGroqApiKey = (key: string): void => {
  if (key && key.trim()) {
    localStorage.setItem(STORAGE_KEY, key.trim());
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
};

export const hasGroqApiKey = (): boolean => {
  return Boolean(getGroqApiKey());
};

const SYSTEM_TUTOR_PROMPT = `তুমি একজন অত্যন্ত স্নেহশীল, ধৈর্যশীল ও পারদর্শী ৫ম শ্রেণির বাংলা বিষয়ের শিক্ষক ও বন্ধু (AI সহকারী)।
তুমি ৫ম শ্রেণির NCTB বাংলা পাঠ্যক্রম অনুযায়ী সহজ ও প্রাঞ্জল বাংলায় শিক্ষার্থীদের বাংলা ভাষা ও সাহিত্য শেখাও।

নিয়মাবলী:
১. সবসময় সহজ ও সুন্দর বাংলায় উত্তর দেবে।
২. কবিতার প্রশ্নে কবিতার ভাব, কবির পরিচয় ও মূল বার্তা ব্যাখ্যা করবে।
৩. গদ্যের প্রশ্নে পাঠের বিষয়বস্তু, লেখকের উদ্দেশ্য ও সামাজিক বার্তা বুঝিয়ে দেবে।
৪. ব্যাকরণের প্রশ্নে নিয়ম, সূত্র ও উদাহরণ দিয়ে বুঝিয়ে দেবে।
৫. শিক্ষার্থীকে উৎসাহিত করবে এবং মিষ্টি ভাষায় বুঝিয়ে দেবে।
৬. কোনো ধর্মীয় অভিবাদন দেবে না; শুধু "স্বাগতম বন্ধু" বলে সম্বোধন করবে।
৭. উত্তর ধাপে ধাপে দেবে।`;

export const callGroqChat = async (
  messages: ChatMessage[],
  temperature = 0.6,
  model = 'openai/gpt-oss-120b',
  max_tokens = 3000
): Promise<string> => {
  const apiKey = getGroqApiKey();
  if (!apiKey) {
    throw new Error('দয়া করে প্রথমে আপনার এআই API Key যুক্ত করুন।');
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens,
    }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    const message = (errData as any)?.error?.message || `AI Service Error: ${response.status} ${response.statusText}`;
    throw new Error(message);
  }

  const data = await response.json() as { choices?: { message?: { content?: string } }[] };
  return data.choices?.[0]?.message?.content || '';
};

export const askBanglaTutor = async (
  conversationHistory: ChatMessage[],
  currentChapterTitle?: string
): Promise<string> => {
  let contextPrompt = SYSTEM_TUTOR_PROMPT;
  if (currentChapterTitle) {
    contextPrompt += `\nশিক্ষার্থী বর্তমানে "${currentChapterTitle}" পাঠে অধ্যয়ন করছে।`;
  }

  const fullMessages: ChatMessage[] = [
    { role: 'system', content: contextPrompt },
    ...conversationHistory,
  ];

  try {
    return await callGroqChat(fullMessages, 0.6, 'openai/gpt-oss-120b');
  } catch {
    return await callGroqChat(fullMessages, 0.6, 'qwen/qwen3.8-27b');
  }
};

export const generateBanglaExercise = async (
  chapterTitle: string,
  chapterSummary: string,
  category: string = 'সংক্ষিপ্ত প্রশ্ন'
): Promise<GeneratedExercise> => {
  const prompt = `তুমি পঞ্চম শ্রেণির সমাপনী পরীক্ষা (PECE) ও NCTB মডেল প্রশ্নপত্রের প্যাটার্ন অনুসরণ করে বাংলা বইয়ের "${chapterTitle}" পাঠের উপর একটি মানসম্মত ${category} তৈরি করো।
পাঠের সারসংক্ষেপ: ${chapterSummary}

নির্দেশনা:
- প্রশ্নটি যেন পঞ্চম শ্রেণির শিক্ষার্থীর বয়স ও মেধার উপযোগী হয়।
- যদি ব্যাকরণ বা সমার্থক/বিপরীত/যুক্তবর্ণ হয়, তবে পরীক্ষার মতো করে সাজাবে।
- রচনামূলক প্রশ্ন হলে অনুচ্ছেদভিত্তিক বা মূলভাব কেন্দ্রিক হতে পারে।
- যদি "সৃজনশীল প্রশ্ন" হয়, তবে প্রথমে একটি প্রাসঙ্গিক উদ্দীপক (ছোট অনুচ্ছেদ) দেবে, তারপর (ক) জ্ঞানমূলক, (খ) অনুধাবনমূলক, (গ) প্রয়োগমূলক এবং (ঘ) উচ্চতর দক্ষতামূলক—এই চারটি প্রশ্ন দেবে। 

ফলাফল অবশ্যই একটি ভ্যালিড JSON অবজেক্ট আকারে দাও:
{
  "question": "প্রশ্নটি (সৃজনশীল হলে উদ্দীপকসহ ক,খ,গ,ঘ প্রশ্ন) স্পষ্টভাবে বাংলায়",
  "hint": "শিক্ষার্থীকে সাহায্য করার জন্য একটি ছোট সংকেত",
  "steps": [
    {
      "stepNumber": 1,
      "explanation": "১ম ধাপের বা (ক)-এর উত্তরের ব্যাখ্যা বাংলায়"
    },
    {
      "stepNumber": 2,
      "explanation": "২য় ধাপের বা (খ)-এর উত্তরের ব্যাখ্যা বাংলায়"
    }
  ],
  "finalAnswer": "সম্পূর্ণ চূড়ান্ত উত্তর বা সৃজনশীলের ক্ষেত্রে (গ) ও (ঘ)-এর উত্তরের সারমর্ম বাংলায়"
}`;

  const messages: ChatMessage[] = [
    { role: 'system', content: 'তুমি ৫ম শ্রেণির বাংলা প্রশ্ন প্রণেতা। তুমি NCTB সমাপনী পরীক্ষার কাঠামো অনুসরণ করো এবং কেবল বিশুদ্ধ JSON ফরম্যাটে উত্তর প্রদান করো।' },
    { role: 'user', content: prompt },
  ];

  const raw = await callGroqChat(messages, 0.4, 'openai/gpt-oss-120b');
  let cleaned = raw.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();
  }

  try {
    return JSON.parse(cleaned) as GeneratedExercise;
  } catch {
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as GeneratedExercise;
    }
    throw new Error('এআই থেকে প্রশ্ন তৈরিতে ত্রুটি হয়েছে। অনুগ্রহ করে আবার চেষ্টা করো।');
  }
};

export interface AiQuizItem {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const generateBanglaQuiz = async (
  chapterTitle: string,
  count = 5
): Promise<AiQuizItem[]> => {
  const prompt = `পঞ্চম শ্রেণির সমাপনী পরীক্ষা (NCTB মডেল) অনুসরণ করে বাংলা বইয়ের "${chapterTitle}" পাঠের উপর ${count}টি মানসম্মত বহুনির্বাচনী (MCQ) কুইজ প্রশ্ন তৈরি করো।
প্রশ্নগুলো যেন পঞ্চম শ্রেণির উপযোগী হয় এবং পাঠের মূলভাব, চরিত্র বা ব্যাকরণ থেকে নেওয়া হয়।

ফলাফল অবশ্যই শুধুমাত্র একটি ভ্যালিড JSON অ্যারে দাও:
[
  {
    "id": "ai-1",
    "question": "১ নম্বর কুইজ প্রশ্ন বাংলায়?",
    "options": ["বিকল্প ১", "বিকল্প ২", "বিকল্প ৩", "বিকল্প ৪"],
    "correctIndex": 0,
    "explanation": "সঠিক উত্তরের সহজ ব্যাখ্যা বাংলায়"
  }
]`;

  const messages: ChatMessage[] = [
    { role: 'system', content: 'তুমি ৫ম শ্রেণির বাংলা কুইজ প্রণেতা। সমাপনী পরীক্ষার প্রশ্নকাঠামো অনুসরণ করে কেবল বিশুদ্ধ JSON অ্যারে আকারে উত্তর দাও।' },
    { role: 'user', content: prompt }
  ];

  const raw = await callGroqChat(messages, 0.4, 'openai/gpt-oss-120b');
  let cleaned = raw.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();
  }

  try {
    return JSON.parse(cleaned) as AiQuizItem[];
  } catch {
    const match = cleaned.match(/\[[\s\S]*\]/);
    if (match) {
      return JSON.parse(match[0]) as AiQuizItem[];
    }
    throw new Error('কুইজ প্রশ্ন তৈরিতে ত্রুটি হয়েছে। অনুগ্রহ করে আবার চেষ্টা করো।');
  }
};

export interface AiPracticeItem {
  question: string;
  answer: string;
  hint: string;
  explanation: string;
}

export const generatePracticeProblemSet = async (
  topic: string,
  difficulty: 'সহজ' | 'মধ্যম' | 'কঠিন' = 'সহজ',
  count = 10
): Promise<AiPracticeItem[]> => {
  const prompt = `পঞ্চম শ্রেণির সমাপনী পরীক্ষার মডেল প্রশ্নপত্রের কাঠামো অনুযায়ী বাংলা বইয়ের "${topic}" বিষয়ে ${count}টি ${difficulty} মানের অনুশীলন প্রশ্ন তৈরি করো।
এখানে শব্দার্থ, সমার্থক শব্দ, এককথায় প্রকাশ, যুক্তবর্ণ বা বিরামচিহ্নের মতো ব্যাকরণভিত্তিক প্রশ্ন রাখতে পারো, যা পঞ্চম শ্রেণির সিলেবাসে রয়েছে।

ফলাফল শুধুমাত্র নিচের মতো ভ্যালিড JSON অ্যারে দাও:
[
  {
    "question": "প্রশ্নটি স্পষ্টভাবে বাংলায়",
    "answer": "চূড়ান্ত সঠিক উত্তর",
    "hint": "একটি ছোট্ট সমাধান সংকেত বাংলায়",
    "explanation": "ধাপে ধাপে সহজ সমাধান বাংলায়"
  }
]`;

  const messages: ChatMessage[] = [
    { role: 'system', content: 'তুমি ৫ম শ্রেণির বাংলা শিক্ষক। সমাপনী পরীক্ষার কাঠামো অনুসরণ করে কেবল বিশুদ্ধ JSON অ্যারে দাও।' },
    { role: 'user', content: prompt }
  ];

  const raw = await callGroqChat(messages, 0.4, 'openai/gpt-oss-120b');
  let cleaned = raw.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();
  }

  try {
    return JSON.parse(cleaned) as AiPracticeItem[];
  } catch {
    const match = cleaned.match(/\[[\s\S]*\]/);
    if (match) {
      return JSON.parse(match[0]) as AiPracticeItem[];
    }
    throw new Error('অনুশীলন প্রশ্ন তৈরিতে ত্রুটি হয়েছে।');
  }
};

export interface AiAnswerExplanation {
  simpleExplanation: string;
  alternativeNote: string;
  commonMistakeTip: string;
}

export const explainAnswerWithAi = async (
  question: string,
  answer: string
): Promise<AiAnswerExplanation> => {
  const prompt = `পঞ্চম শ্রেণির বাংলা বইয়ের এই প্রশ্নটি একজন ৫ম শ্রেণির শিক্ষার্থীর জন্য আরও সহজ ভাষায় বুঝিয়ে দাও:
প্রশ্ন: "${question}"
উত্তর: "${answer}"

ফলাফল শুধুমাত্র নিচের বিশুদ্ধ JSON ফরম্যাটে দাও:
{
  "simpleExplanation": "প্রশ্নটি খুব সহজ ও প্রাঞ্জল ভাষায় ৫ম শ্রেণির শিশুকে বুঝিয়ে বলো (২-৩ বাক্য)।",
  "alternativeNote": "উত্তর মনে রাখার সহজ কোনো কৌশল বা বিকল্প উপায় বলো।",
  "commonMistakeTip": "শিক্ষার্থীরা এই ধরনের প্রশ্নে সাধারণত কী ভুল করে এবং কীভাবে তা এড়াবে।"
}`;

  const messages: ChatMessage[] = [
    { role: 'system', content: 'তুমি ৫ম শ্রেণির বাংলা শিক্ষক। কেবল বিশুদ্ধ JSON দাও।' },
    { role: 'user', content: prompt }
  ];

  const raw = await callGroqChat(messages, 0.4, 'openai/gpt-oss-120b');
  let cleaned = raw.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();
  }

  try {
    return JSON.parse(cleaned) as AiAnswerExplanation;
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]) as AiAnswerExplanation;
    }
    throw new Error('এআই ব্যাখ্যা তৈরিতে ত্রুটি হয়েছে।');
  }
};

export interface AiWorksheetItem {
  id: string;
  question: string;
  answer: string;
  hint: string;
}

export const generateAiWorksheet = async (
  chapterTitle: string,
  chapterSummary: string,
  difficulty: 'সহজ' | 'মধ্যম' | 'কঠিন' = 'সহজ',
  count = 10
): Promise<AiWorksheetItem[]> => {
  const prompt = `পঞ্চম শ্রেণির সমাপনী পরীক্ষার (PECE) মডেল প্রশ্নপত্রের প্যাটার্ন অনুযায়ী বাংলা বইয়ের "${chapterTitle}" পাঠ থেকে হোমওয়ার্ক বা মডেল টেস্টের জন্য ${count}টি ${difficulty} মানের ওয়ার্কশিট প্রশ্ন তৈরি করো।
পাঠের সারসংক্ষেপ: "${chapterSummary}"

নির্দেশনা:
- প্রশ্নগুলোতে পঞ্চম শ্রেণির সিলেবাস অনুযায়ী যুক্তবর্ণ, এককথায় প্রকাশ, সমার্থক শব্দ, শূন্যস্থান বা মূলভাবের প্রশ্ন অন্তর্ভুক্ত করবে।
- প্রশ্নগুলো যেন শিক্ষার্থীদের মেধা যাচাই করার মতো হয়।

ফলাফল শুধুমাত্র নিচের মতো ভ্যালিড JSON অ্যারে দাও:
[
  {
    "id": "ws-1",
    "question": "স্পষ্ট প্রশ্ন বাংলায়",
    "answer": "চূড়ান্ত সঠিক উত্তর বাংলায়",
    "hint": "ছোট্ট সংকেত"
  }
]`;

  const messages: ChatMessage[] = [
    { role: 'system', content: 'তুমি ৫ম শ্রেণির বাংলা শিক্ষক। মডেল প্রশ্নপত্রের কাঠামো অনুসরণ করে কেবল বিশুদ্ধ JSON অ্যারে তৈরি করো।' },
    { role: 'user', content: prompt }
  ];

  const raw = await callGroqChat(messages, 0.4, 'openai/gpt-oss-120b');
  let cleaned = raw.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();
  }

  try {
    return JSON.parse(cleaned) as AiWorksheetItem[];
  } catch {
    const match = cleaned.match(/\[[\s\S]*\]/);
    if (match) {
      return JSON.parse(match[0]) as AiWorksheetItem[];
    }
    throw new Error('ওয়ার্কশিট তৈরিতে ত্রুটি হয়েছে। অনুগ্রহ করে আবার চেষ্টা করো।');
  }
};

export const generateModelTest = async (
  selectedChapters: string[]
): Promise<string> => {
  const chapterList = selectedChapters.join(', ');
  const prompt = `তুমি পঞ্চম শ্রেণির সমাপনী পরীক্ষা (PECE) ও NCTB মডেল প্রশ্নপত্রের প্যাটার্ন অনুসরণ করে একটি পূর্ণাঙ্গ ১০০ মার্কের মডেল টেস্ট প্রশ্নপত্র তৈরি করো। 
প্রশ্নপত্রটি নিচের অধ্যায়গুলোর ওপর ভিত্তি করে তৈরি হবে:
${chapterList}

নির্দেশনা:
- পুরো প্রশ্নপত্রটি একটি সুন্দর Markdown ফরম্যাটে দেবে, তবে হেডার এবং মার্কস এর জন্য HTML ব্যবহার করবে।
- প্রশ্নপত্রের একেবারে শুরুতে ঠিক মাঝখানে (center align) শ্রেণি ও বিষয়ের নাম এবং "মডেল টেস্ট প্রশ্ন" লেখাটি হেডার হিসেবে দেবে। কোনো কাল্পনিক স্কুলের নাম লেখার দরকার নেই। এর জন্য \`<div align="center">...</div>\` ব্যবহার করবে। এরপর একটি \`<hr>\` দেবে।
- প্রতিটি প্রশ্নের মার্কস (যেমন: ১০×১=১০) ঠিক ডানপাশে (right align) থাকতে হবে। এর জন্য ফ্লেক্সবক্স বা স্প্যান ব্যবহার করবে, যেমন: \`<div style="display: flex; justify-content: space-between;"><span>১. এক বাক্যে উত্তর দাও।</span><span>১০×১=১০</span></div>\`।
- প্রশ্নপত্রে ১, ২, ৩... এভাবে ক্রমিক নম্বর দিয়ে প্রশ্ন সাজাবে।
- প্রশ্নপত্রটি যেন উল্লিখিত সবগুলো অধ্যায় (বা অনেকগুলো অধ্যায় থাকলে অন্তত ৫-৬টি ভিন্ন ভিন্ন অধ্যায়) থেকে মিশ্রিত হয়। শুধুমাত্র প্রথম বা একটি অধ্যায় থেকে সব প্রশ্ন করবে না।
- প্রশ্নপত্রের একেবারে শুরুতে অবশ্যই এক বা একাধিক উদ্দীপক বা প্যাসেজ (যেমন: পাঠ্যবই থেকে একটি প্রদত্ত অনুচ্ছেদ এবং বাইরে থেকে একটি অপঠিত অনুচ্ছেদ) দেবে। 
- প্যাসেজের ওপর ভিত্তি করে শব্দার্থ, শূন্যস্থান পূরণ এবং সৃজনশীল প্রশ্ন (ক, খ, গ - যেখানে প্রতিটির উত্তর প্যাসেজ থেকে বা নিজের মতো করে দিতে হবে) তৈরি করবে।
- এর পাশাপাশি সমার্থক/বিপরীত শব্দ, এককথায় প্রকাশ, যুক্তবর্ণ, চিঠি/দরখাস্ত, এবং রচনা অন্তর্ভুক্ত করবে, ঠিক যেমন পঞ্চম শ্রেণির সমাপনী পরীক্ষায় থাকে।
- শুধু প্রশ্নপত্র তৈরি করবে, উত্তরপত্রের দরকার নেই।

ফলাফল শুধুমাত্র Markdown টেক্সট হিসেবে দেবে (কোনো JSON নয়)। কোনো \`\`\`markdown বা কোড ব্লক ব্যবহার করবে না, সরাসরি লেখা শুরু করবে।`;

  const messages: ChatMessage[] = [
    { role: 'system', content: 'তুমি ৫ম শ্রেণির বাংলা প্রশ্ন প্রণেতা। তুমি NCTB সমাপনী পরীক্ষার (১০০ মার্ক) কাঠামো অনুসরণ করে একটি পূর্ণাঙ্গ মডেল টেস্ট Markdown ফরম্যাটে তৈরি করো।' },
    { role: 'user', content: prompt }
  ];

  const raw = await callGroqChat(messages, 0.5, 'openai/gpt-oss-120b', 4000);
  return raw.trim();
};

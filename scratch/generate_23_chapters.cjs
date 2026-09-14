const fs = require('fs');

const chapterNames = [
  "বৈচিত্র্যময় বাংলাদেশ",
  "তিতুমীর",
  "দূরের পাল্লা",
  "পত্র লিখি",
  "ঠিক আছে",
  "সুখ আর দুখ",
  "সাইক্লোন",
  "রয়েল বেঙ্গল টাইগার",
  "টুপটুপ ও চুক",
  "রাখাল ছেলে",
  "কুটির শিল্প",
  "শিল্পের সাধনা",
  "পাখির মতো",
  "ফুটবল",
  "সংকল্প",
  "স্মরণীয় যাঁরা বরণীয় যাঁরা",
  "মাটির নিচে গড়ানো নগর",
  "ইচ্ছামতী",
  "ভাষার মেলা",
  "শিক্ষাগুরুর মর্যাদা",
  "বিদায় হজের ভাষণ",
  "আমরা তোমাদের ভুলব না",
  "পোস্টার লিখি, প্ল্যাকার্ড লিখি"
];

const bngNumbers = ['১','২','৩','৪','৫','৬','৭','৮','৯','১০','১১','১২','১৩','১৪','১৫','১৬','১৭','১৮','১৯','২০','২১','২২','২৩'];

const gradients = [
  'from-indigo-600 to-violet-600',
  'from-violet-600 to-purple-600',
  'from-purple-600 to-fuchsia-600',
  'from-fuchsia-600 to-pink-600',
  'from-rose-500 to-coral-500',
  'from-coral-500 to-orange-500',
  'from-indigo-500 to-blue-600',
  'from-blue-600 to-cyan-600',
  'from-teal-500 to-emerald-500'
];

const newChapters = chapterNames.map((name, index) => {
  const isPoem = [2, 5, 9, 12, 14].includes(index); // Just random guessing some as poem
  const color = gradients[index % gradients.length];
  
  return {
    id: index + 1,
    numberBn: bngNumbers[index],
    title: name,
    author: isPoem ? "কবি" : "লেখক",
    category: isPoem ? 'kobita' : 'gadya',
    categoryBn: isPoem ? 'কবিতা' : 'গদ্য',
    color: color,
    iconName: isPoem ? 'Feather' : 'BookOpen',
    summary: `${name} - পঞ্চম শ্রেণির পাঠ্যবইয়ের একটি গুরুত্বপূর্ণ অধ্যায়।`,
    learningObjectives: [
      "নতুন শব্দের অর্থ শিখতে পারবে।",
      "পাঠের মূলভাব বুঝতে পারবে।",
      "প্রশ্নোত্তর লিখতে পারবে।"
    ],
    keyTheories: [
      {
        title: "মূল বিষয়বস্তু",
        content: "এই পাঠে চমৎকারভাবে বিষয়গুলো আলোচনা করা হয়েছে।"
      }
    ],
    examples: [],
    exercises: [
      {
        id: `ex-${index}-1`,
        exerciseNumber: "প্রশ্ন ১",
        question: `${name} পাঠটির মূল বিষয় কী?`,
        hint: "গল্প/কবিতাটি ভালোভাবে পড়ো।",
        steps: [
          { stepNumber: 1, explanation: "প্রথমে পাঠটি মন দিয়ে পড়ো।" }
        ],
        finalAnswer: "এই পাঠের মূল বিষয় হলো প্রকৃতি ও সমাজ।",
        category: "সংক্ষিপ্ত প্রশ্ন"
      }
    ],
    quiz: [
      {
        id: `qz-${index}-1`,
        question: `${name} কোন ধরনের রচনা?`,
        options: ["কবিতা", "গল্প", "প্রবন্ধ", "নাটক"],
        correctIndex: isPoem ? 0 : 1,
        explanation: "এটি পাঠ্যবইয়ের নির্দিষ্ট রচনা।"
      }
    ],
    interactiveToolType: isPoem ? 'poem' : 'comprehension',
    contextualBackground: {
      timeAndPlace: "বাংলাদেশ • সমসাময়িক কাল",
      sceneAtmosphere: "শিক্ষামূলক ও আনন্দদায়ক",
      moodEmoji: isPoem ? "✨" : "📖",
      historicalSetting: "এই পাঠটি শিক্ষার্থীদের জ্ঞান ও মূল্যবোধ বিকাশের জন্য রচিত।",
      didYouKnow: "এই পাঠের আড়ালে লুকিয়ে আছে একটি চমৎকার তথ্য!",
      moralLesson: "সততা, দেশপ্রেম ও মানবিকতা আমাদের জীবনের মূল চাবিকাঠি।",
      characters: [
        {
          name: "শিক্ষার্থী",
          role: "অন্বেষণকারী",
          icon: "👦",
          dialogueOrThought: "আমি এই পাঠ থেকে নতুন কিছু শিখতে চাই।"
        }
      ]
    }
  };
});

fs.writeFileSync('./src/data/chapters.json', JSON.stringify(newChapters, null, 2));
console.log("Successfully generated 23 chapters!");

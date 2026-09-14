const fs = require('fs');
const path = require('path');
const chaptersFilePath = path.join(__dirname, '../src/data/chapters.json');
let chapters = JSON.parse(fs.readFileSync(chaptersFilePath, 'utf8'));

chapters[0].examples = [
  {
    "id": "ex1",
    "title": "পেশার উদাহরণ",
    "question": "কে কী কাজ করেন?",
    "steps": [
      {
        "stepNumber": 1,
        "explanation": "কৃষক মাঠে ফসল ফলান।"
      },
      {
        "stepNumber": 2,
        "explanation": "জেলে জাল দিয়ে মাছ ধরেন।"
      }
    ],
    "finalAnswer": "কামার লোহা দিয়ে জিনিস তৈরি করেন, কুমার মাটির হাঁড়িকুড়ি তৈরি করেন এবং তাঁতি কাপড় বোনেন।",
    "tip": "পেশা বলতে বোঝায় যে কাজ করে মানুষ জীবিকা নির্বাহ করে।"
  }
];

chapters[0].exercises = [
  {
    "id": "exer1",
    "question": "বাংলাদেশের কয়েকটি ক্ষুদ্র জাতিগোষ্ঠীর নাম লেখো।",
    "finalAnswer": "চাকমা, মারমা, ককবরক, ওঁরাও, মান্দি, সাঁওতালি ইত্যাদি।",
    "hint": "পার্বত্য জেলা, রাজশাহী বা ময়মনসিংহ অঞ্চলে কারা বাস করে তা চিন্তা করো।"
  },
  {
    "id": "exer2",
    "question": "আমাদের দেশের মানুষ কী কী পেশায় নিয়োজিত?",
    "finalAnswer": "কৃষক, জেলে, কামার, কুমার, তাঁতি ইত্যাদি নানা পেশায়।",
    "hint": "কৃষি ও গ্রামীণ জীবন নিয়ে ভাবো।"
  }
];

chapters[0].keyTheories = [
  {
    "title": "ভাষাগত বৈচিত্র্য",
    "content": "বাংলা ছাড়াও আমাদের দেশে চাকমা, মারমা, ককবরক, ওঁরাও, মান্দি, সাঁওতালি ইত্যাদি ভাষার ব্যবহার আছে।"
  },
  {
    "title": "ধর্ম ও উৎসবের বৈচিত্র্য",
    "content": "مسلم, হিন্দু, বৌদ্ধ, খ্রিষ্টানদের পাশাপাশি ক্ষুদ্র জাতিগোষ্ঠীদের নিজস্ব উৎসব (যেমন বিজু, সাংগ্রাই) রয়েছে।"
  },
  {
    "title": "পেশার বৈচিত্র্য",
    "content": "কৃষক, জেলে, কামার, কুমার, তাঁতিসহ সব পেশার মানুষের শ্রমেই আমাদের দেশ সমৃদ্ধ।"
  }
];

fs.writeFileSync(chaptersFilePath, JSON.stringify(chapters, null, 2), 'utf8');
console.log('Chapter 1 metadata fixed for UI components!');

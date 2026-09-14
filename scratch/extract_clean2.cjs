const fs = require('fs');

const ocrText = fs.readFileSync('scratch/full_book_ocr.txt', 'utf-8');

const englishToBangla = {
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
    '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
};
function toBangla(num) {
    return num.toString().split('').map(d => englishToBangla[d]).join('');
}

const chaptersList = [
    "বৈচিত্র্যময় বাংলাদেশ", "তিতুমীর", "দূরের পাল্লা", "পত্র লিখি", "ঠিক আছে",
    "সুখু আর দুখু", "সাইক্লোন", "রয়েল বেঙ্গল টাইগার", "টুকটুক ও চিকু", "রাখাল ছেলে",
    "কুটির শিল্প", "শিষ্যের সাধনা", "পাখির মতো", "কুপোকাত", "সংকল্প",
    "স্মরণীয় যাঁরা বরণীয় যাঁরা", "মাটির নিচে পুরানো নগর", "ইচ্ছামতী", "ভাষার খেলা",
    "শিক্ষাগুরুর মর্যাদা", "বিদায় হজের ভাষণ", "আমরা তোমাদের ভুলব না", "পোস্টার লিখি, প্ল্যাকার্ড লিখি"
];

// Clean up page markers
const cleanOcr = ocrText.replace(/--- Page page-\d+\.jpg ---/g, '');

const chapters = [];
for (let i = 1; i <= 23; i++) {
    const bNum = toBangla(i);
    const bNext = i < 23 ? toBangla(i+1) : '999';
    
    // allow either English or Bengali digit just in case
    let regexStr = `পাঠ\\s*(?:${bNum}|${i})(?:\\s*|\\n)(.*?)\\n([\\s\\S]*?)(?=পাঠ\\s*(?:${bNext}|${i+1})\\s|$)`;
    let regex = new RegExp(regexStr, 'i');
    
    let match = cleanOcr.match(regex);
    if (match) {
        let content = match[2];
        const exerciseMatch = content.match(/\n\s*[১1][\.।]/);
        if (exerciseMatch) {
            content = content.substring(0, exerciseMatch.index);
        }
        
        content = content.replace(/আমার বাংলা বই/g, '').replace(/শিক্ষাবর্ষ ২০২৬/g, '').trim();
        chapters.push({
            id: i,
            title: chaptersList[i-1],
            text: content
        });
    }
}

chapters.forEach(ch => {
    console.log(`Chapter ${ch.id}: Length: ${ch.text.length} chars`);
});

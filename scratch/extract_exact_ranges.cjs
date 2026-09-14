const fs = require('fs');

const userRanges = [
    { num: 1, name: "বৈচিত্র্যময় বাংলাদেশ", start: 1, end: 7 },
    { num: 2, name: "তিতুমীর", start: 8, end: 17 },
    { num: 3, name: "দূরের পাল্লা", start: 18, end: 25 },
    { num: 4, name: "ঠিক আছে", start: 26, end: 31 },
    { num: 5, name: "সুখ আর দুঃখ", start: 32, end: 40 },
    { num: 6, name: "সাইকেল (সাইক্লোন)", start: 41, end: 41 },
    { num: 7, name: "রয়েল বেঙ্গল টাইগার", start: 42, end: 50 },
    { num: 8, name: "চিরুনি ও চিত্রু (টুকটুক ও চিকু)", start: 51, end: 57 },
    { num: 9, name: "রাজন শিল্প (কুটির শিল্প)", start: 58, end: 63 },
    { num: 10, name: "শিশুরা সামান্য (শিষ্যের সাধনা)", start: 64, end: 71 },
    { num: 11, name: "পাখিকথা (পাখির মতো)", start: 72, end: 77 },
    { num: 12, name: "সংরক্ষণ (কুপোকাত)", start: 78, end: 83 },
    { num: 13, name: "ময়নামতি ধীরা বরনমতি ধীরা", start: 84, end: 91 },
    { num: 14, name: "মাতির মিতি পুরান শহর নগর", start: 92, end: 99 },
    { num: 15, name: "ইচ্ছাপূরণ (ইচ্ছামতী)", start: 100, end: 111 },
    { num: 16, name: "শিক্ষাগুরুর মর্যাদা", start: 112, end: 117 },
    { num: 17, name: "পৃথিবী হরেছে জোয়ার", start: 118, end: 123 },
    { num: 18, name: "আমরা তোমাদের ভুলব না", start: 124, end: 131 },
    { num: 19, name: "পোস্টার লিখি, গ্রাফিতি লিখি", start: 132, end: 139 }
];

const ocrText = fs.readFileSync('scratch/full_book_ocr.txt', 'utf-8');
const pages = ocrText.split('--- Page page-');

function getPageText(num) {
    const pageStr = num.toString().padStart(3, '0') + '.jpg ---';
    const pageObj = pages.find(p => p.startsWith(pageStr));
    if (!pageObj) return '';
    return pageObj.replace(pageStr, '').trim();
}

const resDir = './resources';
if (fs.existsSync(resDir)) {
    fs.readdirSync(resDir).forEach(f => {
        if (f.endsWith('.txt')) fs.unlinkSync(`${resDir}/${f}`);
    });
} else {
    fs.mkdirSync(resDir);
}

for (let i = 0; i < userRanges.length; i++) {
    const item = userRanges[i];
    
    let fullText = '';
    for (let p = item.start; p <= item.end; p++) {
        const imgNum = p + 6;
        fullText += getPageText(imgNum) + '\n\n';
    }
    
    let cleanText = fullText.replace(/আমার বাংলা বই/g, '').replace(/শিক্ষাবর্ষ ২০২৬/g, '').trim();
    
    fs.writeFileSync(`${resDir}/chapter_${item.num}_text.txt`, cleanText);
    console.log(`Saved Chapter ${item.num}: ${item.name} (${cleanText.length} chars)`);
}

console.log("Extraction with exact page ranges complete!");

const fs = require('fs');

const userList = [
    { num: 1, name: "বৈচিত্র্যময় বাংলাদেশ", startImg: 7 },
    { num: 2, name: "তিতুমীর", startImg: 14 },
    { num: 3, name: "দূরের পাল্লা", startImg: 24 },
    { num: 4, name: "ঠিক আছে", startImg: 32 },
    { num: 5, name: "সুখ আর দুঃখ", startImg: 38 },
    { num: 6, name: "সাইকেল (সাইক্লোন)", startImg: 47 },
    { num: 7, name: "রয়েল বেঙ্গল টাইগার", startImg: 48 },
    { num: 8, name: "চিরুনি ও চিত্রু (টুকটুক ও চিকু)", startImg: 57 },
    { num: 9, name: "রাজন শিল্প (কুটির শিল্প)", startImg: 64 },
    { num: 10, name: "শিশুরা সামান্য (শিষ্যের সাধনা)", startImg: 70 },
    { num: 11, name: "পাখিকথা (পাখির মতো)", startImg: 78 },
    { num: 12, name: "সংরক্ষণ (কুপোকাত)", startImg: 84 },
    { num: 13, name: "ময়নামতি ধীরা বরনমতি ধীরা", startImg: 90 },
    { num: 14, name: "মাতির মিতি পুরান শহর নগর", startImg: 98 },
    { num: 15, name: "ইচ্ছাপূরণ (ইচ্ছামতী)", startImg: 106 },
    { num: 16, name: "শিক্ষাগুরুর মর্যাদা", startImg: 118 },
    { num: 17, name: "পৃথিবী হরেছে জোয়ার", startImg: 124 },
    { num: 18, name: "আমরা তোমাদের ভুলব না", startImg: 130 },
    { num: 19, name: "পোস্টার লিখি, গ্রাফিতি লিখি", startImg: 138 }
];

const ocrText = fs.readFileSync('scratch/full_book_ocr.txt', 'utf-8');
const pages = ocrText.split('--- Page page-');

function getPageText(num) {
    const pageStr = num.toString().padStart(3, '0') + '.jpg ---';
    const pageObj = pages.find(p => p.startsWith(pageStr));
    if (!pageObj) return '';
    return pageObj.replace(pageStr, '').trim();
}

// Clear resources dir
const resDir = './resources';
if (fs.existsSync(resDir)) {
    fs.readdirSync(resDir).forEach(f => fs.unlinkSync(`${resDir}/${f}`));
} else {
    fs.mkdirSync(resDir);
}

for (let i = 0; i < userList.length; i++) {
    const item = userList[i];
    const endImg = i < userList.length - 1 ? userList[i+1].startImg - 1 : 142;
    
    let fullText = '';
    for (let img = item.startImg; img <= endImg; img++) {
        fullText += getPageText(img) + '\n\n';
    }
    
    // Clean text by cutting at exercises
    let cleanText = fullText;
    const exerciseMatch = cleanText.match(/\n\s*[১1][\.।\)]|\n\s*অনুশীলনী|\n\s*১\s+শব্দগুলো/);
    if (exerciseMatch) {
        cleanText = cleanText.substring(0, exerciseMatch.index);
    }
    
    // extra cleanup
    cleanText = cleanText.replace(/আমার বাংলা বই/g, '').replace(/শিক্ষাবর্ষ ২০২৬/g, '').trim();
    
    fs.writeFileSync(`${resDir}/chapter_${item.num}_text.txt`, cleanText);
    console.log(`Saved Chapter ${item.num}: ${item.name} (${cleanText.length} chars)`);
}

console.log("Done!");

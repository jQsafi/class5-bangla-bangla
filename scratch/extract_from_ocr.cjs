const fs = require('fs');

const ocrText = fs.readFileSync('scratch/full_book_ocr.txt', 'utf-8');
const pages = ocrText.split('--- Page page-');

function getPage(num) {
    const pageStr = num.toString().padStart(3, '0') + '.jpg ---';
    const pageObj = pages.find(p => p.startsWith(pageStr));
    if (!pageObj) return '';
    return pageObj.replace(pageStr, '').trim();
}

const chaptersMap = [
    { id: 2, title: "তিতুমীর", startBookPage: 6, endBookPage: 10 },
    { id: 3, title: "দূরের পাল্লা", startBookPage: 19, endBookPage: 20 },
    { id: 4, title: "পত্র লিখি", startBookPage: 24, endBookPage: 25 },
    { id: 5, title: "ঠিক আছে", startBookPage: 28, endBookPage: 30 },
    { id: 6, title: "সুখু আর দুখু", startBookPage: 32, endBookPage: 35 },
    { id: 7, title: "সাইক্লোন", startBookPage: 38, endBookPage: 40 },
    { id: 8, title: "রয়েল বেঙ্গল টাইগার", startBookPage: 42, endBookPage: 45 },
    { id: 9, title: "টুকটুক ও চিকু", startBookPage: 47, endBookPage: 50 },
    { id: 10, title: "রাখাল ছেলে", startBookPage: 53, endBookPage: 54 },
    { id: 11, title: "কুটির শিল্প", startBookPage: 57, endBookPage: 60 },
    { id: 12, title: "শিষ্যের সাধনা", startBookPage: 64, endBookPage: 66 },
    { id: 13, title: "পাখির মতো", startBookPage: 69, endBookPage: 71 },
    { id: 14, title: "কুপোকাত", startBookPage: 74, endBookPage: 76 },
    { id: 15, title: "সংকল্প", startBookPage: 84, endBookPage: 85 },
    { id: 16, title: "স্মরণীয় যাঁরা বরণীয় যাঁরা", startBookPage: 90, endBookPage: 94 },
    { id: 17, title: "মাটির নিচে পুরানো নগর", startBookPage: 98, endBookPage: 100 },
    { id: 18, title: "ইচ্ছামতী", startBookPage: 102, endBookPage: 104 },
    { id: 19, title: "ভাষার খেলা", startBookPage: 107, endBookPage: 109 },
    { id: 20, title: "শিক্ষাগুরুর মর্যাদা", startBookPage: 112, endBookPage: 114 },
    { id: 21, title: "বিদায় হজের ভাষণ", startBookPage: 119, endBookPage: 121 },
    { id: 22, title: "আমরা তোমাদের ভুলব না", startBookPage: 124, endBookPage: 127 },
    { id: 23, title: "পোস্টার লিখি, প্ল্যাকার্ড লিখি", startBookPage: 130, endBookPage: 132 }
];

const chaptersFile = './src/data/chapters.json';
let chapters = JSON.parse(fs.readFileSync(chaptersFile, 'utf8'));

if (!fs.existsSync('./resources')) {
    fs.mkdirSync('./resources');
}

for (const cmap of chaptersMap) {
    let chapterText = '';
    for (let p = cmap.startBookPage; p <= cmap.endBookPage; p++) {
        // user said page 1 = image 7, so image num = page + 6
        const imgNum = p + 6;
        const pText = getPage(imgNum);
        if (pText) {
            chapterText += pText + '\n\n';
        }
    }
    
    // clean up OCR artifacts loosely
    chapterText = chapterText.replace(/আমার বাংলা বই/g, '').trim();
    
    fs.writeFileSync(`./resources/chapter_${cmap.id}_text.txt`, chapterText);
    
    // update chapter json
    const ch = chapters.find(c => parseInt(c.id) === cmap.id);
    if (ch) {
        if (ch.category === 'kobita') {
            ch.poemLines = chapterText.split('\n');
            ch.fullText = "";
        } else {
            ch.fullText = chapterText;
            ch.poemLines = [];
        }
    }
}

fs.writeFileSync(chaptersFile, JSON.stringify(chapters, null, 2));
console.log('Successfully extracted texts and updated chapters.json!');


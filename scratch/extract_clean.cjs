const fs = require('fs');

const ocrText = fs.readFileSync('scratch/full_book_ocr.txt', 'utf-8');

// The chapters list based on TOC to map correctly
const chaptersList = [
    "বৈচিত্র্যময় বাংলাদেশ", "তিতুমীর", "দূরের পাল্লা", "পত্র লিখি", "ঠিক আছে",
    "সুখু আর দুখু", "সাইক্লোন", "রয়েল বেঙ্গল টাইগার", "টুকটুক ও চিকু", "রাখাল ছেলে",
    "কুটির শিল্প", "শিষ্যের সাধনা", "পাখির মতো", "কুপোকাত", "সংকল্প",
    "স্মরণীয় যাঁরা বরণীয় যাঁরা", "মাটির নিচে পুরানো নগর", "ইচ্ছামতী", "ভাষার খেলা",
    "শিক্ষাগুরুর মর্যাদা", "বিদায় হজের ভাষণ", "আমরা তোমাদের ভুলব না", "পোস্টার লিখি, প্ল্যাকার্ড লিখি"
];

// Clean up page markers so they don't interrupt text
const cleanOcr = ocrText.replace(/--- Page page-\d+\.jpg ---/g, '');

const chapters = [];
for (let i = 1; i <= 23; i++) {
    // Find the start of the chapter
    let regex = new RegExp(`পাঠ\\s*${i}(?:\\s*|\\n)(.*?)\\n([\\s\\S]*?)(?=পাঠ\\s*${i+1}\\s|$)`, 'i');
    let match = cleanOcr.match(regex);
    if (match) {
        let content = match[2];
        // Cut off at the first exercise. Usually starts with "১. শব্দ" or "১. প্রশ্ন" or "১।"
        // We'll look for "\n১." or "\n১ " or "\n১।"
        const exerciseMatch = content.match(/\n\s*১[\.।]/);
        if (exerciseMatch) {
            content = content.substring(0, exerciseMatch.index);
        }
        
        // Final clean
        content = content.replace(/আমার বাংলা বই/g, '').replace(/শিক্ষাবর্ষ ২০২৬/g, '').trim();
        chapters.push({
            id: i,
            title: chaptersList[i-1],
            text: content
        });
    }
}

chapters.forEach(ch => {
    console.log(`Chapter ${ch.id}: ${ch.title} - Length: ${ch.text.length} chars`);
    fs.writeFileSync(`scratch/ch${ch.id}_preview.txt`, ch.text.substring(0, 100) + '...\n\n[END OF PREVIEW]\n' + ch.text.substring(ch.text.length - 100));
});


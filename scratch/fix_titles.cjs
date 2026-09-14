const fs = require('fs');
const path = require('path');
const chaptersFilePath = path.join(__dirname, '../src/data/chapters.json');
let chapters = JSON.parse(fs.readFileSync(chaptersFilePath, 'utf8'));

chapters[8].title = "টুকটুক ও চিকু";
chapters[11].title = "শিষ্যের সাধনা";
chapters[13].title = "কুপোকাত";
chapters[18].title = "ভাষার খেলা";

fs.writeFileSync(chaptersFilePath, JSON.stringify(chapters, null, 2), 'utf8');
console.log('Fixed titles in chapters.json');

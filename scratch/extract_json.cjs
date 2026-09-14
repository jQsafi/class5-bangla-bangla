const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: fs.createReadStream('/Users/shafayat/.gemini/antigravity-ide/brain/a626a6a8-ba68-463a-9272-36155dd2a460/.system_generated/logs/transcript_full.jsonl'),
  crlfDelay: Infinity
});

let bestMatch = '';

rl.on('line', (line) => {
  if (line.includes('chapters.json')) {
    // Try to extract JSON strings
    const matches = line.match(/\[\{.*\}\]/);
    if (matches) {
       for (const match of matches) {
           try {
               // Only valid JSON
               const parsed = JSON.parse(match);
               if (Array.isArray(parsed) && parsed.length === 17 && match.length > bestMatch.length) {
                   bestMatch = match;
               }
           } catch(e) {}
       }
    }
  }
});

rl.on('close', () => {
  if (bestMatch) {
      fs.writeFileSync('scratch/recovered_chapters.json', bestMatch);
      console.log('Recovered chapters.json of length', bestMatch.length);
  } else {
      console.log('Could not find 17-chapter JSON array');
  }
});

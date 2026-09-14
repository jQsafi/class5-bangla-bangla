const fs = require('fs');
const pdf = require('pdf-parse'); // pdf-parse is a function in normal usage

let dataBuffer = fs.readFileSync('scratch/book.pdf');

// Let's print the typeof pdf
console.log('typeof pdf:', typeof pdf);
if (typeof pdf === 'function') {
  pdf(dataBuffer).then(function(data) {
      fs.writeFileSync('scratch/pdf_text.txt', data.text);
      console.log("Extracted text saved. Total pages:", data.numpages);
  }).catch(err => {
      console.error(err);
  });
} else if (pdf && pdf.default) {
  pdf.default(dataBuffer).then(function(data) {
      fs.writeFileSync('scratch/pdf_text.txt', data.text);
      console.log("Extracted text saved. Total pages:", data.numpages);
  }).catch(err => console.error(err));
} else {
  console.log("pdf-parse export keys:", Object.keys(pdf));
}

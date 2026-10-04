const fs = require('fs');
const content = fs.readFileSync('public/resume/MD_Sozib_Hossain_Resume_Editable.svg', 'utf8');

const regex = /<text[^>]*id=\"(text\d+[^"]*)\"[^>]*>([\s\S]*?)<\/text>/g;
let match;
while ((match = regex.exec(content)) !== null) {
  const id = match[1];
  const text = match[2].replace(/<[^>]+>/g, '').trim();
  if (text.length > 50) {
    console.log(`${id}: len=${text.length} -> "${text}"`);
  }
}

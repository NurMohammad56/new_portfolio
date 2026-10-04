const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function findChromePath() {
  const possiblePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

const browserPath = findChromePath();
if (!browserPath) {
  console.error('Error: Chrome or Edge not found.');
  process.exit(1);
}

const svgPath = path.resolve(__dirname, '../public/resume/MD_Sozib_Hossain_Resume_Editable.svg');
const pdfPath = path.resolve(__dirname, '../public/resume/MD_Sozib_Hossain_Resume_Editable.pdf');
const wrapperHtmlPath = path.resolve(__dirname, '../public/resume/.temp_print_wrapper.html');

if (!fs.existsSync(svgPath)) {
  console.error('Error: SVG file not found at:', svgPath);
  process.exit(1);
}

const svgContent = fs.readFileSync(svgPath, 'utf8');

const wrapperHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>MD. Sozib Hossain - Resume</title>
<style>
  @page {
    size: A4 portrait;
    margin: 0;
  }
  html, body {
    margin: 0;
    padding: 0;
    width: 210mm;
    height: 297mm;
    overflow: hidden;
    background: #ffffff;
  }
  svg {
    display: block;
    width: 210mm;
    height: 297mm;
  }
</style>
</head>
<body>
${svgContent}
</body>
</html>`;

fs.writeFileSync(wrapperHtmlPath, wrapperHtml, 'utf8');

try {
  const cmd = `"${browserPath}" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="${pdfPath}" "file:///${wrapperHtmlPath.replace(/\\/g, '/')}"`;
  execSync(cmd, { stdio: 'pipe' });
  console.log('✅ PDF generated successfully: public/resume/MD_Sozib_Hossain_Resume_Editable.pdf');
} finally {
  if (fs.existsSync(wrapperHtmlPath)) {
    fs.unlinkSync(wrapperHtmlPath);
  }
}

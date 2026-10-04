const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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
const svgPath = path.resolve('public/resume/MD_Sozib_Hossain_Resume_Editable.svg');
const pdfPath = path.resolve('public/resume/MD_Sozib_Hossain_Resume_Editable.pdf');
const tempHtmlPath = path.resolve('public/resume/.temp_render.html');

let svg = fs.readFileSync(svgPath, 'utf8');

// 1. MAIN_CONTENT transform -> translate(296, 0)
svg = svg.replace(/id="MAIN_CONTENT"[\s\S]*?transform="translate\([^)]*\)"/g, 'id="MAIN_CONTENT"\n   transform="translate(296, 0)"');

// 2. Header divider line (rect81) -> width="470"
svg = svg.replace(/<rect[^>]+id="rect81"[^>]*>/g, '<rect y="105" class="st26" width="470" height="1.5" id="rect81" />');

// 3. Footer divider line (rect181) -> width="470"
svg = svg.replace(/<rect[^>]+id="rect181"[^>]*>/g, '<rect class="st26" width="470" height="0.8" id="rect181" />');

// 4. Footer website link -> x = 358.5
svg = svg.replace(/transform="matrix\(1 0 0 1 [0-9.]+ 16\)"/g, 'transform="matrix(1 0 0 1 358.5 16)"');

// 5. Work Experience dates and locations
// Scaleup (Jan 2025 – Present, Dhaka, Bangladesh)
svg = svg.replace(/<text[^>]+id="text91"[^>]*>[\s\S]*?<\/text>/g, '<text transform="translate(398,155)" class="st30 st5 st22" id="text91">Jan 2025 – Present</text>');
svg = svg.replace(/<text[\s\S]*?id="text91"[^>]*>[\s\S]*?<\/text>/g, '<text transform="translate(398,155)" class="st30 st5 st22" id="text91">Jan 2025 – Present</text>');

svg = svg.replace(/<text[^>]+id="text93"[^>]*>[\s\S]*?<\/text>/g, '<text transform="translate(396,168)" class="st30 st5 st22" id="text93">Dhaka, Bangladesh</text>');
svg = svg.replace(/<text[\s\S]*?id="text93"[^>]*>[\s\S]*?<\/text>/g, '<text transform="translate(396,168)" class="st30 st5 st22" id="text93">Dhaka, Bangladesh</text>');

// CodersTrust (Nov 2023 – Dec 2024, Dhaka, Bangladesh)
svg = svg.replace(/<text[^>]+id="text97"[^>]*>[\s\S]*?<\/text>/g, '<text transform="translate(391,155)" class="st30 st5 st22" id="text97">Nov 2023 – Dec 2024</text>');
svg = svg.replace(/<text[\s\S]*?id="text97"[^>]*>[\s\S]*?<\/text>/g, '<text transform="translate(391,155)" class="st30 st5 st22" id="text97">Nov 2023 – Dec 2024</text>');

svg = svg.replace(/<text[^>]+id="text101"[^>]*>[\s\S]*?<\/text>/g, '<text transform="translate(396,168)" class="st30 st5 st22" id="text101">Dhaka, Bangladesh</text>');
svg = svg.replace(/<text[\s\S]*?id="text101"[^>]*>[\s\S]*?<\/text>/g, '<text transform="translate(396,168)" class="st30 st5 st22" id="text101">Dhaka, Bangladesh</text>');

// Freelance (2023 – 2023, Global Clients)
svg = svg.replace(/<text[^>]+id="text105"[^>]*>[\s\S]*?<\/text>/g, '<text transform="translate(414,155)" class="st30 st5 st22" id="text105">2023 – 2023</text>');
svg = svg.replace(/<text[\s\S]*?id="text105"[^>]*>[\s\S]*?<\/text>/g, '<text transform="translate(414,155)" class="st30 st5 st22" id="text105">2023 – 2023</text>');

svg = svg.replace(/<text[^>]+id="text107"[^>]*>[\s\S]*?<\/text>/g, '<text transform="translate(416,168)" class="st30 st5 st22" id="text107">Global Clients</text>');
svg = svg.replace(/<text[\s\S]*?id="text107"[^>]*>[\s\S]*?<\/text>/g, '<text transform="translate(416,168)" class="st30 st5 st22" id="text107">Global Clients</text>');

// 6. Project Badges
// Proj 1 (Evpitch)
svg = svg.replace(
  /<path[^>]+id="path152"[^>]*\/>/g,
  '<path class="st39" d="m 427,221 h 40 c 1.7,0 3,1.3 3,3 v 7 c 0,1.7 -1.3,3 -3,3 h -40 c -1.7,0 -3,-1.3 -3,-3 v -7 c 0,-1.7 1.3,-3 3,-3 z" id="path152" />'
);
svg = svg.replace(/<text[^>]+id="text153"[^>]*>[\s\S]*?<\/text>/g, '<text transform="translate(438.5,230)" class="st40 st5 st41" id="text153">SaaS</text>');

// Proj 2 (Prophetic)
svg = svg.replace(
  /<path[^>]+id="path158"[^>]*\/>/g,
  '<path class="st39" d="m 427,221 h 40 c 1.7,0 3,1.3 3,3 v 7 c 0,1.7 -1.3,3 -3,3 h -40 c -1.7,0 -3,-1.3 -3,-3 v -7 c 0,-1.7 1.3,-3 3,-3 z" id="path158" />'
);
svg = svg.replace(/<text[^>]+id="text159"[^>]*>[\s\S]*?<\/text>/g, '<text transform="translate(438.5,230)" class="st40 st5 st41" id="text159">SaaS</text>');

// Proj 3 (Walkthroughz)
svg = svg.replace(
  /<path[^>]+id="path164"[^>]*\/>/g,
  '<path class="st39" d="m 399,221 h 68 c 1.7,0 3,1.3 3,3 v 7 c 0,1.7 -1.3,3 -3,3 h -68 c -1.7,0 -3,-1.3 -3,-3 v -7 c 0,-1.7 1.3,-3 3,-3 z" id="path164" />'
);
svg = svg.replace(/<text[^>]+id="text165"[^>]*>[\s\S]*?<\/text>/g, '<text transform="translate(410.5,230)" class="st40 st5 st41" id="text165">Location App</text>');

// Proj 4 (EVPitch Mobile)
svg = svg.replace(
  /<path[^>]+id="path170"[^>]*\/>/g,
  '<path class="st39" d="m 405,221 h 62 c 1.7,0 3,1.3 3,3 v 7 c 0,1.7 -1.3,3 -3,3 h -62 c -1.7,0 -3,-1.3 -3,-3 v -7 c 0,-1.7 1.3,-3 3,-3 z" id="path170" />'
);
svg = svg.replace(/<text[^>]+id="text171"[^>]*>[\s\S]*?<\/text>/g, '<text transform="translate(416,230)" class="st40 st5 st41" id="text171">Mobile App</text>');

// Proj 5 (SPLURJJ)
svg = svg.replace(
  /<path[^>]+id="path176"[^>]*\/>/g,
  '<path class="st39" d="m 399,221 h 68 c 1.7,0 3,1.3 3,3 v 7 c 0,1.7 -1.3,3 -3,3 h -68 c -1.7,0 -3,-1.3 -3,-3 v -7 c 0,-1.7 1.3,-3 3,-3 z" id="path176" />'
);
svg = svg.replace(/<text[^>]+id="text177"[^>]*>[\s\S]*?<\/text>/g, '<text transform="translate(410.5,230)" class="st40 st5 st41" id="text177">Location App</text>');

// Proj 6 (Diamond Auctions)
svg = svg.replace(
  /<path[^>]+id="path182"[^>]*\/>/g,
  '<path class="st39" d="m 403,221 h 64 c 1.7,0 3,1.3 3,3 v 7 c 0,1.7 -1.3,3 -3,3 h -64 c -1.7,0 -3,-1.3 -3,-3 v -7 c 0,-1.7 1.3,-3 3,-3 z" id="path182" />'
);
svg = svg.replace(/<text[^>]+id="text183"[^>]*>[\s\S]*?<\/text>/g, '<text transform="translate(414,230)" class="st40 st5 st41" id="text183">E-Commerce</text>');

// Save SVG
fs.writeFileSync(svgPath, svg, 'utf8');
console.log('✅ SVG file written successfully!');

// Export PDF
const html = `<!DOCTYPE html>
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
${svg}
</body>
</html>`;

fs.writeFileSync(tempHtmlPath, html, 'utf8');

try {
  const cmd = `"${browserPath}" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="${pdfPath}" "file:///${tempHtmlPath.replace(/\\/g, '/')}"`;
  execSync(cmd, { stdio: 'pipe' });
  console.log('✅ PDF generated successfully: MD_Sozib_Hossain_Resume_Editable.pdf');
} finally {
  if (fs.existsSync(tempHtmlPath)) {
    fs.unlinkSync(tempHtmlPath);
  }
}

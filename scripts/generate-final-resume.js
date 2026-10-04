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
const photoPath = path.resolve('public/resume/sozib_photo_suit.jpg');
const tempHtmlPath = path.resolve('public/resume/.temp_render.html');

let svg = fs.readFileSync(svgPath, 'utf8');

// 1. Ensure Avatar Photo is present in AVATAR_BADGE
if (!svg.includes('id="avatar_photo"')) {
  const photoBase64 = fs.readFileSync(photoPath).toString('base64');
  const avatarImageTag = `<image
   clip-path="url(#avatar-clip)"
   x="86"
   y="26"
   width="112"
   height="152"
   preserveAspectRatio="xMidYMid slice"
   href="data:image/jpeg;base64,${photoBase64}"
   id="avatar_photo" />\n\t</g>`;
  svg = svg.replace(/<circle[\s\n]+class="st4"[\s\n]+cx="134"[\s\n]+cy="75"[\s\n]+r="49"[\s\n]+id="circle3" \/>[\s\n]+<\/g>/, `<circle\n   class="st4"\n   cx="134"\n   cy="75"\n   r="49"\n   id="circle3" />\n\t\t${avatarImageTag}`);
}

// 2. Set MAIN_CONTENT position -> translate(296, 0)
// Page Width = 794px, Sidebar Width = 268px
// Left Margin = 296 - 268 = 28px
svg = svg.replace(/(id="MAIN_CONTENT"[\s\n]+transform="translate\()[^)]+(\)")/, '$1296, 0$2');

// 3. Set Header and Footer divider rects width to 470px
// Right Margin = 794 - (296 + 470) = 28px -> EXACT MATCH WITH LEFT MARGIN!
svg = svg.replace(/(width=")[^"]*("\s+height="1\.5"\s+id="rect81")/, '$1470$2');
svg = svg.replace(/(<rect\s+class="st26"\s+width=")[^"]*(")/, '$1470$2');

// 4. Footer website link position -> x = 358.5
svg = svg.replace(/(transform="matrix\(1 0 0 1 )[0-9.]+( 16\)"[\s\n]+id="text183")/, '$1358.5$2');
svg = svg.replace(/(transform="matrix\(1 0 0 1 )[0-9.]+( 16\)")/g, '$1358.5$2');

// 5. Experience Section Dates and Locations
// Scaleup (Jan 2025 – Present at 398, Dhaka, Bangladesh at 396)
svg = svg.replace(/(transform="translate\()[0-9.]+(,155\)"\s+class="st30 st5 st22"\s+id="text91")/, '$1398$2');
svg = svg.replace(/(transform="translate\()[0-9.]+(,168\)"\s+class="st30 st5 st22"\s+id="text93")/, '$1396$2');

// CodersTrust (Nov 2023 – Dec 2024 at 391, Dhaka, Bangladesh at 396)
svg = svg.replace(/(transform="translate\()[0-9.]+(,155\)"\s+class="st30 st5 st22"\s+id="text97")/, '$1391$2');
svg = svg.replace(/(class="st30 st5 st22"\s+id="text97"\s+transform="translate\()[0-9.]+(,155\)")/, '$1391$2');
svg = svg.replace(/(transform="translate\()[0-9.]+(,168\)"\s+class="st30 st5 st22"\s+id="text101")/, '$1396$2');

// Freelance (2023 – 2023 at 414, Global Clients at 416)
svg = svg.replace(/(transform="translate\()[0-9.]+(,155\)"\s+class="st30 st5 st22"\s+id="text105")/, '$1414$2');
svg = svg.replace(/(transform="translate\()[0-9.]+(,168\)"\s+class="st30 st5 st22"\s+id="text107")/, '$1416$2');

// 6. Project Badges (Right edge = 470)
// Project 1 (Evpitch - SaaS)
svg = svg.replace(
  /d="m [0-9.]+,221 h [0-9.]+ c 1\.7,0 3,1\.3 3,3 v 7 c 0,1\.7 -1\.3,3 -3,3 h -[0-9.]+ c -1\.7,0 -3,-1\.3 -3,-3 v -7 c 0,-1\.7 1\.3,-3 3,-3 z"(\s+id="path152")/,
  'd="m 427,221 h 40 c 1.7,0 3,1.3 3,3 v 7 c 0,1.7 -1.3,3 -3,3 h -40 c -1.7,0 -3,-1.3 -3,-3 v -7 c 0,-1.7 1.3,-3 3,-3 z"$1'
);
svg = svg.replace(/(transform="translate\()[0-9.]+(,230\)"\s+class="st40 st5 st41"\s+id="text153")/, '$1438.5$2');

// Project 2 (Prophetic - SaaS)
svg = svg.replace(
  /d="m [0-9.]+,221 h [0-9.]+ c 1\.7,0 3,1\.3 3,3 v 7 c 0,1\.7 -1\.3,3 -3,3 h -[0-9.]+ c -1\.7,0 -3,-1\.3 -3,-3 v -7 c 0,-1\.7 1\.3,-3 3,-3 z"(\s+id="path158")/,
  'd="m 427,221 h 40 c 1.7,0 3,1.3 3,3 v 7 c 0,1.7 -1.3,3 -3,3 h -40 c -1.7,0 -3,-1.3 -3,-3 v -7 c 0,-1.7 1.3,-3 3,-3 z"$1'
);
svg = svg.replace(/(transform="translate\()[0-9.]+(,230\)"\s+class="st40 st5 st41"\s+id="text159")/, '$1438.5$2');

// Project 3 (Walkthroughz - Location App)
svg = svg.replace(
  /d="m [0-9.]+,221 h [0-9.]+ c 1\.7,0 3,1\.3 3,3 v 7 c 0,1\.7 -1\.3,3 -3,3 h -[0-9.]+ c -1\.7,0 -3,-1\.3 -3,-3 v -7 c 0,-1\.7 1\.3,-3 3,-3 z"(\s+id="path164")/,
  'd="m 399,221 h 68 c 1.7,0 3,1.3 3,3 v 7 c 0,1.7 -1.3,3 -3,3 h -68 c -1.7,0 -3,-1.3 -3,-3 v -7 c 0,-1.7 1.3,-3 3,-3 z"$1'
);
svg = svg.replace(/(transform="translate\()[0-9.]+(,230\)"\s+class="st40 st5 st41"\s+id="text165")/, '$1410.5$2');

// Project 4 (EVPitch Mobile - Mobile App)
svg = svg.replace(
  /d="m [0-9.]+,221 h [0-9.]+ c 1\.7,0 3,1\.3 3,3 v 7 c 0,1\.7 -1\.3,3 -3,3 h -[0-9.]+ c -1\.7,0 -3,-1\.3 -3,-3 v -7 c 0,-1\.7 1\.3,-3 3,-3 z"(\s+id="path170")/,
  'd="m 405,221 h 62 c 1.7,0 3,1.3 3,3 v 7 c 0,1.7 -1.3,3 -3,3 h -62 c -1.7,0 -3,-1.3 -3,-3 v -7 c 0,-1.7 1.3,-3 3,-3 z"$1'
);
svg = svg.replace(/(transform="translate\()[0-9.]+(,230\)"\s+class="st40 st5 st41"\s+id="text171")/, '$1416$2');

// Project 5 (SPLURJJ - Location App)
svg = svg.replace(
  /d="m [0-9.]+,221 h [0-9.]+ c 1\.7,0 3,1\.3 3,3 v 7 c 0,1\.7 -1\.3,3 -3,3 h -[0-9.]+ c -1\.7,0 -3,-1\.3 -3,-3 v -7 c 0,-1.7 1.3,-3 3,-3 z"(\s+id="path176")/,
  'd="m 399,221 h 68 c 1.7,0 3,1.3 3,3 v 7 c 0,1.7 -1.3,3 -3,3 h -68 c -1.7,0 -3,-1.3 -3,-3 v -7 c 0,-1.7 1.3,-3 3,-3 z"$1'
);
svg = svg.replace(/(transform="translate\()[0-9.]+(,230\)"\s+class="st40 st5 st41"\s+id="text177")/, '$1410.5$2');

// Project 6 (Diamond Auctions - E-Commerce)
svg = svg.replace(
  /d="m [0-9.]+,221 h [0-9.]+ c 1\.7,0 3,1\.3 3,3 v 7 c 0,1\.7 -1\.3,3 -3,3 h -[0-9.]+ c -1\.7,0 -3,-1\.3 -3,-3 v -7 c 0,-1.7 1.3,-3 3,-3 z"(\s+id="path182")/,
  'd="m 403,221 h 64 c 1.7,0 3,1.3 3,3 v 7 c 0,1.7 -1.3,3 -3,3 h -64 c -1.7,0 -3,-1.3 -3,-3 v -7 c 0,-1.7 1.3,-3 3,-3 z"$1'
);
svg = svg.replace(/(transform="translate\()[0-9.]+(,230\)"\s+class="st40 st5 st41"\s+id="text183")/, '$1413.5$2');

// Write final SVG
fs.writeFileSync(svgPath, svg, 'utf8');
console.log('✅ Updated MD_Sozib_Hossain_Resume_Editable.svg successfully (Equal 28px Margins + Photo Embedded)!');

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
  console.log('✅ Exported MD_Sozib_Hossain_Resume_Editable.pdf successfully!');
} finally {
  if (fs.existsSync(tempHtmlPath)) {
    fs.unlinkSync(tempHtmlPath);
  }
}

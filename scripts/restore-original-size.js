const fs = require('fs');

const svgPath = 'c:/Local-Disk-D/programming/myself/public/resume/MD_Sozib_Hossain_Resume_Editable.svg';
let svg = fs.readFileSync(svgPath, 'utf8');

// 1. Restore defs avatar-clip center to cx=134
svg = svg.replace(/<circle cx="118" cy="75" r="48" \/>/g, '<circle cx="134" cy="75" r="48" />');

// 2. Restore SIDEBAR_CONTAINER background rects to width="268"
svg = svg.replace(/<rect\s+class="st1"\s+width="[^"]*"\s+height="1123"/g, '<rect class="st1" width="268" height="1123"');
svg = svg.replace(/<rect\s+class="st2"\s+width="[^"]*"\s+height="5"/g, '<rect class="st2" width="268" height="5"');

// 3. Restore AVATAR_BADGE circles and image center at cx=134
svg = svg.replace(/cx="118"/g, 'cx="134"');
svg = svg.replace(/<image[\s\S]*?id="avatar_photo" \/>/, `<image
   clip-path="url(#avatar-clip)"
   x="86"
   y="26"
   width="112"
   height="152"
   preserveAspectRatio="xMidYMid slice"
   href="data:image/jpeg;base64,${fs.readFileSync('c:/Local-Disk-D/programming/myself/public/resume/sozib_photo_suit.jpg').toString('base64')}"
   id="avatar_photo" />`);

// 4. Restore sidebar margin from x=18 to x=24
svg = svg.replace(/translate\(18,/g, 'translate(24,');
svg = svg.replace(/matrix\(1 0 0 1 18 /g, 'matrix(1 0 0 1 24 ');
svg = svg.replace(/x="18"/g, 'x="24"');

// 5. Restore Metrics cards inside sidebar (original 268px layout)
// Row 1: Card 1 (w=96), Card 2 (w=106)
svg = svg.replace(
  /d="M20,376h88c1\.7,0,3,1\.3,3,3v24c0,1\.7-1\.3,3-3,3H20c-1\.7,0-3-1\.3-3-3v-24C17,377\.3,18\.3,376,20,376z"/g,
  'd="M27,376h96c1.7,0,3,1.3,3,3v24c0,1.7-1.3,3-3,3H27c-1.7,0-3-1.3-3-3v-24C24,377.3,25.3,376,27,376z"'
);
svg = svg.replace(/matrix\(1 0 0 1 56 389\)/g, 'matrix(1 0 0 1 64.7842 389)');
svg = svg.replace(/matrix\(1 0 0 1 50 400\)/g, 'matrix(1 0 0 1 59.6154 400)');

svg = svg.replace(
  /d="M118,376h96c1\.7,0,3,1\.3,3,3v24c0,1\.7-1\.3,3-3,3H118c-1\.7,0-3-1\.3-3-3v-24C115,377\.3,116\.3,376,118,376z"/g,
  'd="M135,376h106c1.7,0,3,1.3,3,3v24c0,1.7-1.3,3-3,3H135c-1.7,0-3-1.3-3-3v-24C132,377.3,133.3,376,135,376z"'
);
svg = svg.replace(/matrix\(1 0 0 1 160 389\)/g, 'matrix(1 0 0 1 177.7842 389)');
svg = svg.replace(/matrix\(1 0 0 1 152 400\)/g, 'matrix(1 0 0 1 170.1716 400)');

// Row 2: Card 3 (w=96), Card 4 (w=106)
svg = svg.replace(
  /d="M20,411h88c1\.7,0,3,1\.3,3,3v24c0,1\.7-1\.3,3-3,3H20c-1\.7,0-3-1\.3-3-3v-24C17,412\.3,18\.3,411,20,411z"/g,
  'd="M27,411h96c1.7,0,3,1.3,3,3v24c0,1.7-1.3,3-3,3H27c-1.7,0-3-1.3-3-3v-24C24,412.3,25.3,411,27,411z"'
);
svg = svg.replace(/matrix\(1 0 0 1 58 424\)/g, 'matrix(1 0 0 1 67.9478 424)');
svg = svg.replace(/matrix\(1 0 0 1 48 435\)/g, 'matrix(1 0 0 1 55.9663 435)');

svg = svg.replace(
  /d="M118,411h96c1\.7,0,3,1\.3,3,3v24c0,1\.7-1\.3,3-3,3H118c-1\.7,0-3-1\.3-3-3v-24C115,412\.3,116\.3,411,118,411z"/g,
  'd="M135,411h106c1.7,0,3,1.3,3,3v24c0,1.7-1.3,3-3,3H135c-1.7,0-3-1.3-3-3v-24C132,412.3,133.3,411,135,411z"'
);
svg = svg.replace(/matrix\(1 0 0 1 160 424\)/g, 'matrix(1 0 0 1 180.9478 424)');
svg = svg.replace(/matrix\(1 0 0 1 138 435\)/g, 'matrix(1 0 0 1 156.2545 435)');

// 6. Sidebar bottom divider line
svg = svg.replace(/width="195"\s+height="0\.6"\s+id="rect76"/g, 'width="220" height="0.6" id="rect76"');

// 7. MAIN_CONTENT restored to translate(296, 0)
svg = svg.replace(/id="MAIN_CONTENT"\s+transform="translate\([^)]*\)"/g, 'id="MAIN_CONTENT"\n   transform="translate(296, 0)"');

// 8. Main content width = 468px
svg = svg.replace(/<rect\s+y="105"\s+class="st26"\s+width="[^"]*"/g, '<rect y="105" class="st26" width="468"');
svg = svg.replace(/<rect\s+class="st26"\s+width="[^"]*"/g, '<rect class="st26" width="468"');
svg = svg.replace(/transform="matrix\(1 0 0 1 360 16\)"/g, 'transform="matrix(1 0 0 1 356.4529 16)"');

// 9. Dates and locations in Work Experience section
svg = svg.replace(/transform="translate\(395,155\)"/g, 'transform="translate(395.9531,155)"');
svg = svg.replace(/transform="translate\(395,168\)"/g, 'transform="translate(394.1992,168)"');
svg = svg.replace(/transform="translate\(390,155\)"/g, 'transform="translate(389.2773,155)"');
svg = svg.replace(/transform="translate\(412,155\)"/g, 'transform="translate(411.9609,155)"');
svg = svg.replace(/transform="translate\(414,168\)"/g, 'transform="translate(414.2148,168)"');

// 10. Project badges (original positions)
svg = svg.replace(
  /d="m 435,221 h 38 c 1\.7,0 3,1\.3 3,3 v 7 c 0,1\.7 -1\.3,3 -3,3 h -38 c -1\.7,0 -3,-1\.3 -3,-3 v -7 c 0,-1\.7 1\.3,-3 3,-3 z"/g,
  'd="m 425,221 h 40 c 1.7,0 3,1.3 3,3 v 7 c 0,1.7 -1.3,3 -3,3 h -40 c -1.7,0 -3,-1.3 -3,-3 v -7 c 0,-1.7 1.3,-3 3,-3 z"'
);
svg = svg.replace(/transform="translate\(445,230\)"/g, 'transform="translate(436.438,230)"');

svg = svg.replace(
  /d="m 407,221 h 66 c 1\.7,0 3,1\.3 3,3 v 7 c 0,1\.7 -1\.3,3 -3,3 h -66 c -1\.7,0 -3,-1\.3 -3,-3 v -7 c 0,-1\.7 1\.3,-3 3,-3 z"/g,
  'd="m 397,221 h 68 c 1.7,0 3,1.3 3,3 v 7 c 0,1.7 -1.3,3 -3,3 h -68 c -1.7,0 -3,-1.3 -3,-3 v -7 c 0,-1.7 1.3,-3 3,-3 z"'
);
svg = svg.replace(/transform="translate\(418,230\)"/g, 'transform="translate(408.7712,230)"');

svg = svg.replace(
  /d="m 413,221 h 60 c 1\.7,0 3,1\.3 3,3 v 7 c 0,1\.7 -1\.3,3 -3,3 h -60 c -1\.7,0 -3,-1\.3 -3,-3 v -7 c 0,-1\.7 1\.3,-3 3,-3 z"/g,
  'd="m 403,221 h 62 c 1.7,0 3,1.3 3,3 v 7 c 0,1.7 -1.3,3 -3,3 h -62 c -1.7,0 -3,-1.3 -3,-3 v -7 c 0,-1.7 1.3,-3 3,-3 z"'
);
svg = svg.replace(/transform="translate\(423,230\)"/g, 'transform="translate(414,230)"');

svg = svg.replace(
  /d="m 411,221 h 62 c 1\.7,0 3,1\.3 3,3 v 7 c 0,1\.7 -1\.3,3 -3,3 h -62 c -1\.7,0 -3,-1\.3 -3,-3 v -7 c 0,-1\.7 1\.3,-3 3,-3 z"/g,
  'd="m 401,221 h 64 c 1.7,0 3,1.3 3,3 v 7 c 0,1.7 -1.3,3 -3,3 h -64 c -1.7,0 -3,-1.3 -3,-3 v -7 c 0,-1.7 1.3,-3 3,-3 z"'
);
svg = svg.replace(/transform="translate\(421,230\)"/g, 'transform="translate(411.4087,230)"');

fs.writeFileSync(svgPath, svg, 'utf8');
console.log('Restored original sizing successfully!');

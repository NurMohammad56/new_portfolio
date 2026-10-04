const fs = require('fs');

const svgPath = 'c:/Local-Disk-D/programming/myself/public/resume/MD_Sozib_Hossain_Resume_Editable.svg';
let svg = fs.readFileSync(svgPath, 'utf8');

// 1. Shift MAIN_CONTENT slightly left from 296 to 288 for better left/right margin balance
svg = svg.replace(/id="MAIN_CONTENT"[\s\n]+transform="translate\([^)]*\)"/g, 'id="MAIN_CONTENT"\n   transform="translate(288, 0)"');

// 2. Shorten Header and Footer divider lines from 468 to 445
svg = svg.replace(/<rect\s+y="105"\s+class="st26"\s+width="[^"]*"/g, '<rect y="105" class="st26" width="445"');
svg = svg.replace(/<rect\s+class="st26"\s+width="[^"]*"/g, '<rect class="st26" width="445"');

// 3. Footer link position
svg = svg.replace(/transform="matrix\(1 0 0 1 [^ ]* 16\)"/g, 'transform="matrix(1 0 0 1 332 16)"');

// 4. Update Summary Section
const newSummary = `<g
   id="SUMMARY_SECTION">
		<text
   transform="matrix(1 0 0 1 0 126)"
   class="st1 st5 st13 st7"
   id="text82">PROFESSIONAL SUMMARY</text>
		<rect
   y="131"
   class="st2"
   width="34"
   height="2"
   id="rect83" />
		<text
   transform="matrix(1 0 0 1 0 146)"
   class="st27 st9 st28"
   id="text83">Results-driven Full-Stack Software Engineer with ~3 years of experience architecting and</text>
		<text
   transform="matrix(1 0 0 1 0 158.5)"
   class="st27 st9 st28"
   id="text84">shipping modern web and mobile apps. Proven track record delivering 22+ web apps, 33+</text>
		<text
   transform="matrix(1 0 0 1 0 171)"
   class="st27 st9 st28"
   id="text85">dashboards, 3+ cross-platform mobile apps, and 7+ scalable backend services globally.</text>
		<text
   transform="matrix(1 0 0 1 0 183.5)"
   class="st27 st9 st28"
   id="text86">Dedicated to clean modular code, UX optimization, high performance, and Cloud engineering.</text>
	</g>`;

svg = svg.replace(/<g\s+id="SUMMARY_SECTION">[\s\S]*?<\/g>/, newSummary);

// 5. Update Experience Section Dates and Bullets
// Scaleup date & city
svg = svg.replace(/transform="translate\([0-9.]+,155\)"\s+class="st30 st5 st22"\s+id="text91"/g, 'transform="translate(360,155)" class="st30 st5 st22" id="text91"');
svg = svg.replace(/transform="translate\([0-9.]+,168\)"\s+class="st30 st5 st22"\s+id="text93"/g, 'transform="translate(360,168)" class="st30 st5 st22" id="text93"');

// Scaleup bullets
svg = svg.replace(
  /Deliver &amp; maintain 22\+ web apps[\s\S]*?backend services\./,
  'Deliver &amp; maintain 22+ web apps, 33+ dashboards, 3+ mobile apps, and 7+ backend services.'
);
svg = svg.replace(
  /Integrate real-time features and secure payment workflows[\s\S]*?PayPal[^\.]*\./,
  'Implement real-time features and payment workflows via Socket.IO, Stripe, &amp; PayPal.'
);

// CodersTrust date & city
svg = svg.replace(/class="st30 st5 st22"\s+id="text97"\s+transform="translate\([0-9.]+,155\)"/g, 'class="st30 st5 st22" id="text97" transform="translate(350,155)"');
svg = svg.replace(/transform="translate\([0-9.]+,155\)"\s+class="st30 st5 st22"\s+id="text97"/g, 'transform="translate(350,155)" class="st30 st5 st22" id="text97"');

// CodersTrust bullets
svg = svg.replace(
  /Trained and mentored 100\+ aspiring software engineers[\s\S]*?best practices\./,
  'Mentored 100+ software engineers in MERN stack and modern JavaScript best practices.'
);
svg = svg.replace(
  /Conducted structured code reviews, architectural feedback[\s\S]*?capstone projects\./,
  'Conducted structured code reviews, architectural guidance, and capstone project reviews.'
);

// Freelance date & city
svg = svg.replace(/transform="translate\([0-9.]+,155\)"\s+class="st30 st5 st22"\s+id="text105"/g, 'transform="translate(385,155)" class="st30 st5 st22" id="text105"');
svg = svg.replace(/transform="translate\([0-9.]+,168\)"\s+class="st30 st5 st22"\s+id="text107"/g, 'transform="translate(375,168)" class="st30 st5 st22" id="text107"');

// Freelance bullets
svg = svg.replace(
  /Shipped 10\+ client projects with 5\.0-star ratings[\s\S]*?integrations\./,
  'Shipped 10+ client projects with 5.0-star ratings covering full web/mobile builds &amp; APIs.'
);
svg = svg.replace(
  /Managed full release lifecycles: UI\/UX, server configuration[\s\S]*?distribution\./,
  'Managed full release lifecycles: UI/UX, server setups (VPS/Nginx), and mobile app stores.'
);

// 6. Update Skills Rows
svg = svg.replace(
  'JavaScript • TypeScript • React.js • Next.js • React Native • Flutter • Redux',
  'JavaScript • TypeScript • React • Next.js • React Native • Flutter • Redux'
);
svg = svg.replace(
  'Docker • Kubernetes • CI/CD • AWS EC2 • AWS S3 • AWS Lambda • Terraform',
  'Docker • Kubernetes • CI/CD • AWS EC2 • AWS S3 • Lambda • Terraform'
);

// 7. Update Project Section Badges and Bullets to stay safely within width=440
// Project 1 (Evpitch)
svg = svg.replace(
  /d="m [0-9.]+,221 h [0-9.]+ c 1\.7,0 3,1\.3 3,3 v 7 c 0,1\.7 -1\.3,3 -3,3 h -[0-9.]+ c -1\.7,0 -3,-1\.3 -3,-3 v -7 c 0,-1\.7 1\.3,-3 3,-3 z"\s+id="path152"/,
  'd="m 402,221 h 38 c 1.7,0 3,1.3 3,3 v 7 c 0,1.7 -1.3,3 -3,3 h -38 c -1.7,0 -3,-1.3 -3,-3 v -7 c 0,-1.7 1.3,-3 3,-3 z"\n   id="path152"'
);
svg = svg.replace(/transform="translate\([0-9.]+,230\)"\s+class="st40 st5 st41"\s+id="text153"/, 'transform="translate(412,230)" class="st40 st5 st41" id="text153"');
svg = svg.replace(
  /• Connected candidate, recruiter, &amp; company portals[\s\S]*?job profiles\./,
  '• Connected candidate, recruiter, &amp; company portals with video pitches &amp; profiles.'
);

// Project 2 (Prophetic)
svg = svg.replace(
  /d="m [0-9.]+,221 h [0-9.]+ c 1\.7,0 3,1\.3 3,3 v 7 c 0,1\.7 -1\.3,3 -3,3 h -[0-9.]+ c -1\.7,0 -3,-1\.3 -3,-3 v -7 c 0,-1\.7 1\.3,-3 3,-3 z"\s+id="path158"/,
  'd="m 402,221 h 38 c 1.7,0 3,1.3 3,3 v 7 c 0,1.7 -1.3,3 -3,3 h -38 c -1.7,0 -3,-1.3 -3,-3 v -7 c 0,-1.7 1.3,-3 3,-3 z"\n   id="path158"'
);
svg = svg.replace(/transform="translate\([0-9.]+,230\)"\s+class="st40 st5 st41"\s+id="text159"/, 'transform="translate(412,230)" class="st40 st5 st41" id="text159"');
svg = svg.replace(
  /• Real-time consultation platform connecting users with verified advisors[\s\S]*?chat\./,
  '• Real-time consultation platform connecting users with verified advisors via video &amp; chat.'
);
svg = svg.replace(
  /• Implemented pay-per-minute billing, flexible wallet balance system[\s\S]*?transcripts\./,
  '• Implemented pay-per-minute billing, wallet balance system, and session transcripts.'
);

// Project 3 (Walkthroughz)
svg = svg.replace(
  /d="m [0-9.]+,221 h [0-9.]+ c 1\.7,0 3,1\.3 3,3 v 7 c 0,1\.7 -1\.3,3 -3,3 h -[0-9.]+ c -1\.7,0 -3,-1\.3 -3,-3 v -7 c 0,-1\.7 1\.3,-3 3,-3 z"\s+id="path164"/,
  'd="m 374,221 h 66 c 1.7,0 3,1.3 3,3 v 7 c 0,1.7 -1.3,3 -3,3 h -66 c -1.7,0 -3,-1.3 -3,-3 v -7 c 0,-1.7 1.3,-3 3,-3 z"\n   id="path164"'
);
svg = svg.replace(/transform="translate\([0-9.]+,230\)"\s+class="st40 st5 st41"\s+id="text165"/, 'transform="translate(385,230)" class="st40 st5 st41" id="text165"');
svg = svg.replace(
  /• City discovery experience with media-rich place storytelling[\s\S]*?perspectives\./,
  '• City discovery experience with media-rich place storytelling from local creators.'
);
svg = svg.replace(
  /• Integrated Cloudinary CDN media pipeline, interactive location maps[\s\S]*?PayPal[^\.]*\./,
  '• Integrated Cloudinary CDN media pipeline, interactive maps, and PayPal payment flow.'
);

// Project 4 (EVPitch Mobile)
svg = svg.replace(
  /d="m [0-9.]+,221 h [0-9.]+ c 1\.7,0 3,1\.3 3,3 v 7 c 0,1\.7 -1\.3,3 -3,3 h -[0-9.]+ c -1\.7,0 -3,-1\.3 -3,-3 v -7 c 0,-1\.7 1\.3,-3 3,-3 z"\s+id="path170"/,
  'd="m 380,221 h 60 c 1.7,0 3,1.3 3,3 v 7 c 0,1.7 -1.3,3 -3,3 h -60 c -1.7,0 -3,-1.3 -3,-3 v -7 c 0,-1.7 1.3,-3 3,-3 z"\n   id="path170"'
);
svg = svg.replace(/transform="translate\([0-9.]+,230\)"\s+class="st40 st5 st41"\s+id="text171"/, 'transform="translate(390,230)" class="st40 st5 st41" id="text171"');
svg = svg.replace(
  /• Published Google Play mobile app with 30s video pitches[\s\S]*?chat\./,
  '• Published Google Play mobile app with 30s video pitches and in-app recruiter messaging.'
);
svg = svg.replace(
  /• Engineered backend REST APIs, live candidate matching filters[\s\S]*?payments\./,
  '• Engineered backend REST APIs, live candidate matching filters, and in-app subscriptions.'
);

// Project 5 (SPLURJJ)
svg = svg.replace(
  /d="m [0-9.]+,221 h [0-9.]+ c 1\.7,0 3,1\.3 3,3 v 7 c 0,1\.7 -1\.3,3 -3,3 h -[0-9.]+ c -1\.7,0 -3,-1\.3 -3,-3 v -7 c 0,-1\.7 1\.3,-3 3,-3 z"\s+id="path176"/,
  'd="m 374,221 h 66 c 1.7,0 3,1.3 3,3 v 7 c 0,1.7 -1.3,3 -3,3 h -66 c -1.7,0 -3,-1.3 -3,-3 v -7 c 0,-1.7 1.3,-3 3,-3 z"\n   id="path176"'
);
svg = svg.replace(/transform="translate\([0-9.]+,230\)"\s+class="st40 st5 st41"\s+id="text177"/, 'transform="translate(385,230)" class="st40 st5 st41" id="text177"');
svg = svg.replace(
  /• Responsive lifestyle media front-end blending editorial articles[\s\S]*?discovery\./,
  '• Responsive lifestyle media front-end blending articles, video, and location discovery.'
);
svg = svg.replace(
  /• Built interactive goal tracking system \("Mimic"\) turning[\s\S]*?plans\./,
  '• Built interactive goal tracking system ("Mimic") turning articles into actionable plans.'
);

// Project 6 (Diamond Auctions)
svg = svg.replace(
  /d="m [0-9.]+,221 h [0-9.]+ c 1\.7,0 3,1\.3 3,3 v 7 c 0,1\.7 -1\.3,3 -3,3 h -[0-9.]+ c -1\.7,0 -3,-1\.3 -3,-3 v -7 c 0,-1\.7 1\.3,-3 3,-3 z"\s+id="path182"/,
  'd="m 378,221 h 62 c 1.7,0 3,1.3 3,3 v 7 c 0,1.7 -1.3,3 -3,3 h -62 c -1.7,0 -3,-1.3 -3,-3 v -7 c 0,-1.7 1.3,-3 3,-3 z"\n   id="path182"'
);
svg = svg.replace(/transform="translate\([0-9.]+,230\)"\s+class="st40 st5 st41"\s+id="text183"/, 'transform="translate(388,230)" class="st40 st5 st41" id="text183"');
svg = svg.replace(
  /• Online auction portal featuring bidder registration, identity verification[\s\S]*?discovery\./,
  '• Online auction portal with bidder registration, identity verification, &amp; lot catalogs.'
);
svg = svg.replace(
  /• Structured seller item submission pipeline with multi-image appraisal[\s\S]*?workflows\./,
  '• Structured seller appraisal pipeline and secure Stripe payment settlement workflows.'
);

fs.writeFileSync(svgPath, svg, 'utf8');
console.log('Applied exact right-margin-fix layout successfully!');

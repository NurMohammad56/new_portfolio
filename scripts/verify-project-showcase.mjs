import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const require=createRequire(import.meta.url);
const ts=require('typescript');
const sharp=require('sharp');
const compiled=ts.transpileModule(await readFile(resolve(root,'data/project-showcase.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
const data={exports:{}};new Function('exports','module',compiled)(data.exports,data);
const projects=data.exports.showcaseProjects;
assert.equal(projects.length,8);
assert.equal(new Set(projects.map(p=>p.id)).size,8);
assert.equal(projects[0].device,'browser');assert.equal(projects[1].device,'tablet');
let screenshots=0,links=0,coverBytes=0;
for(const [i,p] of projects.entries()){
  assert.equal(p.number,String(i+1).padStart(2,'0'));
  assert.ok(p.contribution.startsWith('I '));
  assert.ok(p.backendHighlights.length>=3);assert.ok(p.features.length>=4);
  assert.ok(p.technologies.includes('Node.js'));assert.ok(p.technologies.includes('Express.js'));
  assert.ok(!/coming soon|placeholder|demo preview/i.test(JSON.stringify(p)));
  const cover=resolve(root,'public','.'+p.cover),metadata=await sharp(cover).metadata();
  assert.equal(metadata.width,1440);assert.equal(metadata.height,960);assert.equal(metadata.format,'webp');
  coverBytes+=(await stat(cover)).size;
  for(const image of p.images){
    const bytes=await readFile(resolve(root,'public','.'+image.src));
    assert.equal(bytes.readUInt32BE(16),image.width);assert.equal(bytes.readUInt32BE(20),image.height);
    assert.ok(image.caption);screenshots++;
  }
  for(const link of p.links){
    const url=new URL(link.href);assert.equal(url.protocol,'https:');
    if(link.kind==='googlePlay')assert.equal(url.hostname,'play.google.com');
    if(link.kind==='appStore')assert.equal(url.hostname,'apps.apple.com');
    if(link.kind==='website')assert.ok(['gcl-admin.vercel.app','gcl-vendor.vercel.app'].includes(url.hostname));
    links++;
  }
}
assert.equal(screenshots,32);assert.equal(links,11);
assert.equal(await stat(resolve(root,'public/projects/Project-1/description.txt')).then(()=>true,()=>false),false);
assert.ok(!/Bootstrap-P|VendorFlagship|Customer123|admin@example/.test(JSON.stringify(projects)));
console.log(`PASS: 8 backend projects, 32 intact screenshots, 11 supplied HTTPS links, ${Math.round(coverBytes/1024)} KB of WebP mockup covers. No public GCL credential note.`);

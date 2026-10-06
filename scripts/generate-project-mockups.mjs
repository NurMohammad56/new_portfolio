import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createServer } from 'node:http';
import { resolve, dirname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { drawProjectMockup } from './project-mockup-art.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const ts = require('typescript');
const source = await readFile(resolve(root, 'data/project-showcase.ts'), 'utf8');
const compiled = ts.transpileModule(source, {compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
const data = {exports:{}};
new Function('exports', 'module', compiled)(data.exports, data);
const projects = data.exports.showcaseProjects;
const publicRoot = resolve(root, 'public');
const server = createServer(async (req,res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname === '/') {res.setHeader('Content-Type','text/html');res.end('<!doctype html><title>Portfolio mockup rendering</title><canvas id="art"></canvas>');return;}
    const file = resolve(publicRoot, '.'+decodeURIComponent(url.pathname));
    if (!file.startsWith(publicRoot+sep) || !file.endsWith('.png')) {res.writeHead(404);res.end();return;}
    res.setHeader('Content-Type','image/png');res.end(await readFile(file));
  } catch {res.writeHead(404);res.end();}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const url = `http://127.0.0.1:${server.address().port}`;
let socket;
let tab;
try {
  const endpoint = process.env.NUR_CHROME_DEBUG_URL || 'http://localhost:9223';
  tab = await fetch(`${endpoint}/json/new?${encodeURIComponent(url)}`, {method:'PUT'}).then(r=>r.json());
  socket = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((r,j)=>{socket.addEventListener('open',r,{once:true});socket.addEventListener('error',j,{once:true});});
  let id=0;const pending=new Map();
  socket.addEventListener('message',e=>{const d=JSON.parse(e.data);if(d.id){const p=pending.get(d.id);pending.delete(d.id);if(d.error)p.reject(d.error);else p.resolve(d.result);}});
  const send=(method,params={})=>new Promise((resolve,reject)=>{const key=++id;pending.set(key,{resolve,reject});socket.send(JSON.stringify({id:key,method,params}));});
  await send('Page.enable');await send('Page.navigate',{url});
  await mkdir(resolve(root,'public/projects/covers'),{recursive:true});
  for (const project of projects) {
    const expression = `(async()=>{
      ${drawProjectMockup.toString()}
      const project=${JSON.stringify(project)};
      const images=await Promise.all(project.images.slice(0,3).map(({src})=>new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(new Error('Screenshot unavailable: '+src));image.src=src;})));
      const canvas=document.createElement('canvas');document.body.replaceChildren(canvas);
      drawProjectMockup(canvas,project,images);
      return canvas.toDataURL('image/webp',.92).split(',')[1];
    })()`;
    const result=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
    if(result.exceptionDetails)throw new Error(result.exceptionDetails.exception?.description || 'Mockup render failed');
    const file=resolve(publicRoot,'.'+project.cover);
    const bytes=Buffer.from(result.result.value,'base64');
    await writeFile(file,bytes);console.log(`${project.title}: ${Math.round(bytes.length/1024)} KB / ${project.cover}`);
  }
  console.log('Generated all 8 code-drawn mockup covers. Original screenshots unchanged.');
} finally {
  socket?.close();
  if(tab?.id){const endpoint=process.env.NUR_CHROME_DEBUG_URL || 'http://localhost:9223';await fetch(`${endpoint}/json/close/${tab.id}`).catch(()=>{});}
  server.close();
}

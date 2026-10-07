import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import ts from "typescript";

const loadLocalModule = async relativePath => {
  const source = await readFile(new URL(relativePath, import.meta.url), "utf8");
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const exports = {};
  new Function("exports", code)(exports);
  return exports;
};
const { careerStages } = await loadLocalModule("../data/career.ts");
const { diaryPageTiming } = await loadLocalModule("../components/interactive/diary-timeline.ts");
const readingPositions = careerStages.map((_, index) => diaryPageTiming(index, careerStages.length).destination);
const turningPositions = careerStages.slice(0, -1).flatMap((_, index) => {
  const { turnStart, turnEnd } = diaryPageTiming(index, careerStages.length);
  return [.25, .5, .75].map(fraction => turnStart + (turnEnd - turnStart) * fraction);
});

const endpoint = process.env.NUR_CHROME_DEBUG_URL ?? "http://localhost:9223";
const base = process.env.NUR_PREVIEW_URL ?? "http://localhost:3100";
const tab = await fetch(`${endpoint}/json/new?${encodeURIComponent(base)}`, { method: "PUT" }).then(response => response.json());
const ws = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise(resolve => ws.addEventListener("open", resolve, { once: true }));
let nextId = 0;
const pending = new Map();
const errors = [];
ws.addEventListener("message", event => {
  const message = JSON.parse(event.data);
  if (message.method === "Runtime.exceptionThrown") errors.push(message.params.exceptionDetails.exception?.description ?? message.params.exceptionDetails.text);
  if (message.id) {
    const callback = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) callback.reject(message.error); else callback.resolve(message.result);
  }
});
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++nextId;
  pending.set(id, { resolve, reject });
  ws.send(JSON.stringify({ id, method, params }));
});
const evaluate = async expression => {
  const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text);
  return result.result.value;
};
const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
const until = async expression => {
  for (let attempt = 0; attempt < 60; attempt++) {
    if (await evaluate(expression)) return;
    await wait(100);
  }
  throw new Error(`Timed out: ${expression}`);
};
const output = await mkdtemp(join(tmpdir(), "nur-career-diary-"));
const screenshot = async name => {
  const result = await send("Page.captureScreenshot", { format: "png" });
  await writeFile(join(output, `${name}.png`), Buffer.from(result.data, "base64"));
  return result.data;
};
// Test the painted 3D faces: DOM hit-testing can ignore back-facing ancestors.
const sampleBookPixel = data => evaluate(`(async()=>{
  const image=new Image();image.src='data:image/png;base64,${data}';await image.decode();
  const canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;
  const ctx=canvas.getContext('2d');ctx.drawImage(image,0,0);
  const b=document.querySelector('[data-diary-book]').getBoundingClientRect();
  return [...ctx.getImageData(Math.round(b.left+b.width*.25),Math.round(b.top+b.height*.4),1,1).data];
})()`);
const metrics = () => evaluate(`(() => {
  const diary = document.querySelector('[data-career-diary]');
  return {mode:diary.dataset.mode, chapter:diary.dataset.chapter, phase:diary.dataset.phase, width:document.documentElement.scrollWidth,
    cover:document.querySelector('[data-diary-cover]')?.style.transform,
    leaf:document.querySelector('[data-diary-leaf]')?.style.transform,
    entries:[...diary.querySelectorAll('article:not([aria-hidden="true"]) [data-diary-entry]')].map(entry=>{
      const summary=entry.querySelector('[class*=summary]').getBoundingClientRect(),footer=entry.querySelector('footer').getBoundingClientRect();
      return {role:entry.querySelector('h3').textContent,text:entry.textContent,scroll:entry.scrollHeight,height:entry.clientHeight,summaryBottom:summary.bottom,footerTop:footer.top};
    }), offset:document.querySelector('[data-scroll-edge-lines] path[stroke-dasharray]')?.getAttribute('stroke-dashoffset'),
    bodyOverflow:document.body.style.overflow};
})()`);
const seek = async amount => {
  await evaluate(`(() => {const d=document.querySelector('[data-career-diary]');const start=d.getBoundingClientRect().top+scrollY-88;scrollTo({top:start+(d.offsetHeight-innerHeight+88)*${amount},behavior:'instant'});})()`);
  await wait(1000);
};

try {
  await send("Page.enable");
  await send("Page.bringToFront");
  await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await send("Page.navigate", { url: base });
  await until("document.querySelector('[data-career-diary]')?.dataset.mode==='animated' && document.querySelector('[data-portfolio-content]')?.dataset.ready==='true'");
  const cvResponse = await fetch(`${base}/resume/Nur_Mohammad_Resume.pdf`);
  assert.equal(cvResponse.status, 200);
  const cvBytes = Buffer.from(await cvResponse.arrayBuffer());
  assert.equal(cvBytes.subarray(0, 5).toString(), "%PDF-");
  assert.deepEqual(cvBytes, await readFile(new URL("../public/resume/Nur_Mohammad_Resume.pdf", import.meta.url)));
  assert.equal(await evaluate("document.querySelectorAll('a[href=\"/resume/Nur_Mohammad_Resume.pdf\"][download=\"Nur_Mohammad_Resume.pdf\"]').length"), 2);
  assert.equal((await fetch(`${base}/companies/lskit.svg`)).status, 200);
  console.log("PASS desktop/mobile CV links serve the exact updated PDF and the LSKIT logo loads");
  await seek(0);
  const closed = await metrics();
  assert.equal(closed.chapter, "-1");
  assert.equal(closed.phase,"cover");
  assert.ok(await evaluate("document.querySelector('[data-diary-inside-cover]').parentElement===document.querySelector('[data-diary-cover]')"));
  assert.ok(await evaluate("(()=>{const b=document.querySelector('[data-diary-book]').getBoundingClientRect();const e=document.elementFromPoint(b.left+b.width*.25,b.top+b.height*.5);return !e?.closest('[data-diary-entry],[data-diary-inside-cover]')})()"),"A paper face is exposed beside the closed cover");
  const closedPixel=await sampleBookPixel(await screenshot("01-cover"));
  assert.ok(closedPixel.slice(0,3).every(channel=>channel<80),"Paper is painted beside the closed cover");
  await seek(.12);
  const opening = await metrics();
  assert.notEqual(opening.cover, closed.cover);
  await screenshot("02-opening");
  await seek(readingPositions[0]);
  const first = await metrics();
  assert.equal(first.chapter, "0");
  assert.equal(first.entries.length, 1);
  assert.equal(first.entries[0].role, "Backend Developer");
  assert.ok(first.entries[0].summaryBottom < first.entries[0].footerTop);
  assert.ok(first.entries[0].scroll <= first.entries[0].height + 2, JSON.stringify(first));
  const openPixel=await sampleBookPixel(await screenshot("03-current-role"));
  assert.ok(openPixel.slice(0,3).every(channel=>channel>170),"The opened inner cover must paint its paper face");
  await seek(turningPositions[1]);
  await screenshot("04-page-turn");
  await seek(readingPositions[1]);
  const second = await metrics();
  assert.equal(second.chapter, "1");
  assert.equal(second.entries.length, 1);
  assert.equal(second.entries[0].role, "Full Stack Developer");
  assert.ok(second.entries[0].scroll <= second.entries[0].height + 2, JSON.stringify(second));
  assert.notEqual(second.leaf, first.leaf);
  assert.notEqual(second.offset, first.offset);
  await screenshot("05-previous-role");
  for (let index = 2; index < careerStages.length; index++) {
    await seek(readingPositions[index]);
    const state = await metrics();
    assert.equal(state.chapter, String(index));
    assert.equal(state.entries.length, 1);
    assert.equal(state.entries[0].role, careerStages[index].role);
    assert.ok(state.entries[0].text.includes(careerStages[index].organization));
    assert.ok(state.entries[0].text.includes(careerStages[index].duration));
    assert.ok(state.entries[0].scroll <= state.entries[0].height + 2, JSON.stringify(state));
    await screenshot(`05-chapter-${index + 1}`);
  }
  console.log(`PASS ${careerStages.length} separate readable career chapters`);
  for(const amount of [.08,.12,.16,.21,...turningPositions,.825,.85,.885,.91]) {
    await seek(amount);
    assert.ok(await evaluate("(()=>{const top=document.querySelector('.site-navigation').getBoundingClientRect().bottom;const bottom=document.querySelector('[data-career-diary] [class*=controls]').getBoundingClientRect().top;return [...document.querySelectorAll('[data-diary-cover] > [class*=coverFront],[data-diary-cover] > [class*=coverBack],[data-diary-leaf] > article')].every(face=>{const r=face.getBoundingClientRect();return r.top>=top+4&&r.bottom<=bottom-4})})()"),`Turning face overlaps navbar/controls at ${amount}`);
  }
  console.log("PASS turning faces stay clear of navbar and controls");
  await seek(.89);
  assert.equal((await metrics()).phase,"closing");
  await screenshot("06-closing");
  await seek(.985);
  const finished=await metrics();
  assert.equal(finished.phase,"closed");
  assert.equal(finished.chapter,"-1");
  assert.equal(finished.entries.length,0);
  assert.ok(!/rotateY/.test(finished.cover)||Math.abs(Number(finished.cover.match(/rotateY\(([-.\d]+)deg\)/)?.[1]))<.1);
  assert.ok(!/rotateY/.test(finished.leaf)||Math.abs(Number(finished.leaf.match(/rotateY\(([-.\d]+)deg\)/)?.[1]))<.1);
  await screenshot("07-closed-before-release");
  assert.ok(await evaluate("[...document.querySelectorAll('[data-diary-leaf]')].every(leaf=>!leaf.style.transform.includes('rotateY')||Math.abs(Number(leaf.style.transform.match(/rotateY\\(([-.\\d]+)deg\\)/)?.[1]))<.1)"));
  for (let index = readingPositions.length - 1; index >= 0; index--) {
    await seek(readingPositions[index]);
    assert.equal((await metrics()).chapter, String(index));
  }
  await seek(0);
  assert.equal((await metrics()).chapter, "-1");
  console.log("PASS cover hides paper, opens, turns, closes before release, and reverses smoothly");
  await evaluate("document.querySelector('button[aria-label=\"Read Full Stack Developer at Arabian Services Company\"]').click()");
  await wait(1500);
  assert.equal((await metrics()).chapter, "1");
  await evaluate("document.querySelector('button[aria-label=\"Previous experience chapter\"]').click()");
  await wait(1500);
  assert.equal((await metrics()).chapter, "0");
  console.log("PASS accessible chapter controls");
  await seek(readingPositions.at(-1));
  await evaluate("document.querySelector('button[aria-label=\"Close career diary\"]').click()");
  await wait(1600);
  assert.equal((await metrics()).phase,"closed");
  await evaluate("document.querySelector('button[aria-label=\"Reopen last experience chapter\"]').click()");
  await wait(1600);
  assert.equal((await metrics()).chapter,String(careerStages.length - 1));
  console.log("PASS close and reopen controls");
  await seek(1.15);
  assert.ok(await evaluate("document.querySelector('#projects').getBoundingClientRect().top < innerHeight"));
  assert.equal((await metrics()).bodyOverflow, "");
  assert.equal(await evaluate("getComputedStyle(document.querySelector('[data-scroll-edge-lines]')).pointerEvents"), "none");
  console.log("PASS native scroll release and non-interactive edge lines");
  assert.equal(await evaluate("document.querySelectorAll('[data-edge-point]').length"),12);
  // Lazy content can extend the document on the first trip to the footer.
  for(let attempt=0;attempt<4;attempt++) {
    await evaluate("scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'})");
    await wait(350);
  }
  await until("Math.abs(Number(document.querySelector('[data-scroll-edge-lines] path[stroke-dasharray]').getAttribute('stroke-dashoffset'))+845)<2");
  const endOffset=Number((await metrics()).offset);
  assert.ok(Math.abs(endOffset+845)<2,`Edge animation ended early: ${endOffset}`);
  assert.ok(await evaluate("(()=>{const p=document.querySelector('[data-scroll-edge-lines] path[stroke-dasharray]');const start=-Number(p.getAttribute('stroke-dashoffset'));return start>=0&&start<p.getTotalLength()&&start+155<=p.getTotalLength()})()"));
  await screenshot("08-footer-edge-lines");
  await evaluate("(()=>{const filler=document.createElement('div');filler.id='diary-check-height';filler.style.height='100vh';document.body.append(filler)})()");
  await wait(1000);
  assert.ok(Number((await metrics()).offset)>endOffset+10,"Edge progress did not refresh after document height changed");
  await evaluate("document.querySelector('#diary-check-height').remove()");
  console.log("PASS darker lines, twelve points, full-footer travel, and dynamic document-height tracking");
  for (const [width, height] of [[1920,1080],[1024,768],[900,680],[768,850],[390,844],[320,740],[1440,620]]) {
    await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: false });
    await wait(350);
    const animated = width >= 900 && height >= 680;
    assert.equal((await metrics()).mode, animated ? "animated" : "readable");
    assert.ok((await metrics()).width <= width, JSON.stringify(await metrics()));
    if (animated) {
      for (const amount of readingPositions) {
        await seek(amount);
        const state = await metrics();
        for (const entry of state.entries) assert.ok(entry.scroll <= entry.height+2, `${width}x${height}: ${JSON.stringify(state)}`);
        assert.ok(await evaluate("document.querySelector('[data-diary-book]').getBoundingClientRect().bottom <= document.querySelector('[data-career-diary] [class*=controls]').getBoundingClientRect().top"), `Book overlaps controls at ${width}x${height}`);
        assert.ok(await evaluate("(()=>{const notes=document.querySelector('[data-diary-inside-cover]');return notes.scrollHeight<=notes.clientHeight+2})()"), `Inner cover contents overflow at ${width}x${height}`);
      }
    } else {
      assert.equal((await metrics()).entries.length, careerStages.length);
      await evaluate("document.querySelector('[data-career-diary]').scrollIntoView({behavior:'instant',block:'start'})");
    }
    await screenshot(`responsive-${width}-${height}`);
    console.log(`PASS layout ${width} × ${height}`);
  }
  await send("Emulation.setDeviceMetricsOverride", { width:1440,height:1000,deviceScaleFactor:1,mobile:false });
  await send("Emulation.setEmulatedMedia", { features:[{name:"prefers-reduced-motion",value:"reduce"}] });
  await until("document.querySelector('[data-career-diary]')?.dataset.mode==='readable'");
  assert.equal((await metrics()).entries.length,careerStages.length);
  assert.equal(await evaluate("getComputedStyle(document.querySelector('[data-career-diary]')).position"),"static");
  assert.ok(await evaluate("[...document.querySelectorAll('[data-scroll-edge-lines] path[stroke-dasharray]')].every(path=>getComputedStyle(path).display==='none')"));
  console.log("PASS reduced-motion readable pages and static edge lines");
  assert.equal(await evaluate("document.querySelectorAll('[data-gallery-card]').length"),8);
  await evaluate("document.querySelectorAll('[data-gallery-card]')[0].click()");
  await until("document.querySelector('dialog[open] [data-project-detail]')?.dataset.projectDetail==='gcl-commerce'");
  await evaluate("document.querySelector('[aria-label=\"Close project details\"]').click()");
  assert.equal(await evaluate("document.body.style.overflow"),"");
  console.log("PASS existing project gallery and dialog remain functional");
  assert.deepEqual(errors,[]);
  console.log(`ALL CAREER DIARY CHECKS PASSED. Screenshots: ${output}`);
} finally {
  ws.close();
  await fetch(`${endpoint}/json/close/${tab.id}`);
}

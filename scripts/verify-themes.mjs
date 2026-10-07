import assert from "node:assert/strict";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const endpoint = process.env.NUR_CHROME_DEBUG_URL ?? "http://localhost:9323";
const base = process.env.NUR_PREVIEW_URL ?? "http://localhost:3100";
const output = await mkdtemp(join(tmpdir(), "nur-themes-"));
const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
const errors = [];
let checkpoint = "initial load";
async function connect() {
  const tab = await fetch(`${endpoint}/json/new?about:blank`, { method: "PUT" }).then(response => response.json());
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise(resolve => ws.addEventListener("open", resolve, { once: true }));
  let id = 0;
  const pending = new Map();
  ws.addEventListener("message", event => {
    const message = JSON.parse(event.data);
    if (message.method === "Runtime.exceptionThrown") {
      const error = message.params.exceptionDetails.exception?.description ?? message.params.exceptionDetails.text;
      errors.push(error);
      console.error(`BROWSER ERROR (${checkpoint}): ${error}`);
    }
    if (message.method === "Runtime.consoleAPICalled" && message.params.type === "error") {
      const error = message.params.args.map(arg => arg.value ?? arg.description).join(" ");
      errors.push(error);
      console.error(`BROWSER ERROR (${checkpoint}): ${error}`);
    }
    if (message.id) {
      const callback = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) callback.reject(message.error); else callback.resolve(message.result);
    }
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const next = ++id;
    pending.set(next, { resolve, reject });
    ws.send(JSON.stringify({ id: next, method, params }));
  });
  const evaluate = async expression => {
    const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text);
    return result.result.value;
  };
  await send("Runtime.enable");
  await send("Page.enable");
  return { send, evaluate, close: async () => { ws.close(); await fetch(`${endpoint}/json/close/${tab.id}`); } };
}
const browser = await connect();
const { send, evaluate } = browser;
const until = async expression => {
  for (let attempt = 0; attempt < 100; attempt++) {
    if (await evaluate(`Boolean(${expression})`)) return;
    await wait(100);
  }
  throw new Error(`Timed out: ${expression}`);
};
const ready = () => until("document.querySelector('[data-portfolio-content]')?.dataset.ready==='true' && document.querySelector('[data-theme-toggle]')");
const screenshot = async name => {
  const result = await send("Page.captureScreenshot", { format: "png" });
  await writeFile(join(output, `${name}.png`), Buffer.from(result.data, "base64"));
};
const state = () => evaluate(`(()=>{
  const root=document.documentElement,css=getComputedStyle(root),button=document.querySelector('[data-theme-toggle]');
  return {theme:root.dataset.theme,background:css.getPropertyValue('--ink').trim(),text:css.getPropertyValue('--text').trim(),accent:css.getPropertyValue('--signal').trim(),muted:css.getPropertyValue('--muted').trim(),scheme:css.colorScheme,pressed:button.getAttribute('aria-pressed'),label:button.getAttribute('aria-label'),meta:document.querySelector('meta[name="theme-color"]').content};
})()`);
const luminance = hex => {
  const rgb = [1,3,5].map(offset => parseInt(hex.slice(offset,offset+2),16)/255).map(value => value <= .04045 ? value/12.92 : ((value+.055)/1.055)**2.4);
  return rgb[0]*.2126 + rgb[1]*.7152 + rgb[2]*.0722;
};
const checkColors = async theme => {
  const colors = await state();
  assert.equal(colors.theme, theme);
  assert.equal(colors.scheme, theme);
  assert.equal(colors.pressed, String(theme === "light"));
  assert.equal(colors.meta, colors.background);
  for (const color of [colors.text, colors.muted, colors.accent]) {
    const light = luminance(colors.background), dark = luminance(color);
    const ratio = (Math.max(light,dark)+.05)/(Math.min(light,dark)+.05);
    assert.ok(ratio >= 4.5, `Insufficient ${theme} contrast for ${color}: ${ratio}`);
  }
};
let otherTab;
try {
  await send("Emulation.setDeviceMetricsOverride", { width:1440,height:1000,deviceScaleFactor:1,mobile:false });
  await send("Page.navigate", { url:base });
  await ready();
  await evaluate("localStorage.removeItem('nur-portfolio-theme')");
  await send("Page.reload");
  await ready();
  await checkColors("dark");
  await screenshot("01-dark-hero");
  await evaluate("document.querySelector('[data-theme-toggle]').click()");
  await until("document.querySelector('[data-theme-toggle]').getAttribute('aria-pressed')==='true'");
  await checkColors("light");
  assert.equal(await evaluate("localStorage.getItem('nur-portfolio-theme')"), "light");
  await wait(400);
  await screenshot("02-light-hero");
  console.log("PASS theme switch, readable palette contrast, button labels, browser chrome and saved choice");
  await send("Page.addScriptToEvaluateOnNewDocument", { source: `new MutationObserver((_,observer)=>{if(document.body){window.initialPortfolioTheme=document.documentElement.dataset.theme;observer.disconnect()}}).observe(document,{childList:true,subtree:true})` });
  checkpoint = "saved light reload";
  await send("Page.reload");
  await ready();
  await checkColors("light");
  assert.equal(await evaluate("window.initialPortfolioTheme"), "light");
  console.log("PASS saved light colors restored before the body renders, without hydration errors");
  await evaluate("document.querySelector('#services button[aria-label^=\"Explore\"]').click()");
  await until("document.querySelector('dialog[open] #service-detail-title')");
  assert.equal(await evaluate("getComputedStyle(document.querySelector('dialog[open] button[aria-label=\"Close service details\"]').parentElement).backgroundColor"), "rgb(255, 255, 255)");
  await screenshot("03-light-service-modal");
  await evaluate("document.querySelector('[aria-label=\"Close service details\"]').click()");
  await evaluate("document.querySelectorAll('[data-gallery-card]')[0].click()");
  await until("document.querySelector('dialog[open] [data-project-detail]')");
  await screenshot("04-light-project-modal");
  await evaluate("document.querySelector('[aria-label=\"Close project details\"]').click()");
  assert.equal(await evaluate("document.body.style.overflow"), "");
  for (const section of ["projects","skills","deployment","contact"]) {
    await evaluate(`document.getElementById('${section}').scrollIntoView({behavior:'instant',block:'start'})`);
    await wait(650);
    await screenshot(`light-${section}`);
  }
  console.log("PASS light service/project dialogs, gallery and all themed sections");
  for (const width of [1440,1240,1130,1024,768,390,320]) {
    await send("Emulation.setDeviceMetricsOverride", { width,height:900,deviceScaleFactor:1,mobile:false });
    await evaluate("scrollTo({top:0,behavior:'instant'})");
    await wait(350);
    assert.ok(await evaluate(`document.documentElement.scrollWidth<=${width}`), `Overflow at ${width}px`);
    assert.ok(await evaluate(`(()=>{const r=document.querySelector('[data-theme-toggle]').getBoundingClientRect();const header=document.querySelector('.site-navigation').getBoundingClientRect();return r.left>=0&&r.right<=${width}&&r.top>=header.top&&r.bottom<=header.bottom})()`), `Theme button off screen at ${width}px`);
    assert.ok(await evaluate("(()=>{const b=document.querySelector('[data-theme-toggle]').getBoundingClientRect();return [...document.querySelectorAll('.nav-inner>a,.nav-inner>nav,.nav-inner>.mobile-menu-button')].filter(el=>getComputedStyle(el).display!=='none').every(el=>{const r=el.getBoundingClientRect();return r.right<=b.left||r.left>=b.right})})()"), `Navbar overlaps at ${width}px`);
    await screenshot(`light-header-${width}`);
  }
  await evaluate("document.querySelector('.mobile-menu-button').click()");
  await until("document.querySelector('#mobile-navigation').getAttribute('aria-hidden')==='false'");
  await evaluate("document.querySelector('[data-theme-toggle]').click()");
  await until("document.documentElement.dataset.theme==='dark'");
  assert.equal(await evaluate("getComputedStyle(document.querySelector('#mobile-navigation')).backgroundColor"), "rgb(3, 11, 16)");
  await evaluate("document.querySelector('.mobile-menu-button').click()");
  console.log("PASS responsive header, mobile navigation and theme switching at seven widths");
  otherTab = await connect();
  checkpoint = "second tab";
  await otherTab.send("Page.navigate", { url:base });
  for (let attempt=0;attempt<100;attempt++) {
    if (await otherTab.evaluate("document.querySelector('[data-portfolio-content]')?.dataset.ready==='true'")) break;
    await wait(100);
  }
  await otherTab.evaluate("document.querySelector('[data-theme-toggle]').click()");
  await until("document.documentElement.dataset.theme==='light'");
  await checkColors("light");
  console.log("PASS theme preference synchronization between real browser tabs");
  await send("Emulation.setEmulatedMedia", { features:[{name:"prefers-reduced-motion",value:"reduce"}] });
  checkpoint = "reduced motion";
  await evaluate("document.querySelector('[data-theme-toggle]').click()");
  await until("document.documentElement.dataset.theme==='dark'");
  await checkColors("dark");
  assert.ok(await evaluate("getComputedStyle(document.querySelector('[data-theme-toggle]')).transitionDuration.split(',').every(duration=>parseFloat(duration)<=.001)"));
  console.log("PASS reduced-motion theme controls");
  await send("Page.addScriptToEvaluateOnNewDocument", { source: `Storage.prototype.getItem=()=>{throw new Error('Storage blocked')};Storage.prototype.setItem=()=>{throw new Error('Storage blocked')}` });
  checkpoint = "blocked storage reload";
  await send("Page.reload");
  await ready();
  await checkColors("dark");
  await evaluate("document.querySelector('[data-theme-toggle]').click()");
  await until("document.documentElement.dataset.theme==='light'");
  await checkColors("light");
  console.log("PASS usable theme switching with browser storage blocked");
  assert.deepEqual(errors, []);
  console.log(`ALL THEME CHECKS PASSED. Screenshots: ${output}`);
} finally {
  await otherTab?.close();
  await browser.close();
}

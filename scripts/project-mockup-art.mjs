// Code-drawn device compositions. Screenshots are placed as supplied, without
// AI reconstruction, UI replacement, or cropping. Keep this function standalone
// so the generator can render it in a browser canvas.
export function drawProjectMockup(canvas, project, images) {
  const ctx = canvas.getContext('2d');
  canvas.width = 1440;
  canvas.height = 960;
  ctx.scale(1.2, 1.2);
  const round = (x, y, w, h, r) => { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); };
  ctx.fillStyle = '#030b10'; ctx.fillRect(0, 0, 1200, 800);
  const glow = ctx.createRadialGradient(610, 330, 20, 610, 330, 720);
  glow.addColorStop(0, '#12393b'); glow.addColorStop(.58, '#082127'); glow.addColorStop(1, '#030b10');
  ctx.fillStyle = glow; ctx.fillRect(0, 0, 1200, 800);
  ctx.strokeStyle = '#72d5cc0a'; ctx.lineWidth = 1;
  for (let x = 24; x < 1200; x += 64) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 800); ctx.stroke(); }
  for (let y = 24; y < 800; y += 64) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1200, y); ctx.stroke(); }
  ctx.strokeStyle = '#66a4a124';
  for (const [w, h] of [[1010, 540], [1130, 652]]) { round((1200-w)/2, (720-h)/2, w, h, 48); ctx.stroke(); }
  ctx.font = '11px monospace'; ctx.fillStyle = '#94aaa9';
  ctx.fillText(`${project.number} / ${project.platform.toUpperCase()}`, 44, 42);
  ctx.textAlign = 'right'; ctx.fillStyle = '#17e6d2'; ctx.fillText('BACKEND BY NUR MOHAMMAD', 1156, 42); ctx.textAlign = 'left';
  const ground = ctx.createRadialGradient(600, 594, 8, 600, 594, 475);
  ground.addColorStop(0, '#000000a8'); ground.addColorStop(1, '#00000000');
  ctx.fillStyle = ground; ctx.beginPath(); ctx.ellipse(600, 594, 480, 54, 0, 0, Math.PI*2); ctx.fill();

  const device = (image, centerX, centerY, screenW, angle, type) => {
    const pad = type === 'tablet' ? 14 : type === 'phone' ? 7 : type === 'browser' ? 7 : 2;
    const bar = type === 'browser' ? 27 : 0;
    const screenH = screenW * image.naturalHeight / image.naturalWidth;
    const w = screenW + pad*2, h = screenH + pad*2 + bar;
    const radius = type === 'tablet' ? 24 : type === 'phone' ? 30 : 12;
    ctx.save(); ctx.translate(centerX, centerY); ctx.rotate(angle*Math.PI/180);
    ctx.shadowColor = '#00000090'; ctx.shadowBlur = 34; ctx.shadowOffsetY = 24;
    round(-w/2, -h/2, w, h, radius); ctx.fillStyle = '#101d24'; ctx.fill();
    ctx.shadowColor = 'transparent';
    const edge = ctx.createLinearGradient(-w/2, -h/2, w/2, h/2);
    edge.addColorStop(0, '#819b9e'); edge.addColorStop(.3, '#283c45'); edge.addColorStop(.65, '#071116'); edge.addColorStop(1, '#46686b');
    ctx.strokeStyle = edge; ctx.lineWidth = 2; round(-w/2, -h/2, w, h, radius); ctx.stroke();
    if (type === 'browser') {
      for (const [i, color] of ['#809c9b','#567875','#365855'].entries()) { ctx.beginPath(); ctx.arc(-w/2 + 18 + i*12, -h/2 + 16, 3, 0, Math.PI*2); ctx.fillStyle=color; ctx.fill(); }
      ctx.fillStyle='#8ca7a8'; ctx.font='9px monospace'; ctx.textAlign='center'; ctx.fillText(project.title.toLowerCase() + ' / ' + (image === images[0] ? 'storefront' : 'workspace'), 0, -h/2+19); ctx.textAlign='left';
    }
    if (type === 'tablet') { ctx.beginPath(); ctx.arc(0, -h/2+7, 2, 0, Math.PI*2); ctx.fillStyle='#668183'; ctx.fill(); }
    if (type === 'phone') {
      ctx.fillStyle='#29424a'; round(-w/2-2, -h/2+74, 2, 40, 1); ctx.fill(); round(w/2, -h/2+105, 2, 54, 1); ctx.fill();
    }
    ctx.save(); round(-screenW/2, -h/2+pad+bar, screenW, screenH, Math.max(5, radius-pad)); ctx.clip();
    ctx.fillStyle='#fff'; ctx.fillRect(-screenW/2, -h/2+pad+bar, screenW, screenH);
    ctx.drawImage(image, -screenW/2, -h/2+pad+bar, screenW, screenH); ctx.restore(); ctx.restore();
  };
  if (project.device === 'browser') {
    device(images[1] ?? images[0], 735, 273, 780, 5, 'browser');
    device(images[0], 543, 376, 922, -4, 'browser');
  } else if (project.device === 'tablet') {
    device(images[1] ?? images[0], 349, 319, 306, -9, 'tablet');
    device(images[0], 714, 328, 355, 5, 'tablet');
  } else {
    const type = project.device;
    device(images[1] ?? images[0], 353, 310, 196, -11, type);
    device(images[2] ?? images[0], 849, 309, 196, 11, type);
    device(images[0], 601, 325, 233, -1, type);
  }
  // The gallery adds its own accessible title and category at the bottom.
  const fade = ctx.createLinearGradient(0, 615, 0, 800);
  fade.addColorStop(0, '#030b1000'); fade.addColorStop(1, '#030b10');
  ctx.fillStyle = fade; ctx.fillRect(0, 615, 1200, 185);
  return canvas;
}

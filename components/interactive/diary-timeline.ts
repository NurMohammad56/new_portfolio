// One reversible scroll timeline: open, read, turn, read, close, release.
export const diaryTimeline = {
  openStart: 0.035,
  openEnd: 0.25,
  turnStart: 0.43,
  turnEnd: 0.59,
  closeStart: 0.8,
  closeEnd: 0.94,
} as const;

export const smoothRange = (value: number, start: number, end: number) => {
  const t = Math.max(0, Math.min(1, (value - start) / (end - start)));
  return t * t * t * (t * (t * 6 - 15) + 10);
};

export const diaryOpenness = (value: number) =>
  smoothRange(value, diaryTimeline.openStart, diaryTimeline.openEnd)
  * (1 - smoothRange(value, diaryTimeline.closeStart, diaryTimeline.closeEnd));

export const diaryLeafProgress = (value: number, index: number, count: number) => {
  const { turnStart, turnEnd } = diaryPageTiming(index, count);
  return smoothRange(value, turnStart, turnEnd) * (1 - smoothRange(value, diaryTimeline.closeStart, diaryTimeline.closeEnd - 0.035));
};

// Every chapter gets a still reading interval, not a continuously turning page.
export const diaryPageTiming = (index: number, count: number) => {
  const turnDuration = Math.min(0.16, 0.22 / Math.max(1, count - 1));
  const readingDuration = (diaryTimeline.closeStart - diaryTimeline.openEnd - Math.max(0, count - 1) * turnDuration) / Math.max(1, count);
  const readStart = diaryTimeline.openEnd + index * (readingDuration + turnDuration);
  const turnStart = readStart + readingDuration;
  return { readStart, readEnd: turnStart, turnStart, turnEnd: turnStart + turnDuration, destination: readStart + readingDuration * 0.5 };
};

export const diaryChapter = (value: number, count: number) => {
  if (value < diaryTimeline.openEnd * 0.82 || value >= diaryTimeline.closeEnd - 0.015) return -1;
  let chapter = 0;
  for (let index = 0; index < count - 1; index++) {
    const { turnStart, turnEnd } = diaryPageTiming(index, count);
    if (value >= (turnStart + turnEnd) / 2) chapter = index + 1;
  }
  return chapter;
};

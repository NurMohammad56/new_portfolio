import type { ReactNode } from "react";
import styles from "./stack-study.module.css";

function Node({ x, y, label }: { x: number; y: number; label: string }) {
  return <g transform={`translate(${x} ${y})`}><rect className={styles.node} x="-33" y="-17" width="66" height="34" rx="8" /><text className={styles.label} textAnchor="middle" y="3">{label}</text></g>;
}

function Layer({ y, label, index }: { y: number; label: string; index: number }) {
  return (
    <g transform={`translate(0 ${y})`} className={styles.layer} style={{ animationDelay: `${index * -0.6}s` }}>
      <path className={styles.side} d="M132 70 210 109 288 70 288 91 210 130 132 91Z" />
      <path className={styles.top} d="M132 70 210 31 288 70 210 109Z" />
      <path className={styles.edge} d="M132 70 210 109 288 70M210 109V130" />
      <text className={styles.label} x="171" y="103" textAnchor="middle" transform="rotate(26 171 103)">{label}</text>
      <circle className={styles.light} cx="146" cy="88" r="2" />
    </g>
  );
}

function Backend() {
  return <>
    <path className={styles.ground} d="M82 202 210 138 338 202 210 266Z" />
    <path className={styles.connection} d="M77 83H104L135 100M286 107H340M282 177 318 210H346" />
    <path className={styles.flow} d="M77 83H104L135 100M286 107H340M282 177 318 210H346" />
    <Layer y={99} label="EVENTS" index={2} /><Layer y={55} label="LOGIC" index={1} /><Layer y={11} label="GATEWAY" index={0} />
    <Node x={54} y={83} label="CLIENT" /><Node x={365} y={107} label="DATA" /><Node x={367} y={211} label="STREAM" />
    <path className={styles.annotation} d="M210 37V14M210 244V256" />
    <text className={styles.micro} x="210" y="9" textAnchor="middle">REQUEST IN</text>
  </>;
}

function Frontend() {
  return <>
    <path className={styles.ground} d="M50 229 219 143 381 222 212 268Z" />
    <g transform="translate(92 40) rotate(-7 115 88)" className={styles.browser}>
      <rect className={styles.side} x="9" y="11" width="231" height="164" rx="12" />
      <rect className={styles.node} width="231" height="164" rx="12" />
      <path className={styles.edge} d="M0 27H231" />
      {[14, 24, 34].map(x => <circle key={x} className={styles.light} cx={x} cy="14" r="2" />)}
      <rect className={styles.quiet} x="16" y="43" width="37" height="103" rx="5" />
      <rect className={styles.top} x="66" y="43" width="148" height="40" rx="6" />
      <rect className={styles.quiet} x="66" y="96" width="67" height="50" rx="6" /><rect className={styles.quiet} x="146" y="96" width="68" height="50" rx="6" />
      <path className={styles.edge} d="M78 56H157M78 66H125M24 57H43M24 73H39M24 89H43" />
      <path className={styles.cursor} d="M178 123 179 145 185 138 191 147 196 144 189 134 200 133Z" />
    </g>
    <path className={styles.connection} d="M51 193H83L119 166M293 209H328L349 183" /><path className={styles.flow} d="M51 193H83L119 166M293 209H328L349 183" />
    <Node x={48} y={215} label="AI DRAFT" /><Node x={358} y={199} label="REVIEW" />
    <path className={styles.spark} d="M53 77 57 87 67 91 57 95 53 105 49 95 39 91 49 87Z" />
    <text className={styles.micro} x="210" y="258" textAnchor="middle">HUMAN REVIEW · CONNECTED UI</text>
  </>;
}

function Mobile() {
  return <>
    <ellipse className={styles.ground} cx="190" cy="238" rx="119" ry="25" />
    <g transform="translate(110 28) rotate(-8 61 96)" className={styles.browser}>
      <rect className={styles.side} x="8" y="9" width="118" height="195" rx="22" /><rect className={styles.node} width="118" height="195" rx="22" />
      <rect className={styles.quiet} x="10" y="12" width="98" height="172" rx="15" /><path className={styles.edge} d="M43 20H75M44 173H74" />
      <circle className={styles.top} cx="59" cy="64" r="19" /><path className={styles.edge} d="M50 64 57 70 69 57" />
      <rect className={styles.top} x="24" y="102" width="71" height="14" rx="4" /><path className={styles.edge} d="M24 130H85M24 143H65" />
    </g>
    <path className={styles.connection} d="M242 100H297V71M242 133H343M242 166H297V206" /><path className={styles.flow} d="M242 100H297V71M242 133H343M242 166H297V206" />
    <Node x={305} y={55} label="ACCOUNT" /><Node x={355} y={133} label="SYNC" /><Node x={305} y={224} label="NOTIFY" />
    <circle className={styles.ripple} cx="66" cy="134" r="18" /><circle className={styles.light} cx="66" cy="134" r="3" />
    <text className={styles.micro} x="210" y="266" textAnchor="middle">ONE ACTION · CONNECTED STATE</text>
  </>;
}

function Integrations() {
  return <>
    <ellipse className={styles.orbit} cx="210" cy="136" rx="138" ry="94" /><ellipse className={styles.orbit} cx="210" cy="136" rx="100" ry="62" />
    <path className={styles.connection} d="M210 97V55M258 136H330M210 175V216M162 136H90" /><path className={styles.flow} d="M210 97V55M258 136H330M210 175V216M162 136H90" />
    <path className={styles.side} d="M162 119 210 95 258 119V159L210 183 162 159Z" /><path className={styles.top} d="M162 119 210 95 258 119 210 143Z" /><path className={styles.edge} d="M162 119 210 143 258 119M210 143V183" />
    <text className={styles.label} x="210" y="123" textAnchor="middle">PRODUCT</text>
    <Node x={210} y={38} label="IDENTITY" /><Node x={365} y={136} label="MEDIA" /><Node x={210} y={236} label="AI / MAPS" /><Node x={55} y={136} label="WEBHOOK" />
    <circle className={styles.ripple} cx="210" cy="136" r="73" />
    <circle className={styles.light} cx="95" cy="84" r="2" /><circle className={styles.light} cx="321" cy="191" r="2" />
  </>;
}

function Production() {
  return <>
    <path className={styles.ground} d="M41 204 210 120 379 204 210 288Z" />
    <path className={styles.connection} d="M72 174 155 131 252 174 345 126" /><path className={styles.flow} d="M72 174 155 131 252 174 345 126" />
    {[{ x: 67, y: 166, text: "GIT" }, { x: 157, y: 113, text: "BUILD" }, { x: 253, y: 149, text: "LIVE" }, { x: 350, y: 104, text: "LOGS" }].map((step, index) => (
      <g key={step.text} transform={`translate(${step.x} ${step.y})`} className={styles.layer} style={{ animationDelay: `${index * -0.6}s` }}>
        <path className={styles.side} d="M-34 0 0 17 34 0V18L0 35-34 18Z" /><path className={styles.top} d="M-34 0 0-17 34 0 0 17Z" /><path className={styles.edge} d="M-34 0 0 17 34 0M0 17V35" />
        <text className={styles.label} textAnchor="middle" y="3">{step.text}</text>
        <text className={styles.micro} textAnchor="middle" y="57">{String(index + 1).padStart(2, "0")}</text>
      </g>
    ))}
    <path className={styles.annotation} d="M253 122V54H316" /><text className={styles.micro} x="256" y="42">RELEASE PATH</text>
    <circle className={styles.ripple} cx="253" cy="149" r="33" />
  </>;
}

const scenes: Record<string, () => ReactNode> = {
  "backend-realtime": Backend, "interface-engineering": Frontend, "mobile-products": Mobile,
  "product-systems": Integrations, "production-release": Production,
};

export function StackStudy({ groupId }: { groupId: string }) {
  const Scene = scenes[groupId] ?? Backend;
  return <div className={styles.stage} data-stack-study={groupId} aria-hidden="true">
    <svg viewBox="10 0 400 300" className={styles.scene}><Scene /></svg>
  </div>;
}

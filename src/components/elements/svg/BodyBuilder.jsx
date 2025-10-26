// components/MinimalBodyIcon.jsx
"use client";

import React from "react";

/**
 * MinimalBodyIcon
 * props:
 *  - size (number|string) default 64
 *  - color default "#ffffff"
 *  - loopSpeed default 3.6 (seconds)
 */
export function MinimalBodyIcon({
  size = 64,
  color = "#ffffff",
  loopSpeed = 3.6,
}) {
  const s = typeof size === "number" ? `${size}px` : size;
  const speed = typeof loopSpeed === "number" ? `${loopSpeed}s` : loopSpeed;

  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 200 200"
      role="img"
      aria-label="Bodybuilding icon"
      style={{ ["--icon-color"]: color, ["--speed"]: speed }}
    >
      <style>{`
        :root{ --c: var(--icon-color); --spd: var(--speed); }
        .root { transform-origin: 50% 55%; animation: breathe var(--spd) ease-in-out infinite; }
        .arm { transform-box: fill-box; transform-origin: 50% 10%; animation: armRaise var(--spd) ease-in-out infinite; }
        .arm.r { animation-delay: 0s; }
        .arm.l { animation-delay: 0.1s; }
        .biceps { animation: pulse var(--spd) ease-in-out infinite; animation-delay: calc(var(--spd) * 0.25); opacity: 0.08; }

        svg:hover .arm { animation-play-state: paused; transform: rotate(-18deg); }
        svg:hover .arm.l { transform: rotate(18deg); }

        @keyframes armRaise {
          0%   { transform: rotate(75deg); }
          45%  { transform: rotate(6deg); }
          65%  { transform: rotate(-12deg); }
          100% { transform: rotate(75deg); }
        }
        @keyframes breathe {
          0% { transform: scale(1); }
          45% { transform: scale(1.02); }
          65% { transform: scale(0.995); }
          100% { transform: scale(1); }
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity:0.08; }
          50% { transform: scale(1.06); opacity:0.12; }
          100% { transform: scale(1); opacity:0.08; }
        }

        .stroke { stroke: var(--c); stroke-width: 6; stroke-linecap: round; stroke-linejoin: round; fill: none; }
        .fill { fill: var(--c); }
      `}</style>

      <g className="root">
        <circle cx="100" cy="44" r="12" className="fill" />
        <path
          className="fill"
          d="M86 62 C80 92, 120 92, 114 62 L114 108 C114 120, 86 120, 86 108 Z"
        />

        <g
          className="arm r"
          transform="rotate(75 150 40)"
          style={{ transformOrigin: "150px 40px" }}
        >
          <path className="stroke" d="M150 40 C138 50, 130 68, 120 84" />
          <path className="stroke" d="M120 84 C114 96, 108 110, 100 116" />
          <ellipse className="biceps fill" cx="142" cy="44" rx="9" ry="5" />
        </g>

        <g
          className="arm l"
          transform="rotate(-75 50 40)"
          style={{ transformOrigin: "50px 40px" }}
        >
          <path className="stroke" d="M50 40 C62 50, 70 68, 80 84" />
          <path className="stroke" d="M80 84 C86 96, 92 110, 100 116" />
          <ellipse className="biceps fill" cx="58" cy="44" rx="9" ry="5" />
        </g>

        <path className="stroke" d="M88 118 L112 118" />
      </g>
    </svg>
  );
}

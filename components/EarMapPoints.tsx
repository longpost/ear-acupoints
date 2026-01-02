"use client";

import React, { useMemo, useRef, useState } from "react";
import type { EarPoint, Lang } from "@/lib/types";

type Props = {
  viewBox: string;
  /** Mirror the ear outline horizontally (used for right ear). */
  earFlipX?: boolean;
  /** Scale the ear outline image (points are NOT scaled). */
  earScale?: number;
  earTranslateX?: number;
  earTranslateY?: number;

  lang: Lang;
  points: EarPoint[];
  selectedId: string | null;
  onSelect: (id: string) => void;

  /** Admin mode: click to read coordinates. */
  admin?: boolean;
  onAdminPick?: (p: { x: number; y: number }) => void;
};

function parseViewBox(viewBox: string) {
  const parts = viewBox.trim().split(/\s+/).map(Number);
  const w = parts.length === 4 && Number.isFinite(parts[2]) ? parts[2] : 744.09;
  const h = parts.length === 4 && Number.isFinite(parts[3]) ? parts[3] : 1052.4;
  const minX = parts.length === 4 && Number.isFinite(parts[0]) ? parts[0] : 0;
  const minY = parts.length === 4 && Number.isFinite(parts[1]) ? parts[1] : 0;
  return { minX, minY, w, h };
}

export default function EarMapPoints({
  viewBox,
  earFlipX = false,
  earScale = 1.12,
  earTranslateX = 0,
  earTranslateY = 0,
  lang,
  points,
  selectedId,
  onSelect,
  admin = false,
  onAdminPick,
}: Props) {
  const vb = useMemo(() => parseViewBox(viewBox), [viewBox]);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hover, setHover] = useState<string | null>(null);

  const selected = points.find((p) => p.id === selectedId) || null;

  const label = (zh: string, en: string) => (lang === "zh" ? zh : en);

  function clientToSvg(e: React.MouseEvent) {
    const svg = svgRef.current;
    if (!svg) return null;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    const inv = ctm.inverse();
    const res = pt.matrixTransform(inv);
    return { x: res.x, y: res.y };
  }

  const onClickSvg = (e: React.MouseEvent) => {
    if (!admin) return;
    const p = clientToSvg(e);
    if (!p) return;
    onAdminPick?.(p);
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      {/* Ear outline as an image (stable; no SVG innerHTML issues). */}
      <img
        src="/ear_outline.svg"
        alt={label("耳朵轮廓", "Ear outline")}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "contain",
          transform: `${earFlipX ? "scaleX(-1) " : ""}translate(${earTranslateX}px, ${earTranslateY}px) scale(${earScale})`,
          transformOrigin: "center center",
          // If you want a hard black outline, uncomment:
          // filter: "contrast(220%) brightness(0%)",
        }}
      />

      {/* Points overlay */}
      <svg
        ref={svgRef}
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid meet"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
        role="img"
        aria-label={label("耳穴点位（科普）", "Auricular points (educational)")}
        onClick={onClickSvg}
      >
        {/* Optional admin crosshair */}
        {admin ? (
          <rect x={vb.minX} y={vb.minY} width={vb.w} height={vb.h} fill="transparent" />
        ) : null}

        {points.map((p) => {
          const isSel = p.id === selectedId;
          const isHover = p.id === hover;
          const r = isSel ? 6 : 5;
          return (
            <g
              key={p.id}
              onClick={(e) => {
                if (admin) return; // admin clicks handled by svg
                e.stopPropagation();
                onSelect(p.id);
              }}
              onMouseEnter={() => setHover(p.id)}
              onMouseLeave={() => setHover((cur) => (cur === p.id ? null : cur))}
              style={{ cursor: admin ? "crosshair" : "pointer" }}
            >
              <circle className={isSel ? "point selected" : "point"} cx={p.x} cy={p.y} r={r} opacity={isHover || isSel ? 1 : 0.9} />
              {isSel ? <circle className="pointRing" cx={p.x} cy={p.y} r={10} /> : null}
              <title>
                {label(p.zh, p.en)} ({p.standard})
              </title>
            </g>
          );
        })}

        {/* Selected label */}
        {selected ? (
          <g pointerEvents="none">
            <rect x={selected.x + 10} y={selected.y - 16} width={210} height={26} rx={8} ry={8} fill="white" opacity={0.92} />
            <text x={selected.x + 18} y={selected.y + 2} fontSize="12" fontFamily="Arial" fill="#111827">
              {label(selected.zh, selected.en)} · {selected.standard}
            </text>
          </g>
        ) : null}
      </svg>
    </div>
  );
}

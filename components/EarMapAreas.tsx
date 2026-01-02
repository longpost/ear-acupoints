"use client";

import React, { useMemo, useRef } from "react";
import type { EarArea, Lang } from "@/lib/types";

type Props = {
  viewBox: string;
  earFlipX?: boolean;
  earScale?: number;
  earTranslateX?: number;
  earTranslateY?: number;

  lang: Lang;
  areas: EarArea[];
  selectedId: string | null;
  onSelect: (id: string) => void;

  admin?: boolean;
  onAdminPick?: (p: { x: number; y: number }) => void;
};

export default function EarMapAreas({
  viewBox,
  earFlipX = false,
  earScale = 1.12,
  earTranslateX = 0,
  earTranslateY = 0,
  lang,
  areas,
  selectedId,
  onSelect,
  admin = false,
  onAdminPick,
}: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const label = (zh: string, en: string) => (lang === "zh" ? zh : en);
  const selected = useMemo(() => areas.find((a) => a.id === selectedId) || null, [areas, selectedId]);

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

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
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
        }}
      />

      <svg
        ref={svgRef}
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid meet"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
          // Mirror overlay to match the mirrored outline for the right ear.
          transform: earFlipX ? "scaleX(-1)" : "none",
          transformOrigin: "center center",
        }}
        role="img"
        aria-label={label("耳功能区（科普）", "Ear zones (educational)")}
        onClick={(e) => {
          if (!admin) return;
          const p = clientToSvg(e);
          if (!p) return;
          onAdminPick?.(p);
        }}
      >
        {areas.map((a) => {
          const isSel = a.id === selectedId;
          return (
            <g
              key={a.id}
              onClick={(e) => {
                if (admin) return;
                e.stopPropagation();
                onSelect(a.id);
              }}
              style={{ cursor: admin ? "crosshair" : "pointer" }}
            >
              <path
                d={a.pathD}
                fill={isSel ? "rgba(14,165,233,0.35)" : "rgba(239,68,68,0.18)"}
                stroke={isSel ? "#0ea5e9" : "#ef4444"}
                strokeWidth={isSel ? 2.5 : 2}
              />
              <title>{label(a.nameZh, a.nameEn)}</title>
            </g>
          );
        })}

        {/* For the right ear, the whole SVG is mirrored. To keep text readable, we simply omit the on-map label box.
            The info panel on the right still shows the full details. */}
        {selected && !earFlipX ? (
          <g pointerEvents="none">
            <rect x={selected.labelX} y={selected.labelY - 16} width={240} height={26} rx={8} ry={8} fill="white" opacity={0.92} />
            <text x={selected.labelX + 8} y={selected.labelY + 2} fontSize="12" fontFamily="Arial" fill="#111827">
              {label(selected.nameZh, selected.nameEn)}
            </text>
          </g>
        ) : null}
      </svg>
    </div>
  );
}

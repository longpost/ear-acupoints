"use client";

import React, { useMemo, useState } from "react";
import EarMapPoints from "@/components/EarMapPoints";
import EarMapAreas from "@/components/EarMapAreas";
import { ALL_POINTS, GBT_COMMON_POINTS, NADA_POINTS } from "@/lib/points";
import { EAR_AREAS } from "@/lib/areas";
import { CATEGORY_LABEL, type EarArea, type EarPoint, type Lang, type Mode, type Standard } from "@/lib/types";

type Props = {
  viewBox: string;
};

function getViewBoxWidth(viewBox: string) {
  const parts = viewBox.trim().split(/\s+/).map(Number);
  return parts.length === 4 && Number.isFinite(parts[2]) ? parts[2] : 744.09;
}

export default function AppClient({ viewBox }: Props) {
  const [lang, setLang] = useState<Lang>("zh");
  const [mode, setMode] = useState<Mode>("points");
  const [standard, setStandard] = useState<Standard>("NADA");
  const [q, setQ] = useState("");

  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);

  const [admin, setAdmin] = useState(false);
  const [adminLast, setAdminLast] = useState<{ x: number; y: number } | null>(null);

  const W = useMemo(() => getViewBoxWidth(viewBox), [viewBox]);

  const label = (zh: string, en: string) => (lang === "zh" ? zh : en);

  // Points for current standard.
  const pointsForStandard: EarPoint[] = useMemo(() => {
    if (standard === "NADA") return NADA_POINTS;
    return GBT_COMMON_POINTS;
  }, [standard]);

  const filteredPoints: EarPoint[] = useMemo(() => {
    const s = q.trim().toLowerCase();
    const src = pointsForStandard;
    if (!s) return src;
    return src.filter((p) => {
      const hay = [p.id, p.zh, p.en, p.organZh, p.organEn, p.summaryZh, p.summaryEn].join(" ").toLowerCase();
      return hay.includes(s);
    });
  }, [q, pointsForStandard]);

  const selectedPoint = useMemo(
    () => ALL_POINTS.find((p) => p.id === selectedPointId) || null,
    [selectedPointId]
  );
  const selectedArea = useMemo(
    () => EAR_AREAS.find((a) => a.id === selectedAreaId) || null,
    [selectedAreaId]
  );

  // Keep selection consistent when switching tabs.
  React.useEffect(() => {
    if (mode === "points") {
      setSelectedAreaId(null);
    } else {
      setSelectedPointId(null);
    }
  }, [mode]);

  React.useEffect(() => {
    if (!selectedPointId) return;
    const sp = ALL_POINTS.find((p) => p.id === selectedPointId);
    if (sp && sp.standard !== standard) setSelectedPointId(null);
  }, [standard]); // eslint-disable-line react-hooks/exhaustive-deps

  // Right ear points are mirrored.
  const rightPoints = useMemo(
    () => filteredPoints.map((p) => ({ ...p, x: W - p.x })),
    [filteredPoints, W]
  );
  // NOTE: For areas mode, we flip the whole EarMapAreas overlay by setting earFlipX.
  // That visually mirrors both the outline and overlay areas without rewriting path data.

  return (
    <main className="container">
      <header className="top">
        <div>
          <h1 className="h1">{label("耳穴/功能区 科普互动图", "Auricular Points & Zones (Educational)")}</h1>
          <div className="sub">
            {label(
              "同一页面切换：穴位（点：NADA / GB/T）与 功能区（区域）。仅科普演示，不用于诊断或治疗。",
              "One page with modes: Points (NADA / GB/T) and Zones (Areas). Educational only; not medical advice."
            )}
          </div>
        </div>

        <div className="row" style={{ justifyContent: "flex-end" }}>
          <button className={"pill " + (lang === "zh" ? "active" : "")} onClick={() => setLang("zh")}>中文</button>
          <button className={"pill " + (lang === "en" ? "active" : "")} onClick={() => setLang("en")}>English</button>
          <button className={"pill " + (admin ? "active" : "")} onClick={() => setAdmin((v) => !v)} title="Admin mode: click map to read coordinates">
            {label("标点模式", "Admin")}
          </button>
        </div>
      </header>

      {/* Mode selector */}
      <div className="row" style={{ gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
        <button className={"pill " + (mode === "points" ? "active" : "")} onClick={() => setMode("points")}>
          {label("穴位（点）", "Points")}
        </button>
        <button className={"pill " + (mode === "areas" ? "active" : "")} onClick={() => setMode("areas")}>
          {label("功能区（区域）", "Zones (Areas)")}
        </button>

        {mode === "points" ? (
          <>
            <span className="sep" />
            <button className={"pill " + (standard === "NADA" ? "active" : "")} onClick={() => setStandard("NADA")}>
              NADA (5)
            </button>
            <button className={"pill " + (standard === "GBT" ? "active" : "")} onClick={() => setStandard("GBT")}>
              GB/T (common)
            </button>
          </>
        ) : null}

        <span className="sep" />
        <input
          className="input"
          placeholder={label("搜索：神门 / 肺 / spine ...", "Search: Shen Men / Lung / spine ...")}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        {adminLast ? (
          <div className="badge" style={{ marginLeft: "auto" }}>
            x={adminLast.x.toFixed(1)} y={adminLast.y.toFixed(1)}
          </div>
        ) : null}
      </div>

      <div className="grid">
        {/* Left: list */}
        <section className="card">
          <div className="toolbar">
            {mode === "points" ? (
              <div style={{ fontSize: 12, opacity: 0.8 }}>
                {label("当前标准：", "Standard: ")} <b>{standard}</b>
              </div>
            ) : (
              <div style={{ fontSize: 12, opacity: 0.8 }}>
                {label("当前模式：功能区（区域）", "Mode: Zones (Areas)")}
              </div>
            )}
          </div>

          <div className="list">
            {mode === "points"
              ? filteredPoints.map((p) => {
                  const isActive = p.id === selectedPointId;
                  return (
                    <div key={p.id} className={"item " + (isActive ? "active" : "")} onClick={() => setSelectedPointId(p.id)}>
                      <div className="itemTitle">{label(p.zh, p.en)}</div>
                      <div className="itemMeta">
                        {label(CATEGORY_LABEL[p.category].zh, CATEGORY_LABEL[p.category].en)} · {label(p.organZh, p.organEn)} · {p.standard}
                      </div>
                    </div>
                  );
                })
              : EAR_AREAS.map((a) => {
                  const isActive = a.id === selectedAreaId;
                  return (
                    <div key={a.id} className={"item " + (isActive ? "active" : "")} onClick={() => setSelectedAreaId(a.id)}>
                      <div className="itemTitle">{label(a.nameZh, a.nameEn)}</div>
                      <div className="itemMeta">{label(a.organZh, a.organEn)}</div>
                    </div>
                  );
                })}
          </div>

          <div style={{ padding: 12, fontSize: 12, color: "var(--muted)" }}>
            {admin ? (
              <>
                {label(
                  "标点模式开启：点击耳朵空白处可读取坐标（右上角显示）。用来快速补充/修正 GB/T 点位。",
                  "Admin on: click empty map to read coordinates (shown top right). Use to re-mark GB/T points quickly."
                )}
              </>
            ) : (
              <>
                {label(
                  "提示：右耳为镜像显示。点位/功能区示意用于教学演示。",
                  "Tip: Right ear is mirrored. Points/zones are schematic for education."
                )}
              </>
            )}
          </div>
        </section>

        {/* Middle: maps */}
        <section className="card">
          <div className="twoEars">
            <div>
              <div className="earTitle">{label("左耳", "Left")}</div>
              <div className="earBox">
                {mode === "points" ? (
                  <EarMapPoints
                    viewBox={viewBox}
                    lang={lang}
                    points={filteredPoints}
                    selectedId={selectedPointId}
                    onSelect={setSelectedPointId}
                    earFlipX={false}
                    admin={admin}
                    onAdminPick={(p) => setAdminLast(p)}
                  />
                ) : (
                  <EarMapAreas
                    viewBox={viewBox}
                    lang={lang}
                    areas={EAR_AREAS}
                    selectedId={selectedAreaId}
                    onSelect={setSelectedAreaId}
                    earFlipX={false}
                    admin={admin}
                    onAdminPick={(p) => setAdminLast(p)}
                  />
                )}
              </div>
            </div>

            <div>
              <div className="earTitle">{label("右耳", "Right")}</div>
              <div className="earBox">
                {mode === "points" ? (
                  <EarMapPoints
                    viewBox={viewBox}
                    lang={lang}
                    points={rightPoints}
                    selectedId={selectedPointId}
                    onSelect={setSelectedPointId}
                    earFlipX={true}
                    admin={admin}
                    onAdminPick={(p) => setAdminLast(p)}
                  />
                ) : (
                  <EarMapAreas
                    viewBox={viewBox}
                    lang={lang}
                    areas={EAR_AREAS}
                    selectedId={selectedAreaId}
                    onSelect={setSelectedAreaId}
                    earFlipX={true}
                    admin={admin}
                    onAdminPick={(p) => setAdminLast(p)}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="legend">
            {mode === "points"
              ? label(
                  `当前：${standard}（点位）。GB/T 目前为“常用点” starter set，建议你用标点模式对照教材快速修正。`,
                  `Now: ${standard} (points). GB/T here is a starter "common points" set—use Admin mode to re-mark against your reference.`
                )
              : label(
                  "当前：功能区（区域）。这是示意区域，用于讲解/分类。你可以后续用更详细的区域 SVG 替换。",
                  "Now: Zones (areas). These are schematic regions for teaching; you can replace with a more detailed zonal SVG later."
                )}
          </div>
        </section>

        {/* Right: info */}
        <section className="card">
          <div className="info">
            {mode === "points" ? (
              selectedPoint ? (
                <PointInfo lang={lang} p={selectedPoint} />
              ) : (
                <EmptyInfo lang={lang} titleZh="点位信息" titleEn="Point info" />
              )
            ) : selectedArea ? (
              <AreaInfo lang={lang} a={selectedArea} />
            ) : (
              <EmptyInfo lang={lang} titleZh="区域信息" titleEn="Area info" />
            )}

            <div className="kv" style={{ marginTop: 14 }}>
              <div className="k">{label("免责声明", "Disclaimer")}</div>
              <div className="v">
                {label(
                  "仅用于科普/教学演示。不要把本页面内容当作诊断或治疗依据；如有不适请咨询专业医疗人员。",
                  "Educational demo only. Not for diagnosis or treatment decisions; consult a qualified clinician for symptoms."
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      <style jsx global>{`
        :root {
          --bg: #f6f7fb;
          --card: #ffffff;
          --border: #e5e7eb;
          --text: #111827;
          --muted: #6b7280;
          --shadow: 0 8px 30px rgba(0,0,0,0.06);
        }
        body { background: var(--bg); color: var(--text); }
        .container { max-width: 1280px; margin: 0 auto; padding: 18px; }
        .top { display: flex; gap: 12px; justify-content: space-between; align-items: flex-start; }
        .h1 { margin: 0; font-size: 20px; font-weight: 900; }
        .sub { margin-top: 6px; font-size: 13px; opacity: 0.8; line-height: 1.6; }
        .row { display: flex; gap: 8px; align-items: center; }
        .sep { width: 1px; height: 18px; background: var(--border); margin: 0 4px; }
        .pill {
          border: 1px solid var(--border);
          background: var(--card);
          padding: 8px 12px;
          border-radius: 999px;
          font-size: 13px;
          cursor: pointer;
        }
        .pill.active { background: #111827; color: white; border-color: #111827; }
        .input {
          border: 1px solid var(--border);
          background: var(--card);
          padding: 8px 12px;
          border-radius: 12px;
          min-width: 260px;
          font-size: 13px;
        }
        .grid {
          display: grid;
          grid-template-columns: 360px 1fr 360px;
          gap: 14px;
          align-items: start;
        }
        @media (max-width: 1100px) {
          .grid { grid-template-columns: 1fr; }
          .input { min-width: 200px; }
        }
        .card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 14px;
          box-shadow: var(--shadow);
          overflow: hidden;
        }
        .toolbar { padding: 12px; border-bottom: 1px solid var(--border); }
        .list { max-height: 70vh; overflow: auto; }
        .item { padding: 12px; border-bottom: 1px solid var(--border); cursor: pointer; }
        .item:hover { background: rgba(0,0,0,0.02); }
        .item.active { background: rgba(17,24,39,0.06); }
        .itemTitle { font-weight: 900; }
        .itemMeta { margin-top: 4px; font-size: 12px; color: var(--muted); line-height: 1.4; }
        .twoEars { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 12px; }
        @media (max-width: 900px) { .twoEars { grid-template-columns: 1fr; } }
        .earTitle { font-weight: 900; margin-bottom: 6px; }
        .earBox { width: 100%; aspect-ratio: 3 / 4; }
        .legend { padding: 10px 12px; font-size: 12px; color: var(--muted); border-top: 1px solid var(--border); }
        .info { padding: 12px; }
        .badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 8px;
          border-radius: 999px;
          border: 1px solid var(--border);
          font-size: 12px;
          background: #fff;
        }
        .kv { margin-top: 12px; }
        .k { font-size: 12px; color: var(--muted); margin-bottom: 6px; }
        .v { font-size: 13px; line-height: 1.7; }
        .point { fill: #ef4444; }
        .point.selected { fill: #0ea5e9; }
        .pointRing { fill: none; stroke: #0ea5e9; stroke-width: 2.5; opacity: 0.9; }
      `}</style>
    </main>
  );
}

function EmptyInfo({ lang, titleZh, titleEn }: { lang: Lang; titleZh: string; titleEn: string }) {
  const label = (zh: string, en: string) => (lang === "zh" ? zh : en);
  return (
    <>
      <h2 style={{ margin: 0, fontSize: 18 }}>{label(titleZh, titleEn)}</h2>
      <div className="sub" style={{ marginTop: 8 }}>
        {label("先在左侧列表或耳朵上选择一个项目。", "Pick an item from the list or click the map.")}
      </div>
    </>
  );
}

function PointInfo({ lang, p }: { lang: Lang; p: EarPoint }) {
  const label = (zh: string, en: string) => (lang === "zh" ? zh : en);
  return (
    <>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <span className="badge">{p.standard}</span>
        <span className="badge">{label(CATEGORY_LABEL[p.category].zh, CATEGORY_LABEL[p.category].en)}</span>
      </div>
      <h2 style={{ margin: "10px 0 0", fontSize: 18 }}>
        {label(p.zh, p.en)}
      </h2>

      <div className="kv">
        <div className="k">{label("关联脏腑/系统（科普）", "Related organ/system (educational)")}</div>
        <div className="v">{label(p.organZh, p.organEn)}</div>
      </div>
      <div className="kv">
        <div className="k">{label("科普说明", "Educational note")}</div>
        <div className="v">{label(p.summaryZh, p.summaryEn)}</div>
      </div>
      {p.caseZh || p.caseEn ? (
        <div className="kv">
          <div className="k">{label("小病例/使用场景（科普）", "Mini case / use scenario (educational)")}</div>
          <div className="v">{label(p.caseZh ?? "", p.caseEn ?? "")}</div>
        </div>
      ) : null}
    </>
  );
}

function AreaInfo({ lang, a }: { lang: Lang; a: EarArea }) {
  const label = (zh: string, en: string) => (lang === "zh" ? zh : en);
  return (
    <>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <span className="badge">{label("功能区", "Zone")}</span>
      </div>
      <h2 style={{ margin: "10px 0 0", fontSize: 18 }}>
        {label(a.nameZh, a.nameEn)}
      </h2>

      <div className="kv">
        <div className="k">{label("关联脏腑/系统（科普）", "Related organ/system (educational)")}</div>
        <div className="v">{label(a.organZh, a.organEn)}</div>
      </div>
      <div className="kv">
        <div className="k">{label("科普说明", "Educational note")}</div>
        <div className="v">{label(a.summaryZh, a.summaryEn)}</div>
      </div>
      {a.caseZh || a.caseEn ? (
        <div className="kv">
          <div className="k">{label("小病例/使用场景（科普）", "Mini case / use scenario (educational)")}</div>
          <div className="v">{label(a.caseZh ?? "", a.caseEn ?? "")}</div>
        </div>
      ) : null}
    </>
  );
}

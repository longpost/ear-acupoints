export type Lang = "zh" | "en";

export type Standard = "NADA" | "GBT";

export type Mode = "points" | "areas";

/** A clickable ear acupoint (a point). Coordinates are in the SVG viewBox space. */
export type EarPoint = {
  id: string;
  standard: Standard;
  zh: string;
  en: string;
  /** e.g. "Calming", "Organs" ... purely for filtering and education UI. */
  category:
    | "Calming"
    | "Organs"
    | "Endocrine"
    | "Pain"
    | "HeadFace"
    | "Spine"
    | "Other";

  /** Educational tag for what this point is commonly associated with. */
  organZh: string;
  organEn: string;

  /** Short description shown in the info panel. */
  summaryZh: string;
  summaryEn: string;

  /** Optional: a mini "case vignette" for education (NOT medical advice). */
  caseZh?: string;
  caseEn?: string;

  x: number;
  y: number;
};

/** A clickable ear functional zone (an area). pathD is in the same viewBox coordinate space. */
export type EarArea = {
  id: string;
  nameZh: string;
  nameEn: string;
  /** Educational association. */
  organZh: string;
  organEn: string;
  summaryZh: string;
  summaryEn: string;
  caseZh?: string;
  caseEn?: string;

  /** SVG path 'd' string in viewBox coordinates */
  pathD: string;
  /** Where to place the label box */
  labelX: number;
  labelY: number;
};

export const CATEGORY_LABEL: Record<EarPoint["category"], { zh: string; en: string }> = {
  Calming: { zh: "安神/情绪", en: "Calming" },
  Organs: { zh: "脏腑", en: "Organs" },
  Endocrine: { zh: "内分泌", en: "Endocrine" },
  Pain: { zh: "疼痛", en: "Pain" },
  HeadFace: { zh: "头面", en: "Head/Face" },
  Spine: { zh: "脊柱", en: "Spine" },
  Other: { zh: "其它", en: "Other" },
};

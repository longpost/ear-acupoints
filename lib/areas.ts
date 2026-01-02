import type { EarArea } from "./types";

/**
 * Educational "functional zones" (areas). These are NOT the NADA protocol.
 * These shapes are schematic and meant for interaction and explanation.
 *
 * Tip: If you want a more detailed/accurate zonal map, replace these paths
 * with ones traced from your preferred reference figure.
 */
export const EAR_AREAS: EarArea[] = [
  {
    id: "AREA_CONCHA_DIGESTIVE",
    nameZh: "消化区（示意）",
    nameEn: "Digestive zone (schematic)",
    organZh: "胃/肠/消化（科普）",
    organEn: "Stomach/Intestines/Digestion (educational)",
    summaryZh: "耳廓反射/功能区图中常用的消化相关区域概念（示意）。",
    summaryEn: "A commonly taught digestive-related zone concept on zonal ear maps (schematic).",
    caseZh: "例：科普课里会把“食欲、腹胀、消化慢”等话题放在这个区域概念下讲。",
    caseEn: "Example: used in education discussions about appetite/bloating/slow digestion.",
    // Rough polygon in concha
    pathD: "M365 480 L420 500 L425 545 L395 585 L350 565 L345 515 Z",
    labelX: 430,
    labelY: 520,
  },
  {
    id: "AREA_CONCHA_RESP",
    nameZh: "呼吸区（示意）",
    nameEn: "Respiratory zone (schematic)",
    organZh: "肺/呼吸（科普）",
    organEn: "Lung/Respiration (educational)",
    summaryZh: "功能区图里常用的呼吸相关区域概念（示意）。",
    summaryEn: "A respiratory-related zone concept on zonal maps (schematic).",
    caseZh: "例：紧张时呼吸浅、胸口紧的科普讨论，会指向“呼吸区”这个概念。",
    caseEn: "Example: teaching about shallow breathing/chest tightness during stress.",
    pathD: "M335 450 L380 455 L390 495 L360 520 L330 500 Z",
    labelX: 410,
    labelY: 460,
  },
  {
    id: "AREA_ANTIHELIX_SPINE",
    nameZh: "脊柱区（示意）",
    nameEn: "Spine zone (schematic)",
    organZh: "颈/胸/腰段脊柱（科普）",
    organEn: "Cervical/Thoracic/Lumbar spine (educational)",
    summaryZh: "很多功能区图会沿对耳轮标出“脊柱分段”概念（示意）。",
    summaryEn: "Many zonal maps mark spine segments along the antihelix (schematic).",
    caseZh: "例：科普课里讲“久坐腰背酸”时，会用这条带状区域解释“分段”。",
    caseEn: "Example: used when teaching posture-related back discomfort topics.",
    pathD: "M290 320 L320 340 L330 560 L300 585 L280 520 Z",
    labelX: 120,
    labelY: 380,
  },
  {
    id: "AREA_LOBULE_HEADFACE",
    nameZh: "头面区（示意）",
    nameEn: "Head/face zone (schematic)",
    organZh: "头面部（科普）",
    organEn: "Head/face (educational)",
    summaryZh: "耳垂在许多图里用于头面相关概念（示意）。",
    summaryEn: "The lobule is often used for head/face concepts on zonal maps (schematic).",
    caseZh: "例：科普讨论“鼻塞、咽喉不适、牙痛”等时，会用这个区域概念做分类。",
    caseEn: "Example: used in education discussions about sinuses/throat/teeth topics.",
    pathD: "M285 700 L420 700 L430 820 L350 865 L275 820 Z",
    labelX: 430,
    labelY: 740,
  },
];

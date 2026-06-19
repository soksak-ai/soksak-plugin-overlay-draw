// strokes — 낙서 획 모델의 순수 로직(DOM/캔버스 비의존 — vitest 단위검증).
// main.js 는 이걸 import 해 캔버스에 그린다. 여기는 "무엇을 그릴지"(데이터)만, "어떻게 그릴지"(픽셀)는 main.

// 좌표 정제 — 유한수 [x,y] 쌍만 남긴다(NaN·문자열·결손 제거). 빈 결과면 [].
export function cleanPoints(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((p) => Array.isArray(p) && p.length >= 2) // null·비배열·결손 항목 제거(Number(null)=0 오통과 방지)
    .map((p) => [Number(p[0]), Number(p[1])])
    .filter((p) => Number.isFinite(p[0]) && Number.isFinite(p[1]));
}

// 한 획 생성 — points 정제 + 색/굵기/지우개 확정(생략 시 현재값 fallback). 빈 점이면 null(획 아님).
export function makeStroke(input, defaults) {
  const points = cleanPoints(input && input.points);
  if (!points.length) return null;
  const d = defaults || {};
  return {
    color: input && input.color ? String(input.color) : d.color || "#ff3b30",
    width:
      input && Number.isFinite(Number(input.width))
        ? Number(input.width)
        : Number.isFinite(Number(d.width))
          ? Number(d.width)
          : 4,
    eraser: !!(input && input.eraser),
    points,
  };
}

// undo — 마지막 획 제거(불변: 새 배열 반환). 빈 배열이면 그대로.
export function undo(strokes) {
  return strokes.slice(0, Math.max(0, strokes.length - 1));
}

// 펜 굵기 클램프 — 1~64.
export function clampWidth(px, fallback) {
  const n = Number(px);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(1, Math.min(64, Math.round(n)));
}

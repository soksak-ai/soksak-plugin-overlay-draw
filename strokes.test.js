import { describe, expect, it } from "vitest";
import { cleanPoints, makeStroke, undo, clampWidth } from "./strokes.js";

describe("cleanPoints — 유한수 [x,y] 쌍만", () => {
  it("정상 좌표 보존", () => {
    expect(cleanPoints([[1, 2], [3, 4]])).toEqual([[1, 2], [3, 4]]);
  });
  it("NaN·문자열·결손 제거", () => {
    expect(cleanPoints([[1, 2], ["a", 4], [3, NaN], [5, 6], null])).toEqual([[1, 2], [5, 6]]);
  });
  it("숫자 문자열은 변환", () => {
    expect(cleanPoints([["10", "20"]])).toEqual([[10, 20]]);
  });
  it("배열 아니면 []", () => {
    expect(cleanPoints(null)).toEqual([]);
    expect(cleanPoints(undefined)).toEqual([]);
  });
});

describe("makeStroke — 획 생성(정제 + 색/굵기/지우개 fallback)", () => {
  const def = { color: "#000", width: 4 };
  it("입력 색·굵기 우선", () => {
    const s = makeStroke({ points: [[0, 0], [1, 1]], color: "#f00", width: 8 }, def);
    expect(s).toEqual({ color: "#f00", width: 8, eraser: false, points: [[0, 0], [1, 1]] });
  });
  it("색·굵기 생략 시 defaults", () => {
    const s = makeStroke({ points: [[0, 0]] }, def);
    expect(s.color).toBe("#000");
    expect(s.width).toBe(4);
  });
  it("지우개 플래그", () => {
    expect(makeStroke({ points: [[0, 0]], eraser: true }, def).eraser).toBe(true);
  });
  it("빈/불량 점이면 null(획 아님)", () => {
    expect(makeStroke({ points: [] }, def)).toBeNull();
    expect(makeStroke({ points: [["x", "y"]] }, def)).toBeNull();
    expect(makeStroke({}, def)).toBeNull();
  });
});

describe("undo — 마지막 획 제거(불변)", () => {
  it("마지막 1개 제거, 원본 불변", () => {
    const a = [{ p: 1 }, { p: 2 }, { p: 3 }];
    const b = undo(a);
    expect(b).toEqual([{ p: 1 }, { p: 2 }]);
    expect(a).toHaveLength(3); // 원본 보존
  });
  it("빈 배열이면 그대로", () => {
    expect(undo([])).toEqual([]);
  });
});

describe("clampWidth — 1~64 클램프", () => {
  it("범위 안 반올림", () => {
    expect(clampWidth(8.4, 4)).toBe(8);
  });
  it("하한·상한", () => {
    expect(clampWidth(0, 4)).toBe(1);
    expect(clampWidth(999, 4)).toBe(64);
  });
  it("비수면 fallback", () => {
    expect(clampWidth("abc", 4)).toBe(4);
    expect(clampWidth(undefined, 7)).toBe(7);
  });
});

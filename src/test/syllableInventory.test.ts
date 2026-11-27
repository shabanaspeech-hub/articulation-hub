import { describe, it, expect } from "vitest";
import { SHAPE_WORDS, SHAPES, filterShapeWords, shapeInfo } from "@/data/syllableInventory";

describe("syllable shape inventory", () => {
  it("follows the 4-level hierarchy", () => {
    expect(shapeInfo("CV").level).toBe(1);
    expect(shapeInfo("C1V1C1V1").level).toBe(1);
    expect(shapeInfo("C1V1C1V2").level).toBe(2);
    expect(shapeInfo("CVC").level).toBe(3);
    expect(shapeInfo("C1V1C2V2").level).toBe(3);
    expect(shapeInfo("CVCVCV").level).toBe(4);
  });
  it("has words for every shape", () => {
    for (const s of SHAPES) expect(SHAPE_WORDS.some((w) => w.shape === s.shape)).toBe(true);
  });
  it("separates reduplicated, same-consonant and variegated two-syllable words", () => {
    const shapeOf = (word: string) => SHAPE_WORDS.find((w) => w.word === word)?.shape;
    expect(shapeOf("mama")).toBe("C1V1C1V1");
    expect(shapeOf("puppy")).toBe("C1V1C1V2");
    expect(shapeOf("bunny")).toBe("C1V1C2V2");
    expect(shapeOf("banana")).toBe("CVCVCV");
  });
  it("keeps cluster words out of simple two-syllable shapes", () => {
    const simple = SHAPE_WORDS.filter((w) => w.shape === "C1V1C2V2").map((w) => w.word);
    for (const bad of ["monkey", "pizza", "water", "turtle"]) expect(simple).not.toContain(bad);
  });
  it("filters by search, level and shape", () => {
    expect(filterShapeWords({ query: "bun" }).map((w) => w.word)).toContain("bunny");
    expect(filterShapeWords({ level: 1 }).every((w) => shapeInfo(w.shape).level === 1)).toBe(true);
    expect(filterShapeWords({ shape: "VC" }).every((w) => w.shape === "VC")).toBe(true);
  });
});

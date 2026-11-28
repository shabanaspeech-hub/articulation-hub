import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import config from "../../capacitor.config";
import photos from "../data/localWordPhotos.json";

describe("offline photo packaging", () => {
  it("starts native apps from the local web build, not a remote website", () => {
    expect(config.webDir).toBe("dist");
    expect(config.server?.url).toBeUndefined();
  });

  it("provides a real local WebP file for every bundled photo", () => {
    const entries = Object.values(photos);
    expect(entries.length).toBeGreaterThan(0);
    for (const entry of entries) {
      expect(entry.src.startsWith("/photos/")).toBe(true);
      const path = resolve("public", entry.src.slice(1));
      expect(existsSync(path), entry.src).toBe(true);
      const bytes = readFileSync(path);
      expect(bytes.subarray(0, 4).toString()).toBe("RIFF");
      expect(bytes.subarray(8, 12).toString()).toBe("WEBP");
    }
  });
});
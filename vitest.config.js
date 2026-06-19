import { defineConfig } from "vitest/config";

// strokes.js 는 순수 로직(DOM 비의존) — node 환경이면 충분.
export default defineConfig({ test: { environment: "node" } });

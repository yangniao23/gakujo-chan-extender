#!/usr/bin/env node

import * as esbuild from "esbuild";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));

const config = {
  bundle: true,
  minify: true,
  target: "es2020",
  format: "iife",
  platform: "browser",
  alias: {
    "@": join(__dirname, "src"),
  },
};

async function testBuild() {
  const testFile = "src/core/auth/convert.ts";

  if (!existsSync(testFile)) {
    console.error(`❌ Test file not found: ${testFile}`);
    process.exit(1);
  }

  try {
    const result = await esbuild.build({
      ...config,
      entryPoints: [testFile],
      outfile: "/tmp/test-build.js",
      write: true,
    });

    console.log("✅ Build successful!");
    console.log(
      `Generated output size: ${
        result.outputFiles?.[0]?.contents.length || "unknown"
      } bytes`
    );
  } catch (error) {
    console.error("❌ Build failed:", error);
    process.exit(1);
  }
}

testBuild();

#!/usr/bin/env node

/**
 * TypeScript -> JavaScript ビルドテスト
 * esbuild の alias 解決をテスト
 */

import * as esbuild from "esbuild";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function testAliasResolution() {
  console.log("Testing esbuild alias resolution...\n");

  const config = {
    bundle: true,
    format: "iife",
    platform: "browser",
    minify: false,
    target: "es2020",
    alias: {
      "@": join(__dirname, "src"),
    },
  };

  try {
    // Test 1: background.ts
    console.log("Test 1: Building background.ts...");
    const result1 = await esbuild.build({
      ...config,
      entryPoints: ["src/background/background.ts"],
      outfile: "/tmp/background-test.js",
      write: true,
    });
    console.log("  ✓ Success\n");

    // Test 2: login-2fa.ts
    console.log("Test 2: Building login-2fa.ts...");
    const result2 = await esbuild.build({
      ...config,
      entryPoints: ["src/pages/login-2fa.ts"],
      outfile: "/tmp/login-2fa-test.js",
      write: true,
    });
    console.log("  ✓ Success\n");

    // Test 3: portal-main.ts
    console.log("Test 3: Building portal-main.ts...");
    const result3 = await esbuild.build({
      ...config,
      entryPoints: ["src/pages/portal-main.ts"],
      outfile: "/tmp/portal-main-test.js",
      write: true,
    });
    console.log("  ✓ Success\n");

    console.log("✅ All tests passed!");
    console.log("\nGenerated files in /tmp/");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    if (error.errors) {
      console.error("\nDetailed errors:");
      error.errors.forEach((e, i) => {
        console.error(`  ${i + 1}. ${e.text}`);
      });
    }
    process.exit(1);
  }
}

testAliasResolution();

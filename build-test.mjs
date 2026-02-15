#!/usr/bin/env node

import * as esbuild from "esbuild";
import { copyFileSync, mkdirSync, existsSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const commonConfig = {
  bundle: true,
  sourcemap: false,
  minify: true,
  target: "es2020",
  format: "iife",
  platform: "browser",
  resolveExtensions: [".ts", ".tsx", ".js", ".jsx"],
};

async function buildFirefox() {
  const outDir = "firefox_sources";

  console.log("🔨 Building for Firefox...\n");

  const buildConfig = {
    ...commonConfig,
    alias: {
      "@": join(__dirname, "src"),
    },
    define: {
      "process.env.BROWSER": JSON.stringify("firefox"),
    },
  };

  try {
    // Background script
    console.log("  Building backGround.js...");
    await esbuild.build({
      ...buildConfig,
      entryPoints: ["src/background/background.ts"],
      outfile: `${outDir}/backGround.js`,
    });
    console.log("  ✓ backGround.js");

    // Page scripts
    const pageScripts = [
      "portal-main",
      "portal-notifications",
      "portal-assignments",
      "portal-grades",
      "login-2fa",
    ];

    for (const script of pageScripts) {
      const entryFile = `src/pages/${script}.ts`;
      if (existsSync(entryFile)) {
        console.log(`  Building ${script}.js...`);
        await esbuild.build({
          ...buildConfig,
          entryPoints: [entryFile],
          outfile: `${outDir}/${script}.js`,
        });
        console.log(`  ✓ ${script}.js`);
      } else {
        console.log(`  ⚠ ${entryFile} not found, skipping`);
      }
    }

    // Verify generated files
    console.log("\n📋 Generated files:");
    const jsFiles = readdirSync(outDir).filter((f) => f.endsWith(".js"));
    jsFiles.forEach((f) => {
      const stat = require("fs").statSync(join(outDir, f));
      console.log(`  ${f} (${stat.size} bytes)`);
    });

    console.log("\n✅ Build completed successfully!");
  } catch (error) {
    console.error("❌ Build failed:", error);
    process.exit(1);
  }
}

buildFirefox();

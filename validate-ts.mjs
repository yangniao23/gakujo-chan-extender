#!/usr/bin/env node

/**
 * TypeScript 実装の妥当性検証
 */

import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function validateTypeScriptFiles() {
  console.log("📋 TypeScript Implementation Validation\n");

  const tests = [
    {
      name: "convert.ts has cross-realm arrayToHex",
      file: "src/core/auth/convert.ts",
      pattern: /Object\.prototype\.toString\.call/,
    },
    {
      name: "totp.ts exports generateOtp",
      file: "src/core/auth/totp.ts",
      pattern: /export async function generateOtp/,
    },
    {
      name: "validation.ts has sanitizeBase32",
      file: "src/core/auth/validation.ts",
      pattern: /export function sanitizeBase32/,
    },
    {
      name: "browser/api.ts exports runtime & tabs",
      file: "src/core/browser/api.ts",
      pattern: /export (const|let) (runtime|tabs)/,
    },
    {
      name: "login-2fa.ts imports totp",
      file: "src/pages/login-2fa.ts",
      pattern: /import.*generateOtp.*from.*totp/,
    },
    {
      name: "portal-main.ts imports modules",
      file: "src/pages/portal-main.ts",
      pattern: /import.*features/,
    },
    {
      name: "message-reader.ts handles URL extraction",
      file: "src/features/notifications/message-reader.ts",
      pattern: /function extractUrlFromHtml/,
    },
    {
      name: "auto-extend.ts has extendSession function",
      file: "src/features/session/auto-extend.ts",
      pattern: /function extendSession.*boolean/,
    },
    {
      name: "background.ts has handleTabAutomation",
      file: "src/background/background.ts",
      pattern: /async function handleTabAutomation/,
    },
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const content = readFileSync(join(__dirname, test.file), "utf8");
      if (test.pattern.test(content)) {
        console.log(`✅ ${test.name}`);
        passed++;
      } else {
        console.log(`❌ ${test.name}`);
        console.log(`   Pattern not found: ${test.pattern}`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name}`);
      console.log(`   File not found: ${test.file}`);
      failed++;
    }
  }

  console.log(
    `\n📊 Results: ${passed} passed, ${failed} failed out of ${tests.length} tests`
  );

  if (failed === 0) {
    console.log(
      "\n✅ All validation tests passed! TypeScript implementation is ready for building."
    );
    return true;
  } else {
    console.log("\n❌ Some tests failed. Check the implementation.");
    return false;
  }
}

const success = validateTypeScriptFiles();
process.exit(success ? 0 : 1);

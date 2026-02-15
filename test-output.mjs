/**
 * ビルド出力の妥当性テスト
 * 生成されたJavaScriptが必要な機能を含んでいるか検証
 */

import { readFileSync, existsSync } from "fs";

function testBuildOutput() {
  console.log("🧪 Testing Build Output\n");

  const tests = [
    {
      name: "backGround.js contains handleTabAutomation",
      file: "firefox_sources/backGround.js",
      pattern: /handleTabAutomation|campusweb/,
    },
    {
      name: "portal-main.js contains auto-extend logic",
      file: "firefox_sources/portal-main.js",
      pattern: /timeout-timer|portaltimerimg|AutoExtender/,
    },
    {
      name: "portal-main.js contains version display",
      file: "firefox_sources/portal-main.js",
      pattern: /extension version|tabmenu-ul|VersionShow/,
    },
    {
      name: "portal-notifications.js contains message-reader",
      file: "firefox_sources/portal-notifications.js",
      pattern: /readButton|readNumInputBox|MessageReader/,
    },
    {
      name: "login-2fa.js contains TOTP generation",
      file: "firefox_sources/login-2fa.js",
      pattern: /TOTP|getCurrentCounter|generateOtp|2FA/,
    },
  ];

  let passed = 0;
  let failed = 0;
  const missing = [];

  for (const test of tests) {
    if (!existsSync(test.file)) {
      console.log(`⏭️  ${test.name}`);
      console.log(`   File not yet built: ${test.file}`);
      missing.push(test.file);
      failed++;
      continue;
    }

    try {
      const content = readFileSync(test.file, "utf8");
      if (test.pattern.test(content)) {
        console.log(`✅ ${test.name}`);
        passed++;
      } else {
        console.log(`⚠️  ${test.name}`);
        console.log(`   Pattern not found: ${test.pattern}`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name}`);
      console.log(`   Error reading file: ${error.message}`);
      failed++;
    }
  }

  console.log(
    `\n📊 Results: ${passed} passed, ${failed} failed out of ${tests.length} tests`
  );

  if (missing.length > 0) {
    console.log(`\n⏳ Files still needed to be built:`);
    missing.forEach((f) => console.log(`   - ${f}`));
    console.log(`\nRun: npm run build:firefox`);
  }

  return passed;
}

testBuildOutput();

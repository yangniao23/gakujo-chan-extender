import * as esbuild from "esbuild";
import { copyFileSync, mkdirSync, existsSync, readdirSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const isWatch = args.includes("--watch");
const target =
  args.find((arg) => arg.startsWith("--target="))?.split("=")[1] || "both";

const commonConfig = {
  bundle: true,
  sourcemap: isWatch ? "inline" : false,
  minify: !isWatch,
  target: "es2020",
  format: "iife",
  platform: "browser",
  resolveExtensions: [".ts", ".tsx", ".js", ".jsx"],
  tsconfigRaw: {
    compilerOptions: {
      jsxFactory: "undefined",
      jsxFragmentFactory: "undefined",
    },
  },
};

// ビルド対象設定
const buildTargets = target === "both" ? ["chrome", "firefox"] : [target];

async function build() {
  for (const browserTarget of buildTargets) {
    const outDir = `${browserTarget}_sources`;
    const isFirefox = browserTarget === "firefox";

    console.log(`Building for ${browserTarget}...`);

    const buildConfig = {
      ...commonConfig,
      alias: {
        "@": join(__dirname, "src"),
      },
      define: {
        "process.env.BROWSER": JSON.stringify(browserTarget),
      },
    };

    // Background script
    await esbuild.build({
      ...buildConfig,
      entryPoints: ["src/background/background.ts"],
      outfile: `${outDir}/backGround.js`,
    });

    // Page scripts (content scripts entry points)
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
        await esbuild.build({
          ...buildConfig,
          entryPoints: [entryFile],
          outfile: `${outDir}/${script}.js`,
        });
      }
    }

    // Copy static files
    mkdirSync(`${outDir}/icons`, { recursive: true });

    const iconFiles = ["icon48.png", "icon128.png"];
    for (const icon of iconFiles) {
      if (existsSync(`icons/${icon}`)) {
        copyFileSync(`icons/${icon}`, `${outDir}/icons/${icon}`);
      }
    }

    console.log(`✓ Build complete for ${browserTarget}`);
  }
}

if (isWatch) {
  console.log("Watch mode not implemented yet. Run build manually.");
  process.exit(1);
} else {
  build().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

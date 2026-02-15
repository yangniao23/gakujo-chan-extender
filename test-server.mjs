#!/usr/bin/env node

/**
 * テスト用ローカルサーバー
 * test-fixtures/html/ 内の静的HTMLファイルを
 * 学情のURLパターンで提供する
 */

import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = 3000;

const routes = {
  '/campusweb/campusportal.do': 'portal-main.html',
  '/campusweb/campusportal.do?tabId=en': 'assignments-list.html',
  '/campusweb/campusportal.do?tabId=si': 'grades-list.html',
  '/campusweb/campusportal.do?tabId=kj': 'notifications-list.html',
};

const server = createServer(async (req, res) => {
  const url = req.url || '/';
  console.log(`Request: ${url}`);

  // ルーティング
  const filename = routes[url] || routes['/campusweb/campusportal.do'];
  const filepath = join(__dirname, 'test-fixtures', 'html', filename);

  try {
    const content = await readFile(filepath, 'utf-8');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(content);
    console.log(`  → Served: ${filename}`);
  } catch (error) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end(`File not found: ${filename}\n\nPlease save HTML snapshots first.`);
    console.error(`  ✗ Not found: ${filename}`);
  }
});

server.listen(PORT, () => {
  console.log(`
🚀 Test server running at http://localhost:${PORT}

Available routes:
  http://localhost:${PORT}/campusweb/campusportal.do
  http://localhost:${PORT}/campusweb/campusportal.do?tabId=en
  http://localhost:${PORT}/campusweb/campusportal.do?tabId=si
  http://localhost:${PORT}/campusweb/campusportal.do?tabId=kj

Press Ctrl+C to stop
  `);
});

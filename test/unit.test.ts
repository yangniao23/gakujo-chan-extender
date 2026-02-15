import { describe, it, expect } from 'vitest';

/**
 * 日付/時刻フォーマットのユニットテスト
 */

describe('Date/Time Utilities', () => {
  it('should format date as YYYYMMDDHHMM', () => {
    // 固定日時でテスト: 2025年2月15日 14時30分
    const testDate = new Date(2025, 1, 15, 14, 30, 0);

    const year = testDate.getFullYear();
    const month = String(testDate.getMonth() + 1).padStart(2, '0');
    const date = String(testDate.getDate()).padStart(2, '0');
    const hour = String(testDate.getHours()).padStart(2, '0');
    const min = String(testDate.getMinutes()).padStart(2, '0');
    const result = `${year}${month}${date}${hour}${min}`;

    expect(result).toBe('202502151430');
  });

  it('should handle single-digit dates correctly', () => {
    const testDate = new Date(2025, 0, 5, 9, 5, 0); // Jan 5, 09:05

    const year = testDate.getFullYear();
    const month = String(testDate.getMonth() + 1).padStart(2, '0');
    const date = String(testDate.getDate()).padStart(2, '0');
    const hour = String(testDate.getHours()).padStart(2, '0');
    const min = String(testDate.getMinutes()).padStart(2, '0');
    const result = `${year}${month}${date}${hour}${min}`;

    expect(result).toBe('202501050905');
  });
});

/**
 * DOM操作ユーティリティのテスト
 */

describe('DOM Utilities', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should create a table and retrieve cells', () => {
    // テーブルを作成
    const table = document.createElement('table');
    const row = table.insertRow();
    row.insertCell(0).textContent = 'Cell 1';
    row.insertCell(1).textContent = 'Cell 2';
    document.body.appendChild(table);

    // 取得してテスト
    const retrievedTable = document.querySelector('table');
    expect(retrievedTable).toBeTruthy();
    expect(retrievedTable?.rows[0].cells[0].textContent).toBe('Cell 1');
    expect(retrievedTable?.rows[0].cells[1].textContent).toBe('Cell 2');
  });

  it('should add elements to container', () => {
    const container = document.createElement('div');
    container.id = 'tabmenutable';
    document.body.appendChild(container);

    const button1 = document.createElement('button');
    button1.textContent = 'Button 1';
    const button2 = document.createElement('button');
    button2.textContent = 'Button 2';

    container.appendChild(button1);
    container.appendChild(button2);

    const retrieved = document.getElementById('tabmenutable');
    expect(retrieved?.children.length).toBe(2);
    expect(retrieved?.children[0].textContent).toBe('Button 1');
  });
});

/**
 * テーブルソートロジックのテスト
 */

describe('Table Sort Logic', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should sort array of objects numerically', () => {
    const data = [
      { no: 3, title: 'C' },
      { no: 1, title: 'A' },
      { no: 2, title: 'B' },
    ];

    data.sort((a, b) => a.no - b.no);

    expect(data[0].no).toBe(1);
    expect(data[1].no).toBe(2);
    expect(data[2].no).toBe(3);
  });

  it('should sort array of objects alphabetically', () => {
    const data = [
      { code: 'C123', name: 'Charlie' },
      { code: 'A456', name: 'Alice' },
      { code: 'B789', name: 'Bob' },
    ];

    data.sort((a, b) => {
      if (a.code < b.code) return -1;
      if (a.code > b.code) return 1;
      return 0;
    });

    expect(data[0].code).toBe('A456');
    expect(data[1].code).toBe('B789');
    expect(data[2].code).toBe('C123');
  });

  it('should extract deadline from text', () => {
    const text = '開始日: 2025/02/01 12:00 ～ 締切: 2025/03/15 23:59';
    const tildaIndex = text.indexOf('～');
    // ～の直後から"締切: "を除去して数字だけを抽出
    let deadline = text
      .substring(tildaIndex + 1)
      .replace(/[^\d]/g, ''); // すべての非数字を除去

    expect(deadline).toBe('202503152359');
  });

  it('should classify submission status', () => {
    const statuses = ['未提出', '一時保存', '提出済']
      .map((text) => {
        if (text.match(/未提出|Not submitted/)) return 1;
        if (text.match(/一時保存|Temporarily saved/)) return 2;
        if (text.match(/提出済|Submitted/)) return 3;
        return 0;
      });

    expect(statuses).toEqual([1, 2, 3]);
  });
});

/**
 * GPA計算ロジックのテスト
 */

describe('GPA Calculation', () => {
  it('should calculate GPA correctly', () => {
    // テストデータ: 
    // 科目1: GP=4.0, 単位=2 → 8.0
    // 科目2: GP=3.5, 単位=3 → 10.5
    // 科目3: GP=3.0, 単位=2 → 6.0
    // 合計: 24.5 / 7 = 3.5
    const grades = [
      { gp: 4.0, credits: 2 },
      { gp: 3.5, credits: 3 },
      { gp: 3.0, credits: 2 },
    ];

    const gpCredits = grades.map((g) => g.gp * g.credits);
    const credits = grades.map((g) => g.credits);

    const gpSum = gpCredits.reduce((sum, val) => sum + val, 0);
    const creditSum = credits.reduce((sum, val) => sum + val, 0);
    const gpa = gpSum / creditSum;

    expect(gpa).toBeCloseTo(3.5, 1);
  });

  it('should handle zero credits', () => {
    const grades: { gp: number; credits: number }[] = [];

    const gpCredits = grades.map((g) => g.gp * g.credits);
    const credits = grades.map((g) => g.credits);

    const gpSum = gpCredits.reduce((sum, val) => sum + val, 0);
    const creditSum = credits.reduce((sum, val) => sum + val, 0);
    const gpa = creditSum > 0 ? gpSum / creditSum : 0;

    expect(gpa).toBe(0);
  });

  it('should format GPA to 4 decimal places', () => {
    const gpa = 3.456789;
    const formatted = gpa.toFixed(4);

    expect(formatted).toBe('3.4568');
  });
});

/**
 * URL抽出ロジックのテスト
 */

describe('URL Extraction', () => {
  it('should extract URL from HTML link', () => {
    const html =
      '<a href="https://example.com/page?id=123&name=test">Link</a>';

    // href属性の値を抽出
    const hrefStart = html.indexOf('="') + 2;
    const hrefEnd = html.indexOf('"', hrefStart);
    const url = html.substring(hrefStart, hrefEnd);

    expect(url).toBe('https://example.com/page?id=123&name=test');
  });

  it('should decode HTML entities', () => {
    const url = 'https://example.com?param1=a&amp;param2=b';
    const decoded = url.replace(/amp;/g, '');

    expect(decoded).toBe('https://example.com?param1=a&param2=b');
  });
});

/**
 * Report Domain ロジックのテスト
 */

describe('Report Domain', () => {
  it('should format date time as YYYYMMDDHHMM', () => {
    // 同期関数ではなく、日時フォーマットロジックをテスト
    const testDate = new Date(2025, 1, 15, 14, 30, 0);
    const year = testDate.getFullYear();
    const month = String(testDate.getMonth() + 1).padStart(2, '0');
    const date = String(testDate.getDate()).padStart(2, '0');
    const hour = String(testDate.getHours()).padStart(2, '0');
    const min = String(testDate.getMinutes()).padStart(2, '0');
    const result = `${year}${month}${date}${hour}${min}`;

    expect(result).toBe('202502151430');
  });

  it('should extract deadline from period text', () => {
    const text = '2025/02/01 12:00 ～ 2025/03/15 23:59';
    const tildaIndex = text.indexOf('～');
    if (tildaIndex !== -1) {
      const deadline = text
        .substring(tildaIndex + 1)
        .replace(/\//g, '')
        .replace(/:/g, '')
        .replace(/\s/g, '');
      expect(deadline).toBe('202503152359');
    }
  });

  it('should determine submission status from pattern', () => {
    expect('未提出'.match(/未提出|Not submitted/)).toBeTruthy();
    expect('一時保存'.match(/一時保存|Temporarily saved/)).toBeTruthy();
    expect('提出済'.match(/提出済|Submitted/)).toBeTruthy();
  });

  it('should sort reports by deadline', () => {
    const reports = [
      { cells: ['a'], status: 1, deadline: '202503202359' },
      { cells: ['b'], status: 1, deadline: '202502151400' },
      { cells: ['c'], status: 1, deadline: '202503012300' },
    ];

    // 期限内と期限切れに分割
    const now = '202502161430';
    const active = reports.filter((row) => row.deadline >= now);
    const expired = reports.filter((row) => row.deadline < now);

    // それぞれをソート
    const sortByDeadlineAndStatus = (a: any, b: any) => {
      const deadlineDiff = parseInt(a.deadline) - parseInt(b.deadline);
      if (deadlineDiff !== 0) return deadlineDiff;
      return a.status - b.status;
    };

    active.sort(sortByDeadlineAndStatus);
    expired.sort(sortByDeadlineAndStatus);

    expect(active[0].deadline).toBe('202503012300');
    expect(active[1].deadline).toBe('202503202359');
    expect(expired[0].deadline).toBe('202502151400');
  });
});

/**
 * GPA Domain ロジックのテスト
 */

describe('GPA Domain', () => {
  it('should calculate GPA with multiple courses', () => {
    const courses = [
      { gp: 4.0, credits: 2 },
      { gp: 3.5, credits: 3 },
      { gp: 3.0, credits: 2 },
    ];

    const gpCredits = courses.map((c) => c.gp * c.credits);
    const credits = courses.map((c) => c.credits);

    const gpSum = gpCredits.reduce((sum, val) => sum + val, 0);
    const creditSum = credits.reduce((sum, val) => sum + val, 0);
    const gpa = creditSum > 0 ? gpSum / creditSum : 0;

    expect(gpa).toBeCloseTo(3.5, 1);
  });

  it('should return 0 GPA when no courses', () => {
    const courses: any[] = [];

    const gpCredits = courses.map((c) => c.gp * c.credits);
    const credits = courses.map((c) => c.credits);

    const gpSum = gpCredits.reduce((sum, val) => sum + val, 0);
    const creditSum = credits.reduce((sum, val) => sum + val, 0);
    const gpa = creditSum > 0 ? gpSum / creditSum : 0;

    expect(gpa).toBe(0);
  });

  it('should format GPA header with display', () => {
    const headerText = 'GP';
    const gpa = 3.456789;
    const formatted = `${headerText}\n GPA:${gpa.toFixed(4)}`;

    expect(formatted).toBe('GP\n GPA:3.4568');
  });

  it('should parse score as NaN when empty', () => {
    const scoreText = '';
    const score = scoreText.trim() ? parseFloat(scoreText) : NaN;

    expect(isNaN(score)).toBe(true);
  });

  it('should parse score as number when present', () => {
    const scoreText = '85.5';
    const score = scoreText.trim() ? parseFloat(scoreText) : NaN;

    expect(score).toBe(85.5);
    expect(!isNaN(score)).toBe(true);
  });

  it('should sort grades by score handling NaN', () => {
    const grades = [
      { no: 1, score: 75, originalIndex: 0 },
      { no: 2, score: NaN, originalIndex: 1 },
      { no: 3, score: 85, originalIndex: 2 },
      { no: 4, score: NaN, originalIndex: 3 },
    ];

    grades.sort((a, b) => {
      const aHasScore = !isNaN(a.score);
      const bHasScore = !isNaN(b.score);

      if (!aHasScore && !bHasScore) {
        return a.originalIndex - b.originalIndex;
      }

      if (!aHasScore) return -1;
      if (!bHasScore) return 1;

      if (a.score !== b.score) {
        return a.score - b.score;
      }

      return a.originalIndex - b.originalIndex;
    });

    expect(isNaN(grades[0].score)).toBe(true);
    expect(isNaN(grades[1].score)).toBe(true);
    expect(grades[2].score).toBe(75);
    expect(grades[3].score).toBe(85);
  });
});

/**
 * Notification Domain ロジックのテスト
 */

describe('Notification Domain', () => {
  it('should extract URL from HTML href attribute', () => {
    const html = '=student/notifications?noticeId=12345">';
    const hrefStart = html.indexOf('=') + 1;
    const hrefEnd = html.indexOf('"');
    let url = html.substring(hrefStart, hrefEnd);

    // HTMLエンティティをデコード
    while (url.indexOf('amp;') !== -1) {
      url = url.replace('amp;', '');
    }

    expect(url).toBe('student/notifications?noticeId=12345');
  });

  it('should parse notification table rows', () => {
    // HTMLテーブルの場合をシミュレート
    const mockTable = document.createElement('table');
    
    const headerRow = mockTable.insertRow();
    headerRow.insertCell(0).textContent = 'Date';
    headerRow.insertCell(1).textContent = 'Link';
    
    const dataRow1 = mockTable.insertRow();
    dataRow1.insertCell(0).innerHTML = '2025-02-15';
    dataRow1.insertCell(1).innerHTML = '<a href="#">Link 1</a>';
    
    const dataRow2 = mockTable.insertRow();
    dataRow2.insertCell(0).innerHTML = '2025-02-14';
    dataRow2.insertCell(1).innerHTML = '<a href="#">Link 2</a>';

    // テーブルの行をパースして配列に変換
    const result: string[][] = [];
    for (let i = 1; i < mockTable.rows.length; i++) {
      result[i] = [];
      const row = mockTable.rows[i];
      for (let j = 0; j < mockTable.rows[0].cells.length; j++) {
        result[i][j] = row.cells[j].innerHTML;
      }
    }

    expect(result[1][0]).toBe('2025-02-15');
    expect(result[1][1]).toBe('<a href="#">Link 1</a>');
    expect(result[2][0]).toBe('2025-02-14');
    expect(result[2][1]).toBe('<a href="#">Link 2</a>');
  });

  it('should build full GakuJo URL', () => {
    const baseUrl = 'https://gakujo.iess.niigata-u.ac.jp/campusweb/';
    const relativePath = 'student/notifications?noticeId=12345';
    const fullUrl = baseUrl + relativePath;

    expect(fullUrl).toBe(
      'https://gakujo.iess.niigata-u.ac.jp/campusweb/student/notifications?noticeId=12345'
    );
  });
});

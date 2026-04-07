const fs = require('fs');
const path = require('path');
const csv = require('csv-parse/lib/sync');
const argv = require('minimist')(process.argv.slice(2));

if (!argv.file || !fs.existsSync(argv.file)) {
  console.error('Usage: node import-tests.js --file path/to/file.csv --slug my-test');
  process.exit(1);
}

const file = argv.file;
const slug = argv.slug || path.basename(file, path.extname(file));
const content = fs.readFileSync(file, 'utf8');
let rows = [];
if (file.endsWith('.csv')) {
  rows = csv(content, { columns: true, skip_empty_lines: true });
} else {
  rows = JSON.parse(content);
}

const questions = rows.map((r, i) => ({
  id: i + 1,
  question: r.question || r.Q || r.q || 'TBD',
  options: [r.A || r.a || r.option1, r.B || r.b || r.option2, r.C || r.c || r.option3, r.D || r.d || r.option4].map(x=>x||'TBD'),
  correctAnswer: (()=>{
    const c = r.correct || r.answer || r.correctAnswer || r.Correct;
    if (!c) return 0;
    if (/^[A-Da-d]$/.test(String(c))) return String(c).toUpperCase().charCodeAt(0)-65;
    const n = Number(c);
    return isNaN(n) ? 0 : n-1;
  })()
}));

const outDir = path.join(__dirname, '..', 'lib', 'tests');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, `${slug}.ts`);
const fileContent = `import { Test } from '../test-schema';\n\nexport const test: Test = ${JSON.stringify({ slug, title: slug, timeInMinutes: questions.length, questions }, null, 2)};\n\nexport default test;\n`;
fs.writeFileSync(outPath, fileContent, 'utf8');
console.log('Imported', questions.length, 'questions to', outPath);

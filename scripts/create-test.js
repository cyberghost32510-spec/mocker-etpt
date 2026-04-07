const fs = require('fs');
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));

if (!argv.slug) {
  console.error('Usage: node create-test.js --slug your-slug --title "Title" --questions 20');
  process.exit(1);
}

const slug = argv.slug;
const title = argv.title || slug;
const count = Number(argv.questions || 10);

const repoRoot = path.join(__dirname, '..');
const testsDir = path.join(repoRoot, 'lib', 'tests');
if (!fs.existsSync(testsDir)) fs.mkdirSync(testsDir, { recursive: true });

const filePath = path.join(testsDir, `${slug}.ts`);
const template = `import { Test } from '../test-schema';

export const test: Test = {
  slug: '${slug}',
  title: '${title}',
  description: '',
  timeInMinutes: ${count},
  questions: ${JSON.stringify(Array.from({ length: count }, (_, i) => ({ id: i+1, question: 'TBD', options: ['A','B','C','D'], correctAnswer: 0 })), null, 2)}
};

export default test;
`;

fs.writeFileSync(filePath, template, 'utf8');

// try to update lib/tests/index.ts if exists
const indexPath = path.join(repoRoot, 'lib', 'tests', 'index.ts');
if (fs.existsSync(indexPath)) {
  let idx = fs.readFileSync(indexPath, 'utf8');
  const importLine = `import ${slug.replace(/-/g,'_')} from './${slug}';\n`;
  if (!idx.includes(importLine)) {
    idx = importLine + idx;
    idx += `\n// added by create-test: ${slug}\n`;
    fs.writeFileSync(indexPath, idx, 'utf8');
  }
}

console.log('Created', filePath);

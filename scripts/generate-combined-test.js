const fs = require('fs');
const path = require('path');

function readFile(p){
  return fs.readFileSync(p, 'utf8');
}

function parseMarkdownQuestions(markdown){
  const lines = markdown.split(/\r?\n/);
  const questions = [];
  let i = 0;
  while(i < lines.length){
    // find start of a question: patterns like "**1.**" or "1." at line start
    const qStart = lines[i].match(/^\s*(?:\*\*)?\s*(\d+)\.?\*?\*?\s*(.*)$/);
    if(qStart){
      // start collecting
      let qnum = qStart[1];
      let qtext = qStart[2] || '';
      i++;
      // collect following lines until option A found
      while(i < lines.length && !/^[A-Da-d][\).]?\s+/.test(lines[i]) && !/^\*\*Correct/i.test(lines[i]) && !/^Correct/i.test(lines[i]) && !/^\*\*/.test(lines[i])){
        if(lines[i].trim()) qtext += ' ' + lines[i].trim();
        i++;
      }
      // collect options
      const opts = [];
      while(i < lines.length && /^[A-Da-d][\).]?\s+/.test(lines[i])){
        const m = lines[i].match(/^[A-Da-d][\).]?\s+(.*)$/);
        if(m) opts.push(m[1].trim());
        i++;
      }
      // sometimes options are like "A. text" with blank lines; also support lines starting with a., b.
      if(opts.length === 0){
        // try case-insensitive a. style
        while(i < lines.length && /^[a-d][\).]?\s+/.test(lines[i].toLowerCase())){
          const m = lines[i].match(/^[a-d][\).]?\s+(.*)$/i);
          if(m) opts.push(m[1].trim());
          i++;
        }
      }
      // find correct answer line within next 6 lines
      let correct = null;
      let explanation = undefined;
      for(let j=0;j<8 && (i+j)<lines.length;j++){
        const l = lines[i+j];
        if(!l) continue;
        const cm = l.match(/Correct(?: Answer| Option|:)?\s*[:]?\s*\*?\*?\s*([A-Da-d]|[0-9]+|[A-Za-z]+)\*?\*?/i);
        if(cm){
          const val = cm[1].trim();
          // map letter or number
          if(/^[A-Da-d]$/.test(val)){
            correct = val.toUpperCase().charCodeAt(0) - 65; // A->0
          } else if(/^[0-9]+$/.test(val)){
            correct = parseInt(val,10)-1; // 1-indexed number
          } else {
            // sometimes words like "C" or "D" are present; try first char
            const ch = val[0].toUpperCase();
            if(/^[A-D]$/.test(ch)) correct = ch.charCodeAt(0)-65;
          }
          break;
        }
      }

      const qobj = {
        question: qtext.trim() || `Question ${qnum}`,
        options: opts.length? opts : ["A","B","C","D"],
        correct: (correct !== null && !isNaN(correct)) ? correct : 0,
        sourceNumber: Number(qnum)
      };
      questions.push(qobj);
    } else {
      i++;
    }
  }
  return questions;
}

function uniqByQuestion(arr){
  const seen = new Set();
  return arr.filter(q => {
    const key = q.question.replace(/\s+/g,' ').trim().slice(0,120);
    if(seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

(async function main(){
  const repoRoot = path.join(__dirname, '..', '..');
  const mathsPath = path.join(repoRoot, 'maths.md');
  const physicsPath = path.join(repoRoot, 'physics.md');
  const englishPath = path.join(repoRoot, 'english.md');

  const mathsMd = fs.existsSync(mathsPath) ? readFile(mathsPath) : '';
  const physicsMd = fs.existsSync(physicsPath) ? readFile(physicsPath) : '';
  const englishMd = fs.existsSync(englishPath) ? readFile(englishPath) : '';

  const mathsQ = parseMarkdownQuestions(mathsMd);
  const physicsQ = parseMarkdownQuestions(physicsMd);
  const englishQ = parseMarkdownQuestions(englishMd);

  const tagged = [];
  mathsQ.forEach(q => tagged.push({...q, subject: 'Mathematics'}));
  physicsQ.forEach(q => tagged.push({...q, subject: 'Physics'}));
  if(englishQ.length > 0){
    englishQ.forEach(q => tagged.push({...q, subject: 'English'}));
  } else {
    const extraFromMaths = mathsQ.slice(0,40).map(q=> ({...q, subject:'English'}));
    tagged.push(...extraFromMaths);
  }

  const unique = uniqByQuestion(tagged);

  const needed = 200;
  let pool = unique;
  if(pool.length < needed){
    const deficit = needed - pool.length;
    const fill = mathsQ.slice(0, deficit).map(q=>({...q, subject:'Maths (dup)'}));
    pool = pool.concat(fill);
  }
  const final = pool.slice(0, needed).map((q, idx) => ({
    id: idx+1,
    question: q.question,
    options: q.options,
    correctAnswer: q.correct,
    subject: q.subject || 'Mixed'
  }));

  const outPath = path.join(repoRoot, 'clone-nustrive-website', 'lib', 'combined-200.ts');
  const header = `// Auto-generated combined 200 MCQ test\n// Sources: maths.md, physics.md, english.md (fallback)\n\nexport interface Question { id:number; question:string; options:string[]; correctAnswer:number; subject?:string; }\n\nexport const combined200: Question[] = `;
  const content = header + JSON.stringify(final, null, 2) + `;\n\nexport const combinedTestConfig = { id: 'combined-200', name: 'Combined 200 MCQ Test', totalQuestions: ${final.length}, timeInMinutes: ${final.length}, subjects: ['Mathematics','Physics','English'] }\n`;
  fs.writeFileSync(outPath, content, 'utf8');
  console.log('Wrote', outPath, 'with', final.length, 'questions');
})();
